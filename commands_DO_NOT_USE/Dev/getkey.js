const Discord = require('discord.js');
const fs = require('fs');
const old = require('../../constants/Bot/config.json');
const over = require('../../launcher_accounts.json');
const mineflayer = require('mineflayer');
const email = process.env['email'];
const pass = process.env['pass'];

module.exports = {
	name: 'Getkey',
	description: 'Gets a new apikey',
	usage: 'getkey',
	perms: 'Be the Dev lmao',
	folder: 'Dev',
	aliases: [],
	async execute(client, message, args) {
		if (message.author.id != old.ownerID) return message.channel.send("Can't use this.");

		const bot = mineflayer.createBot({
			host: 'hypixel.net',
			username: email,
			password: pass,
		});

		bot.on('login', () => {
			console.log('Logged in to Hypixel');
		});

		bot.on('spawn', () => {
			bot.chat('/api new');
		});

		bot.on('message', async (message) => {
			if (message.text === 'Your new API key is ') {
				old.apikey = message.extra[0].text;
				fs.writeFileSync('/home/runner/Testing-JS/constants/Bot/config.json', JSON.stringify(old));

				over.mojangClientToken = 'reset';
				fs.writeFileSync('/home/runner/Testing-JS/launcher_accounts.json', JSON.stringify(over));

				bot.end();
				console.log('Logged out of Hypixel');
			}
		});
		message.channel.send('Hypixel API-Key reset.');
	},
};
