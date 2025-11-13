const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('echo')
		.addStringOption((option) => option.setName('message').setDescription('The message you want repeated.').setRequired(true))
		.setDescription('Replies with the message provided, publically.'),
	async execute(interaction) {
		await interaction.reply({ content: message });
	},
};