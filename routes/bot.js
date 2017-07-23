const express = require('express');
const router = express.Router();
const builder = require('botbuilder');
var firebase = require('firebase');
firebase.initializeApp(require('../config/firebaseConfig'));
var database = firebase.database();
var userRef = database.ref('users/');


// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

router.post("/", connector.listen());

const bot = new builder.UniversalBot(connector, function (session) {
    // store user's address
    var newUser = userRef.child(session.message.user.id);
    newUser.set({
        address: session.message.address
    });

    // end current dialog
    session.endDialog('Hey there! We will ask you a few questions to get started...');
});

// Every 5 seconds, check for new registered users and start a new dialog
userRef.limitToLast(1).on('child_added', function (snapshot) {

    // all records after the last continue to invoke this function
    var newUserID = snapshot.key;
    console.log('Starting survey', newUserID);

    const newConversationAddress = Object.assign({}, snapshot.val().address);

    // start survey dialog
    bot.beginDialog(newConversationAddress, 'survey', null, function (err) {
        if (err) {
            // error ocurred while starting new conversation. Channel not supported?
            bot.send(new builder.Message()
                .text('This channel does not support this operation: ' + err.message)
                .address(address));
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
            'Hi ' + results.response + ', for which Resume Manager do you want updates? ',
            ['Internship', 'Placement']);
    },
    function (session, results) {
        userRef.child(session.message.user.id).child("updateType").set(results.response.entity);
        session.endDialog('Got it... ' + session.userData.name +
            ' you want updates for ' + session.userData.updateType +
            ' Resume Manager.');
    }
]);

module.exports = router;