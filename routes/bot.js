const express = require('express');
const router = express.Router();
const builder = require('botbuilder');
const firebase = require('../config/firebaseConfig');
const database = firebase.database();
const userRef = database.ref('users/');


// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

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
    }
});

userRef.orderByChild("createdAt").limitToLast(1).on('child_added', function (snapshot) {

    // all records after the last continue to invoke this function
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

module.exports = router;