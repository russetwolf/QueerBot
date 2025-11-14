const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const prettyCron = require('prettycron');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('list-reminders')
		.setDescription('List the reminders the bot has.'),
	async execute(interaction) {
		const guildId = interaction.interaction.guildID;

		const table = interaction.client.tables.get("reminders");
		let response = "Currently active reminders:\n";

		try {
			const reminders = await table.findAll();

			reminders.filter(r => {
					return r.active && !r.isBirthday && r.guildId == guildId;
				})
				.forEach(r => {
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