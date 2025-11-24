const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const prettyCron = require('prettycron');
const souvenirUndo = require('../../command-support/souvenir-undo.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('reminder-undo')
		.addIntegerOption((option) => 
			option.setName('reminder-id')
				.setDescription('The unique ID number of your accidentally-deleted reminder.')
				.setRequired(true))
		.setDescription('Un-forget a reminder.'),
	async execute(interaction) {
		const reminderId = interaction.options.getInteger('reminder-id');
		const user = interaction.user.username;
		const guildId = interaction.guildId;

		const result = await souvenirUndo(interaction.client, guildId, reminderId, user);

		if (result.affectedRows == 0) {
            return interaction.reply({ 
				content: `I didn't have a reminder with id ${reminderId} on file. Now I still don't!`, 
				flags: MessageFlags.Ephemeral 
			});
        }

		const r = result.row;
		let line = `"${r.message}" by ${r.creator_username}\n`;
						line += `${prettyCron.toString(r.crontab)}${r.once ? " (once)" : ""}${r.everyother ? " (every other time)" : ""}`;
        return interaction.reply({ 
			content: `I un-deleted the below reminder with id ${reminderId}.\n---\n${line}`, 
			flags: MessageFlags.Ephemeral 
		});
	},
};