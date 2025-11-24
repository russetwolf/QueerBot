const cronStart = require('./souvenir-cron-start.js');

module.exports = async (client, guildId, reminderId, user) => {
	const table = client.tables.get("souvenirs");

	const affectedRows = await table.update({ active: true, last_modified_by_username: user }, { where: { id: reminderId, guildId: guildId, active: false } });

	const r = await table.findOne({ where: { id: reminderId } });
	//create crontab to execute it later
	cronStart(client, r.crontab, r.id);

	return {affectedRows: affectedRows, row: r};
};