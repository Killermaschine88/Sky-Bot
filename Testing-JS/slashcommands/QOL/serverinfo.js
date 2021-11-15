const Discord = require('discord.js');

module.exports = {
	name: 'Serverinfo',
	description: 'Shows stats about the current server.',
	usage: 'serverinfo',
	perms: 'None',
	folder: 'QOL',
	aliases: ['si'],
	execute: (interaction) => {
		interaction.editReply({
			embeds: [
				new Discord.MessageEmbed()
					.setTitle('Server Stats')
					.setColor('00ff00')
					.addFields(
						{
							name: 'Name',
							value: `${interaction.guild.name}`,
							inline: true,
						},
						{
							name: 'Member Count',
							value: `${interaction.guild.memberCount}`,
							inline: true,
						},
						{
							name: 'Verification Level',
							value: `${interaction.guild.verificationLevel}`,
							inline: true,
						},
						{
							name: 'Created',
							value: `<t:${Math.ceil(interaction.guild.createdTimestamp / 100)}:R>`,
							inline: true,
						}
					),
			],
		});
	},
};
