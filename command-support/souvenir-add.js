const cronStart = require('./souvenir-cron-start.js');

module.exports = async (tables, guildId, row) => {
	const table = tables.get("souvenirs");

	//create reminder in db
	row.guildId = guildId
	const reminder = await table.create(row);

	//create crontab to execute it later
	cronStart(reminder.crontab, reminder.id);

	return reminder.id;
};
