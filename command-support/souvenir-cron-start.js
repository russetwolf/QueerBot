const { CronJob } = require('cron');

module.exports = async (crontab, id) => {
	//create crontab to execute it later
	const job = new CronJob(
		crontab, // cronTime
		async function () {
			await souvenirCheck(interaction.client, id, job);
		}, // onTick
		null, // onComplete
		true, // start
		'America/Toronto' // timeZone
	);
};
