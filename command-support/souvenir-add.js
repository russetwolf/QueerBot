const cronStart = require('./souvenir-cron-start.js');

module.exports = async (client, guildId, row) => {
	const table = client.tables.get("souvenirs");

	//create reminder in db
	row.guildId = guildId
	const reminder = await table.create(row);

	//create crontab to execute it later
	cronStart(client, reminder.crontab, reminder.id);

	return reminder.id;
};
