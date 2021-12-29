const Discord = require('discord.js');
const emoji = require('../../constants/Simulator/Json/emojis.json');
const mobs = require('../../constants/Simulator/Json/mobstats.json');
const getLevel = require('../../constants/Simulator/Functions/skilllvl.js');
const playerStats = require('../../constants/Simulator/Functions/playerStats.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');


module.exports = {
	name: 'sbfishing',
	description: 'Earn fishing XP',
	usage: 'sbfishing',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['fishing', 'fish'],
	cooldown: 20,
	async execute(interaction, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: interaction.user.id });

		const collection1 = mclient.db('SkyblockSim').collection('blockedchannels');

		if (player === null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			await interaction.editReply({ embeds: [noprofile] });
			return;
		}

		if (player.data.misc.is_fishing === true) {
			const alreadyfishing = new Discord.MessageEmbed()
				.setTitle('You are already fishing')
				.setColor('RED')
				.setFooter(getFooter('Pond'));
			await interaction.editReply({ embeds: [alreadyfishing] });
			return;
		}

		//Values needed
		let pstats = await playerStats(player);
		let fishinglvl = getLevel(player.data.skills.fishing).level;
		let rod = player.data.equipment.fishing.rod.name;
		let rod_speed = player.data.equipment.fishing.rod.fishing_speed;
		let sea_creature_chance = pstats.sea_creature_chance;
		let isCreature = '';
		let mob = '';
		let rod_casted = false;
		let creature_caught = false;
		let foundmob = '';
		let fishing_time = getFishingTime(rod_speed);

		//Fight Values
		let health = pstats.health;
		let php = health;
		let damage = pstats.damage;
		let strength = pstats.strength;
		let combatlvl = getLevel(player.data.skills.combat).level;
		let critchance = pstats.crit_chance;
		let critdmg = pstats.crit_damage;
		let critted = '';
		let pdmg = '';
		let mhp = '';
		let mdmg = '';

		//Buttons for Catching Fish
		const bcatch = new Discord.MessageButton()
			.setCustomId('cast')
			.setEmoji('852069714359877643')
			.setLabel('Cast Rod')
			.setStyle('PRIMARY');

		const blure = new Discord.MessageButton()
			.setCustomId('lure')
			.setEmoji('🐟')
			.setLabel('Lure Rod')
			.setStyle('PRIMARY');

		const bcatchoff = new Discord.MessageButton()
			.setCustomId('a') // ???
			.setEmoji('852069714359877643')
			.setLabel('Cast Rod')
			.setStyle('PRIMARY')
			.setDisabled(true);

		const blureoff = new Discord.MessageButton()
			.setCustomId('aaaa') // ???
			.setEmoji('🐟')
			.setLabel('Lure Rod')
			.setStyle('PRIMARY')
			.setDisabled(true);

		//Buttons for Killing Sea Creatures
		const bkillsc = new Discord.MessageButton()
			.setCustomId('killsc')
			.setEmoji('852079613052059658')
			.setLabel('Attack Sea Creature')
			.setStyle('PRIMARY');

		const bkillscoff = new Discord.MessageButton()
			.setCustomId('aa') // ???
			.setEmoji('852079613052059658')
			.setLabel('Attack Sea Creature')
			.setStyle('PRIMARY')
			.setDisabled(true);

		//Stop Button
		const bcancel = new Discord.MessageButton().setCustomId('cancel').setLabel('Stop Fishing').setStyle('DANGER');

		//Different Rows needed
		const row = new Discord.MessageActionRow().addComponents(bcatch, bkillscoff, bcancel);
		const row1 = new Discord.MessageActionRow().addComponents(blure, bkillscoff, bcancel);
		const row2 = new Discord.MessageActionRow().addComponents(bcatchoff, bkillsc, bcancel);
		const row3 = new Discord.MessageActionRow().addComponents(blureoff, bkillscoff, bcancel);

    //console.log(row.components)

		//Pond Embed
		let pond = new Discord.MessageEmbed()
			.setTitle('Fishing Pond')
			.setColor(getColor('Pond'))
			.setFooter(getFooter('Pond'))
			.setDescription(
				`Rod: **${rod}**\nSea Creature Chance: \`${sea_creature_chance} α\`\nFishing Speed: \`${rod_speed} 🎣\``
			);
		if (player.data.settings.imgshown == true) {
			pond.setImage('https://cdn.discordapp.com/attachments/871669216703578152/905004300835631174/unknown.png'); //rod in hand
		}

		const menu = await interaction.editReply({
			embeds: [pond],
			components: [row],
		});

		await collection.updateOne(
			{ _id: interaction.user.id },
			{ $set: { 'data.misc.is_fishing': true } },
			{ upsert: true }
		);

		await collection1.updateOne(
			{ _id: interaction.channelId },
			{ $set: { blocked: true, user: interaction.user.id } },
			{ upsert: true }
		);

		const filter = (i) => {
			return i.user.id === interaction.user.id;
		};

		const collector = menu.createMessageComponentCollector({
			filter,
			componentType: 'BUTTON',
			time: 720000,
		});

		collector.on('collect', async (i) => {
      await i.deferUpdate()
			if (player.data.misc.is_mining == true) {
				interaction.followUp({
					content: 'You seem to be mining, cheeky you.',
					ephemeral: true,
				});
				return collector.stop();
			}

			if (i.customId === 'cast' && rod_casted === false) {
				rod_casted = true;
				pond.fields = [];
				pond.addField('\u200b', '<a:wait:847471618272002059> Waiting for something to bite the bait.');
				if (player.data.settings.imgshown == true) {
					pond.setImage(
						'https://cdn.discordapp.com/attachments/871669216703578152/905004413695983636/unknown.png'
					); //rod in water
				}

				await interaction.editReply({ embeds: [pond], components: [row3] });

				await sleep(fishing_time);

				pond.fields = [];
				pond.addField('\u200b', 'Something bit, lure it in!');
				if (player.data.settings.imgshown == true) {
					pond.setImage(
						'https://cdn.discordapp.com/attachments/871669216703578152/905004487725441064/unknown.png'
					); //fish close to rod
				}

				await interaction.editReply({ embeds: [pond], components: [row1] });
			} else if (i.customId === 'lure' && rod_casted === true) {
				let creature = isSeaCreature(sea_creature_chance, isCreature);
				if (creature === 'yes') {
					foundmob = await getSeaCreatureStats(mob, mobs, fishinglvl, mclient);
					mhp = foundmob.hp;
					mdmg = foundmob.dmg;
					pond.fields = [];
					pond.setColor('ORANGE');
					pond.addField(
						`${foundmob.name} caught!`,
						`Player health: ❤️ **${php}**\nMob health: ❤️ **${mhp}**`
					);
					await interaction.editReply({ embeds: [pond], components: [row2] });
					rod_casted = false;
				} else {
					let raredrop = isRareDrop(fishinglvl);
					if (raredrop == 'yes') {
						let coinamounts = [2500, 5000, 7500, 10000, 15000, 20000];
						let coindrop = coinamounts[Math.floor(Math.random() * coinamounts.length)];

						await collection.updateOne(
							{ _id: interaction.user.id },
							{ $inc: { 'data.profile.coins': coindrop } },
							{ upsert: true }
						);

						rod_casted = false;
						pond.fields = [];
						pond.addField(`RARE CATCH!`, `Earned **<:coins:861974605203636253> ${coindrop} coins**`);

						await interaction.editReply({ embeds: [pond], components: [row] });
					} else {
						let fishxp = Math.floor(Math.random() * (200 - 50) + 50);
						let fishes = ['Raw Fish', 'Raw Salmon', 'Pufferfish', 'Clownfish'];
						let fishname = fishes[Math.floor(Math.random() * fishes.length)];
						let fishingcoins = 0;
						if (fishname === 'Raw Fish') {
							fishingcoins = 30;
						} else if (fishname === 'Raw Salmon') {
							fishingcoins = 15;
						} else if (fishname === 'Pufferfish') {
							fishingcoins = 20;
						} else if (fishname === 'Clownfish') {
							fishingcoins = 25;
						}

						rod_casted = false;
						pond.fields = [];
						pond.addField(
							`Caught a ${fishname}`,
							`Earned **${fishxp} XP**!\nSold it for <:coins:861974605203636253> **${fishingcoins} coins**`
						);
						if (player.data.settings.imgshown == true) {
							pond.setImage(
								'https://cdn.discordapp.com/attachments/871669216703578152/905004300835631174/unknown.png'
							); //rod in hand
						}

						await collection.updateOne(
							{ _id: interaction.user.id },
							{
								$inc: {
									'data.skills.fishing': fishxp,
									'data.profile.coins': fishingcoins,
								},
							},
							{ upsert: true }
						);

						await interaction.editReply({ embeds: [pond], components: [row] });
					}
				}
			} else if (i.customId === 'killsc') {
				let crit = isCrit(critchance, critted);
				if (crit === 'yes') {
					pdmg =
						Math.floor((5 + damage) * (1 + strength / 100) * (1 + combatlvl * 0.04)) * (1 + critdmg / 100);
				} else {
					pdmg = Math.floor((5 + damage) * (1 + strength / 100) * (1 + combatlvl * 0.04));
				}

				php = dmgtaken(php, mdmg);
				mhp = dmgdealt(mhp, pdmg);

				if (crit === 'yes') {
					pond.fields = [];
					pond.addField(
						`Battle`,
						`Player health: ❤️ ${php} (- ${mdmg})\nMob health: ❤️ ${mhp} (-<:crit:870306942806020106> ${pdmg})`
					);
				} else {
					pond.fields = [];
					pond.addField(`Battle`, `Player health: ❤️ ${php} (- ${mdmg})\nMob health: ❤️ ${mhp} (- ${pdmg})`);
				}
				await interaction.editReply({ embeds: [pond] });

				if (i.customId === 'killsc' && mhp <= 0) {
					let amount = Math.floor(Math.random() * (3 - 1) + 1);
					let mobdrop = 'Lilypad';
					let special_mobs = ['Nurse Shark', 'Blue Shark', 'Tiger Shark', 'Great White Shark'];
					if (special_mobs.includes(foundmob.name)) {
						mobdrop = 'Shark Fin';
					}
					pond.fields = [];
					pond.setColor('BLUE');
					pond.addField(
						`Result`,
						`You killed the enemy!\nEarned **${foundmob.xp} XP** and **${amount} ${mobdrop}**.`
					);

					php = health;

					player = await collection.findOne({
						_id: interaction.user.id,
					});

					const updatePlayer = await addItems(mobdrop, amount, player);

					await collection.replaceOne({ _id: interaction.user.id }, updatePlayer);

					await collection.updateOne(
						{ _id: interaction.user.id },
						{ $inc: { 'data.skills.fishing': foundmob.xp } }
					);

					await interaction.editReply({ embeds: [pond], components: [row] });
				} else if (i.customId === 'killsc' && php <= 0) {
					pond.fields = [];
					pond.setColor('RED');
					pond.addField(`Result`, `Died to the enemy, which had **❤️ ${mhp}** left.`);
					await interaction.editReply({ embeds: [pond] });
					collector.stop();
				}
			} else if (i.customId === 'cancel') {
				collector.stop();
			}
		});

		collector.on('end', async (collected) => {
			pond.setColor('RED');
			pond.fields = [];
			pond.addField('\u200b', 'Stopped Fishing.');
			await collection.updateOne(
				{ _id: interaction.user.id },
				{ $set: { 'data.misc.is_fishing': false } },
				{ upsert: true }
			);
			await collection1.updateOne({ _id: interaction.channelId }, { $set: { blocked: false } }, { upsert: true });
			try {
				await interaction.editReply({ embeds: [pond], components: [] });
			} catch (e) {}
		});
	},
};

function isSeaCreature(sea_creature_chance, isCreature) {
	let rn = Math.floor(Math.random() * 100) + 1;
	if (rn < sea_creature_chance) {
		isCreature = 'yes';
		return isCreature;
	} else {
		isCreature = 'no';
		return isCreature;
	}
}

async function getSeaCreatureStats(mob, mobs, fishinglvl, mclient) {
	const collection = mmclient.db('SkyblockSim').collection('events');
	let events = await collection.find({}).toArray();
	let shark_event = events.find((event) => event._id == 'shark_fishing');

	let seacreatures = '';
	if (shark_event.enabled) {
		seacreatures = Object.entries(mobs).filter(
			([name, props]) => props.level <= fishinglvl || (props.level <= fishinglvl && props.shark_mob)
		);
	} else {
		seacreatures = Object.entries(mobs).filter(([name, props]) => props.level <= fishinglvl && !props.shark_mob);
	}
	// console.log(seacreatures)

	if (seacreatures === undefined) {
		mob = 'None';
		return mob;
	}
	let mobchoosen = seacreatures[Math.floor(Math.random() * seacreatures.length)];
	mob = mobchoosen[1];
	return mob;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

//Damage Calculations
function dmgtaken(php, mdmg) {
	php -= mdmg;
	return php;
}

function dmgdealt(mhp, pdmg) {
	mhp -= pdmg;
	return mhp;
}

function isCrit(critchance, critted) {
	let hit = Math.floor(Math.random() * 100) + 1;
	if (hit < critchance) {
		critted = 'yes';
		return critted;
	} else {
		critted = 'no';
		return critted;
	}
}

function getFishingTime(rod_speed) {
	if (rod_speed === 0) return 8000;
	if (rod_speed === 10) return 7600;
	if (rod_speed === 20) return 7200;
	if (rod_speed === 30) return 6800;
	if (rod_speed === 40) return 5900;
	if (rod_speed === 50) return 5000;
	if (rod_speed === 60) return 4000;
	if (rod_speed === 70) return 3500;
	if (rod_speed === 75) return 3000;
	if (rod_speed === 100) return 2000;
}

function addItems(mobdrop, amount, player) {
	if (!player.data.inventory.items) player.data.inventory.items = [];

	if (player.data.inventory.items.length === 0) {
		player.data.inventory.items.push({
			name: mobdrop,
			amount: amount,
		});
		return player;
	}

	for (const item of player.data.inventory.items) {
		if (item.name === mobdrop) {
			item.amount += amount;
			return player;
		}
	}

	player.data.inventory.items.push({
		name: mobdrop,
		amount: amount,
	});
	return player;
}

function isRareDrop(fishinglvl) {
	let rn1 = Math.random() * (100 - 1) + 1;
	if (rn1 <= fishinglvl * 0.1) {
		return 'yes';
	} else {
		return 'no';
	}
}
