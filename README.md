# QueerBot

This is a [DiscordJS](https://discordjs.guide/) bot built via the tutorial initially and then built out to support requested functionality in a local server. No warranties are made, use at your own risk.

# Setup

Follow instructions in the DiscordJS guide.
Notably, create a `prod.env` file (it is `gitignore`'d) with the following:

```
TOKEN="your-token-goes-here"
CLIENT_ID="your-application-id-goes-here"
BIRTHDAY_CHANNEL_ID="channel-that-you-want-birthday-notifications-in"
```

For ease of development/testing if you're doing any, you'll also need to create a second application and create a `test.env` file that has it's specific details:

```
TOKEN="your-TESTING-token-goes-here"
CLIENT_ID="your-TESTING-application-id-goes-here"
GUILD_ID="your-private-testing-server-id-goes-here"
BIRTHDAY_CHANNEL_ID="channel-that-you-want-birthday-notifications-in-your-TESTING-server"
```

# Dependencies

## discordjs-reaction-role
This project leverages [discordjs-reaction-role](https://github.com/makigas/discordjs-reaction-role) for the role-react functionality commonly seen in Discord Bots.
**Be sure to set your bot role to the top of the hierarchy so it can manage roles for all members.**
For now the reaction role JSON is stored in the `config.json` file like so:
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

Log into GCP with your Google account, create a new project, and create a new Cloud Engine VM instance.

SSH into the machine from the GCP Console and `git pull` this repo.

```apt install node npm```

```npm install discord.js sequelize sqlite3 cron prettycron```

Then you can follow below instructions for first deploy.

## Deploy

Once you `git push` your changes, SSH into the VM from GCP Console, and `git pull` the new code.

Get your `prod.env` file on the server too, however you want. I leave this as an exercise to the reader.

Use `screen` to start a session that will run after your SSH session quits. Key commands:

`sudo screen -list` will list all the detatched sessions, with id numbers.

`sudo screen -S [id number] -p 0 -X quit` will kill a given session.

`sudo screen -S QueerBot` to launch a new session, where you can cd into the Queerbot directory.

Run `node --env-file=prod.env prod-deploy-commands.js` to deploy new slash commands to Discord.

Run `node --env-file=prod.env index.js` to start the server.

`Ctrl+A` and `Ctrl-D` in quick succession to detetch from the session so you can quit your SSH session.

# Development and local testing

Run `node --env-file=test.env test-deploy-commands.js` to deploy new slash commands to Discord.

Run `node --env-file=test.env index.js` to start the test bot that only runs in your private server.

# Design Challenges

Sometimes this thing goes offline because I accidentally left the test instance running instead, or the session ended because I exited the SSH session and didn't think about it killing the node instance, etc. This makes me want to have a "catch-up" check on startup to go back and do any reminders or birthdays it missed.

I see two main approaches:

1. A "heartbeat" where it checks the last heartbeat and acts on anything that should have triggered betweent the last heartbeat and startup time
2. Recording last execution time in the database for each reminder and birthday. Checking if any rows should have executed since their last execution. For "once" instances this can be hacked together by checking against "created date", but leaves gaps for repeating instances. 

Either way we need a way to translate a crontab string and a datetime in the past and determine "should this have run in between?"

This is also making me want to refactor the birthdays into a specialized type of reminder instead of a whole separate thing.

# To Do
 1. 
     a. DONE: Modularlize Souvenir functionality to accomodate Birthdays as a special case

     b. DONE: Convert Birthday functionality to Souvenirs.

 2. Add above "catch-up" function
 2. Add "snooze" function to reminders
 3. Look into sub-commands to better group commands
 3. Add Birthday wish randomization
 4. Add some automated testing to this repo
 5. Move role assignemnt stuff into DB instead of `config.json` and maybe add ability ot have the bot create the message and store the config for it
 6. Set up GitHub actions to deploy to GCP when merging to main (and main branch protections)
