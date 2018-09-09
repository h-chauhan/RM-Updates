const Job = require('cron').CronJob;
const cronConfig = require('../configs/cron.config');
var firebase = require('./firebase');

module.exports = {
    scheduleJobs: function() {
        new Job({
            cronTime: cronConfig.NotificationSchedule,
            onTick: function() {
                firebase.savePlacementNotifs();
                console.log("Placement Notifications Saved!!!");
            },
            start: true
        });

        new Job({
            cronTime: cronConfig.NotificationSchedule,
            onTick: function() {
                firebase.saveInternshipNotifs();
                console.log("Internship Notifications Saved!!!");
            },
            start: true
        });

        new Job({
            cronTime: cronConfig.JobsSchedule,
            onTick: function() {
                firebase.savePlacementJobs();
                console.log("Placement Jobs Saved!!!");
            },
            start: true
        });

        new Job({
            cronTime: cronConfig.JobsSchedule,
            onTick: function() {
                firebase.saveInternshipJobs();
                console.log("Internship Jobs Saved!!!");
            },
            start: true
        });
    }
};