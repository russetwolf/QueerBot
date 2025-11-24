const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const prettyCron = require('prettycron');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('reminder-remove')
		.addIntegerOption((option) => 
			option.setName('reminder-id')
				.setDescription('The unique ID number of your reminder. Use reminders-list to find it.')
				.setRequired(true))
		.setDescription('Make the bot forget a reminder.'),
	async execute(interaction) {
		const reminderId = interaction.options.getInteger('reminder-id');
		const user = interaction.user.username;
		const table = interaction.client.tables.get("souvenirs");
		const guildId = interaction.guildId;

		const affectedRows = await table.update({ active: false, last_modified_by_username: user }, { where: { id: reminderId, guildId: guildId } });
        if (affectedRows == 0) {
            return interaction.reply({ 
				content: `I didn't have a reminder with id ${reminderId} on file for this server. Now I still don't!`, 
				flags: MessageFlags.Ephemeral 
			});
        }

		const r = await table.findOne({ where: { id: reminderId } });

		let line = `"${r.message}" by ${r.creator_username}\n`;
						line += `${prettyCron.toString(r.crontab)}${r.once ? " (once)" : ""}${r.everyother ? " (every other time)" : ""}`;

        return interaction.reply({ 
			content: `I deactivated the below reminder with id ${reminderId}. If this was a mistake, run \`/reminder-undo [id]\`\n---\n${line}`, 
			flags: MessageFlags.Ephemeral 
		});
	},
};