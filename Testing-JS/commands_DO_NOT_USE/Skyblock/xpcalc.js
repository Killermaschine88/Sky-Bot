const Discord = require('discord.js');
module.exports = {
	name: 'XPCalc',
	description: 'Calculates XP needed from lvl x to y',
	usage: 'xpcalc (Start LVL) (End LVL)',
	perms: 'None',
	folder: 'Skyblock',
	aliases: ['xpc'],
	execute: (client, message, args) => {
		message.channel.send('Im being worked on');
	},
};
