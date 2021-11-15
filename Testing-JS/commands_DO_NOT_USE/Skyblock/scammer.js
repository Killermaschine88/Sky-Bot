const Discord = require('discord.js');
const axios = require('axios');
const sbz = require('../../constants/Skyblock/sbz.json');
const urii = process.env['uri'];

module.exports = {
	name: 'Scammer',
	description: 'Checks the SBZ and Sky Bot Database for Scammers',
	usage: 'scammer (IGN)',
	perms: 'None',
	folder: 'Skyblock',
	aliases: ['sc'],
	async execute(client, message, args, mclient) {
		const ign = args[0];

		if (ign === undefined) {
			message.channel.send('Please enter a Username to check.');
			return;
		}

		const waitembed = new Discord.MessageEmbed()
			.setDescription('Checking for Player Data . . .')
			.setFooter(
				"If i don't respond within 10 Seconds then theres an Error at the Database\nTry again later pls."
			)
			.setColor('ORANGE');

		const waitingembed = await message.channel.send({
			embeds: [waitembed],
		});

		axios.get(`https://api.mojang.com/users/profiles/minecraft/${ign}`).then(async (res) => {
			const uuid = res.data.id;

			if (uuid === undefined) {
				const invalidign = new Discord.MessageEmbed()
					.setDescription(`Invalid Username can\'t find **${ign}** in the Mojang Database.`)
					.setColor('ORANGE');
				waitingembed.edit({ embeds: [invalidign] });
				return;
			}

			if (res.status != 200) {
				const apierror = new Discord.MessageEmbed()
					.setDescription(
						`An Error has occured this is usually due to the API being overloaded or something going wrong pls try again in a minute.`
					)
					.setColor('ORANGE');
				waitingembed.edit({ embeds: [apierror] });
				return;
			}

			const ign = args[0];
			const collection = mclient.db('Sky-Bot').collection('Scammers');
			let found = await collection.findOne({ _id: uuid });

			if (found) {
				const sbembed = new Discord.MessageEmbed()
					.setAuthor(
						ign,
						`https://cravatar.eu/helmavatar/${ign}/600.png`,
						`https://de.namemc.com/profile/${ign}`
					)
					.setTitle('⚠️USER IS A SCAMMER⚠️')
					.setDescription(
						`**DON\'T TRADE WITH THAT USER**\n\n**IGN:** ${ign}\n**Reason:** ${found.scamREASON}\n**UUID:** ${uuid}`
					)
					.setColor('RED')
					.setFooter('Powered by the Sky Bot Scammer Database');
				waitingembed.edit({ embeds: [sbembed] });
				return;
			} else if (sbz[uuid]) {
				const sbzembed = new Discord.MessageEmbed()
					.setAuthor(
						ign,
						`https://cravatar.eu/helmavatar/${ign}/600.png`,
						`https://de.namemc.com/profile/${ign}`
					)
					.setTitle('⚠️USER IS A SCAMMER⚠️')
					.setDescription(
						`**DON\'T TRADE WITH THAT USER**\n\n**IGN:** ${ign}\n**Reason:** ${sbz[uuid]['reason']}\n**UUID:** ${uuid}`
					)
					.setColor('RED')
					.setFooter('Powered by the SkyblockZ Scammer Database');
				waitingembed.edit({ embeds: [sbzembed] });
				return;
			} else {
				const innocent = new Discord.MessageEmbed()
					.setAuthor(
						ign,
						`https://cravatar.eu/helmavatar/${ign}/600.png`,
						`https://de.namemc.com/profile/${ign}`
					)
					.setTitle('<a:yes:847468695772987423> USER IS INNOCENT')
					.setDescription(`Still be careful when trading with anyone!`)
					.setColor('GREEN');
				waitingembed.edit({ embeds: [innocent] });
			}
		});
	},
};
