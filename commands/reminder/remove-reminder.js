const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('remove-reminder')
		.addIntegerOption((option) => option.setName('reminder-id').setDescription('The unique ID number of your reminder. Use list-reminders to find it.').setRequired(true))
		.setDescription('Make the bot forget a reminder.'),
	async execute(interaction) {
		const reminderId = interaction.options.getInteger('reminder-id');
		const table = interaction.client.tables.get("reminders");

		const affectedRows = await table.destroy( { where: {id: reminderId } });

        if (!affectedRows) {
            return interaction.reply({ content: `I didn't have a reminder with id ${reminderId} on file. Now I still don't!`, flags: MessageFlags.Ephemeral });
        }

        return interaction.reply({ content: `I deleted the reminder with id ${reminderId}.`, flags: MessageFlags.Ephemeral });
	},
};