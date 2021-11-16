const Discord = require('discord.js');
const emoji = require('../../constants/Simulator/Json/emojis.json');
const mobs = require('../../constants/Simulator/Json/mobstats.json');
const getLevel = require('../../constants/Simulator/Functions/skilllvl.js');
const playerStats = require('../../constants/Simulator/Functions/playerStats.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');

module.exports = {
	name: 'sbmining',
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
			interaction.editReply({ embeds: [noprofile] });
			return;
		}

		if (player.data.misc.is_mining === true) {
			const alreadymining = new Discord.MessageEmbed()
				.setTitle('You are already mining')
				.setColor('RED')
				.setFooter(getFooter(player));
			interaction.editReply({ embeds: [alreadymining] });
			return;
		}

		var validlocations = [
			'Coal Mine',
			'Gold Mine',
			'Gunpowder Mines',
			'Lapis Quarry',
			"Pigman's Den",
			'Slimehill',
			'Diamond Reserve',
			'Obsidian Sanctuary',
			'Dwarven Mines',
			'Crystal Hollows',
		];
		if (!validlocations.includes(player.data.misc.location)) {
			const invalidarea = new Discord.MessageEmbed()
				.setTitle('Not at a mining area')
				.setDescription('You are not at a valid mining area, please choose one from /sb warp')
				.setColor('RED')
				.setFooter(getFooter(player));

			return interaction.editReply({ embeds: [invalidarea] });
		}

		let ps = await playerStats(player);

		let cd = await getCooldown(ps);
		let location = player.data.misc.location;
		let ore = {
			name: 'Cobblestone',
			img: 'https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/a/a2/Bruchstein.png',
		};

		let embed = new Discord.MessageEmbed()
			.setTitle('Mine')
			.setDescription(
				`Pickaxe: **${player.data.equipment.mining.pickaxe.name}**\nMining speed: \`${ps.mining_speed} ⸕\`\nMining fortune: \`${ps.mining_fortune} ☘\``
			)

			.setFooter(getFooter(player))
			.setColor(getColor(player));

		const cancel = new Discord.MessageButton().setCustomId('cancel').setLabel('Stop Mining').setStyle('DANGER');

		const mine = new Discord.MessageButton()
			.setCustomId('mine')
			.setEmoji('852069714577719306')
			.setLabel('Mine Ore')
			.setStyle('PRIMARY');

		const mineoff = new Discord.MessageButton()
			.setCustomId('mineoff')
			.setEmoji('852069714577719306')
			.setLabel('Mine Ore')
			.setStyle('PRIMARY')
			.setDisabled(true);

		const row = new Discord.MessageActionRow().addComponents(mine, cancel);
		const row1 = new Discord.MessageActionRow().addComponents(mineoff, cancel);

		let menu = await interaction.editReply({
			embeds: [embed],
			components: [row],
		});

		const filter = (i) => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		};

		const collector = menu.createMessageComponentCollector({
			filter,
			componentType: 'BUTTON',
			time: 858000,
			idle: 60000,
		});

		await collection.updateOne(
			{ _id: interaction.user.id },
			{ $set: { 'data.misc.is_mining': true } },
			{ upsert: true }
		);

		await collection1.updateOne(
			{ _id: interaction.channelId },
			{ $set: { blocked: true, user: interaction.user.id } },
			{ upsert: true }
		);

		//Collector
		collector.on('collect', async (i) => {
			if (!validlocations.includes(player.data.misc.location) || player.data.misc.is_fishing == true) {
				interaction.followUp({
					content: 'You seem to be fishing, cheeky you.',
					ephemeral: true,
				});
				return collector.stop();
			}

			if (i.customId == 'mine') {
				let ore = getOre(player, ps);
				if (player.data.settings.imgshown == true) {
					embed.setImage(ore.img);
				}
				embed.fields = [];
				embed.addField('\u200B', `Mined **${ore.amount}x ${ore.name}** at the **${location}**`);

				interaction.editReply({ embeds: [embed], components: [row1] });

				await sleep(cd);

				player = await collection.findOne({ _id: interaction.user.id });

				const updatePlayer = await addItems(ore, player);

				await collection.replaceOne({ _id: interaction.user.id }, updatePlayer);

				await collection.updateOne(
					{ _id: interaction.user.id },
					{ $inc: { 'data.skills.mining': ore.xp * ore.amount } },
					{ upsert: true }
				);

				interaction.editReply({ embeds: [embed], components: [row] });
			} else if (i.customId == 'cancel') {
				collector.stop();
			}
		});

		//Collector End
		collector.on('end', async (collected) => {
			embed.setColor('RED');
			embed.fields = [];
			embed.addField('\u200b', 'Stopped mining.');
			embed.setImage('');
			await collection.updateOne(
				{ _id: interaction.user.id },
				{ $set: { 'data.misc.is_mining': false } },
				{ upsert: true }
			);
			await collection1.updateOne({ _id: interaction.channelId }, { $set: { blocked: false } }, { upsert: true });
			menu.edit({ embeds: [embed], components: [] });
		});
	},
};

function sleep(ms) {
	return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

function addItems(ore, player) {
	if (!player.data.inventory.items) player.data.inventory.items = [];

	if (player.data.inventory.items.length === 0) {
		player.data.inventory.items.push({
			name: ore.name,
			amount: ore.amount,
		});
		return player;
	}

	for (const item of player.data.inventory.items) {
		if (item.name === ore.name) {
			item.amount += ore.amount;
			return player;
		}
	}

	player.data.inventory.items.push({
		name: ore.name,
		amount: ore.amount,
	});
	return player;
}

function getOre(player, ps) {
	let location = player.data.misc.location;
	let ores = '';
	let name = '';
	let img = '';
	let amount = 1;

	//Get valid ores for area
	if (location == 'Coal Mine') {
		ores = ['Cobblestone', 'Coal'];
	} else if (location == 'Gold Mine') {
		ores = ['Cobblestone', 'Coal', 'Iron Ingot', 'Gold Ingot'];
	} else if (location == 'Gunpowder Mines') {
		ores = ['Cobblestone', 'Coal', 'Iron Ingot', 'Gold Ingot'];
	} else if (location == 'Lapis Quarry') {
		ores = ['Cobblestone', 'Lapis Lazuli'];
	} else if (location == "Pigman's Den") {
		ores = ['Cobblestone', 'Redstone'];
	} else if (location == 'Slimehill') {
		ores = ['Cobblestone', 'Emerald'];
	} else if (location == 'Diamond Reserve') {
		ores = ['Cobblestone', 'Diamond'];
	} else if (location == 'Obsidian Sanctuary') {
		ores = ['Cobblestone', 'Diamond', 'Obsidian'];
	} else if (location == 'Dwarven Mines') {
		ores = [
			'Cobblestone',
			'Coal',
			'Iron Ingot',
			'Gold Ingot',
			'Lapis Lazuli',
			'Redstone',
			'Emerald',
			'Diamond',
			'Mithril',
		];
	} else if (location == 'Crystal Hollows') {
		ores = [
			'Hardstone',
			'Coal',
			'Iron Ingot',
			'Gold Ingot',
			'Lapis Lazuli',
			'Redstone',
			'Emerald',
			'Diamond',
			'Mithril',
			'Titanium',
			'Gemstone',
		];
	}

	//Generate Random Ore
	let randore = ores[Math.floor(Math.random() * ores.length)];

	//Decide whats choosen
	if (randore == 'Cobblestone') {
		name = 'Cobblestone';
		img = 'https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/a/a2/Bruchstein.png';
		xp = 3;
	} else if (randore == 'Coal') {
		name = 'Coal';
		img = 'https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/c/c1/Kohle.png';
		xp = 5;
	} else if (randore == 'Iron Ingot') {
		name = 'Iron Ingot';
		img = 'https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/2/24/Eisenbarren.png';
		xp = 7;
	} else if (randore == 'Gold Ingot') {
		name = 'Gold Ingot';
		img = 'https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/9/93/Goldbarren.png';
		xp = 10;
	} else if (randore == 'Lapis Lazuli') {
		name = 'Lapis Lazuli';
		img = 'https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/8/81/Lapislazuli.png';
		xp = 15;
	} else if (randore == 'Redstone') {
		name = 'Redstone';
		img = 'https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/2/20/Redstone-Staub.png';
		xp = 20;
	} else if (randore == 'Emerald') {
		name = 'Emerald';
		img = 'https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/c/c5/Smaragd.png';
		xp = 25;
	} else if (randore == 'Diamond') {
		name = 'Diamond';
		img = 'https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/6/64/Diamant.png';
		xp = 30;
	} else if (randore == 'Obsidian') {
		name = 'Obsidian';
		img = 'https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/2/24/Obsidian.png';
		xp = 35;
	} else if (randore == 'Mithril') {
		name = 'Mithril';
		img = 'https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/0/0c/Prismarinkristalle.png';
		xp = 30;
	} else if (randore == 'Hardstone') {
		name = 'Hardstone';
		img = 'https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/4/45/Stein.png';
		xp = 10;
	} else if (randore == 'Gemstone') {
		name = 'Gemstone';
		img = 'https://static.wikia.nocookie.net/hypixel-skyblock/images/8/8d/Rough_Ruby_Gemstone.png';
		xp = 40;
	} else if (randore == 'Titanium') {
		name = 'Titanium';
		img = 'https://static.wikia.nocookie.net/hypixel-skyblock/images/c/cc/Titanium.png';
		xp = 35;
	}

  let rn = Math.floor(Math.random() * (50 - 1) + 1);

  amount += Math.floor(ps.mining_fortune / 50)

  if(rn <= Math.floor(ps.mining_fortune % 50)) {
    amount += 1
  }

	//return data
	return {
		name: name,
		img: img,
		amount: amount,
		xp: xp,
	};
}

async function getCooldown(ps) {
	if (ps.mining_speed <= 10) {
		return 2000;
	} else if (ps.mining_speed <= 20) {
		return 1900;
	} else if (ps.mining_speed <= 30) {
		return 1700;
	} else if (ps.mining_speed <= 40) {
		return 1600;
	} else if (ps.mining_speed <= 50) {
		return 1500;
	} else if (ps.mining_speed <= 60) {
		return 1400;
	} else if (ps.mining_speed <= 70) {
		return 1300;
	} else if (ps.mining_speed <= 80) {
		return 1200;
	} else if (ps.mining_speed <= 90) {
		return 1100;
	} else if (ps.mining_speed <= 100) {
		return 1000;
	}
}
