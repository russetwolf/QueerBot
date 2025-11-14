const { SlashCommandBuilder, MessageFlags } = require('discord.js');

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
            return interaction.reply({content: `I didn't have a birthday on file for you. Now I still don't!`, flags: MessageFlags.Ephemeral });
        }

        return interaction.reply({content: `I deleted the birthday on file for you.`, flags: MessageFlags.Ephemeral });
	},
};