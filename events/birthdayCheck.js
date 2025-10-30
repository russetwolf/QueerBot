const { Events } = require('discord.js');
const { birthdayChannelId } = require('./config.json');

module.exports = async (client) => {
	const today = new Date().toLocaleDateString('en-US');
	const [month, day] = today.split('/').slice(0, 2);
	console.log(`Checking for birthdays today: ${month}/${day}`);

	const bTable = interaction.client.tables.get("birthdays");

	try {
		const birthdays = await bTable.findAll({ where: { month: month, day: day } });

		birthdays.forEach(row => {
			const user = row.get('username');
			const wishCountIncremented = row.get('usage_count')+1;
			let lastDigit = wishCountIncremented;
			let countSuffix;
			if (wishCountIncremented > 20) { //Will be rond at numbers over 100, but it's unlikely we'll hit those for this usecase.
				lastDigit = wishCountIncremented % 10;
			}
			switch (lastDigit) {
				case 1:
					countSuffix = "st";
					break;
				case 2:
					countSuffix = "nd";
					break;
				case 3:
					countSuffix = "rd";
					break;
				default:
					countSuffix = "th"
			}
			const message = `🎉 Happy Birthday, <@${user}>! 🎂 This is my ${wishCountIncremented}${countSuffix} time wishing you that!`;
			client.channels.cache.get(birthdayChannelId).send(birthdayMessage);
			
			bTable.update({ usage_count: wishCountIncremented }, { where: {username: user } });
		})
	} catch (error) {
		console.error(`Error Processing Birthdays: ${error}`);
	}
};