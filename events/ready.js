const { Events } = require('discord.js');
const {CronJob } = require('cron');
const birthdayCheck = require('./birthdayCheck.js');
const reminderCheck = require('./reminderCheck.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) 
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

		// Have to re-set the cronjobs for reminders on restart.
		const table = client.tables.get("reminders");
		const reminders = await table.findAll();
		reminders.forEach(reminder => {
			const job = new CronJob(
					reminder.get('crontab'), // cronTime
					async function () {
						await reminderCheck(client, reminder.get('id'), job);
					}, // onTick
					null, // onComplete
					true, // start
					'America/Toronto' // timeZone
				);
		})

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};