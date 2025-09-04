// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token, reactionRoleConfig } = require('./config.json');

//reaction-role lib
const { ReactionRole } = require("discordjs-reaction-role");

// Create a new client instance
const client = new Client({ 
	partials: [Partials.Message, Partials.Reaction],
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions
	], 
});

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

client.cooldowns = new Collection();

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.tables = new Collection();
const tablesPath = path.join(__dirname, 'tables');
const tableFiles = fs.readdirSync(tablesPath).filter(file => file.endsWith('.js'));

for (const file of tableFiles) {
	const filePath = path.join(tablesPath, file);
	const table = require(filePath);
	client.tables.set(table.name, sequelize.define(table.name, table.definition));
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const manager = new ReactionRole(client, reactionRoleConfig);

// Log in to Discord with your client's token
client.login(token);

// Stop the bot when the process is closed (via Ctrl-C).
const destroy = () => {
  manager.teardown();
  client.destroy();
};
process.on("SIGINT", destroy);
process.on("SIGTERM", destroy);