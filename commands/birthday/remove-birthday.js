const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('remove-birthday')
		.setDescription('Make the bot forget your birthday.'),
	async execute(interaction) {
		const bUser = interaction.user.username;
		const bTable = interaction.client.tables.get("birthdays");

		const affectedRows = await bTable.destroy( { where: {username: bUser } });

        if (!affectedRows) {
            return interaction.reply(`I didn't have a birthday on file for you. Now I still don't!`);
        }

        return interaction.reply(`I deleted the birthday on file for you.`);
	},
};