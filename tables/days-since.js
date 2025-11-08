const Sequelize = require('sequelize');
	
module.exports = {
	name: "days-since",
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
		tracker_name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		date_last_occurred: {
			type: Sequelize.DATEONLY,
			defaultValue: Sequelize.NOW,
			allowNull: false,
		},
		record: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}
};