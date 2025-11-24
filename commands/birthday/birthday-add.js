const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const souvenirAdd = require('../../command-support/souvenir-add.js');
const birthdayGet = require('../../command-support/souvenir-birthday-get.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('birthday-add')
		.addIntegerOption((option) => option.setName('month').setDescription('Your birth month as a number between 1 and 12.').setRequired(true).setMinValue(1).setMaxValue(12))
		.addIntegerOption((option) => option.setName('day').setDescription('Your birth day as a number between 1 and 31.').setRequired(true).setMinValue(1).setMaxValue(31))
		.setDescription('Add your birthday to the bot.'),
	async execute(interaction) {
		const user = interaction.user.username;
		const month = interaction.options.getInteger('month');
		const day = interaction.options.getInteger('day');

		try {
			const birthdayInfo = await birthdayGet(interaction.client, interaction.guildId, user);
			if(birthdayInfo.souvenir) {
				return interaction.reply({
					content: `You already have a birthday on file as ${birthdayInfo.month}/${birthdayInfo.day}. Try change-birthday command instead.`, 
					flags: MessageFlags.Ephemeral 
				});
			}

			let b = {
				creator_username: user,
				message: `Happy Birthday to @${user}!`,
				channelId: process.env.BIRTHDAY_CHANNEL_ID,
				crontab: `0 12 ${day} ${month} *`,
				once: false,
				isBirthday: true,
			}
		
			const birthdayId = await souvenirAdd(interaction.client, interaction.guildId, b);

			return interaction.reply({content: `Birthday ${month}/${day} added for ${user}.`, flags: MessageFlags.Ephemeral });
		} catch (error) {
			console.log(error);
			return interaction.reply({content: `Something went wrong with adding a birthday: ${error.name}`, flags: MessageFlags.Ephemeral });
		}
	},
};