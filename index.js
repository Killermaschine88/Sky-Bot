const Discord = require('discord.js');
const Stats = require('discord-live-stats')
const client = new Discord.Client({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'], shardCount: 2
});
client.options.http.api = 'https://discordapp.com/api'
const config = require('./constants/Bot/config.json');
const keepAlive = require('./constants/Bot/keepAlive.js');
const fs = require('fs');
const token = process.env['token'];
global.c = 0;
let e = 0;
global.sc = 0;
const urii = process.env['uri'];
const { AutoPoster } = require('topgg-autoposter');
const toptoken = process.env['toptoken'];

const MongoClient = require('mongodb').MongoClient;
const mclient = new MongoClient(urii, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
mclient.connect();
global.mmclient = mclient;

//Stats https://test.baltrazz.repl.co
try {
const Poster = new Stats.Client(client, {
  stats_uri: 'https://test.baltrazz.repl.co/',
  authorizationkey: process.env['stats_auth'],
  postinterval: 20000
})
} catch (e) {}


//Debugging
/*client
    .on("debug", console.log)
    .on("warn", console.log)*/
    

//Topgg votes detectionsa
const Topgg = require("@top-gg/sdk")
const express = require("express")

const app = express();

const webhook = new Topgg.Webhook("69420")

app.post("/dblwebhook", webhook.listener(async vote => {

  const collection = mclient.db('SkyblockSim').collection('Players');
  let found = await collection.findOne({ _id: vote.user })

if(found != null) {

  await collection.updateOne(
    { _id: vote.user },
    { $inc: { "data.profile.gems": 2 } },
    { upsert: true })
  //Sending voted message

  const tyembed = new Discord.MessageEmbed()
    .setTitle('🥰 Thanks for Voting 🥰')
    .setDescription(`As a reward i added you 2 Gems <:gems:879264850348486696> to your Profile, those can be used to buy special Items 😉\n\nThis really supports my Developer and helps me grow in popularity.`)


    client.users.fetch(vote.user).then(async user => {
      user.send({ embeds: [tyembed] }).catch(() => console.log('Not dmed'))
    }).catch(console.error)
} else {
const tyembed = new Discord.MessageEmbed()
    .setTitle('🥰 Thanks for Voting 🥰')
    .setDescription(`This really supports my Developer and helps me grow in popularity.`)


    client.users.fetch(vote.user).then(async user => {
      user.send({ embeds: [tyembed] }).catch(() => console.log('Not dmed'))
    }).catch(console.error)
}


  client.channels.fetch('850847486826643516')
    .then(channel => channel.send(`<@${vote.user}> has voted for me.\nID: ${vote.user}`))
    .catch(console.error)
}))

app.listen(3000) //if it doesnt work take port 80

//Topgg stats posting
const poster = AutoPoster(toptoken, client)

poster.on('posted', (stats) => { // ran when succesfully posted
  console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
})


// Bot token login
client.login(token);

//Collections needed
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.slashcommands = new Discord.Collection();

//Slash Command Loader
const slashcommandFolders = fs.readdirSync('./slashcommands');

for (const folder of slashcommandFolders) {
	const commandFiles = fs.readdirSync(`./slashcommands/${folder}`).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./slashcommands/${folder}/${file}`);
		sc += 1;
		client.slashcommands.set(command.name.toLowerCase(), command);
	}
}

const commandFolders = fs.readdirSync('./commands_DO_NOT_USE');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands_DO_NOT_USE/${folder}`).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands_DO_NOT_USE/${folder}/${file}`);
		c += 1;
		client.commands.set(command.name.toLowerCase(), command);
	}
}

//Command Handler
client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	if (message.channel.type === 'DM') return message.channel.send('I dont work in DMs.');

	const gprefix = '!';

	if (!message.content.startsWith(gprefix) || message.author.bot) return;

	const args = message.content.slice(gprefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command =
		client.commands.get(commandName) ||
		client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (config.blacklistedusers.includes(message.author.id))
		return message.channel.send(
			'You are blacklisted from using this Bot. If you believe this is false. Then message **Baltraz#4874**'
		);

	/*const { cooldowns } = client;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	let cooldownAmount = (command.cooldown || 3) * 1000;

	//Owner Cooldown Bypass
	if (message.author.id === '570267487393021969') {
		cooldownAmount = 0;
	}

	if (timestamps.has(message.author.id)) {
		let expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(
				`You need to wait **${timeLeft.toFixed(1)}s** before using \`${command.name}\` again.`
			);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);*/

	//Once i add to main bot
	const servercoll = mclient.db('Sky-Bot').collection('Servers');
	let found = await servercoll.findOne({ _id: message.guild.id });

	if (message.author.id != '570267487393021969') {
		if (found == null || found.scopeadded == false) {
      console.log('server coll error')
			try {
				await client.guilds.cache.get(message.guild.id)?.commands.fetch([]);
				await servercoll.updateOne({ _id: message.guild.id }, { $set: { scopeadded: true } }, { upsert: true });
			} catch (error) {
				const noscope = new Discord.MessageEmbed()
					.setTitle('Slash Command Changes')
					.setColor('RED')
					.setFooter('Greetings Sky Bot Dev')
					.setDescription(
						'Please notify the Server owner or an Admin to re-authorize the Bot using the attached Button there is **NO NEED TO KICK THE BOT** you can just re-authorize it and it will work using SlashCommands.\n\nThis is to ensure you will be able to use all the Slash Commands as the Devs are required to make Slash Commands by Discord.\n\nOnce the Bot is reauthorized your all set and this Message also wont appear again.'
					);
				const row = new Discord.MessageActionRow().addComponents(
					new Discord.MessageButton()
						.setLabel('Bot Invite')
						.setURL(
							'https://discord.com/api/oauth2/authorize?client_id=839835292785704980&permissions=139653925953&scope=applications.commands%20bot'
						)
						.setStyle('LINK')
				);
				message.channel.send({ embeds: [noscope], components: [row] });
				await servercoll.updateOne(
					{ _id: message.guild.id },
					{ $set: { scopeadded: false } },
					{ upsert: true }
				);
			}
		} else {
			const addedscope = new Discord.MessageEmbed()
				.setTitle('Unsupported Message Commands')
				.setColor('ORANGE')
				.setFooter('Greetings Sky Bot Dev')
				.setDescription(
					'Message Commands have been remove from Sky Bot due to a change in Discords System which means, Bot Developers are required to use Slash Commands.\nThis server can use Slash Commands so please use them.\n\nClick the attached Button for an Article explaining those changes.'
				);
			const row = new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setLabel('Discord Article')
					.setURL(
						'https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Access-Deprecation-for-Verified-Bots'
					)
					.setStyle('LINK')
			);
			message.channel.send({ embeds: [addedscope], components: [row] });
		}
		return;
	}
	//if (command.folder != 'Dev') return;

	try {
		await command.execute(client, message, args, mclient);
	} catch (error) {
		console.error(error);
		message.reply('There was an Error trying to execute that Command!');
	}
});

//Event Handler
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, mclient, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, mclient, client));
		e += 1;
	}
}

//Loophole to keep the Bot running
//keepAlive();

/* how to export commands 
//add cooldown: 0, to set a specific cooldown else it is 3 seconds
const Discord = require('discord.js');
module.exports = {
  name: "Name",
  description: "Description",
  usage: "Usage",
  perms: "Permissions Needed",
  folder: "folder",
  aliases: [],
    execute: (client, message, args) => {
      //putmycodehere
    }
};
*/

/*
module.exports = {
	name: 'name',
	execute(client) {
    code here
	}
};
*/
