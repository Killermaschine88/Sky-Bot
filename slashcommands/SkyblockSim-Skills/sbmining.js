const Discord = require('discord.js');
const emoji = require('../../constants/Simulator/Json/emojis.json');
const mobs = require('../../constants/Simulator/Json/mobstats.json');
const getLevel = require('../../constants/Simulator/Functions/skilllvl.js');
const playerStats = require('../../constants/Simulator/Functions/playerStats.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');
const buttonemoji = require('../../constants/Simulator/Json/emojilist.json');
const { addItems } = require('../../constants/Functions/simulator.js')

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
			await interaction.editReply({ embeds: [noprofile] });
			return;
		}

		if (player.data.misc.is_mining === true) {
			const alreadymining = new Discord.MessageEmbed()
				.setTitle('You are already mining')
				.setColor('RED')
				.setFooter(getFooter(player));
			await interaction.editReply({ embeds: [alreadymining] });
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

			return await interaction.editReply({ embeds: [invalidarea] });
		}

		let ps = await playerStats(player);

		let cd = await getCooldown(ps);
		let location = player.data.misc.location;
		

		let embed = new Discord.MessageEmbed()
			.setTitle('Mine')
			.setDescription(
				`Pickaxe: **${player.data.equipment.mining.pickaxe.name}**\nMining Speed: \`${ps.mining_speed} ⸕\`\nMining Fortune: \`${ps.mining_fortune} ☘\``
			)
			.setFooter(getFooter(player))
			.setColor(getColor(player));

		const cancel = new Discord.MessageButton().setCustomId('cancel').setLabel('Stop Mining').setStyle('DANGER');

		let row1 = new Discord.MessageActionRow()
		let row2 = new Discord.MessageActionRow()
    let row3 = new Discord.MessageActionRow()
    let row4 = new Discord.MessageActionRow()
    let row5 = new Discord.MessageActionRow().addComponents(cancel)

    row1 = await addButtons(row1, 1)
    row2 = await addButtons(row2, 2)
    row3 = await addButtons(row3, 3)
    row4 = await addButtons(row4, 4)

		let menu = await interaction.editReply({
			embeds: [embed],
			components: [row1, row2, row3, row4, row5],
		});

		const filter = (i) => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		};

		const collector = menu.createMessageComponentCollector({
			filter,
			componentType: 'BUTTON',
			time: 720000,
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
    let clickamount = 0;
		collector.on('collect', async (i) => {
			if (!validlocations.includes(player.data.misc.location) || player.data.misc.is_fishing == true) {
				interaction.followUp({
					content: 'You seem to be fishing, cheeky you.',
					ephemeral: true,
				});
				return collector.stop();
			}
      if (i.customId == 'cancel') {
				return collector.stop();
			}
      const rowId = i.customId.charAt(0)
      const indexId = i.customId.charAt(1)

      const ore = getOre(player)
      const oreemoji = buttonemoji[ore].id
      const oreamount = getOreAmount(ps)

      if(rowId == 1) row1.components[indexId].emoji.id = oreemoji
      else if(rowId == 2) row2.components[indexId].emoji.id = oreemoji
      else if(rowId == 3) row3.components[indexId].emoji.id = oreemoji
      else if(rowId == 4) row4.components[indexId].emoji.id = oreemoji

      clickamount++

      for(const button of row1.components) {
        button.disabled = true
      }
      for(const button of row2.components) {
        button.disabled = true
      }
      for(const button of row3.components) {
        button.disabled = true
      }
      for(const button of row4.components) {
        button.disabled = true
      }

      embed.fields = [];
			embed.addField('\u200B', `Mined ${oreamount}x ${ore}`);

      player = await collection.findOne({ _id: interaction.user.id });
      const updatePlayer = addItems(ore, oreamount, player);

			await collection.replaceOne({ _id: interaction.user.id }, updatePlayer);

      const xp = getXP(ore) * oreamount

      await collection.updateOne(
        { _id: interaction.user.id },
        { $inc: { 'data.skills.mining': xp }},
        { upsert: true }
      )
      
      await interaction.editReply({embeds: [embed], components: [row1, row2, row3, row4, row5]})

      await sleep(getCooldown(ps))

      if(rowId == 1) row1.components[indexId].emoji.id = '902991050686226433'
      else if(rowId == 2) row2.components[indexId].emoji.id = '902991050686226433'
      else if(rowId == 3) row3.components[indexId].emoji.id = '902991050686226433'
      else if(rowId == 4) row4.components[indexId].emoji.id = '902991050686226433'

      for(const button of row1.components) {
        if(button.emoji.id == '902991050686226433') continue;
        button.disabled = false
      }
      for(const button of row2.components) {
        if(button.emoji.id == '902991050686226433') continue;
        button.disabled = false
      }
      for(const button of row3.components) {
        if(button.emoji.id == '902991050686226433') continue;
        button.disabled = false
      }
      for(const button of row4.components) {
        if(button.emoji.id == '902991050686226433') continue;
        button.disabled = false
      }

      embed.fields = []
      if(clickamount >= 20) {
        clickamount = 0;
        row1 = await addButtons(row1, 1)
        row2 = await addButtons(row2, 2)
        row3 = await addButtons(row3, 3)
        row4 = await addButtons(row4, 4)
      }

      await interaction.editReply({embeds: [embed], components: [row1, row2, row3, row4, row5]})
		});

		//Collector End
		collector.on('end', async (collected) => {
			embed.setColor('RED');
			embed.fields = [];
			embed.addField('\u200b', 'Stopped mining.');
			await collection.updateOne(
				{ _id: interaction.user.id },
				{ $set: { 'data.misc.is_mining': false } },
				{ upsert: true }
			);
			await collection1.updateOne({ _id: interaction.channelId }, { $set: { blocked: false } }, { upsert: true });
			await interaction.editReply({ embeds: [embed], components: [] });
		});
	},
};

function sleep(ms) {
	return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

function getOre(player) {
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

  let randore = ores[Math.floor(Math.random() * ores.length)];

	return randore
}

function getCooldown(ps) {
	if (ps.mining_speed <= 10) {
		return 2200;
	} else if (ps.mining_speed <= 20) {
		return 2000;
	} else if (ps.mining_speed <= 30) {
		return 1900;
	} else if (ps.mining_speed <= 40) {
		return 1800;
	} else if (ps.mining_speed <= 50) {
		return 1700;
	} else if (ps.mining_speed <= 60) {
		return 1600;
	} else if (ps.mining_speed <= 70) {
		return 1500;
	} else if (ps.mining_speed <= 80) {
		return 1400;
	} else if (ps.mining_speed <= 90) {
		return 1300;
	} else if (ps.mining_speed <= 100) {
		return 1200;
	} else {
    return 1200;
  }
}

let i = 0;
//function to add discord messagebuttons to a row with randomly generated ore based off an provided array
function addButtons(row, index) {
  row.components = []
while(row.components.length < 5) {
    row.components.push(
    new Discord.MessageButton()
      .setCustomId(`${index}${i}`)
      .setEmoji('876209923875303424')
      .setStyle('SECONDARY'),
      )
      i++;
    }
	i = 0;
	return row;
}

function getOreAmount(ps) {
  let amount = 1
  let rn = Math.floor(Math.random() * (50 - 1) + 1);

  amount += Math.floor(ps.mining_fortune / 50)

  if(rn <= Math.floor(ps.mining_fortune % 50)) {
    amount += 1
  }
  return amount
}
// bedrock id 902991050686226433

function getXP(ore) {
  if(ore == 'Cobblestone') return 1
  else if(ore == 'Coal') return 3
  else if(ore == 'Iron Ingot') return 4
  else if(ore == 'Gold Ingot') return 6
  else if(ore == 'Lapis Lazuli') return 8
  else if(ore == 'Redstone') return 10
  else if(ore == 'Emerald') return 12
  else if(ore == 'Diamond') return 14
  else if(ore == 'Obsidian') return 16
  else if(ore == 'Hardstone') return 18
  else if(ore == 'Mithril') return 20
  else if(ore == 'Titanium') return 22
  else if(ore == 'Gemstone') return 25
  else return 5
}