const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const birthdayGet = require('../../command-support/souvenir-birthday-get.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('birthday-get')
		.setDescription('Get your birthday from the bot'),
	async execute(interaction) {
		const user = interaction.user.username;

		try {
			const birthdayInfo = await birthdayGet(interaction.client, interaction.guildId, user);			
			const birthday = birthdayInfo.souvenir;

            if (birthday) {
                return interaction.reply({content: `Your birthday is ${birthdayInfo.month}/${birthdayInfo.day}.`, flags: MessageFlags.Ephemeral });;
            }

			return interaction.reply({content: `I don't have a birthday on file for you. Try add-birthday.`, flags: MessageFlags.Ephemeral });
		} catch (error) {
			console.log(error);
			return interaction.reply({content: `Something went wrong with getting a birthday: ${error.name}`, flags: MessageFlags.Ephemeral });
		}
	},
};