const Discord = require('discord.js');

module.exports = {
	name: 'suggest',
	description: 'Sends the bots invite link',
	usage: 'invite',
	perms: 'None',
	folder: 'Bot',
	aliases: [],
	cooldown: 60,
	execute: (interaction) => {
		let input = interaction.options.getString('suggestion');

		let suggested = new Discord.MessageEmbed()
			.setTitle('Suggestion sent')
			.setColor('GREEN')
			.setDescription(
				'To see your suggestion, join my [support server](https://discord.gg/Ca6XpTRQaR) and check the suggestions channel.'
			);

		interaction.editReply({ embeds: [suggested] });

		let suggestembed = new Discord.MessageEmbed()
			.setTitle(`New suggestion from ${interaction.user.tag}`)
			.setDescription(`${input}`)
			.setFooter(`${interaction.user.id}`);

		interaction.client.channels
			.fetch('909871468136001606')
			.then((channel) =>
				channel.send({ embeds: [suggestembed] }).then(
					(msg) =>
						msg.react('👍') &&
						msg.react('👎') &&
						msg.startThread({
							name: `Suggestion from ${interaction.user.username}`,
							// autoArchiveDuration: 60,
							//reason: 'Needed a separate thread f',
						})
				)
			)
			.catch(console.error);
	},
};
