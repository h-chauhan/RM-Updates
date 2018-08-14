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
    session.endDialog();
});

bot.dialog('survey', [
    function (session) {
        session.send('Welcome to RM Updates. Please answer a few questions to subscribe to the service. ' +
            'You can read the Privacy Policy here: http://dturmupdates.me/PrivacyPolicy.html');
        userRef.child(session.message.user.id).child("name").set(session.message.user.name);
        builder.Prompts.choice(session,
            session.message.user.name + ', for which Resume Manager do you want updates? ', ['Internship', 'Placement']);
    },
    function (session, results) {
        userRef.child(session.message.user.id).child("updateType").set(results.response.entity);
        userRef.child(results.response.entity).child(session.message.user.id)
            .set(userSnap.child(session.message.user.id).val());
        session.endDialog('You are now subscribed to ' + results.response.entity + ' RM Updates.');
    }
]);

userRef.on('child_added', function (snapshot) {

    if (userSnap != null && !snapshot.hasChild("createdAt") 
        && !userSnap.child("Placement").hasChild(snapshot.key)
        && !userSnap.child("Internship").hasChild(snapshot.key)) {
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

            userSnap.child("Placement").forEach(function (user) {
                bot.send(new builder.Message()
                    .text("Notification Update:\n\n---\n\n" +
                        notification.date + " " + notification.time + "\n\n---\n\n" +
                        notification.header + "\n\n---\n\n" +
                        notification.body + "\n\n---\n\n" +
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
            userSnap.child("Internship").forEach(function (user) {
                    bot.send(new builder.Message()
                        .text("Notification Update:\n\n---\n\n" +
                            notification.date + " " + notification.time + "\n\n---\n\n" +
                            notification.header + "\n\n---\n\n" +
                            notification.body + "\n\n---\n\n" +
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
            userSnap.child("Placement").forEach(function (user) {
                    bot.send(new builder.Message()
                        .text("Job Opening Update:\n\n---\n\n" +
                            job.name + "\n\n---\n\n" +
                            "Application Deadline: " + job.appDeadline + "\n\n---\n\n" +
                            "Date of Visit: " + job.dateOfVisit + "\n\n---\n\n" +
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
            userSnap.child("Internship").forEach(function (user) {
                    bot.send(new builder.Message()
                        .text("Job Opening Update:\n\n---\n\n" +
                            job.name + "\n\n---\n\n" +
                            "Application Deadline: " + job.appDeadline + "\n\n---\n\n" +
                            "Date of Visit: " + job.dateOfVisit + "\n\n---\n\n" +
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