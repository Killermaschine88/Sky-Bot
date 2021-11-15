const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
	name: 'Verify',
	usage: 'verify (IGN)',
	description: 'Sets the Users Nick to [Cata Level] IGN',
	perms: 'None',
	folder: 'Skyblock',
	aliases: [],
	execute(client, message, args) {
		if (!message.guild.roles.cache.find((role) => role.name === 'Linked'))
			return message.channel.send("Can't find a Role named `Linked`.");

		if (!message.guild.me.permissions.has('MANAGE_ROLES'))
			return message.channel.send("I don't have `MANAGE_ROLES` Permission.");

		if (!message.guild.me.permissions.has('MANAGE_NICKNAMES'))
			return message.channel.send("I don't have `MANAGE_NICKNAMES` Permission.");

		let verifyrole = message.guild.roles.cache.find((role) => role.name === 'Linked');

		let target = message.author;

		let mtarget = message.guild.members.cache.get(target.id);

		let ign = args[0];
		message.delete();
		try {
			if (ign === undefined) {
				message.channel
					.send('<a:no:847468672380829707> Please use the proper Format: `!verify IGN`')
					.then((msg) =>
						setTimeout(() => {
							msg.delete();
						}, 10000)
					);
				return;
			}
			delete require.cache[require.resolve('../../config.json')];
			const config = require('../../config.json');
			axios.get(`https://some-random-api.ml/mc?username=${ign}`).then((res) => {
				const uuid = res.data.uuid;
				axios.get(`https://api.hypixel.net/player?key=${config.apikey}&uuid=${uuid}`).then((res) => {
					if (res.data.player.socialMedia.links.DISCORD != message.author.tag) {
						message.channel
							.send(
								"<a:no:847468672380829707> Your Discord isn't Linked to your Hxpixel Account or you entered the wrong IGN."
							)
							.then((msg) =>
								setTimeout(() => {
									msg.delete();
								}, 10000)
							);
						return;
					} else if (res.data.player.socialMedia.links.DISCORD === message.author.tag) {
						axios
							.get(`https://baltrazz.repl.co/v1/profiles/${uuid}/catacombs?key=${config.apikey}`)
							.then((res) => {
								let level = res.data.data.dungeons.types.catacombs.level;
								let round = level.toFixed();
								message.member.setNickname(`[${round}] ${ign}`);
								mtarget.roles.add(verifyrole.id);

								const vembed = new Discord.MessageEmbed()
									.setTitle('<a:yes:847468695772987423> User successfully verified.')
									.setDescription(
										`${message.author} has successfully linked and their Nickname has been updated.`
									)
									.setColor('GREEN');
								message.channel.send({ embeds: [vembed] }).then((msg) =>
									setTimeout(() => {
										msg.delete();
									}, 10000)
								);
							});
					}
				});
			});
		} catch (error) {
			console.error(error);
			message.channel.send('Error. Please try again later or Message Baltraz#4874.');
		}
	},
};
