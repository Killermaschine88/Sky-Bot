const Discord = require('discord.js');
const config = require('../../constants/Bot/config.json');

module.exports = {
	name: 'servers',
	description: 'Show Command Uses',
	usage: 'cu',
	perms: 'Dev',
	folder: 'Dev',
	aliases: ['se'],
	async execute(client, message, args, mclient) {
		if (message.author.id !== config.ownerID) return message.channel.send("Can't use this!");

    let guilds = client.guilds.cache.map(g => ({ name: g.name, count: g.memberCount, id: g.id }))
      guilds = guilds.sort((a, b) => b.count - a.count)

    let str = ''
    let i = 0

    for(const g of guilds) {
      str += `${i+1}. ${g.name} - ${g.count}\n`
      if(i >= 20) break;
      i++
    }

    const embed = new Discord.MessageEmbed()
    .setTitle('20 Biggest Servers')
    .setColor('GREEN')
    .setDescription(`${str}`)

    message.channel.send({embeds: [embed]})
  }
}