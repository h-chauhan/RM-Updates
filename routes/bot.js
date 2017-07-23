const express = require('express');
const router = express.Router();
const builder = require('botbuilder');

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

router.post("/", connector.listen());

const userStore = [];
const bot = new builder.UniversalBot(connector, function (session) {
    // store user's address
    const address = session.message.address;
    userStore.push(address);

    // end current dialog
    session.endDialog('Hey there! We will ask you a few questions to get started...');
});

// Every 5 seconds, check for new registered users and start a new dialog
setInterval(function () {
    const newAddresses = userStore.splice(0);
    newAddresses.forEach(function (address) {

        console.log('Starting survey', address);

        // new conversation address, copy without conversationId
        const newConversationAddress = Object.assign({}, address);

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
}, 5000);

bot.dialog('survey', [
    function (session) {
        builder.Prompts.text(session, 'Hello... What\'s your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.choice(session,
            'Hi ' + results.response + ', for which Resume Manager do you want updates? ',
            ['Internship', 'Placement']);
    },
    function (session, results) {
        session.userData.updateType = results.response.entity;
        session.endDialog('Got it... ' + session.userData.name +
            ' you want updates for ' + session.userData.updateType +
            ' Resume Manager.');
    }
]);

module.exports = router;