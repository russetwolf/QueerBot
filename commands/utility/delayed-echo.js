const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('delayed-echo')
		.addStringOption((option) => option.setName('message').setDescription('The message you want repeated.').setRequired(true))
		.setDescription('Replies with the message provided, publically, after 30s.'),
	async execute(interaction) {
		await sleep(30*1000);
		await interaction.reply({ content: interaction.options.getString('message') });
	},
};