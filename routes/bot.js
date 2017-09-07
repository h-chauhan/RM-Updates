const builder = require('botbuilder');
const express = require('express');
const router = express.Router();
const firebase = require('../config/firebaseConfig');
const database = firebase.database();
const newsRef = database.ref('news/');
const newsInternRef = database.ref('internNews/');
const jobsRef = database.ref('jobs/');
const internJobsRef = database.ref('internJobs/');
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

bot.dialog('survey', [
    function (session) {
        session.send('Welcome to RM Updates. Please answer a few questions to subscribe to the service. ' +
            'You can read the Privacy Policy here: http://dturmupdates.tk/PrivacyPolicy.html');
        builder.Prompts.text(session, 'To start with... What\'s your name?');
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
                    .address(newConversationAddress)
                    .sourceEvent({
                        facebook: {
                            notification_type: "REGULAR"
                        }
                    }));
            }
        });
    }
});

newsRef.on('child_added', function (snapshot) {
    if (!snapshot.hasChild("createdAt")) {
        newsRef.child(snapshot.key).child("createdAt")
            .set(firebase.database.ServerValue.TIMESTAMP);
        let notification = snapshot.val().notification;
        if (userSnap !== null) {
            userSnap.forEach(function (user) {
                if (user.val().updateType === "Placement")
                    bot.send(new builder.Message()
                        .text("Notification Update:\r\n" +
                            notification.date + " " + notification.time + "\r\n" +
                            notification.header + "\r\n" +
                            notification.body.substr(0, 500) + "\r\n" +
                            "Posted By: " + notification.poster)
                        .address(user.val().address)
                        .sourceEvent({
                            facebook: {
                                notification_type: "REGULAR"
                            }
                        }));
            });
        }
    }
});

newsInternRef.on('child_added', function (snapshot) {
    if (!snapshot.hasChild("createdAt")) {
        newsInternRef.child(snapshot.key).child("createdAt")
            .set(firebase.database.ServerValue.TIMESTAMP);
        let notification = snapshot.val().notification;
        if (userSnap !== null) {
            userSnap.forEach(function (user) {
                if (user.val().updateType === "Internship")
                    bot.send(new builder.Message()
                        .text("Notification Update:\r\n" +
                            notification.date + " " + notification.time + "\r\n" +
                            notification.header + "\r\n" +
                            notification.body.substr(0, 500) + "\r\n" +
                            "Posted By: " + notification.poster)
                        .address(user.val().address)
                        .sourceEvent({
                            facebook: {
                                notification_type: "REGULAR"
                            }
                        }));
            });
        }
    }
});

jobsRef.on('child_added', function (snapshot) {
    if (!snapshot.hasChild("createdAt")) {
        jobsRef.child(snapshot.key).child("createdAt")
            .set(firebase.database.ServerValue.TIMESTAMP);
        let job = snapshot.val().job;
        if (userSnap !== null) {
            userSnap.forEach(function (user) {
                if (user.val().updateType === "Placement")
                    bot.send(new builder.Message()
                        .text("Job Opening Update:\r\n" +
                            job.name + "\r\n" +
                            "Application Deadline: " + job.appDeadline + "\r\n" +
                            "Date of Visit: " + job.dateOfVisit + "\r\n" +
                            "Apply: " + job.link)
                        .address(user.val().address)
                        .sourceEvent({
                            facebook: {
                                notification_type: "REGULAR"
                            }
                        }));
            });
        }
    }
});

internJobsRef.on('child_added', function (snapshot) {
    if (!snapshot.hasChild("createdAt")) {
        internJobsRef.child(snapshot.key).child("createdAt")
            .set(firebase.database.ServerValue.TIMESTAMP);
        let job = snapshot.val().job;
        if (userSnap !== null) {
            userSnap.forEach(function (user) {
                if (user.val().updateType === "Internship")
                    bot.send(new builder.Message()
                        .text("Job Opening Update:\r\n" +
                            job.name + "\r\n" +
                            "Application Deadline: " + job.appDeadline + "\r\n" +
                            "Date of Visit: " + job.dateOfVisit + "\r\n" +
                            "Apply: " + job.link)
                        .address(user.val().address)
                        .sourceEvent({
                            facebook: {
                                notification_type: "REGULAR"
                            }
                        }));
            });
        }
    }
});

userRef.on('value', function (snapshot) {
    userSnap = snapshot;
});

module.exports = router;