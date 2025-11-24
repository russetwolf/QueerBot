module.exports = async (client, guildId, reminderId, user) => {
	const table = client.tables.get("souvenirs");
	const affectedRows = await table.update({ active: false, last_modified_by_username: user }, { where: { id: reminderId, guildId: guildId, active: true } });
	const r = await table.findOne({ where: { id: reminderId } });
	return {affectedRows: affectedRows, row: r};
};