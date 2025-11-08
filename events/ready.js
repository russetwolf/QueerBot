const { Events } = require('discord.js');
const {CronJob } = require('cron');
const birthdayCheck = require('./birthdayCheck.js');
const reminderCheck = require('./reminderCheck.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) 
	{
		client.tables.forEach(async table => {
			await table.sync();
			console.log(`Sync'd table: ${table.name}`);
		});
		console.log(`Sync'd all tables`);
		
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
		console.log(`Got table: ${table.name}`);
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