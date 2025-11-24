module.exports = async (client, guildId, reminderId, user, row) => {
	const table = client.tables.get("souvenirs");
	const affectedRows = await table.update({
		crontab: row.crontab,
		message: row.message,
		channelId: row.channelId,
		once: row.once,
		everyother: row.everyother,
		everyother_send_next_time: row.everyother_send_next_time,
		last_modified_by_username: user
	}, 
	{ where: { id: reminderId, guildId: guildId, active: true } });
	const r = await table.findOne({ where: { id: reminderId } });
	return { affectedRows: affectedRows, row: r };
};