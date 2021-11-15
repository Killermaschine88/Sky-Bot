const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'Stats',
	usage: 'stats (IGN)',
	description: 'Show Overall Stats for the mentioned User',
	perms: 'None',
	folder: 'Skyblock',
	aliases: [],
	async execute(client, message, args) {
		if (!args[0]) {
			var ign = message.member.displayName;
		} else {
			if (message.mentions.members.first()) {
				var ign = message.mentions.members.first().displayName;
			} else var ign = args[0];
		} // Gets IGN

		ign = ign.replace(/\W/g, ''); // removes weird characters

		fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`).then((res) => {
			if (res.status != 200) {
				return message.channel.send({
					embeds: [
						new Discord.MessageEmbed()
							.setDescription(`No Minecraft account found for \`${ign}\``)
							.setColor('DC143C')
							.setTimestamp(),
					],
				});
			}
		}); // Test if IGN esists

		ign = await getTrueIgn(ign);

		// At this point we know its a valid IGN, but not if it has skyblock profiles
		const apiData = await getApiData(ign); // Gets all skyblock player data from Senither's Hypixel API Facade

		const waitembed = new Discord.MessageEmbed()
			.setDescription('Checking for Player Data . . .')
			.setColor('ORANGE');

		const waitingembed = await message.channel.send({
			embeds: [waitembed],
		});

		if (apiData.status != 200) {
			return waitingembed.edit({
				embeds: [new Discord.MessageEmbed().setDescription(apiData.reason).setColor('DC143C').setTimestamp()],
			});
		}

		// IGN is valid and player has skyblock profiles
		if (!apiData.apiEnabled === false) return message.channel.send('This players API is off.');
		let bank = apiData.data.coins.bank;
		if (!bank) bank = '0';
		let purse = apiData.data.coins.purse;
		if (!purse) purse = '0';
		return message.channel.send({
			embeds: [
				new Discord.MessageEmbed()
					.setTitle(`Stats for ${ign} on Profile: ${apiData.data.name}`)
					.setColor('7CFC00')
					.setAuthor(
						ign,
						`https://cravatar.eu/helmavatar/${ign}/600.png`,
						`http://sky.shiiyu.moe/stats/${ign}`
					)
					.setDescription(`General Stats Overview for the Player`)
					.addFields(
						{
							name: '💰 Coins',
							value: `Total: ${toFixed(apiData.data.coins.total)}\nBank: ${toFixed(
								bank
							)}\nPurse: ${toFixed(purse)}`,
							inline: true,
						},

						{
							name: '<:rev:852892164559732806> Slayers',
							value: `Zombie: ${toFixed(apiData.data.slayers.bosses.revenant.level)}\nSpider: ${toFixed(
								apiData.data.slayers.bosses.tarantula.level
							)}\nWolf: ${toFixed(apiData.data.slayers.bosses.sven.level)}`,
							inline: true,
						},

						{
							name: 'Weight',
							value: `Total: ${toFixed(apiData.data.weight)}\nOverflow: ${toFixed(
								apiData.data.weight_overflow
							)}\nSkills: ${toFixed(apiData.data.skills.weight)}\nSlayers: ${toFixed(
								apiData.data.slayers.weight
							)}\nDungons: ${toFixed(apiData.data.dungeons.weight)}`,
							inline: true,
						},

						{
							name: '<:combat:852069714527911956> Skill Average',
							value: toFixed(apiData.data.skills.average_skills),
							inline: true,
						}
					),
			],
		});
	},
};

async function getUUID(ign) {
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
	const result = await response.json();
	return result.id;
}

async function getApiData(ign) {
	delete require.cache[require.resolve('../../config.json')];
	const config = require('../../config.json');

	const UUID = await getUUID(ign);
	const response = await fetch(`https://baltrazz.repl.co/v1/profiles/${UUID}/skills?key=${config.apikey}`);
	return await response.json();
}

async function getTrueIgn(ign) {
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
	const result = await response.json();
	return result.name;
}

function toFixed(num) {
	var re = new RegExp('^-?\\d+(?:.\\d{0,' + (2 || -1) + '})?');
	return num.toString().match(re)[0];
}
