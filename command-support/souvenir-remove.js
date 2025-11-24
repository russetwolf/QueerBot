module.exports = async (guildId, reminderId, user) => {
	const affectedRows = await table.update({ active: false, last_modified_by_username: user }, { where: { id: reminderId, guildId: guildId, active: true } });
	const r = await table.findOne({ where: { id: reminderId } });
	return {affectedRows: affectedRows, row: r};
};