var db = require('../configs/firebase.config');
var service = require('./service');

module.exports = {
    savePlacementNotifs: function() {
        service.getPlacementNotifications().then((body) => {
            result = JSON.parse(body);
            var ref = db.collection('placement_notifications');
            result.forEach(notif => {
                var doc = ref.doc(notif.date + ":" + notif.time);
                doc.set(notif);
            });
        });
    },

    saveInternshipNotifs: function() {
        service.getInternshipNotifications().then((body) => {
            result = JSON.parse(body);
            var ref = db.collection('internship_notifications');
            result.forEach(notif => {
                var doc = ref.doc(notif.date + ":" + notif.time);
                doc.set(notif);
            });
        });
    },

    savePlacementJobs: function() {
        service.getPlacementJobs().then((body) => {
            result = JSON.parse(body);
            var ref = db.collection('placement_jobs');
            result.forEach(job => {
                var doc = ref.doc(job.name);
                doc.set(job);
            });
        });
    },

    saveInternshipJobs: function() {
        service.getInternshipJobs().then((body) => {
            result = JSON.parse(body);
            var ref = db.collection('internship_jobs');
            result.forEach(job => {
                var doc = ref.doc(job.name);
                doc.set(job);
            });
        });
    },
};