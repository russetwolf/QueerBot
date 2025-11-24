const cronStart = require('../../command-support/souvenir-cron-start.js');

module.exports = async (guildId, reminderId, user) => {
	const table = interaction.client.tables.get("souvenirs");

	const affectedRows = await table.update({ active: true, last_modified_by_username: user }, { where: { id: reminderId, guildId: guildId, active: false } });
	//create crontab to execute it later
	cronStart(reminder.crontab, reminder.id);

	const r = await table.findOne({ where: { id: reminderId } });
	return {affectedRows: affectedRows, row: r};
};