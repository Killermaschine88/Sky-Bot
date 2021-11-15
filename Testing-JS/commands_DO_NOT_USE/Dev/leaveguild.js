const Discord = require('discord.js');
const config = require('../../constants/Bot/config.json');

module.exports = {
	name: 'Leaveguild',
	description: 'Leaves said Guild (Dev Only)',
	usage: 'guildleave (Guild ID)',
	perms: 'Dev',
	folder: 'Dev',
	aliases: ['lg'],
	execute: (client, message, args) => {
		if (message.author.id !== config.ownerID) return message.channel.send("Can't use this!");

		const arg = args[0];
		let targetguild = client.guilds.cache.get(arg);
		if (!targetguild) {
			return message.channel.send(`Enter a valid guild ID`);
		} else {
			targetguild.leave().then(message.channel.send('Successfully left the Guild.'));
		}
	},
};
