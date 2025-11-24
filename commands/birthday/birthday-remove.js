const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const souvenirRemove = require('../../command-support/souvenir-remove.js');
const birthdayGet = require('../../command-support/souvenir-birthday-get.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('birthday-remove')
		.setDescription('Make the bot forget your birthday.'),
	async execute(interaction) {
		const user = interaction.user.username;
		const guildId = interaction.guildId;
		const birthdayInfo = await birthdayGet(interaction.client, guildId, user);

		if (!birthdayInfo.souvenir) {
			return interaction.reply({ 
				content: `I didn't have a birthday on file for you. Now I still don't!`, 
				flags: MessageFlags.Ephemeral 
			});
		}

		await souvenirRemove(interaction.client, guildId, birthdayInfo.souvenir.id, user);
		return interaction.reply({ 
			content: `I deactivated the birthday on file for you. If this was a mistake, run \`/reminder-undo ${birthdayInfo.souvenir.id}\``, 
			flags: MessageFlags.Ephemeral 
		});
	},
};