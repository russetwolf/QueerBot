const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const prettyCron = require('prettycron');
const souvenirRemove = require('../../command-support/souvenir-remove.js');

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
		const guildId = interaction.guildId;

		const result = await souvenirRemove(interaction.client, guildId, reminderId, user);

        if (result.affectedRows == 0) {
            return interaction.reply({ 
				content: `I didn't have an active reminder with id ${reminderId} on file for this server. Now I still don't!`, 
				flags: MessageFlags.Ephemeral 
			});
        }

		const r = result.row;
		let line = `"${r.message}" by ${r.creator_username}\n`;
						line += `${prettyCron.toString(r.crontab)}${r.once ? " (once)" : ""}${r.everyother ? " (every other time)" : ""}`;
        return interaction.reply({ 
			content: `I deactivated the below reminder with id ${reminderId}. If this was a mistake, run \`/reminder-undo [id]\`\n---\n${line}`, 
			flags: MessageFlags.Ephemeral 
		});
	},
};