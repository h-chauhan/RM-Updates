const cronJob = require('cron').CronJob;

const cronConfig = require('./../config/cronConfig');
const pullRM = require('./pullRM');
const pullInternRM = require('./pullInternRM');

module.exports = {
    scheduleJobs: scheduleJobs
};

function scheduleJobs() {
    // Pull new data from RM
    new cronJob({
        cronTime: cronConfig.pullRMSchedule, // The time pattern when you want the job to start
        onTick: function () { // Task to run
            console.log("Pulling RM");
            pullRM().then(function (html) {
                console.log(html);
            });
            console.log("Pulling Intern RM");
            // pullInternRM().then(function (html) {
            //     console.log(html);
            // })
        },
        start: true // immediately starts the job.
    });
}