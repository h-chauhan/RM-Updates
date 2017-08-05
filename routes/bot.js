const builder = require('botbuilder');
const express = require('express');
const router = express.Router();
const firebase = require('../config/firebaseConfig');
const database = firebase.database();
const newsRef = database.ref('news/');
const userRef = database.ref('users/');
let userSnap = null;
const connector = require('../config/botConfig');

router.post("/", connector.listen());

const bot = new builder.UniversalBot(connector, function (session) {
    // store user's address
    const newUser = userRef.child(session.message.user.id);

    newUser.child("address").set(session.message.address);

    // end current dialog
    session.endDialog('Hey there!');
});

userRef.on('child_added', function (snapshot) {
    if (!snapshot.hasChild("createdAt")) {
        userRef.child(snapshot.key).child("createdAt")
            .set(firebase.database.ServerValue.TIMESTAMP);
        const newUserID = snapshot.key;
        console.log('Starting survey', newUserID);

        const newConversationAddress = Object.assign({}, snapshot.val().address);

        // start survey dialog
        bot.beginDialog(newConversationAddress, 'survey', null, function (err) {
            if (err) {
                // error ocurred while starting new conversation. Channel not supported?
                bot.send(new builder.Message()
                    .text('This channel does not support this operation: ' + err.message)
                    .address(newConversationAddress));
            }
        });
    }
});

bot.dialog('survey', [
    function (session) {
        builder.Prompts.text(session, 'Hello... What\'s your name?');
    },
    function (session, results) {
        userRef.child(session.message.user.id).child("name").set(results.response);
        builder.Prompts.choice(session,
            'Hi ' + results.response + ', for which Resume Manager do you want updates? ', ['Internship', 'Placement']);
    },
    function (session, results) {
        userRef.child(session.message.user.id).child("updateType").set(results.response.entity);
        session.endDialog('Got it... ');
    }
]);

newsRef.on('child_added', function (snapshot) {
    if (!snapshot.hasChild("createdAt")) {
        newsRef.child(snapshot.key).child("createdAt")
            .set(firebase.database.ServerValue.TIMESTAMP);
        let notification = snapshot.val().notification;
        if (userSnap !== null) {
            userSnap.forEach(function (user) {
                bot.send(new builder.Message()
                    .text("Notification Update: " +
                        notification.date + " " + notification.time + ". " +
                        notification.header + ". " +
                        notification.body.substr(0, 100) + "... " +
                        "Posted By: " + notification.poster)
                    .address(user.val().address));
            });
        }
    }
});

userRef.on('value', function (snapshot) {
    userSnap = snapshot;
});

module.exports = router;