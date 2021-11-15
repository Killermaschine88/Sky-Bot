const Discord = require('discord.js');

module.exports = {
	name: 'Serverinfo',
	description: 'Shows some Stats about the current Server.',
	usage: 'serverinfo',
	perms: 'None',
	folder: 'QOL',
	aliases: ['si'],
	execute: (client, message, args) => {
		message.channel.send({
			embeds: [
				new Discord.MessageEmbed()
					.setTitle('Server Stats')
					.setColor('00ff00')
					.addFields(
						{
							name: 'Server Owner',
							value: `${message.guild.owner}`,
							inline: true,
						},
						{
							name: 'Server Name',
							value: `${message.guild.name}`,
							inline: true,
						},
						{
							name: 'Member Count',
							value: `${message.guild.memberCount}`,
							inline: true,
						},
						{
							name: 'Server Verification Level',
							value: `${message.guild.verificationLevel}`,
							inline: true,
						},
						{
							name: 'Server Created On',
							value: `${message.guild.createdAt}`,
							inline: true,
						}
					),
			],
		});
	},
};
