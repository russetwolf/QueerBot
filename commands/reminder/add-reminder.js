const { SlashCommandBuilder } = require('discord.js');
const {CronJob } = require('cron');
const reminderCheck = require('../../events/reminderCheck.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('add-reminder')
		.addStringOption((option) => option.setName('message').setDescription('The message you want displayed.').setRequired(true))
		.addStringOption((option) => option.setName('crontab').setDescription('When you want it to remind you in CronTab format https://crontab.guru/ Default: tomorrow at noon.'))
		.addStringOption((option) => option.setName('once').setDescription('(true/false) Do you want this to be a one-time reminder? Default: true.'))
		.addStringOption((option) => option.setName('everyother').setDescription('(true/false) Do you want this to be every-other instance of your crontab? Default: false.'))
		.setDescription('Add a reminder the bot.'),
	async execute(interaction) {
		const user = interaction.user.username;
		const message = interaction.options.getString('message');
		const channelId = interaction.channelId;

		const crontab = interaction.options.getString('crontab');
		const once = interaction.options.getString('once');
		const everyother = interaction.options.getString('everyother');

		const table = interaction.client.tables.get("reminders");

		try {
			//create reminder in db
			const reminder = await table.create({
				creator_username: user,
				message: message,
				crontab: crontab == null ? "0 12 * * *" : crontab,
				channelId: channelId,
				once: once == null ? true : once,
				everyother: everyother == null ? false : everyother,
				everyother_send_next_time: true,
			});

			//create crontab to execute it later
			const job = new CronJob(
				crontab, // cronTime
				async function () {
					await reminderCheck(interaction.client, reminder.get('id'), job);
				}, // onTick
				null, // onComplete
				true, // start
				'America/Toronto' // timeZone
			);

			return interaction.reply(`Reminder added!`);
		} catch (error) {
			console.log(error);
			return interaction.reply(`Something went wrong with adding a reminder: ${error.name}`);
		}
	},
};