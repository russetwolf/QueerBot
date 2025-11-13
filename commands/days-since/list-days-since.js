const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('u-list-days-since')
		.setDescription('List the days-since trackers the bot has.'),
	async execute(interaction) {

		const table = interaction.client.tables.get("days-since");
		let response = "Currently active days-since trackers:\n";

		try {
			const trackers = await table.findAll();

			trackers.forEach(async r => {
				const diffTime = Math.abs(new Date() - new Date(r.date_last_occurred));
				const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
				let record = r.record;

				if (diffDays > record) {
					record = diffDays;
					table.update({ record: record }, { where: {id: r.id } });
				}

				let line = `Days since last ${r.tracker_name}: ${diffDays} days\n`;
				line += `[id: ${r.id}] Record: ${record} days. Creator: ${r.creator_username}`;
				response += `\n---\n${line}`;
			});
			
			return interaction.reply({ content: response, flags: MessageFlags.Ephemeral });
		} catch (error) {
			console.log(error);
			return interaction.reply({ content: `Something went wrong with getting the days-since list: ${error.name}`, flags: MessageFlags.Ephemeral });
		}
	},
};