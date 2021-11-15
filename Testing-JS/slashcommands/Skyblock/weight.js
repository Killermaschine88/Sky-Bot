const Discord = require('discord.js');
const fetch = require('node-fetch');

const loading = `847471618272002059`;

module.exports = {
	name: 'Weight',
	usage: 'weight (IGN) <Profile>',
	description:
		"Gets the weight of a player's profile. This is a number generated from your Skills, Slayers and Dungeons levels.",
	perms: 'None',
	folder: 'Skyblock',
	aliases: ['we'],
	async execute(interaction) {
		var ign = interaction.options.getString('ign');

		var method = 'save';

		ign = ign.replace(/\W/g, ''); // removes weird characters

		const waitembed = new Discord.MessageEmbed()
			.setDescription('Checking for player data . . .')
			.setColor('ORANGE');

		const waitingembed = await interaction.editReply({
			embeds: [waitembed],
		});

		fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`).then((res) => {
			if (res.status != 200) {
				const nomcacc = new Discord.MessageEmbed()
					.setDescription(`No Minecraft account found for \`${ign}\``)
					.setColor('DC143C')
					.setTimestamp();
				waitingembed.edit({ embeds: [nomcacc] });
				return;
			}
		}); // Test if IGN esists

		ign = await getTrueIgn(ign);

		// At this point we know its a valid IGN, but not if it has skyblock profiles
		const apiData = await getApiData(ign, method); // Gets all skyblock player data from Senither's Hypixel API Facade

		if (apiData.status != 200) {
			const apierrorembed = new Discord.MessageEmbed()
				.setDescription(apiData.reason)
				.setColor('DC143C')
				.setTimestamp();
			waitingembed.edit({ embeds: [apierrorembed] });
			return;
		}
		// IGN is valid and player has skyblock profiles

		if (apiData.data.skills.apiEnabled == false) {
			const apioff = new Discord.MessageEmbed()
				.setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
				.setDescription(
					'This player current has the Skills API disabled, tell them to enable it in the Skyblock menu and then try again'
				)
				.setColor('DC143C')
				.setTimestamp();
			waitingembed.edit({ embeds: [apioff] });
			return;
		}

		//fix this shit
		if (apiData.data.dungeons == null) {
			const nodungeonsfound = new Discord.MessageEmbed()
				.setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
				.setDescription(`${ign} has not entered the Catacombs`)
				.setColor('DC143C')
				.setTimestamp();
			waitingembed.edit({ embeds: [nodungeonsfound] });
			return;
		}

		const foundresults = new Discord.MessageEmbed()
			.setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
			.setColor('7CFC00')
			.setDescription(
				`${ign}'s total weight for their **${apiData.data.name}** profile is **${toFixed(
					apiData.data.weight
				)} + ${toFixed(apiData.data.weight_overflow)} overflow (${toFixed(
					apiData.data.weight + apiData.data.weight_overflow
				)} Total)**`
			)
			.addFields(
				{
					name: 'Skills',
					value: [
						`<:mining:852069714577719306> Mining`,
						`<:foraging:852069714447695872> Foraging`,
						`<:enchanting:852069714511659058> Enchanting`,
						`<:farming:852069714451759114> Farming`,
						`<:combat:852069714527911956> Combat`,
						`<:fishing:852069714359877643> Fishing`,
						`<:alchemy:852069714480988180> Alchemy`,
						`<:taming:852069714493833227> Taming`,
					].join('\n'),
					inline: true,
				},
				{
					name: 'Level',
					value: [
						toFixed(apiData.data.skills.mining.level),
						toFixed(apiData.data.skills.foraging.level),
						toFixed(apiData.data.skills.enchanting.level),
						toFixed(apiData.data.skills.farming.level),
						toFixed(apiData.data.skills.combat.level),
						toFixed(apiData.data.skills.fishing.level),
						toFixed(apiData.data.skills.alchemy.level),
						toFixed(apiData.data.skills.taming.level),
					].join('\n'),
					inline: true,
				},
				{
					name: 'Weight',
					value: [
						`**${toFixed(apiData.data.skills.mining.weight)}** + ${toFixed(
							apiData.data.skills.mining.weight_overflow
						)} *(${toFixed(
							apiData.data.skills.mining.weight + apiData.data.skills.mining.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.skills.foraging.weight)}** + ${toFixed(
							apiData.data.skills.foraging.weight_overflow
						)} *(${toFixed(
							apiData.data.skills.foraging.weight + apiData.data.skills.foraging.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.skills.enchanting.weight)}** + ${toFixed(
							apiData.data.skills.enchanting.weight_overflow
						)} *(${toFixed(
							apiData.data.skills.enchanting.weight + apiData.data.skills.enchanting.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.skills.farming.weight)}** + ${toFixed(
							apiData.data.skills.farming.weight_overflow
						)} *(${toFixed(
							apiData.data.skills.farming.weight + apiData.data.skills.farming.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.skills.combat.weight)}** + ${toFixed(
							apiData.data.skills.combat.weight_overflow
						)} *(${toFixed(
							apiData.data.skills.combat.weight + apiData.data.skills.combat.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.skills.fishing.weight)}** + ${toFixed(
							apiData.data.skills.fishing.weight_overflow
						)} *(${toFixed(
							apiData.data.skills.fishing.weight + apiData.data.skills.fishing.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.skills.alchemy.weight)}** + ${toFixed(
							apiData.data.skills.alchemy.weight_overflow
						)} *(${toFixed(
							apiData.data.skills.alchemy.weight + apiData.data.skills.alchemy.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.skills.taming.weight)}** + ${toFixed(
							apiData.data.skills.taming.weight_overflow
						)} *(${toFixed(
							apiData.data.skills.taming.weight + apiData.data.skills.taming.weight_overflow
						)})*`,
					].join('\n'),
					inline: true,
				},

				{
					name: 'Slayer',
					value: [
						`<:rev:852892164559732806> Revenant Horror`,
						`<:tara:852892164392222740> Tarantula Broodfather`,
						`<:sven:852892164299423754> Sven Packmaster`,
						`<:eman:854253314747924511> Voidgloom Seraph`,
					].join('\n'),
					inline: true,
				},
				{
					name: 'Experience',
					value: [
						apiData.data.slayers.bosses.revenant.experience
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
						apiData.data.slayers.bosses.tarantula.experience
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
						apiData.data.slayers.bosses.sven.experience.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
						apiData.data.slayers.bosses.enderman.experience
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
					].join('\n'),
					inline: true,
				},
				{
					name: 'Weight',
					value: [
						`**${toFixed(apiData.data.slayers.bosses.revenant.weight)}** + ${toFixed(
							apiData.data.slayers.bosses.revenant.weight_overflow
						)} *(${toFixed(
							apiData.data.slayers.bosses.revenant.weight +
								apiData.data.slayers.bosses.revenant.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.slayers.bosses.tarantula.weight)}** + ${toFixed(
							apiData.data.slayers.bosses.tarantula.weight_overflow
						)} *(${toFixed(
							apiData.data.slayers.bosses.tarantula.weight +
								apiData.data.slayers.bosses.tarantula.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.slayers.bosses.sven.weight)}** + ${toFixed(
							apiData.data.slayers.bosses.sven.weight_overflow
						)} *(${toFixed(
							apiData.data.slayers.bosses.sven.weight + apiData.data.slayers.bosses.sven.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.slayers.bosses.enderman.weight)}** + ${toFixed(
							apiData.data.slayers.bosses.enderman.weight_overflow
						)} *(${toFixed(
							apiData.data.slayers.bosses.enderman.weight +
								apiData.data.slayers.bosses.enderman.weight_overflow
						)})*`,
					].join('\n'),
					inline: true,
				},

				{
					name: 'Dungeons',
					value: [
						`<:catacombs:854399510951624775> Catacombs`,
						`<:healer:852079613001990175> Healer`,
						`<:mage:852079612699607072> Mage`,
						`<:berserker:852079613052059658> Berserker`,
						`<:archer:852079613042491402> Archer`,
						`<:tank:852079613051666472> Tank`,
					].join('\n'),
					inline: true,
				},
				{
					name: 'Level',
					value: [
						toFixed(apiData.data.dungeons.types.catacombs.level),
						toFixed(apiData.data.dungeons.classes.healer.level),
						toFixed(apiData.data.dungeons.classes.mage.level),
						toFixed(apiData.data.dungeons.classes.berserker.level),
						toFixed(apiData.data.dungeons.classes.archer.level),
						toFixed(apiData.data.dungeons.classes.tank.level),
					].join('\n'),
					inline: true,
				},
				{
					name: 'Weight',
					value: [
						`**${toFixed(apiData.data.dungeons.types.catacombs.weight)}** + ${toFixed(
							apiData.data.dungeons.types.catacombs.weight_overflow
						)} *(${toFixed(
							apiData.data.dungeons.types.catacombs.weight +
								apiData.data.dungeons.types.catacombs.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.dungeons.classes.healer.weight)}** + ${toFixed(
							apiData.data.dungeons.classes.healer.weight_overflow
						)} *(${toFixed(
							apiData.data.dungeons.classes.healer.weight +
								apiData.data.dungeons.classes.healer.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.dungeons.classes.mage.weight)}** + ${toFixed(
							apiData.data.dungeons.classes.mage.weight_overflow
						)} *(${toFixed(
							apiData.data.dungeons.classes.mage.weight +
								apiData.data.dungeons.classes.mage.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.dungeons.classes.berserker.weight)}** + ${toFixed(
							apiData.data.dungeons.classes.berserker.weight_overflow
						)} *(${toFixed(
							apiData.data.dungeons.classes.berserker.weight +
								apiData.data.dungeons.classes.berserker.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.dungeons.classes.archer.weight)}** + ${toFixed(
							apiData.data.dungeons.classes.archer.weight_overflow
						)} *(${toFixed(
							apiData.data.dungeons.classes.archer.weight +
								apiData.data.dungeons.classes.archer.weight_overflow
						)})*`,
						`**${toFixed(apiData.data.dungeons.classes.tank.weight)}** + ${toFixed(
							apiData.data.dungeons.classes.tank.weight_overflow
						)} *(${toFixed(
							apiData.data.dungeons.classes.tank.weight +
								apiData.data.dungeons.classes.tank.weight_overflow
						)})*`,
					].join('\n'),
					inline: true,
				}
			)
			.setTimestamp();

		waitingembed.edit({ embeds: [foundresults] });
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
