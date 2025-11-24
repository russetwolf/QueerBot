const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const prettyCron = require('prettycron');
const souvenirList = require('../../command-support/souvenir-list.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('reminder-list')
		.setDescription('List the reminders the bot has.'),
	async execute(interaction) {
		let response = "Currently active reminders:\n";

		try {
			const reminders = await souvenirList(interaction.client.tables, interaction.guildId, [{ key: "active", value: true },{ key: "isBirthday", value: false }]);
			console.log(reminders.length);

			reminders.forEach(r => {
				let line = `"${r.message}" by ${r.creator_username}\n`;
				line += `${prettyCron.toString(r.crontab)}${r.once ? " (once)" : ""}${r.everyother ? " (every other time)" : ""}\n`;
				line += `[id: ${r.id}], channel: ${r.channelId}`;
				response += `\n---\n${line}`;
			});
			
			return interaction.reply({ content: response, flags: MessageFlags.Ephemeral });
		} catch (error) {
			console.log(error);
			return interaction.reply({ content: `Something went wrong with getting the reminders list: ${error.name}`, flags: MessageFlags.Ephemeral });
		}
	},
};