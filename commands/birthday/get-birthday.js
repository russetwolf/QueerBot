const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('get-birthday')
		.setDescription('Get your birthday from the bot'),
	async execute(interaction) {
		const bUser = interaction.user.username;

		const bTable = interaction.client.tables.get("birthdays");

		try {
			const birthday = await bTable.findOne({ where: { username: bUser } });

            if (birthday) {
                return interaction.reply({content: `Your birthday is ${birthday.get('month')}/${birthday.get('day')} and I've wished you a happy one ${birthday.get('usage_count')} times`, flags: MessageFlags.Ephemeral });;
            }

			return interaction.reply({content: `I don't have a birthday on file for you. Try add-birthday.`, flags: MessageFlags.Ephemeral });
		} catch (error) {
			return interaction.reply({content: `Something went wrong with getting a birthday: ${error.name}`, flags: MessageFlags.Ephemeral });
		}
	},
};