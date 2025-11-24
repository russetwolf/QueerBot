const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const birthdayGet = require('../../command-support/souvenir-birthday-get.js');
const souvenirChange = require('../../command-support/souvenir-change.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('birthday-change')
		.addIntegerOption((option) => option.setName('month').setDescription('Your birth month as a number between 1 and 12.').setRequired(true).setMinValue(1).setMaxValue(12))
		.addIntegerOption((option) => option.setName('day').setDescription('Your birth day as a number between 1 and 31.').setRequired(true).setMinValue(1).setMaxValue(31))
		.setDescription('Change your own birthday with the bot.'),
	async execute(interaction) {
		const user = interaction.user.username;
		const month = interaction.options.getInteger('month');
		const day = interaction.options.getInteger('day');

		birthdayInfo = await birthdayGet(interaction.client, interaction.guildId, user);
		let b = birthdayInfo.souvenir;

		if (!b) {
	        return interaction.reply({content: `I don't have a birthday on file for you. Try add-birthday.`, flags: MessageFlags.Ephemeral });
		}
		b.crontab = `0 12 ${day} ${month} *`;

		const result = await souvenirChange(interaction.client, interaction.guildId, b.id, user, b);

        if (result.affectedRows > 0 ) {
            return interaction.reply({content: `Updated your birthday to ${month}/${day}.`, flags: MessageFlags.Ephemeral });
        }
		return interaction.reply({content: `Something went wrong with changing a birthday.`, flags: MessageFlags.Ephemeral });
	},
};