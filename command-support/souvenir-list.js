module.exports = async (guildId, flags) => {
	const table = interaction.client.tables.get("souvenirs");
	const reminders = await table.findAll();

	return reminders.filter(r => {
		if (r.get('guildId') != guildId) return false;
		flags.forEach( pair => {
			if (r.get(pair.key) != pair.value) return false;
		});
	});
};