const Discord = require('discord.js');

module.exports = {
	name: 'Invite',
	description: 'Sends the Bots Invite Link',
	usage: 'invite',
	perms: 'None',
	folder: 'Bot',
	aliases: [],
	execute: (client, message, args) => {
		const embed = new Discord.MessageEmbed().setTitle('Important Bot Links').setColor('fed8b1');
		const buttons = new Discord.MessageActionRow().addComponents(
			new Discord.MessageButton()
				.setLabel('Support Server')
				.setURL('https://discord.gg/Ca6XpTRQaR')
				.setStyle('LINK'),
			new Discord.MessageButton()
				.setLabel('Bot Invite')
				.setURL(
					'https://discord.com/api/oauth2/authorize?client_id=839835292785704980&permissions=139653925953&scope=applications.commands%20bot'
				)
				.setStyle('LINK')
		);
		message.channel.send({ embeds: [embed], components: [buttons] });
	},
};
