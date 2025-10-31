const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('list-reminders')
		.setDescription('List the reminders the bot has.'),
	async execute(interaction) {

		const table = interaction.client.tables.get("reminders");
		let response = "Currently active reminders:\n";

		try {
			const reminders = await table.findAll();

			reminders.forEach(r => {
				const line = `id: ${r.id}, creator: ${r.creator_username}, cron: ${r.crontab}, message: ${r.message}, channel: ${r.channelId}, once?: ${r.once}, everyother?: ${r.everyother}, send on next instance?: ${r.everyother_send_next_time}`
				response += `---\n${line}`
			});
			
			return interaction.reply(response);
		} catch (error) {
			console.log(error);
			return interaction.reply(`Something went wrong with getting the reminders list: ${error.name}`);
		}
	},
};