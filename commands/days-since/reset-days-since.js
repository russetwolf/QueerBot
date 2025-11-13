const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { NOW } = require('sequelize');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('u-reset-days-since')
		.addIntegerOption((option) => option.setName('id').setDescription('The unique ID number of your days-since tracker. Use list-days-since to find it.').setRequired(true))
		.setDescription('Make the bot reset a days-since tracker to 0.'),
	async execute(interaction) {
		const daysSinceId = interaction.options.getInteger('id');
		const table = interaction.client.tables.get("days-since");
		
		const r = await table.findOne({ where: { id: daysSinceId } });

		if (r) {
			const diffTime = Math.abs(new Date() - new Date(r.date_last_occurred));
			const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
			let record = r.record;

			if (diffDays > record) {
				record = diffDays;
			}

			const today = new Date();

			await table.update({ date_last_occurred: today, record: record }, { where: {id: daysSinceId } });

			//Announce this to everyone, it's half the fun!
			return interaction.reply({ content:`Reset days since ${r.tracker_name} to 0, it was ${diffDays}. Record: ${record}` });
		}
        return interaction.reply({ content: `I don't have a tracker with id ${daysSinceId} on file. Please use list-days-since to find your tracker id.`, flags: MessageFlags.Ephemeral });
	},
};