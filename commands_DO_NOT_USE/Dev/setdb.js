const config = require('../../constants/Bot/config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'setdb',
	description: 'Set db entry',
	usage: 'dp',
	perms: 'Dev',
	folder: 'Dev',
	aliases: ['db'],
	async execute(client, message, args, mclient) {
		if (message.author.id !== config.ownerID) return message.channel.send("Can't use this!");

		let id = args[0];
		let path = args[1];
		let value = args[2];

    if(!id || !path || !value) {
      return message.channel.send('Missing id path or value.')
    }

		if (id == 0) {
			id = message.author.id;
		}

		if (args[3] != undefined) {
			value = args[2] + ' ' + args[3];
		}

		if (!isNaN(value)) value = Number(value);

		if (value == 'true') value = true;
		else if (value == 'false') value = false;

		const collection = mclient.db('SkyblockSim').collection('Players');

		await collection.updateOne({ _id: id }, { $set: { [path]: value } }, { upsert: true });

		const done = new Discord.MessageEmbed()
			.setDescription(`Document for <@!${id}> updated.\n\nPath: **${path}**\nNew Value: **${value}**`)
			.setColor('GREEN');

		message.channel.send({ embeds: [done] });
	},
};
