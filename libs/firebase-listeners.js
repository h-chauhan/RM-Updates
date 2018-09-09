var db = require('../configs/firebase.config').database();
var firebase = require('./firebase');
var messenger = require('./messenger');
var rm = require('./RM');

db.ref('placement_notifications').on('child_added', (snapshot) => {
    if (!snapshot.hasChild('created')) {
        db.ref('placement_notifications').child(snapshot.key).child("created")
            .set("true");

        var subscribers = firebase.getSubscribers('Placement');

        if (subscribers !== null) {
            for(id in subscribers) {
                messenger.sendTxtMessage(id,
                    rm.NotificationToString(snapshot.child('notification').val()));
            };
        }
    }
});

db.ref('internship_notifications').on('child_added', (snapshot) => {
    if (!snapshot.hasChild('created')) {
        db.ref('internship_notifications').child(snapshot.key).child("created")
            .set("true");

        var subscribers = firebase.getSubscribers('Internship');

        if (subscribers !== null) {
            for(id in subscribers) {
                messenger.sendTxtMessage(id,
                    rm.NotificationToString(snapshot.child('notification').val()));
            };
        }
    }
});

db.ref('placement_jobs').on('child_added', (snapshot) => {
    if (!snapshot.hasChild('created')) {
        db.ref('placement_jobs').child(snapshot.key).child("created")
            .set("true");

        var subscribers = firebase.getSubscribers('Placement');

        if (subscribers !== null) {
            for(id in subscribers) {
                messenger.sendTxtMessage(id,
                    rm.JobToString(snapshot.child('job').val()));
            };
        }
    }
});

db.ref('internship_jobs').on('child_added', (snapshot) => {
    if (!snapshot.hasChild('created')) {
        db.ref('internship_jobs').child(snapshot.key).child("created")
            .set("true");

        var subscribers = firebase.getSubscribers('Internship');

        if (subscribers !== null) {
            for(id in subscribers) {
                messenger.sendTxtMessage(id,
                    rm.JobToString(snapshot.child('job').val()));
            };
        }
    }
});

module.exports = this;