module.exports = async (client, guildId, flags) => {
	const table = client.tables.get("souvenirs");
	const reminders = await table.findAll();

	const filtered = reminders.filter(r => {
		if (r.get('guildId') != guildId) {
			return false;
		}

		for (let i = 0; i < flags.length; i++) {
			if (r.get(flags[i].key) != flags[i].value) {
				return false;
			}
		}
		return true;
	});
	return filtered;
};