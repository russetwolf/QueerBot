module.exports = async (tables, guildId, flags) => {
	console.log("A");
	const table = tables.get("souvenirs");
	const reminders = await table.findAll();

	return reminders.filter(r => {
		if (r.get('guildId') != guildId) return false;
		flags.forEach( pair => {
			if (r.get(pair.key) != pair.value) return false;
		});
	});
};