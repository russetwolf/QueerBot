const Sequelize = require('sequelize');
	
module.exports = {
	name: "souvenirs",
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
		guildId: {
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
		last_modified_by_username: {
			type: Sequelize.STRING,
			defaultValue: "creator",
			allowNull: false,
		},
		active: {
			type: Sequelize.BOOLEAN,
			defaultValue: true,
			allowNull:false,
		},
		isBirthday: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			allowNull:false,
		}
	}
};