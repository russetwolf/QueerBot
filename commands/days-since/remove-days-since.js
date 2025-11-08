const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('remove-days-since')
		.addIntegerOption((option) => option.setName('id').setDescription('The unique ID number of your days-since tracker. Use list-days-sinces to find it.').setRequired(true))
		.setDescription('Make the bot forget a days-since tracker.'),
	async execute(interaction) {
		const daysSinceId = interaction.options.getInteger('id');
		const table = interaction.client.tables.get("days-since");

		const affectedRows = await table.destroy( { where: {id: daysSinceId } });

        if (!affectedRows) {
            return interaction.reply(`I didn't have a tracker with id ${daysSinceId} on file. Now I still don't!`);
        }

        return interaction.reply(`I deleted the tracker with id ${days-sinceId}.`);
	},
};