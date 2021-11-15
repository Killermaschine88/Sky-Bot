const config = require('../../constants/Bot/config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'commanduses',
	description: 'Show Command Uses',
	usage: 'cu',
	perms: 'Dev',
	folder: 'Dev',
	aliases: ['cmd', 'cu'],
	async execute(client, message, args, mclient) {
		if (message.author.id !== config.ownerID) return message.channel.send("Can't use this!");

		const collection = mclient.db('Sky-Bot').collection('commanduses');
		let cmduse = await collection.find({}).sort({ uses: -1 }).toArray();

		let i = 0;

		const embed = new Discord.MessageEmbed().setTitle('Most used Commands').setDescription('').setColor('90EE90');

		while (i < cmduse.length && i < 20) {
			embed.description += `${cmduse[i]._id}: ${cmduse[i].uses}\n`;
			i += 1;
		}

		message.channel.send({ embeds: [embed] });
	},
};
