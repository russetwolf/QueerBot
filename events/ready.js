const { Events } = require('discord.js');
const {CronJob } = require('cron');
const birthdayCheck = require('./birthdayCheck.js');
const souvenirCheck = require('./souvenirCheck.js');

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

		// Have to re-set the cronjobs for souvenirs on restart.
		const souvenirTable = client.tables.get("souvenirs");
		console.log(`Got table: ${souvenirTable.name}`);
		const souvenirs = await souvenirTable.findAll();
		souvenirs.forEach(souvenir => {
			const job = new CronJob(
					souvenir.get('crontab'), // cronTime
					async function () {
						await souvenirCheck(client, souvenir.get('id'), job);
					}, // onTick
					null, // onComplete
					true, // start
					'America/Toronto' // timeZone
				);
		})

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};