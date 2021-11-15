const Discord = require('discord.js');
const prefix = require('@replit/database');
const prefixx = new prefix();
const emoji = '';
const mobs = '';
const getLevel = '';

module.exports = {
	name: 'Sbfishing',
	description: 'Earn Fishing XP',
	usage: 'sbfishing',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['fishing', 'fish'],
	cooldown: 20,
	async execute(client, message, args, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: message.author.id });

		var gprefix = await prefixx.get(message.guild.id, { raw: false });
		if (gprefix === null) gprefix = '.';

		if (player === null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No Profile found')
				.setDescription(`Create a Profile using \`${gprefix}sbstart\` or \`${gprefix}sbcreate\``);
			message.channel.send({ embeds: [noprofile] });
			return;
		}

		/*if (player.data.misc.is_fishing === true) {
      const alreadyfishing = new Discord.MessageEmbed()
        .setTitle('You are already Fishing somewhere so i can\'t create another Pond for you')
        .setColor('RED')
        .setFooter('Skyblock Simulator')
      message.channel.send({ embeds: [alreadyfishing] })
      return;
    }*/

		//Values needed
		let fishinglvl = getLevel(player.data.skills.fishing).level;
		let rod = player.data.equipment.fishing.rod.name;
		let rod_speed = player.data.equipment.fishing.rod.fishing_speed;
		let sea_creature_chance =
			player.data.stats.sea_creature_chance +
			player.data.equipment.fishing.rod.sea_creature_chance +
			player.data.equipment.fishing.armor.sea_creature_chance +
			fishinglvl / 2;
		let isCreature = '';
		let mob = '';
		let rod_casted = false;
		let creature_caught = false;
		let foundmob = '';
		let fishing_time = getFishingTime(rod_speed);

		//Fight Values
		let health = player.data.stats.health;
		let php = health;
		let damage = player.data.stats.damage;
		let strength = player.data.stats.strength;
		let combatlvl = getLevel(player.data.skills.combat).level;
		let critchance = player.data.stats.crit_chance;
		let critdmg = player.data.stats.crit_damage;
		let critted = '';
		let pdmg = '';
		let mhp = '';
		let mdmg = '';

		//Logging
		console.log(fishing_time);

		//Buttons for Catching Fish
		const bcatch = new Discord.MessageButton().setCustomId('cast').setLabel('Cast Rod').setStyle('PRIMARY');

		const blure = new Discord.MessageButton().setCustomId('lure').setLabel('Lure Rod').setStyle('PRIMARY');

		const bcatchoff = new Discord.MessageButton()
			.setCustomId('a')
			.setLabel('Cast Rod')
			.setStyle('PRIMARY')
			.setDisabled(true);

		const blureoff = new Discord.MessageButton()
			.setCustomId('aaaa')
			.setLabel('Lure Rod')
			.setStyle('PRIMARY')
			.setDisabled(true);

		//Buttons for Killing Sea Creatures
		const bkillsc = new Discord.MessageButton()
			.setCustomId('killsc')
			.setLabel('Kill Sea Creature')
			.setStyle('PRIMARY');

		const bkillscoff = new Discord.MessageButton()
			.setCustomId('aa')
			.setLabel('Kill Sea Creature')
			.setStyle('PRIMARY')
			.setDisabled(true);

		//Stop Button
		const bcancel = new Discord.MessageButton().setCustomId('cancel').setLabel('Stop Fishing').setStyle('DANGER');

		//Different Rows needed
		const row = new Discord.MessageActionRow().addComponents(bcatch, bkillscoff, bcancel);
		const row1 = new Discord.MessageActionRow().addComponents(blure, bkillscoff, bcancel);
		const row2 = new Discord.MessageActionRow().addComponents(bcatchoff, bkillsc, bcancel);
		const row3 = new Discord.MessageActionRow().addComponents(blureoff, bkillscoff, bcancel);

		//Pond Embed
		let pond = new Discord.MessageEmbed()
			.setTitle('Fishing Pond')
			.setColor('BLUE')
			.setFooter('Skyblock Simulator')
			.setDescription(
				`${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}\n${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}\n${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}\n${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}\n${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}\n${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}\n${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}\n${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}\n${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}${emoji.water}\n`
			);

		const menu = await message.channel.send({
			embeds: [pond],
			components: [row],
		});

		await collection.updateOne(
			{ _id: message.author.id },
			{ $set: { 'data.misc.is_fishing': true } },
			{ upsert: true }
		);

		const filter = (i) => {
			i.deferUpdate();
			return i.user.id === message.author.id;
		};

		const collector = menu.createMessageComponentCollector({
			filter,
			componentType: 'BUTTON',
			time: 1000000,
		});

		collector.on('collect', async (i) => {
			if (i.customId === 'cast' && rod_casted === false) {
				rod_casted = true;
				pond.fields = [];
				pond.addField('\u200b', '<a:wait:847471618272002059> Waiting for something to bite the Bait.');

				menu.edit({ embeds: [pond], components: [row3] });

				await sleep(fishing_time);

				pond.fields = [];
				pond.addField('\u200b', 'Something bit the Bait, lure it in.');

				menu.edit({ embeds: [pond], components: [row1] });
			} else if (i.customId === 'lure' && rod_casted === true) {
				let creature = isSeaCreature(sea_creature_chance, isCreature);
				if (creature === 'yes') {
					foundmob = getSeaCreatureStats(mob, mobs, fishinglvl);
					mhp = foundmob.hp;
					mdmg = foundmob.dmg;
					pond.fields = [];
					pond.setColor('ORANGE');
					pond.addField(`${foundmob.name} caught!`, `Player Health: ❤️ ${php}\nMob Health: ❤️ ${mhp}`);
					menu.edit({ embeds: [pond], components: [row2] });
					rod_casted = false;
				} else {
					rod_casted = false;
					pond.fields = [];
					pond.addField(`Fish caught`, `earned 50 Fishing XP`);

					await collection.updateOne(
						{ _id: message.author.id },
						{ $inc: { 'data.skills.fishing': 50 } },
						{ upsert: true }
					);

					menu.edit({ embeds: [pond], components: [row] });
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
						`Player Health: ❤️ ${php} (- ${mdmg})\nMob Health: ❤️ ${mhp} (-<:crit:870306942806020106> ${pdmg})`
					);
				} else {
					pond.fields = [];
					pond.addField(`Battle`, `Player Health: ❤️ ${php} (- ${mdmg})\nMob Health: ❤️ ${mhp} (- ${pdmg})`);
				}
				menu.edit({ embeds: [pond] });

				if (i.customId === 'killsc' && mhp <= 0) {
					pond.fields = [];
					pond.setColor('BLUE');
					pond.addField(
						`Result`,
						`Killed the Enemy with **❤️ ${php}** left and earned ${foundmob.xp} Fishing XP.`
					);
					await collection.updateOne(
						{ _id: message.author.id },
						{ $inc: { 'data.skills.fishing': foundmob.xp } },
						{ upsert: true }
					);
					php = health;

					menu.edit({ embeds: [pond], components: [row] });
				} else if (i.customId === 'killsc' && php <= 0) {
					pond.fields = [];
					pond.setColor('RED');
					pond.addField(`Result`, `Died to the Enemy which had **❤️ ${mhp}** left.`);
					menu.edit({ embeds: [pond] });
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
				{ _id: message.author.id },
				{ $set: { 'data.misc.is_fishing': false } },
				{ upsert: true }
			);
			menu.edit({ embeds: [pond], components: [] });
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

function getSeaCreatureStats(mob, mobs, fishinglvl) {
	let seacreatures = Object.entries(mobs).filter(([name, props]) => props.level <= fishinglvl);
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
	if (rod_speed === 75) return 3200;
	if (rod_speed === 100) return 2000;
}
