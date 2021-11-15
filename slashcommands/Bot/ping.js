const Discord = require('discord.js');
const pms = require('pretty-ms');

module.exports = {
	name: 'ping',
	description: 'Shows the bots ping',
	usage: 'ping',
	perms: 'None',
	folder: 'Bot',
	aliases: [],
	async execute(interaction) {
		const embed = new Discord.MessageEmbed().setDescription('Pinging . . .');
		await interaction.editReply({ embeds: [embed] });

		interaction.fetchReply().then((m) => {
			//Deciding Ping Emoji Shown
			let ping = '';
			if (m.createdTimestamp - interaction.createdTimestamp < 150) {
				ping = '<:ping:847473419011620955>';
			} else if (m.createdTimestamp - interaction.createdTimestamp < 300) {
				ping = '<:ping2:859717516548636672>';
			} else {
				ping = '<:ping3:859717516284002314>';
			}

			let ping1 = '';
			if (interaction.client.ws.ping < 150) {
				ping1 = '<:ping:847473419011620955>';
			} else if (interaction.client.ws.ping < 300) {
				ping1 = '<:ping2:859717516548636672>';
			} else {
				ping1 = '<:ping3:859717516284002314>';
			}

			interaction.editReply({
				embeds: [
					new Discord.MessageEmbed()
						.setTitle('Current Bot Ping')
						.setColor('GREEN')
						.addFields(
							{
								name: `${ping} Bot Latency`,
								value: `${m.createdTimestamp - interaction.createdTimestamp} ms.`,
								inline: false,
							},
							{
								name: `${ping1} API Latency`,
								value: `${Math.round(interaction.client.ws.ping)} ms.`,
								inline: false,
							}
						),
				],
			});
		});
	},
};
