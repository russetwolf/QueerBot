# QueerBot

This is a [DiscordJS](https://discordjs.guide/) bot built via the tutorial initially and then built out to support requested functionality in a local server. No warranties are made, use at your own risk.

The script to deploy commands to your test server prepends the commands with 't-' to indicate which set of commands it is (so you don't see duplcate commands in the test server). The main code handles all commands with 't-' at the start as not having that, so don't write commands starting with 't-' without modifying this system.

# Setup

Follow instructions in the DiscordJS guide.
Notably, create a `config.json` file with the following (it is `gitignore`'d):

```
{
	"token": "your-token-goes-here",
	"clientId": "your-application-id-goes-here",
	"guildId": "your-private-testing-server-id-goes-here"
	"birthdayChannelId": "channel-that-you-want-birthday-notifications-in",
	"reactionRoleConfig": [
		...
	]
}
```

# Dependencies

## discordjs-rection-role
This project leverages [discordjs-reaction-role](https://github.com/makigas/discordjs-reaction-role) for the role-react functionality commonly seen in Discord Bots.
**Be sure to set your bot role to the top of the hierarchy so it can manage roles for all members.**
For now the reaction role JSON is also stored in the `config.json`:
```
"reactionRoleConfig": [
		{
			"messageId": "123456789",
			"reaction": "🔔",
			"roleId": "098765432"
		}
	]
```

## Sequelize

This bot uses a database to store reminder information. Initial implementation uses the suggestion in the DiscordJS guide.

```npm install discord.js sequelize sqlite3```

## Cron

This bot uses the cron library as a task scheduler for birthdays and other reminders. Also prettycron to make it human-readable.

```npm install cron prettycron```

## Credit where credit is due

I took a lot of guidance from https://github.com/willy-r/bd-buddy-bot for how to implement the birthdaty scheduling.

# Deployment

I chose to deploy on GCP free tier. Here are some notes on how I deploy and run QueerBot, for posterity.

## Setup

Log into GCP with your Google account, create a new project, and create a new Clour Engine VM instance.

SSH into the machine from the GCP Console and `git pull` this repo.

```apt install node npm```

```npm install discord.js sequelize sqlite3 cron```

Then you can follow below instructions for first deploy.

## Deploy

Once you `git push` your changes, SSH into the VM from GCP Console, and `git pull` the new code.

Use `screen` to start a session that will run after your SSH session quits. Key commands:

`sudo screen -list` will list all the detatched sessions, with id numbers.

`sudo screen -S [id number] -p 0 -X quit` will kill a given session.

`sudo screen -S QueerBot` to launch a new session, where you can cd into the Queerbot directory and run `node index.js` to start the server.

`Ctrl+A` `Ctrl-D` in quick succession to detetch from the session so you can quit your SSH session.
