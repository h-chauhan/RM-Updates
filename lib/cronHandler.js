const cronJob = require('cron').CronJob;

const cronConfig = require('./../config/cronConfig');
const pullRM = require('./pullRM');
const pullRMJobs = require('./pullRMJobs');
const pullInternRM = require('./pullInternRM');
const pullInternJobs = require('./pullInternJobs');
const pingMyself = require('./pingMyself');

module.exports = {
    scheduleJobs: scheduleJobs
};

function scheduleJobs() {
    // Pull new data from RM
    new cronJob({
        cronTime: cronConfig.pullRMSchedule, // The time pattern when you want the job to start
        onTick: function () { // Task to run
            console.log("Pulling RM");
            pullRM();
            console.log("Pulling Intern RM");
            pullInternRM();
        },
        start: true // immediately starts the job.
    });

    new cronJob({
        cronTime: cronConfig.pullRMJobsSchedule, // The time pattern when you want the job to start
        onTick: function () { // Task to run
            console.log("Pulling RM Jobs");
            pullRMJobs();
            console.log("Pulling Intern Jobs");
            pullInternJobs();
        },
        start: true // immediately starts the job.
    });

    // new cronJob({
    //     cronTime: cronConfig.pingMyselfSchedule, // The time pattern when you want the job to start
    //     onTick: function () { // Task to run
    //         console.log("Pinging myself");
    //         pingMyself();
    //     },
    //     start: true // immediately starts the job.
    // });
}