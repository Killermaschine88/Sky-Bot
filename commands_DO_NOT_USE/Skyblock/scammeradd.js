const urii = process.env['uri'];
const Discord = require('discord.js');
const config = require('../../constants/Bot/config.json');
const axios = require('axios');

module.exports = {
	name: 'scammeradd',
	description: 'Adds a Scammer to the Database (Dev Only)',
	usage: 'scammeradd (Scammer IGN) (Scammer Reason)',
	perms: 'Scam Managers Only',
	folder: 'Skyblock',
	aliases: ['sa'],
	execute: (client, message, args, mcleint) => {
		if (!config.scammanagers.includes(message.author.id)) {
			const noperms = new Discord.MessageEmbed()
				.setDescription(
					'You tried using a Scam Manager Only Command.\nIf you want to report a Scammer join https://discord.gg/Ca6XpTRQaR and report them there.'
				)
				.setColor('ORANGE');
			message.channel.send({ embeds: [noperms] });
			return;
		}

		const scammerIGN = args[0];
		const scamPROOF = args[1];
		const scamREASON = args.slice(2).join(' ');

		if (args[0] === undefined || args[1] === undefined) {
			message.channel.send('scammeradd (Scammer IGN) (Scam Proof[IMGUR Link]) (Scam Reason)');
			return;
		}

		// get uuid from mentioned ign here
		axios.get(`https://some-random-api.ml/mc?username=${scammerIGN}`).then(async (res) => {
			const uuid = res.data.uuid;

			const collection = mclient.db('Sky-Bot').collection('Scammers');

			await collection.updateOne(
				{ _id: uuid },
				{
					$set: {
						scammerIGN: scammerIGN,
						scamPROOF: scamPROOF,
						scamREASON: scamREASON,
					},
				},
				{ upsert: true }
			);

			const sucEmbed = new Discord.MessageEmbed()
				.setTitle('Scammer Added')
				.setColor('GREEN')
				.setDescription(`Successfully added **${scammerIGN}** to the Scammer list for: **${scamREASON}**`)
				.setFooter(`Added by ${message.author.tag}`);

			await message.channel.send({ embeds: [sucEmbed] });
			await client.channels
				.fetch(config.scamlog)
				.then((channel) => channel.send({ embeds: sucEmbed }))
				.catch(console.error);
		});
	},
};
