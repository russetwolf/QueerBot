const { Events } = require('discord.js');
const {CronJob } = require('cron');

module.exports = async (client, reminderId, job) => {
	console.log(`Running reminder with id ${reminderId}`);

	const table = client.tables.get("souvenirs");

	try {
		const reminders = await table.findAll({ where: { id: reminderId, active: true } });
		console.log(`Found ${reminders.length} reminder.`)
		if (reminders.length == 0) {
			job.stop();
		}

		reminders.forEach(async row => {
			const message = row.get('message');
			const channelId = row.get('channelId');
			const once = row.get('once');
			const everyother = row.get('everyother');

			if (once) {
				const affectedRows = await table.update({ active: false }, { where: { id: reminderId } });
			}
			else if (everyother) {
				const shouldSend = row.get('everyother_send_next_time');
				try {
					//invert the bool for next time
					table.update({ everyother_send_next_time: !shouldSend }, { where: { id: reminderId  } });
				} catch (error) {
					console.error(`Error processing everyother reminder: ${error}`);
				}
				if (!shouldSend) { 
					//don't send this time
					console.log("Not reminding this time on every-other.");
					return;
				}
			}

			//send the reminder
			client.channels.cache.get(channelId).send(`${message} [reminder id: ${row.id} by ${row.creator_username}]`);
		})
	} catch (error) {
		console.error(`Error getting reminders: ${error}`);
	}
	
};