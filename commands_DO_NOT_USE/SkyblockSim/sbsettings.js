const Discord = require('discord.js');
const prefix = require('@replit/database');
const prefixx = new prefix();

module.exports = {
	name: 'Sbsettings',
	description: 'Settings for SkyblockSim',
	usage: 'sbsettings (Setting Name)',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['sbse'],
	cooldown: 10,
	async execute(client, message, args, mclient) {
		//Getting prefix
		var gprefix = await prefixx.get(message.guild.id, { raw: false });
		if (gprefix === null) gprefix = '.';

		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: message.author.id });

		if (player.data.settings === null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No Profile found')
				.setDescription(`Create a Profile using \`${gprefix}sbstart\` or \`${gprefix}sbcreate\``);

			message.channel.send({ embeds: [noprofile] });
			return;
		}

		if (!args[0]) {
			const settings = new Discord.MessageEmbed()
				.setTitle('Skyblock Simulator Settings')
				.setColor('90EE90')
				.setDescription(
					`**Enable / Disable Settings for Skyblock Simulator**\n\nUse \`${gprefix}sbsettings (Settings Name)\` to toggle the Settings ON/OFF\nAvailable Settings:\n\`img\``
				)
				.addField('Image shown at Sbfarm Command', `${player.data.settings.imgshown}`, true);

			message.channel.send({ embeds: [settings] });
			return;
		}

		if (args[0] === 'img' && player.data.settings.imgshown === true) {
			await collection.updateOne(
				{ _id: message.author.id },
				{ $set: { 'data.settings.imgshown': false } },
				{ upsert: true }
			);
			message.channel.send('Disabled Area Image being shown at sbfarm');
			return;
		} else if (args[0] === 'img' && player.data.settings.imgshown === false) {
			await collection.updateOne(
				{ _id: message.author.id },
				{ $set: { 'data.settings.imgshown': true } },
				{ upsert: true }
			);
			message.channel.send('Enabled Area Image being shown at sbfarm');
			return;
		}
	},
};
