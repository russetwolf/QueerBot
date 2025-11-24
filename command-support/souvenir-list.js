module.exports = async (tables, guildId, flags) => {
	const table = tables.get("souvenirs");
	const reminders = await table.findAll();

	return reminders.filter(r => {
		console.log(`Row ${r.id}`)
		if (r.get('guildId') != guildId) {
			console.log(`not part of this guild ${r.guildId} =/= ${guildId}`);
			return false;
		}
		flags.forEach( pair => {
			if (r.get(pair.key) != pair.value) {
				console.log(`pair.key = ${pair.key} | pair.value = ${pair.value} | r.key =  ${r.get(pair.key)}`);
				return false;
			}
		});
		return true;
	});
};