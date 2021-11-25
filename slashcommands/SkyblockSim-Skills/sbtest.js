const Discord = require('discord.js');
const emoji = require('../../constants/Simulator/Json/emojis.json');
const mobs = require('../../constants/Simulator/Json/mobstats.json');
const getLevel = require('../../constants/Simulator/Functions/skilllvl.js');
const playerStats = require('../../constants/Simulator/Functions/playerStats.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');

module.exports = {
	name: 'sbtest',
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
		

		let embed = new Discord.MessageEmbed()
			.setTitle('Mine')
			.setDescription(
				`Pickaxe: **${player.data.equipment.mining.pickaxe.name}**\nMining speed: \`${ps.mining_speed} ⸕\`\nMining fortune: \`${ps.mining_fortune} ☘\``
			)
			.setFooter(getFooter(player))
			.setColor(getColor(player));

		const cancel = new Discord.MessageButton().setCustomId('cancel').setLabel('Stop Mining').setStyle('DANGER');

    const ores = getOreArray(player)

		let row1 = new Discord.MessageActionRow()
		let row2 = new Discord.MessageActionRow()
    let row3 = new Discord.MessageActionRow()
    let row4 = new Discord.MessageActionRow()

    row1 = addButtons(row, ores, 1)

		let menu = await interaction.editReply({
			embeds: [embed],
			components: [row1],
		});

    return

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
			interaction.editReply({ embeds: [embed], components: [] });
		});
	},
};

function sleep(ms) {
	return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

function getOreArray(player) {
	let location = player.data.misc.location;
	let ores;

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
      'Titanium',
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
	return ores
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
	} else {
    return 1000;
  }
}

let i = 0;
//function to add discord messagebuttons to a row with randomly generated ore based off an provided array
function addButtons(row, ores, index) {
//choose random ore from ores array
let randore = ores[Math.floor(Math.random() * ores.length)];
//add button to row
while(row.length < 5) {
row.addComponents(
	new Discord.MessageButton()
		.setCustomId(`${index}${i}`)
		.setLabel(`${randore}`)
		.setStyle('PRIMARY'),
		)
		i++;
	}
	i = 0;
	return row;
}