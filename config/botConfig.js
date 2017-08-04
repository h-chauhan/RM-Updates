// Create chat connector for communicating with the Bot Framework Service
const builder = require('botbuilder');

module.exports = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

