const Sequelize = require('sequelize');
	
module.exports = {
	name: "birthdays",
	definition: {
		username: {
			type: Sequelize.STRING,
			unique: true,
		},
		month: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		day: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		usage_count: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}
};