const Discord = require('discord.js');
const prefix = require('@replit/database');
const prefixx = new prefix();

module.exports = {
	name: 'Sbdragon',
	description: 'Slay Dragons',
	usage: 'sbdragon',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['sbd'],
	cooldown: 30,
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

		if (player.data.skills.combat < 15000) {
			const noentry = new Discord.MessageEmbed()
				.setTitle('Missing Requirements')
				.setColor('RED')
				.setDescription(
					`You don\'t fit the Requirements needed to enter **The End**.\n\nCombat XP needed: **15000**\nYour Combat XP: **${
						player.data.skills.combat
					}**\nMissing Combat XP: **${15000 - player.data.skills.combat}**`
				);
			message.channel.send({ embeds: [noentry] });
			return;
		}

		let inv = player.data.inventory.items;
		const eyes = inv.find((item) => item.name === 'Summoning Eye');

		if (eyes === undefined || eyes.amount < 2) {
			const noeyes = new Discord.MessageEmbed()
				.setTitle('Not enough Summoning Eyes')
				.setColor('RED')
				.setDescription(
					`You don\'t have enough Summoning Eyes to fight a Dragon.\nYou need atleast **2 Summoning Eyes** to fight a Dragon\nTo get **Summoning Eyes** use ${gprefix}sbwarp Area Dragon\'s Nest to farm them`
				);

			message.channel.send({ embeds: [noeyes] });
			return;
		}

		const start = new Discord.MessageEmbed()
			.setDescription('<a:wait:847471618272002059> Placing Eyes to Summon the Dragon')
			.setColor('PURPLE')
			.setFooter('Skyblock Simulator');

		const menu = await message.channel.send({ embeds: [start] });

		await sleep(3000);

		//Drop Calculations
		let rn = Math.floor(Math.random() * (15 - 1) + 1);

		let helmrn = Math.floor(Math.random() * (10 - 1) + 1);
		let cprn = Math.floor(Math.random() * (15 - 1) + 1);
		let legsrn = Math.floor(Math.random() * (10 - 1) + 1);
		let bootsrn = Math.floor(Math.random() * (10 - 1) + 1);
		let fragsamount = Math.floor(Math.random() * (15 - 3) + 3);

		//Dragon Name Decision
		let dragonnames = ['Protector', 'Old', 'Wise', 'Unstable', 'Young', 'Strong', 'Superior'];
		let dragname = dragonnames[Math.floor(Math.random() * dragonnames.length)];
		let loot = '';

		const spawned = new Discord.MessageEmbed()
			.setDescription(`<:berserker:852079613052059658> **${dragname} Dragon** has spawned!`)
			.setColor('PURPLE')
			.setFooter('Skyblock Simulator');

		menu.edit({ embeds: [spawned] });

		await sleep(5000);

		//Drag Pet Drop
		let dragonpetrn = Math.floor(Math.random() * (50000 - 1) + 1);
		let dragrn = Math.floor(Math.random() * (50000 - 1) + 1);

		if (helmrn === rn) loot = 'Helmet';
		else if (cprn === rn) loot = 'Chestplate';
		else if (legsrn === rn) loot = 'Leggings';
		else if (bootsrn === rn) loot = 'Boots';
		else loot = 'Fragments';

		//Dragon Earned Calc
		let helm = 200000;
		let chest = 500000;
		let legs = 350000;
		let boots = 200000;
		let frags = 10000;
		let price = 0;

		if (loot === 'Helmet') price = helm;
		else if (loot === 'Chestplate') price = chest;
		else if (loot === 'Leggings') price = legs;
		else if (loot === 'Boots') price = boots;
		else price = frags * fragsamount;

		let multi = 1;

		if (dragname === 'Protector') multi = 1;
		else if (dragname === 'Old') multi = 1;
		else if (dragname === 'Wise') multi = 2;
		else if (dragname === 'Unstable') multi = 1.5;
		else if (dragname === 'Young') multi = 1.5;
		else if (dragname === 'Strong') multi = 2.5;
		else if (dragname === 'Superior') multi = 4;

		let earned = price * multi;

		let amount = 2;
		let dropped = 'Summoning Eye';

		const updatePlayer = addItem(dropped, amount, player);

		await collection.replaceOne({ _id: message.author.id }, updatePlayer);

		await collection.updateOne(
			{ _id: message.author.id },
			{ $inc: { 'data.profile.coins': earned } },
			{ upsert: true }
		);

		const end = new Discord.MessageEmbed();
		if (player.data.settings.imgshown === true) {
			end.setImage('https://cdn.discordapp.com/attachments/850847486826643516/866566391125508106/latest.webp');
		}
		end.setTitle('Dragon Loot')
			.setColor('PURPLE')
			.setFooter('Skyblock Simulator\nThis is purely cosmetic as of now will change in the Future');
		if (loot === 'Fragments') {
			end.setDescription(
				`You killed an **${dragname} Dragon** which dropped you **${fragsamount}x ${loot}** earning you **<:coins:861974605203636253> ${earned} Coins**`
			);
		} else {
			end.setDescription(
				`You killed an **${dragname} Dragon** which dropped you **${loot}** earning you **<:coins:861974605203636253> ${earned} Coins**`
			);
		}

		if (dragonpetrn === dragrn) {
			end.addField('\u200b', '**DRAGON PET DROP**');
		}

		menu.edit({ embeds: [end] });
	},
};

function sleep(ms) {
	return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

function addItem(dropped, amount, player) {
	if (!player.data.inventory.items) player.data.inventory.items = [];

	if (player.data.inventory.items.length === 0) {
		player.data.inventory.items.push({
			name: dropped,
			amount: amount,
		});
		return player;
	}

	for (const item of player.data.inventory.items) {
		if (item.name === dropped) {
			item.amount -= amount;
			return player;
		}
	}

	player.data.inventory.items.push({
		name: dropped,
		amount: amount,
	});
	return player;
}
