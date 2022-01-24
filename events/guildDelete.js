const Discord = require('discord.js');

module.exports = {
	name: 'guildDelete',
	execute(guild, mclient, client) {
    if(!guild.name) return
		discordLog(
			client,
			new Discord.MessageEmbed()
				.setDescription(`Left a Guild: \`${guild.name}\``)
				.setColor('RED')
				.setTimestamp()
				.addFields(
					{
						name: 'Total Server Count Now',
						value: `${client.guilds.cache.size}`,
					},
					{
						name: 'Total User Count Now',
						value: `${client.users.cache.size}`,
					}
				)
		);
	},
};

function discordLog(client, embed) {
	delete require.cache[require.resolve('../constants/Bot/config.json')];
	const config = require('../constants/Bot/config.json');

	client.channels
		.fetch(config.leavelog)
		.then((channel) => channel.send({ embeds: [embed] }))
		.catch(console.error);
}
