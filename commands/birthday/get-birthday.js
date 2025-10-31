const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('get-birthday')
		.setDescription('Get your birthday from the bot'),
	async execute(interaction) {
		const bUser = interaction.user.username;

		const bTable = interaction.client.tables.get("birthdays");

		try {
			const birthday = await bTable.findOne({ where: { username: bUser } });

            if (birthday) {
                return interaction.reply(`Your birthday is ${birthday.get('month')}/${birthday.get('day')} and I've wished you a happy one ${birthday.get('usage_count')} times`);
            }

			return interaction.reply(`I don't have a birthday on file for you. Try add-birthday.`);
		} catch (error) {
			return interaction.reply(`Something went wrong with getting a birthday: ${error.name}`);
		}
	},
};