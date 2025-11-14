const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('change-birthday')
		.addIntegerOption((option) => option.setName('month').setDescription('Your birth month as a number between 1 and 12.').setRequired(true).setMinValue(1).setMaxValue(12))
		.addIntegerOption((option) => option.setName('day').setDescription('Your birth day as a number between 1 and 31.').setRequired(true).setMinValue(1).setMaxValue(31))
		.setDescription('Change your own birthday with the bot.'),
	async execute(interaction) {
		const bUser = interaction.user.username;
		const bMonth = interaction.options.getInteger('month');
		const bDay = interaction.options.getInteger('day');

		const bTable = interaction.client.tables.get("birthdays");

		const affectedRows = await bTable.update({ month: bMonth, day: bDay }, { where: {username: bUser } });

        if (affectedRows > 0 ) {
            return interaction.reply({content: `Updated your birthday to ${bMonth}/${bDay}.`, flags: MessageFlags.Ephemeral });
        }

        return interaction.reply({content: `I don't have a birthday on file for you. Try add-birthday.`, flags: MessageFlags.Ephemeral });
	},
};