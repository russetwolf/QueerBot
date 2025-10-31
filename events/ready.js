const { Events } = require('discord.js');
const {CronJob } = require('cron');
const birthdayCheck = require('./birthdayCheck.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) 
	{
		client.tables.forEach(table => {
			table.sync();
		});
		const job = new CronJob(
			'30 12 * * *', // cronTime
			async function () {
				await birthdayCheck(client);
      		}, // onTick
			null, // onComplete
			true, // start
			'America/Toronto' // timeZone
		);

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};