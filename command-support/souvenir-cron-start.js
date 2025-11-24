const { CronJob } = require('cron');
const souvenirCheck = require('../events/souvenirCheck.js');

module.exports = async (client, crontab, id) => {
	//create crontab to execute it later
	const job = new CronJob(
		crontab, // cronTime
		async function () {
			await souvenirCheck(client, id, job);
		}, // onTick
		null, // onComplete
		true, // start
		'America/Toronto' // timeZone
	);
};
