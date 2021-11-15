const Discord = require('discord.js');
const config = require('../../constants/Bot/config.json');

module.exports = {
	name: 'Getinvite',
	description: 'Gets an Invite to said Guild (Dev Only)',
	usage: 'getinvite (Guild ID)',
	perms: 'Dev',
	folder: 'Dev',
	aliases: ['gi'],
	execute: (client, message, args) => {
		if (message.author.id !== config.ownerID) return message.channel.send("Can't use this!");
		const arg = args[0];
		let targetguild = client.guilds.cache.get(arg);
		if (!targetguild) {
			return message.channel.send(`Enter a valid guild ID`);
		} else {
			targetguild.channels.cache
				.random()
				.createInvite({ maxAge: 0, maxUses: 1 })
				.then((inv) => message.channel.send(`${targetguild.name}\n${inv.url}`));
		}
	},
};
