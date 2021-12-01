const Discord = require('discord.js');
const leveling = require('../../constants/Simulator/Functions/leveling.js');
const playerStats = require('../../constants/Simulator/Functions/playerStats.js');
const slayerLevel = require('../../constants/Simulator/Functions/slayerLevel.js');
const catalvl = require('../../constants/Simulator/Functions/dungeonlevel.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');

module.exports = {
	name: 'sbinfo',
	description: 'Creates your profile for Skyblock Simulator',
	usage: 'sbstart',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['sbi', 'sbview'],
	cooldown: 10,
	async execute(interaction, mclient) {
		if (interaction.options.getUser('user') != null) {
			var id = interaction.options.getUser('user').id;
		} else {
			var id = interaction.user.id;
		}

		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: id });

		if (player === null) {
			const nodata = new Discord.MessageEmbed().setColor('RED').setDescription(`No profile found for <@!${id}>`);
			await interaction.editReply({ embeds: [nodata] });
			return;
		}

		let mining = player.data.skills.mining;
		let foraging = player.data.skills.foraging;
		let enchanting = player.data.skills.enchanting;
		let farming = player.data.skills.farming;
		let combat = player.data.skills.combat;
		let fishing = player.data.skills.fishing;
		let cata = player.data.dungeons.xp;
		let classxp = player.data.dungeons.class.selected.xp;

		mining = getLevelByXp(mining);
		//foraging = getLevelByXp(foraging);
		//enchanting = getLevelByXp(enchanting);
		//farming = getLevelByXp(farming);
		combat = getLevelByXp(combat);
		fishing = getLevelByXp(fishing);
		cata = catalvl(cata).level;
		classxp = catalvl(classxp).level;

		//console.log(combat)
		//console.log(cata)

		let salevel = mining.level + combat.level + fishing.level;
		salevel = salevel / 3;
		let sa = salevel.toFixed(2);

		let str = '';
		let i = 0;
		if (player.data.inventory.items.length == 0) {
			str = 'Empty';
		} else {
			for (item of player.data.inventory.items) {
				if (item.amount != 0) {
					if (str.length < 4000 && i <= player.data.inventory.items.length) {
						str += item.name + ': ' + item.amount + '\n';
					} else {
						break;
					}
				}

				i += 1;
			}
		}
		i = 0;

		let armorstr = '**Format:** [ItemId] Recombobulator Reforge Itemname Stats\n\n';
		let armornum = 0;
		let swordstr = '**Format:** [ItemId] Recombobulator Reforge Itemname Stats\n\n';
		let swordnum = 0;
		for (item of player.data.inventory.armor) {
			armorstr += `[${armornum}] `;
			if (item.recombobulated == true) {
				armorstr += '<:recomb:881094744183275540>';
			}

			if (item.reforge != 'None') {
				armorstr += `${item.reforge} `;
			}

			armorstr += `${item.name} `;

			if (item.health != 0) {
				armorstr += `\`${item.health} ❤\`, `;
			}
			if (item.defense != 0) {
				armorstr += `\`${item.defense} ❈\`, `;
			}
			if (item.strength != 0) {
				armorstr += `\`${item.strength} ❁\`, `;
			}
			if (item.crit_chance != 0) {
				armorstr += `\`${item.crit_chance} ☣\`, `;
			}
			if (item.crit_damage != 0) {
				armorstr += `\`${item.crit_damage} ☠\`, `;
			}
			if (item.magic_find != 0) {
				armorstr += `\`${item.magic_find} ✯\`, `;
			}
			if (item.sea_creature_chance != 0) {
				armorstr += `\`${item.sea_creature_chance} α\`, `;
			}
			armorstr += '\n';
			armornum += 1;
		}

		for (item of player.data.inventory.sword) {
			swordstr += `[${swordnum}] `;
			if (item.recombobulated == true) {
				swordstr += '<:recomb:881094744183275540>';
			}

			if (item.reforge != 'None') {
				swordstr += `${item.reforge} `;
			}

			swordstr += `${item.name} `;

			if (item.damage != 0) {
				swordstr += `\`${item.damage} ⚔️\`, `;
			}
			if (item.strength != 0) {
				swordstr += `\`${item.strength} ❁\`, `;
			}
			if (item.crit_chance != 0) {
				swordstr += `\`${item.crit_chance} ☣\`, `;
			}
			if (item.crit_damage != 0) {
				swordstr += `\`${item.crit_damage} ☠\`, `;
			}
			swordstr += '\n';
			swordnum += 1;
		}
		armornum = 0;
		swordnum = 0;

		//Player Stats
		let type = 'all';
		let cookie = player.data.misc.booster_cookie.active;
		const ps = await playerStats(player, type, cookie);

		//Various Stats
		let playerfishingspeed = player.data.equipment.fishing.rod.fishing_speed;

		let eqsword = '';
		let eqarmor = '';
		let eqpickaxe = '';
		let eqrod = '';

		if (player.data.equipment.combat.sword.recombobulated == true) {
			eqsword += '<:recomb:881094744183275540> ';
		}

		if (player.data.equipment.combat.sword.reforge != 'None') {
			eqsword += player.data.equipment.combat.sword.reforge + ' ' + player.data.equipment.combat.sword.name;
		} else {
			eqsword += player.data.equipment.combat.sword.name;
		}

		if (player.data.equipment.combat.armor.recombobulated == true) {
			eqarmor += '<:recomb:881094744183275540> ';
		}
		if (player.data.equipment.combat.armor.reforge != 'None') {
			eqarmor += player.data.equipment.combat.armor.reforge + ' ' + player.data.equipment.combat.armor.name;
		} else {
			eqarmor += player.data.equipment.combat.armor.name;
		}

		if (player.data.equipment.mining.pickaxe.recombobulated == true) {
			eqpickaxe += '<:recomb:881094744183275540> ';
		}
		if (player.data.equipment.mining.pickaxe.reforge != 'None') {
			eqpickaxe += player.data.equipment.mining.pickaxe.reforge + ' ' + player.data.equipment.mining.pickaxe.name;
		} else {
			eqpickaxe += player.data.equipment.mining.pickaxe.name;
		}

		if (player.data.equipment.fishing.rod.recombobulated == true) {
			eqrod += '<:recomb:881094744183275540> ';
		}
		if (player.data.equipment.fishing.rod.reforge != 'None') {
			eqrod += player.data.equipment.fishing.rod.reforge + ' ' + player.data.equipment.fishing.rod.name;
		} else {
			eqrod += player.data.equipment.fishing.rod.name;
		}

		const foundinfo = new Discord.MessageEmbed()
			.setFooter(getFooter(player))
			.setColor(getColor(player))
			.setDescription(
				`**Info for <@!${id}> on profile ${player.data.profile.cute_name}**\nProfile creation: <t:${
					player.data.profile.started
				}:f>\nCoins: **${player.data.profile.coins.toLocaleString()} <:coins:861974605203636253>**\nGems: **${
					player.data.profile.gems
				} <:gems:879264850348486696>**\nWeapon: **${eqsword}**\nArmor: **${eqarmor}**\nRod: **${eqrod}**\nPickaxe: **${eqpickaxe}**`
			)
			.addField(
				`Skills [${sa}]`,
				`<:mining:852069714577719306> Mining [${mining.level}]: **${mining.xpCurrent} XP / ${mining.xpForNext} XP**\n<:combat:852069714527911956> Combat [${combat.level}]: **${combat.xpCurrent} XP / ${combat.xpForNext} XP**\n<:fishing:852069714359877643> Fishing [${fishing.level}]: **${fishing.xpCurrent} XP / ${fishing.xpForNext} XP**`,
				true
			)
			.addField(
				'Stats',
				`Effective Health: **\`${ps.health} ❤\`\n**Health: **\`${ps.hp} ❤\`**\nDefense: \`${ps.defense} ❈\`\nDamage: \`${ps.damage} ⚔️\`\nStrength: \`${ps.strength} ❁\`\nCrit Chance: \`${ps.crit_chance} ☣\`\nCrit Damage: \`${ps.crit_damage} ☠\`\nMagic Find: \`${ps.magic_find} ✯\`\nSea Creature Chance: \`${ps.sea_creature_chance} α\`\nFishing Speed: \`${playerfishingspeed} 🎣\`\nMining Speed: \`${ps.mining_speed} ⸕\`\nMining Fortune: \`${ps.mining_fortune} ☘\``,
				true
			)
			.addField('Location', `${player.data.misc.location}`, true);

		if (player.data.misc.booster_cookie.active == true) {
			foundinfo.addField(`Booster Cookie`, `Expiration: <t:${player.data.misc.booster_cookie.expires}>`);
		}

		const row = new Discord.MessageActionRow().addComponents(
			new Discord.MessageButton()
				.setCustomId('main')
				.setEmoji('852069714493833227')
				.setLabel('Main')
				.setStyle('PRIMARY'),
			new Discord.MessageButton()
				.setCustomId('inv')
				.setEmoji('881176353444085820')
				.setLabel('Inventory')
				.setStyle('PRIMARY'),
			new Discord.MessageButton()
				.setCustomId('slayer')
				.setEmoji('852892164559732806')
				.setLabel('Slayer')
				.setStyle('PRIMARY'),
			new Discord.MessageButton()
				.setCustomId('dungeons')
				.setEmoji('854399510951624775')
				.setLabel('Dungeons')
				.setStyle('PRIMARY')
		);

		const row2 = new Discord.MessageActionRow().addComponents(
			new Discord.MessageButton()
				.setCustomId('armorlist')
				.setEmoji('852079613051666472')
				.setLabel('Armor')
				.setStyle('PRIMARY'),
			new Discord.MessageButton()
				.setCustomId('swordlist')
				.setEmoji('852079613052059658')
				.setLabel('Sword')
				.setStyle('PRIMARY'),
			new Discord.MessageButton().setCustomId('settings').setEmoji('🛠️').setLabel('Settings').setStyle('PRIMARY')
		);

		const menu = await interaction.editReply({
			embeds: [foundinfo],
			components: [row, row2],
		});

		const collector = menu.createMessageComponentCollector({
			componentType: 'BUTTON',
			time: 60000,
		});

		collector.on('collect', async (i) => {
			if (i.user.id === interaction.user.id) {
				if (i.customId === 'main') {
					await i.deferUpdate();
					const main = new Discord.MessageEmbed()
						.setFooter(getFooter(player))
						.setColor(getColor(player))
						.setDescription(
							`**Info for <@!${id}> on profile ${player.data.profile.cute_name}**\nProfile creation: <t:${
								player.data.profile.started
							}:f>\nCoins: **${player.data.profile.coins.toLocaleString()} <:coins:861974605203636253>**\nGems: **${
								player.data.profile.gems
							} <:gems:879264850348486696>**\nWeapon: **${eqsword}**\nArmor: **${eqarmor}**\nRod: **${eqrod}**\nPickaxe: **${eqpickaxe}**`
						)
						.addField(
							`Skills [${sa}]`,
							`<:mining:852069714577719306> Mining [${mining.level}]: **${mining.xpCurrent} XP / ${mining.xpForNext} XP**\n<:combat:852069714527911956> Combat [${combat.level}]: **${combat.xpCurrent} XP / ${combat.xpForNext} XP**\n<:fishing:852069714359877643> Fishing [${fishing.level}]: **${fishing.xpCurrent} XP / ${fishing.xpForNext} XP**`,
							true
						)
						.addField(
							'Stats',
							`Effective health: **\`${ps.health} ❤\`\n**Health: **\`${ps.hp} ❤\`**\nDefense: \`${ps.defense} ❈\`\nDamage: \`${ps.damage} ⚔️\`\nStrength: \`${ps.strength} ❁\`\nCrit chance: \`${ps.crit_chance} ☣\`\nCrit damage: \`${ps.crit_damage} ☠\`\nMagic find: \`${ps.magic_find} ✯\`\nSea Creature chance: \`${ps.sea_creature_chance} α\`\nFishing speed: \`${playerfishingspeed} 🎣\`\nMining speed: \`${ps.mining_speed} ⸕\`\nMining fortune: \`${ps.mining_fortune} ☘\``,
							true
						)
						.addField('Location', `${player.data.misc.location}`, true);

					await interaction.editReply({ embeds: [main] });
				} else if (i.customId === 'inv') {
					await i.deferUpdate();
					const inv = new Discord.MessageEmbed()
						.setFooter(getFooter(player))
						.setColor(getColor(player))
						.setDescription(`**Inventory for <@${id}>**\n${str}`);
					await interaction.editReply({ embeds: [inv] });
				} else if (i.customId === 'slayer') {
					await i.deferUpdate();
					const slayer = new Discord.MessageEmbed()

						.setFooter(getFooter(player))
						.setColor(getColor(player))
						.setDescription(`**Slayer info for <@${id}>**\n\n**NOT ADDED YET!!!**`)
						.addField(
							'<:rev:852892164559732806> Revenant Horror',
							`XP: **${player.data.slayer.zombiexp}**\nBoss kills: **${player.data.slayer.zombiekills}**`,
							true
						)
						.addField(
							'<:tara:852892164392222740> Tarantula Broodfather',
							`XP: **${player.data.slayer.spiderxp}**\nBoss kills: **${player.data.slayer.spiderkills}**`,
							true
						)
						.addField(
							'<:sven:852892164299423754> Sven Packmaster',
							`XP: **${player.data.slayer.wolfxp}**\nBoss kills: **${player.data.slayer.wolfkills}**`,
							true
						)
						.addField(
							'<:eman:854253314747924511> Voidgloom Seraph',
							`XP: **${player.data.slayer.endermanxp}**\nBoss kills: **${player.data.slayer.endermankills}**`,
							true
						);
					await interaction.editReply({ embeds: [slayer] });
				} else if (i.customId === 'dungeons') {
					await i.deferUpdate();
					const dungeons = new Discord.MessageEmbed()
						.setFooter(getFooter(player))
						.setColor(getColor(player))
						.setDescription(
							`**Dungeons info for <@${id}>**\n<:catacombs:854399510951624775> Dungeons XP [${cata}]: **${player.data.dungeons.xp}**\n<:mage:852079612699607072> Selected class [${classxp}]: \n* Name: **${player.data.dungeons.class.selected.name}**\n* XP: **${player.data.dungeons.class.selected.xp}**`
						);
					await interaction.editReply({ embeds: [dungeons] });
				} else if (i.customId === 'armorlist') {
					await i.deferUpdate();
					const dungeons = new Discord.MessageEmbed()
						.setFooter(getFooter(player))
						.setColor(getColor(player))
						.setDescription(
							`${armorstr}\nYou can change your armor using \`/sb wardrobe item-name\`\nExample: \`/sb wardrobe Naked\``
						);
					await interaction.editReply({ embeds: [dungeons] });
				} else if (i.customId === 'swordlist') {
					await i.deferUpdate();
					const dungeons = new Discord.MessageEmbed()
						.setFooter(getFooter(player))
						.setColor(getColor(player))
						.setDescription(
							`${swordstr}\nYou can change your sword using \`/sb wardrobe item-name\`\nExample: \`/sb wardrobe Fist\``
						);
					await interaction.editReply({ embeds: [dungeons] });
				} else if (i.customId == 'settings') {
					await i.deferUpdate();
					let settingembed = new Discord.MessageEmbed();
					settingembed.setColor(getColor(player));
					settingembed.setFooter(getFooter(player));
					let set = player.data.settings.confirmation || true;

					settingembed.setDescription(`Settings info for <@${id}>`);
					settingembed.addField('Image Shown', `${player.data.settings.imgshown}`, true);
					settingembed.addField('Confirmation Message', `${set}`);
					await interaction.editReply({ embeds: [settingembed] });
				}
			}
		});

		collector.on('end', async (collected) => {
			try {
				await interaction.editReply({ components: [] });
			} catch (e) {}
		});
	},
};

function getLevelByXp(xp, extra = {}) {
	let xp_table;
	switch (extra.type) {
		case 'runecrafting':
			xp_table = leveling.runecrafting_xp;
			break;
		case 'dungeons':
			xp_table = leveling.dungeoneering_xp;
			break;
		default:
			xp_table = leveling.leveling_xp;
	}

	if (isNaN(xp)) {
		return {
			xp: 0,
			level: 0,
			xpCurrent: 0,
			xpForNext: xp_table[1],
			progress: 0,
			level_cap: 0,
			uncapped_level: 0,
		};
	}

	let xpTotal = 0;
	let level = 0;
	let uncappedLevel = 0;

	let xpForNext = Infinity;

	let levelCap = 1;
	let maxLevel = 1;

	if (extra.cap) {
		levelCap = extra.cap;
	}

	if (extra.skill) {
		if (leveling.default_skill_caps[extra.skill] && leveling.default_skill_caps[extra.skill] > levelCap) {
			levelCap = leveling.default_skill_caps[extra.skill];
		}

		if (leveling.maxed_skill_caps[extra.skill]) {
			maxLevel = leveling.maxed_skill_caps[extra.skill];
		}
	} else {
		levelCap = Object.keys(xp_table)
			.sort((a, b) => Number(a) - Number(b))
			.map((a) => Number(a))
			.pop();
	}

	if (levelCap > maxLevel) {
		maxLevel = levelCap;
	}

	for (let x = 1; x <= maxLevel; x++) {
		xpTotal += xp_table[x];

		if (xpTotal > xp) {
			xpTotal -= xp_table[x];
			break;
		} else {
			if (x <= levelCap) level = x;
			uncappedLevel = x;
		}
	}

	let xpCurrent = Math.floor(xp - xpTotal);

	if (level < levelCap) {
		xpForNext = Math.ceil(xp_table[level + 1]);
	}

	let progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));

	let levelWithProgress = getLevelWithProgress(xp, maxLevel, Object.values(xp_table));

	return {
		xp,
		level,
		maxLevel,
		xpCurrent,
		xpForNext,
		progress,
		levelCap,
		uncappedLevel,
		levelWithProgress,
	};
}

function getLevelWithProgress(experience, maxLevel, experienceGroup) {
	let level = 0;

	for (let toRemove of experienceGroup) {
		experience -= toRemove;
		if (experience < 0) {
			return Math.min(level + (1 - (experience * -1) / toRemove), maxLevel);
		}
		level++;
	}

	return Math.min(level, maxLevel);
}
