module.exports = async (client, guildId, user) => {
	const table = client.tables.get("souvenirs");

    const birthday = await table.findOne({ where: { guildId: guildId, creator_username: user, isBirthday: true, active: true } });
    if (birthday) {
        const crontabSplit = birthday.crontab.split(" ");
        const day = crontabSplit[2];
        const month = crontabSplit[3];
        return { souvenir: birthday, day: day, month: month }
    }
    return { souvenir: null, day: 0, month: 0 }
};