const Discord = require('discord.js');
const pms = require('pretty-ms');

module.exports = {
	name: 'ping',
	description: 'Shows the Bots Ping',
	usage: 'ping',
	perms: 'None',
	folder: 'Bot',
	aliases: [],
	async execute(client, message, args) {
		const embed = new Discord.MessageEmbed().setDescription('Pinging . . .');
		await message.channel.send({ embeds: [embed] }).then((m) => {
			//Deciding Ping Emoji Shown
			let ping = '';
			if (m.createdTimestamp - message.createdTimestamp < 150) {
				ping = '<:ping:847473419011620955>';
			} else if (m.createdTimestamp - message.createdTimestamp < 300) {
				ping = '<:ping2:859717516548636672>';
			} else {
				ping = '<:ping3:859717516284002314>';
			}

			let ping1 = '';
			if (client.ws.ping < 150) {
				ping1 = '<:ping:847473419011620955>';
			} else if (client.ws.ping < 300) {
				ping1 = '<:ping2:859717516548636672>';
			} else {
				ping1 = '<:ping3:859717516284002314>';
			}

			m.edit({
				embeds: [
					new Discord.MessageEmbed()
						.setTitle('Current Bot Info')
						.setColor('GREEN')
						.addFields(
							{
								name: `${ping} BOT Latency`,
								value: `${m.createdTimestamp - message.createdTimestamp}ms.`,
								inline: false,
							},
							{
								name: `${ping1} API Latency`,
								value: `${Math.round(client.ws.ping)}ms.`,
								inline: false,
							}
						),
				],
			});
		});
	},
};
