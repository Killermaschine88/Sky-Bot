const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'Skills',
	description: "Shows the user's skills.",
	usage: 'skills (IGN)',
	perms: 'None',
	folder: 'Skyblock',
	aliases: ['s'],
	async execute(interaction) {
		var ign = interaction.options.getString('ign');

		var method = 'save';

		ign = ign.replace(/\W/g, ''); // removes weird characters

		fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`).then((res) => {
			if (res.status != 200) {
				return interaction.editReply({
					embeds: [
						new Discord.MessageEmbed()
							.setDescription(`No Minecraft account found for \`${ign}\``)
							.setColor('DC143C')
							.setTimestamp(),
					],
				});
			}
		}); // Test if IGN esists

		const waitembed = new Discord.MessageEmbed()
			.setDescription('Checking for player data . . .')
			.setColor('ORANGE');

		const waitingembed = await interaction.editReply({
			embeds: [waitembed],
		});

		// At this point we know its a valid IGN, but not if it has skyblock profiles
		const apiData = await getApiData(ign, method); // Gets all skyblock player data from Senither's Hypixel API Facade

		if (apiData.status != 200) {
			return interaction.editReply({
				embeds: [new Discord.MessageEmbed().setDescription(apiData.reason).setColor('DC143C').setTimestamp()],
			});
		}

		// IGN is valid and player has skyblock profiles

		if (apiData.data.skills.apiEnabled == false)
			return interaction.editReply({
				embeds: [
					new Discord.MessageEmbed()
						.setAuthor(
							ign,
							`https://cravatar.eu/helmavatar/${ign}/600.png`,
							`https://sky.shiiyu.moe/stats/${ign}`
						)
						.setDescription(
							'You currently have skills API disabled, please enable it in the skyblock menu and try again'
						)
						.setColor('DC143C')
						.setTimestamp(),
				],
			});

		//calculations for the skills

		let totalxp =
			apiData.data.skills.mining.experience +
			apiData.data.skills.foraging.experience +
			apiData.data.skills.enchanting.experience +
			apiData.data.skills.farming.experience +
			apiData.data.skills.combat.experience +
			apiData.data.skills.fishing.experience +
			apiData.data.skills.alchemy.experience +
			apiData.data.skills.taming.experience;

		let ttotalxp = Math.floor(totalxp / 1000);
		if (ttotalxp > 999999) {
			ttotalxp = Math.floor(totalxp / 1000000000) + '.' + Math.floor((ttotalxp % 1000000000) / 100000) + 'B';
		} else if (ttotalxp > 999) {
			{
				ttotalxp = Math.floor(totalxp / 1000000) + '.' + Math.floor((totalxp % 1000000) / 10000) + 'M';
			}
		} else {
			ttotalxp = ttotalxp + 'K';
		}

		let mixp = apiData.data.skills.mining.experience;
		let tmixp = Math.floor(mixp / 1000);
		if (tmixp > 999) {
			tmixp = Math.floor(mixp / 1000000) + '.' + Math.floor((mixp % 1000000) / 10000) + 'M';
		} else {
			tmixp = tmixp + 'K';
		}

		let foxp = apiData.data.skills.foraging.experience;
		let tfoxp = Math.floor(foxp / 1000);
		if (tfoxp > 999) {
			tfoxp = Math.floor(foxp / 1000000) + '.' + Math.floor((foxp % 1000000) / 10000) + 'M';
		} else {
			tfoxp = tfoxp + 'K';
		}

		let enxp = apiData.data.skills.enchanting.experience;
		let tenxp = Math.floor(enxp / 1000);
		if (tenxp > 999) {
			tenxp = Math.floor(enxp / 1000000) + '.' + Math.floor((enxp % 1000000) / 10000) + 'M';
		} else {
			tenxp = tenxp + 'K';
		}

		let faxp = apiData.data.skills.farming.experience;
		let tfaxp = Math.floor(faxp / 1000);
		if (tfaxp > 999) {
			tfaxp = Math.floor(faxp / 1000000) + '.' + Math.floor((faxp % 1000000) / 10000) + 'M';
		} else {
			tfaxp = tfaxp + 'K';
		}

		let coxp = apiData.data.skills.combat.experience;
		let tcoxp = Math.floor(coxp / 1000);
		if (tcoxp > 999) {
			tcoxp = Math.floor(coxp / 1000000) + '.' + Math.floor((coxp % 1000000) / 10000) + 'M';
		} else {
			tcoxp = tcoxp + 'K';
		}

		let fixp = apiData.data.skills.fishing.experience;
		let tfixp = Math.floor(fixp / 1000);
		if (tfixp > 999) {
			tfixp = Math.floor(fixp / 1000000) + '.' + Math.floor((fixp % 1000000) / 10000) + 'M';
		} else {
			tfixp = tfixp + 'K';
		}

		let alxp = apiData.data.skills.alchemy.experience;
		let talxp = Math.floor(alxp / 1000);
		if (talxp > 999) {
			talxp = Math.floor(alxp / 1000000) + '.' + Math.floor((alxp % 1000000) / 10000) + 'M';
		} else {
			talxp = talxp + 'K';
		}

		let taxp = apiData.data.skills.taming.experience;
		let ttaxp = Math.floor(taxp / 1000);
		if (ttaxp > 999) {
			ttaxp = Math.floor(taxp / 1000000) + '.' + Math.floor((taxp % 1000000) / 10000) + 'M';
		} else {
			ttaxp = ttaxp + 'K';
		}

		return interaction.editReply({
			embeds: [
				new Discord.MessageEmbed()
					.setTitle(`Skill data for ${ign}`)
					.setColor('7CFC00')
					.setAuthor(
						ign,
						`https://cravatar.eu/helmavatar/${ign}/600.png`,
						`http://sky.shiiyu.moe/stats/${ign}`
					)
					.setDescription(`Total skill XP: **${ttotalxp}**`)
					.setFooter(`${ign}'s skill average: ${toFixed(apiData.data.skills.average_skills)}`)
					.addFields(
						{
							name: '<:mining:852069714577719306> Mining',
							value: `Level: **${toFixed(apiData.data.skills.mining.level)}**\nTotal XP: **${tmixp}**`,
							inline: true,
						},
						{
							name: '<:foraging:852069714447695872> Foraging',
							value: `Level: **${toFixed(apiData.data.skills.foraging.level)}**\nTotal XP: **${tfoxp}**`,
							inline: true,
						},
						{
							name: '<:enchanting:852069714511659058> Enchanting',
							value: `Level: **${toFixed(
								apiData.data.skills.enchanting.level
							)}**\nTotal XP: **${tenxp}**`,
							inline: true,
						},
						{
							name: '<:farming:852069714451759114> Farming',
							value: `Level: **${toFixed(apiData.data.skills.farming.level)}**\nTotal XP: **${tfaxp}**`,
							inline: true,
						},
						{
							name: '<:combat:852069714527911956> Combat',
							value: `Level: **${toFixed(apiData.data.skills.combat.level)}**\nTotal XP: **${tcoxp}**`,
							inline: true,
						},
						{
							name: '<:fishing:852069714359877643> Fishing',
							value: `Level: **${toFixed(apiData.data.skills.fishing.level)}**\nTotal XP: **${tfixp}**`,
							inline: true,
						},
						{
							name: '<:alchemy:852069714480988180> Alchemy',
							value: `Level: **${toFixed(apiData.data.skills.alchemy.level)}**\nTotal XP: **${talxp}**`,
							inline: true,
						},
						{
							name: '<:taming:852069714493833227> Taming',
							value: `Level: **${toFixed(apiData.data.skills.taming.level)}**\nTotal XP: **${ttaxp}**`,
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

async function getApiData(ign, method) {
	delete require.cache[require.resolve('../../constants/Bot/config.json')];
	const config = require('../../constants/Bot/config.json');

	const UUID = await getUUID(ign);
	const response = await fetch(`https://baltrazz.repl.co/v1/profiles/${UUID}/${method}?key=${config.apikey}`);
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
