const Sequelize = require('sequelize');
	
module.exports = {
	name: "reminders",
	definition: {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		creator_username: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		crontab: {
			type: Sequelize.STRING,
			defaultValue: "00 12 * * *",
			allowNull: false,
		},
		message: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		channelId: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		once: {
			type: Sequelize.BOOLEAN,
			defaultValue: true,
			allowNull:false,
		},
		everyother: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			allowNull:false,
		},
		everyother_send_next_time: {
			type: Sequelize.BOOLEAN,
			defaultValue: true,
		},
	}
};