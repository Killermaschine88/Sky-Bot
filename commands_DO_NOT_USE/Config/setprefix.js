const Discord = require('discord.js');
const config = require('../../constants/Bot/config.json');
const prefix = require('@replit/database');
const prefixx = new prefix();

module.exports = {
	name: 'Setprefix',
	description: 'Set the Server Prefix',
	usage: 'setprefix (New Prefix)',
	perms: 'Admin',
	folder: 'Config',
	aliases: ['sp'],
	async execute(client, message, args) {
		if (!message.member.permissions.has('ADMINISTRATOR'))
			return message.channel.send('You are missing the Permission `ADMINISTRATOR`.');

		const id = message.guild.id;
		let gprefix = await prefixx.get(id);
		if (gprefix === null) {
			gprefix = ',';
		}
		if (args[0] === 'getpp') {
			if (message.author.id != '570267487393021969') return;
			const pp = await prefixx.getAll();
			message.channel.send(`${Object.entries(pp)}`);
			return;
		}

		if (args[0] === undefined) {
			message.channel.send(
				`This Servers Prefix is \`${gprefix}\`\nUse \`!setprefix (Prefix)\` to set a new one.`
			);
			return;
		}

		if (args[0].length > 3) {
			message.channel.send(`Please choose a Prefix Below \`3 Characters\`.\nYou entered: \`${args[0]}\``);
			return;
		} else {
			await prefixx.set(id, args[0]);
		}

		message.channel.send(`Prefix has been set to \`${args[0]}\``);
	},
};
