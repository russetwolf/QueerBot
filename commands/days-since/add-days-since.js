const { SlashCommandBuilder } = require('discord.js');
const {CronJob } = require('cron');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('add-days-since')
		.addStringOption((option) => option.setName('tracker_name').setDescription('The event you want tracked.').setRequired(true))
		.setDescription('Add an event for the bot to track days since.'),
	async execute(interaction) {
		const user = interaction.user.username;
		const trackerName = interaction.options.getString('tracker_name');

		const table = interaction.client.tables.get("days-since");

		try {
			//create tracker in db
			const tracker = await table.create({
				creator_username: user,
				tracker_name: trackerName,
			});

			return interaction.reply(`Now tracking days since last ${trackerName}`);
		} catch (error) {
			console.log(error);
			return interaction.reply(`Something went wrong with adding an event: ${error.name}`);
		}
	},
};