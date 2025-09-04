const Sequelize = require('sequelize');
	
module.exports = {
	name: "birthdays",
	definition: {
		username: {
			type: Sequelize.STRING,
			unique: true,
		},
		month: Sequelize.INTEGER,
		day: Sequelize.INTEGER,
		usage_count: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}
};