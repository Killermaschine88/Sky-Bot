const Discord = require('discord.js');

module.exports = {
	name: 'vote',
	description: 'Sends the bots invite link',
	usage: 'invite',
	perms: 'None',
	folder: 'Bot',
	aliases: [],
	execute: (interaction) => {
		const embed = new Discord.MessageEmbed()
			.setTitle('Important Bot Links')
			.setColor('fed8b1')
			.addField(
				'<:verifieddev:848830303472189461> Support Server',
				'[Get support and suggest ideas and features](https://discord.gg/Ca6XpTRQaR)',
				true
			)
			.addField(
				'🤖 Bot Invite',
				'[Invite me](https://discord.com/api/oauth2/authorize?client_id=839835292785704980&permissions=139653925953&scope=applications.commands%20bot)',
				true
			)
			.addField('Vote Link', '[Vote for me](https://top.gg/bot/839835292785704980)');

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
				.setStyle('LINK'),
			new Discord.MessageButton()
				.setLabel('Vote')
				.setURL('https://top.gg/bot/839835292785704980')
				.setStyle('LINK')
		);

		interaction.editReply({ embeds: [embed], components: [buttons] });
	},
};
