const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { CronJob } = require('cron');
const prettyCron = require('prettycron');
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
		const crontab = interaction.options.getString('crontab') == null ? "00 12 * * *" : interaction.options.getString('crontab');

		let r = {
				creator_username: user,
				message: message,
				channelId: channelId,
				crontab: crontab,
			}

		const once = interaction.options.getString('once');
		if (once != null) r.once = once;
		const everyother = interaction.options.getString('everyother');
		if (everyother != null) r.everyother = everyother;

		const table = interaction.client.tables.get("reminders");

		try {
			//create reminder in db
			const reminder = await table.create(r);

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

			const response = `I'll remind you "${message}" at ${prettyCron.toString(crontab)}${reminder.once ? " (once)" : ""}${reminder.everyother ? " (every other time)" : ""} [id: ${reminder.id}]`;

			return interaction.reply({ content: response, flags: MessageFlags.Ephemeral });
		} catch (error) {
			console.log(error);
			return interaction.reply({ content: `Something went wrong with adding a reminder: ${error.name}`, flags: MessageFlags.Ephemeral });
		}
	},
};
