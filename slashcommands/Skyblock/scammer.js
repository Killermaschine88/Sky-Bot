const Discord = require('discord.js');
const axios = require('axios');
const sbz = require('../../constants/Skyblock/sbz.json');
const urii = process.env['uri'];

module.exports = {
	name: 'Scammer',
	description: 'Checks the SBZ and Sky Bot database for scammers',
	usage: 'scammer (IGN)',
	perms: 'None',
	folder: 'Skyblock',
	aliases: ['sc'],
	async execute(interaction, mclient) {
		const ign = interaction.options.getString('ign');

		const waitembed = new Discord.MessageEmbed()
			.setDescription('Checking for player data . . .')
			.setFooter('If I take longer than 10s, there was an error. Try again later.')
			.setColor('ORANGE');

		const waitingembed = await interaction.editReply({
			embeds: [waitembed],
		});

		try {
      axios.get(`https://api.mojang.com/users/profiles/minecraft/${ign}`).then(async (res) => {
			const uuid = res.data.id;

			if (uuid === undefined) {
				const invalidign = new Discord.MessageEmbed()
					.setDescription(`Cannot find **${ign}** in the Mojang database.`)
					.setColor('ORANGE');
				interaction.editReply({ embeds: [invalidign] });
				return;
			}

			if (res.status != 200) {
				const apierror = new Discord.MessageEmbed()
					.setDescription(
						`An error has occured. The API might be overloaded, or something went wrong. Try again later.`
					)
					.setColor('ORANGE');
				interaction.editReply({ embeds: [apierror] });
				return;
			}

			const collection = mclient.db('Sky-Bot').collection('Scammers');
			let found = await collection.findOne({ _id: uuid });

			if (found) {
				const sbembed = new Discord.MessageEmbed()
					.setAuthor(
						ign,
						`https://cravatar.eu/helmavatar/${ign}/600.png`,
						`https://de.namemc.com/profile/${ign}`
					)
					.setTitle('⚠️ User is a scammer ⚠️')
					.setDescription(
						`Do **not** trade with that user\n\n**IGN:** ${ign}\n**Reason:** ${found.scamREASON}\n**UUID:** ${uuid}`
					)
					.setColor('RED')
					.setFooter('Powered by the Sky Bot scammer database');
				interaction.editReply({ embeds: [sbembed] });
				return;
			} else if (sbz[uuid]) {
				const sbzembed = new Discord.MessageEmbed()
					.setAuthor(
						ign,
						`https://cravatar.eu/helmavatar/${ign}/600.png`,
						`https://de.namemc.com/profile/${ign}`
					)
					.setTitle('⚠️ User is a scammer ⚠️')
					.setDescription(
						`Do **not** trade with that user\n\n**IGN:** ${ign}\n**Reason:** ${sbz[uuid]['reason']}\n**UUID:** ${uuid}`
					)
					.setColor('RED')
					.setFooter('Powered by the SkyblockZ Scammer Database');
				interaction.editReply({ embeds: [sbzembed] });
				return;
			} else {
				const innocent = new Discord.MessageEmbed()
					.setAuthor(
						ign,
						`https://cravatar.eu/helmavatar/${ign}/600.png`,
						`https://de.namemc.com/profile/${ign}`
					)
					.setTitle('<a:yes:847468695772987423> User is innocent')
					.setDescription('Still be careful when trading with anyone!')
					.setColor('GREEN');
				interaction.editReply({ embeds: [innocent] });
			}
		});
    } catch (e) {}
	},
};
