var db = require('../configs/firebase.config').database();
var service = require('./service');
var hash = require('./hash');

var subscriberRef = db.ref('subscribers');
var internSubscriberSnap = null;
var placementSubscriberSnap = null;

db.ref('subscribers').orderByChild("type").equalTo("Internship").on('value', (snapshot) => {
    internSubscriberSnap = snapshot;
});

db.ref('subscribers').orderByChild("type").equalTo("Placement").on('value', (snapshot) => {
    placementSubscriberSnap = snapshot;
});

module.exports = {
    savePlacementNotifs: function () {
        service.getPlacementNotifications().then((body) => {
            result = JSON.parse(body);
            result.forEach(notif => {
                db.ref('placement_notifications/' + hash(notif.date + ":" + notif.time)).child("notification").set(notif);
            });
        });
    },

    saveInternshipNotifs: function () {
        service.getInternshipNotifications().then((body) => {
            result = JSON.parse(body);
            result.forEach(notif => {
                db.ref('internship_notifications/' + hash(notif.date + ":" + notif.time)).child("notification").set(notif);
            });
        });
    },

    savePlacementJobs: function () {
        service.getPlacementJobs().then((body) => {
            result = JSON.parse(body);
            result.forEach(job => {
                db.ref('placement_jobs/' + hash(job.name)).child("job").set(job);
            });
        });
    },

    saveInternshipJobs: function () {
        service.getInternshipJobs().then((body) => {
            result = JSON.parse(body);
            result.forEach(job => {
                db.ref('internship_jobs/' + hash(job.name)).child("job").set(job);
            });
        });
    },

    saveSubscriber: function (subscriber) {
        db.ref('subscribers/' + subscriber.id).set(subscriber);
    },

    checkIfSubscriberExist: function (id) {
        if (internSubscriberSnap !== null && placementSubscriberSnap !== null) {
            return internSubscriberSnap.hasChild(id) || placementSubscriberSnap.hasChild(id);
        } else {
            return null;
        }
    },

    getSubscribers: function (type) {
        if (internSubscriberSnap !== null && placementSubscriberSnap !== null) {
            return type === "Internship" ? internSubscriberSnap.val() : placementSubscriberSnap.val();
        } else {
            return null;
        }
    }
};