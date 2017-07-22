const cron = require('cron');

const cronConfig = require('./../config/cronConfig');

module.exports = {
	scheduleJobs: scheduleJobs
};

function scheduleJobs() {
	// Pull new data from RM
	let pullRMJob = new cron.CronJob({
		cronTime: cronConfig.pullRMSchedule,  // The time pattern when you want the job to start
		onTick: onTickPullRM, // Task to run
		start: true, // immediately starts the job.
	});

	function onTickPullRM() {
		console.log("Pulling from RM");
	}

	// Ping own server to sustain on Heroku
	let pingSelfJob = new cron.CronJob({
		cronTime: cronConfig.pingSelfSchedule,  // The time pattern when you want the job to start
		onTick: onTickPingSelf, // Task to run
		start: true, // immediately starts the job.
	});

	function onTickPingSelf() {
		console.log("Pinging Myself");
	}
}