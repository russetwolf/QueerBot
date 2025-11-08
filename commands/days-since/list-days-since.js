const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('list-days-since')
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

				const line = `id: ${r.id}, tracker: ${r.tracker_name}, creator: ${r.creator_username}, time since last occurence: ${diffDays} days, record: ${record} days`
				response += `---\n${line}`
			});
			
			return interaction.reply(response);
		} catch (error) {
			console.log(error);
			return interaction.reply(`Something went wrong with getting the days-since list: ${error.name}`);
		}
	},
};