const Discord = require('discord.js');
const config = require('../constants/Bot/config.json');

module.exports = {
	name: 'guildCreate',
	execute(guild, mclient, client) {
		let targetguild = client.guilds.cache.get(guild.id);
		let owner = guild
			.fetchOwner()
			.then((owner) => {
				if (config.blacklistedservers.includes(guild.id)) {
					targetguild.leave();
					client.channels
						.fetch(config.blacklistlog)
						.then((channel) =>
							channel.send(
								`The Blacklisted Guild **${guild.name}** with the ID **${guild.id}** tried to add me, so i automatically left their Server.`
							)
						);

					return;
				}
				discordLog(
					client,
					new Discord.MessageEmbed()
						.setAuthor(client.user.username, client.user.avatarURL())
						.setDescription(`Joined a Guild: \`${guild.name}\`\n${guild.id}`)
						.setColor('7CFC00')
						.setTimestamp()
						.addFields(
							{
								name: 'Guild Owner',
								value: `${owner.user.tag} (${owner.user.id})]`,
							},
							{
								name: 'Member Count of the Server',
								value: `${guild.memberCount}`,
							},
							{
								name: 'Bot Count of the Server',
								value: `${guild.members.cache.filter((u) => u.user.bot).size}`,
							},
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
			})
			.catch(console.error);
	},
};

function discordLog(client, embed) {
	delete require.cache[require.resolve('../constants/Bot/config.json')];
	const config = require('../constants/Bot/config.json');

	client.channels
		.fetch(config.joinlog)
		.then((channel) => channel.send({ embeds: [embed] }))
		.catch(console.error);
}
