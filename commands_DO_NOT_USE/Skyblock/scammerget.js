const Discord = require('discord.js');
const axios = require('axios');
const sbz = require('../../constants/Skyblock/sbz.json');
const urii = process.env['uri'];
const config = require('../../constants/Bot/config.json');

module.exports = {
	name: 'scammerget',
	description: "Gets all data for the IGN from Sky Bot's Database",
	usage: 'scammerget (IGN)',
	perms: 'Scam Managers Only',
	folder: 'Skyblock',
	aliases: ['sg'],
	async execute(client, message, args, mcleint) {
		if (!config.scammanagers.includes(message.author.id)) {
			const noperms = new Discord.MessageEmbed()
				.setDescription(
					'You tried using a Scam Manager Only Command.\nIf you want to report a Scammer join https://discord.gg/Ca6XpTRQaR and report them there.'
				)
				.setColor('ORANGE');
			message.channel.send({ embeds: [noperms] });
			return;
		}

		const ign = args[0];

		if (ign === undefined) {
			message.channel.send('Please enter a Username to check.');
			return;
		}
		axios.get(`https://api.mojang.com/users/profiles/minecraft/${ign}`).then(async (res) => {
			const uuid = res.data.id;

			message.react('<a:wait:847471618272002059>');

			const ign = args[0];
			const collection = mclient.db('Sky-Bot').collection('Scammers');
			let found = await collection.findOne({ _id: uuid });

			if (found === null) {
				const notfound = new Discord.MessageEmbed()
					.setTitle('Nothing Found')
					.setDescription(`No Data found for that User in Skybots Database.}`)
					.setColor('GREY');
				message.channel.send({ embeds: [notfound] });
				return;
			} else {
				const sbembed = new Discord.MessageEmbed()
					.setAuthor(
						ign,
						`https://cravatar.eu/helmavatar/${ign}/600.png`,
						`https://de.namemc.com/profile/${ign}`
					)
					.setTitle('Found Info')
					.setDescription(
						`**IGN:** ${ign}\n**Reason:** ${found.scamREASON}\n**UUID:** ${uuid}\n**Proof:** ${found.scamPROOF}`
					)
					.setColor('BLACK');
				message.channel.send({ embeds: [sbembed] });
				return;
			}
		});
	},
};
