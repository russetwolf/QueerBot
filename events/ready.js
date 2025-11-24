const { Events } = require('discord.js');
const {CronJob } = require('cron');
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

		// Have to re-set the cronjobs for souvenirs on restart.
		const souvenirTable = client.tables.get("souvenirs");
		console.log(`Setting up Cron Jobs for table: ${souvenirTable.name}`);
		const souvenirs = await souvenirTable.findAll();
		souvenirs.forEach(souvenir => {
			if (souvenir.active) {
				const job = new CronJob(
					souvenir.get('crontab'), // cronTime
					async function () {
						await souvenirCheck(client, souvenir.get('id'), job);
					}, // onTick
					null, // onComplete
					true, // start
					'America/Toronto' // timeZone
				);
			}
		})

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};