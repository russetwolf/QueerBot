const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('delayed-echo')
		.addStringOption((option) => option.setName('message').setDescription('The message you want repeated.').setRequired(true))
		.setDescription('Replies with the message provided, publically, after 30s.'),
	async execute(interaction) {
		setTimeout(() => {
			interaction.client.channels.cache.get(interaction.channelId).send(interaction.options.getString('message'));
		}, 30*1000);
		await interaction.reply({ content: 'Waiting...', flags: MessageFlags.Ephemeral });
		
	},
};