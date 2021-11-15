const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');

module.exports = {
	name: 'sbsettings',
	description: 'Settings for SkyblockSim',
	usage: 'sbsettings (Setting Name)',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['sbse'],
	cooldown: 10,
	async execute(interaction, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: interaction.user.id });

		if (player === null) {
			const noprofile = new Discord.MessageEmbed()
				.setFooter(getFooter(player))
				.setColor('RED')
				.setTitle('No Profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			interaction.editReply({ embeds: [noprofile] });
			return;
		}

		let choosen = interaction.options.getString('choice');
		let state = interaction.options.getString('state');
		let show = '';
		if (state == 'true') {
			state = true;
			show = 'enabled';
		} else {
			state = false;
			show = 'disabled';
		}

		if (choosen === 'imgshown') {
			await collection.updateOne(
				{ _id: interaction.user.id },
				{ $set: { 'data.settings.imgshown': state } },
				{ upsert: true }
			);

			let embed = new Discord.MessageEmbed()
				.setFooter(getFooter(player))
				.setTitle('Setting changed')
				.setColor('GREEN')
				.setDescription(`Images shown is now ${show}.`);
			interaction.editReply({ embeds: [embed] });
			return;
		} else if (choosen === 'confirmation') {
			await collection.updateOne(
				{ _id: interaction.user.id },
				{ $set: { 'data.settings.confirmation': state } },
				{ upsert: true }
			);

			let embed = new Discord.MessageEmbed()
				.setFooter(getFooter(player))
				.setTitle('Setting changed')
				.setColor('GREEN')
				.setDescription(`Confirmation messages are now ${show}.`);
			interaction.editReply({ embeds: [embed] });
			return;
		}
	},
};
