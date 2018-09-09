var firebase = require('./firebase');
var messenger = require('./messenger');

module.exports = {
    handleMessage: function (id, message) {
        var exists = firebase.checkIfSubscriberExist(id);
        if(exists !== null) {
            if (!exists) {
                if (message == "Internship" || message == "Placement") {
                    messenger.getSenderName(id).then((name) => {
                        var subscriber = {
                            "name": name,
                            "id": id,
                            "type": message
                        };
                        firebase.saveSubscriber(subscriber);
                    });
                    messenger.sendTxtMessage(id, "You are now subscribed to " + message + " RM Updates");
                } else {
                    messenger.sendUrlMessage(id, "Welcome to DTU RM Updates. You can read the Privacy Policy here:",
                        "dturmupdates.me/PrivacyPolicy.html", "Read Privacy Policy").then(() => {
                        messenger.sendMessageWithQuickReplies(id,
                            "For which Resume Manager, do you want to subscribe?\n\nInternship or Placement",
                            ["Internship", "Placement"]);
                    });
                }
            }
        }
    }
};