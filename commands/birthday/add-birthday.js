const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('add-birthday')
		.addIntegerOption((option) => option.setName('month').setDescription('Your birth month as a number between 1 and 12.').setRequired(true).setMinValue(1).setMaxValue(12))
		.addIntegerOption((option) => option.setName('day').setDescription('Your birth day as a number between 1 and 31.').setRequired(true).setMinValue(1).setMaxValue(31))
		.setDescription('Add your birthday to the bot.'),
	async execute(interaction) {
		const bUser = interaction.user.username;
		const bMonth = interaction.options.getInteger('month');
		const bDay = interaction.options.getInteger('day');

		const bTable = interaction.client.tables.get("birthdays");

		try {
			const birthday = await bTable.create({
				username: bUser,
				month: bMonth,
				day: bDay,
				usage_count: 0,
			});

			return interaction.reply(`Birthday ${birthday.month}/${birthday.day} added for ${birthday.username}.`);
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('You already have a birthday on file. Try change-birthday command instead.');
			}

			return interaction.reply(`Something went wrong with adding a birthday: ${error.name}`);
		}
	},
};