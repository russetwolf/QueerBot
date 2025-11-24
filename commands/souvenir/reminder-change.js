const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const prettyCron = require('prettycron');
const birthdayGet = require('../../command-support/souvenir-birthday-get.js');
const souvenirChange = require('../../command-support/souvenir-change.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('reminder-change')
		.addIntegerOption((option) => 
			option.setName('reminder-id')
				.setDescription('The unique ID number of your reminder. Use reminders-list to find it.')
				.setRequired(true))
		.addStringOption((option) => 
			option.setName('message')
				.setDescription('The message you want displayed.'))
		.addStringOption((option) => 
			option.setName('crontab')
				.setDescription('When? "min hr day# month# weekday#" Default: tomorrow at noon.'))
		.addStringOption((option) => 
			option.setName('once')
				.setDescription('(true/false) Default: true.'))
		.addStringOption((option) => 
			option.setName('everyother')
				.setDescription('(true/false) Default: false.'))
		.setDescription(`Change a reminder, all fields except ID are optional.`),
	async execute(interaction) {
		const user = interaction.user.username;
		const guildId = interaction.guildId;
		const reminderId = interaction.options.getInteger('reminder-id');
		
		const table = interaction.client.tables.get("souvenirs");

		let r = await table.findOne({ where: { guildId: guildId, id: reminderId, active: true } });
		if (!r) {
	        return interaction.reply({content: `I don't have an active reminder with id ${reminderId} on file for this server.`, flags: MessageFlags.Ephemeral });
		}

		const message = interaction.options.getString('message');
		if (message != null) r.message = message;
		const channelId = interaction.channelId;
		if (channelId != null) r.channelId = channelId;
		const crontab = interaction.options.getString('crontab');
		if (crontab != null) r.crontab = crontab;
		const once = interaction.options.getString('once');
		if (once != null) r.once = once;
		const everyother = interaction.options.getString('everyother');
		if (everyother != null) r.everyother = everyother;

		const result = await souvenirChange(interaction.client, interaction.guildId, reminderId, user, r);

        if (result.affectedRows > 0 ) {
            r = result.row;
			let line = `"${r.message}" by ${r.creator_username}\n`;
						line += `${prettyCron.toString(r.crontab)}${r.once ? " (once)" : ""}${r.everyother ? " (every other time)" : ""}`;
			return interaction.reply({ 
				content: `I changed the reminder with id ${reminderId} to the below reminder.\n---\n${line}`, 
				flags: MessageFlags.Ephemeral 
			});
        }
		
		return interaction.reply({content: `Something went wrong with changing a reminder.`, flags: MessageFlags.Ephemeral });
	},
};