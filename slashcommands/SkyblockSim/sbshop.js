const Discord = require('discord.js');
const dungloot = require('../../constants/Simulator/Json/dungeonloot.json');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');

module.exports = {
	name: 'sbshop',
	description: 'Shows Skyblock Simulator leaderboard',
	usage: 'sblb',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: [],
	cooldown: 5,
	async execute(interaction, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: interaction.user.id });

		if (player === null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			interaction.editReply({ embeds: [noprofile] });
			return;
		}

		let rod = {
			name: player.data.equipment.fishing.rod.name,
			sea_creature_chance: player.data.equipment.fishing.rod.sea_creature_chance,
			fishing_speed: player.data.equipment.fishing.rod.fishing_speed,
		};

		let rodtier = '';
		let rodspeed = '';
		let rodscc = '';
		let rodname = '';
		let coins = player.data.profile.coins;
		let cost = '';
		let amount = '';
		let gemsneeded = 0;
		let sellitem = 'Lilypad';
		let lilyamount = 0;

		let swordinv = player.data.inventory.sword;
		let armorinv = player.data.inventory.armor;
		let swordcost = '';
		let armorcost = '';

		let choosen = '';
		let choosen2 = '';

		if (player.data.inventory.items.find((item) => item.name == 'Lilypad') != undefined) {
			lilyamount = player.data.inventory.items.find((item) => item.name == 'Lilypad').amount;
		}

		//Buttons
		const rod_button = new Discord.MessageButton()
			.setCustomId('rod')
      .setEmoji('852069714359877643')
			.setLabel('Fishing Rod')
			.setStyle('PRIMARY')
			.setDisabled(true);

		const cookie_button = new Discord.MessageButton()
			.setCustomId('cookie')
      .setEmoji('🍪')
			.setLabel('Booster Cookie')
			.setStyle('PRIMARY')
			.setDisabled(true);

		const sword_button = new Discord.MessageButton()
			.setCustomId('sword')
      .setEmoji('852079613052059658')
			.setLabel('Sword')
			.setStyle('PRIMARY')
			.setDisabled(true);

		const armor_button = new Discord.MessageButton()
			.setCustomId('armor')
      .setEmoji('852079613051666472')
			.setLabel('Armor')
			.setStyle('PRIMARY')
			.setDisabled(true);

    const pickaxe_button = new Discord.MessageButton()
      .setCustomId('pickaxe')
      .setEmoji('852069714577719306')
			.setLabel('Pickaxe')
			.setStyle('PRIMARY')
			.setDisabled(true);

		const cancel_button = new Discord.MessageButton().setCustomId('cancel').setLabel('Cancel').setStyle('DANGER');

		const row = new Discord.MessageActionRow();
		const row2 = new Discord.MessageActionRow();

		//Rod Upgrades
		if (rod.name == 'Fishing Rod' && coins >= 5000 && lilyamount >= 10) {
			rod_button.setDisabled(false);
			rodname = 'Prismarine Rod';
			rodscc = 5;
			rodspeed = 10;

			cost = 5000;
			amount = 10;
		} else if (rod.name == 'Prismarine Rod' && coins >= 25000 && lilyamount >= 20) {
			rod_button.setDisabled(false);
			rodname = 'Sponge Rod';
			rodscc = 10;
			rodspeed = 20;

			cost = 25000;
			amount = 20;
		} else if (rod.name == 'Sponge Rod' && coins >= 50000 && lilyamount >= 30) {
			rod_button.setDisabled(false);
			rodname = 'Speedster Rod';
			rodscc = 15;
			rodspeed = 30;

			cost = 50000;
			amount = 30;
		} else if (rod.name == 'Speedster Rod' && coins >= 100000 && lilyamount >= 50) {
			rod_button.setDisabled(false);
			rodname = "Farmer's Rod";
			rodscc = 20;
			rodspeed = 40;

			cost = 100000;
			amount = 50;
		} else if (rod.name == "Farmer's Rod" && coins >= 250000 && lilyamount >= 75) {
			rod_button.setDisabled(false);
			rodname = 'Challenging Rod';
			rodscc = 25;
			rodspeed = 50;

			cost = 250000;
			amount = 75;
		} else if (rod.name == 'Challenging Rod' && coins >= 500000 && lilyamount >= 100) {
			rod_button.setDisabled(false);
			rodname = 'Rod of Champions';
			rodscc = 30;
			rodspeed = 60;

			cost = 500000;
			amount = 100;
		} else if (rod.name == 'Rod of Champions' && coins >= 1000000 && lilyamount >= 150) {
			rod_button.setDisabled(false);
			rodname = 'Rod of Legends';
			rodscc = 40;
			rodspeed = 70;

			cost = 1000000;
			amount = 150;
		} else if (rod.name == 'Rod of Legends' && player.data.profile.gems >= 50 && lilyamount >= 250) {
			rod_button.setDisabled(false);
			rodname = 'Rod of the Sea';
			rodscc = 50;
			rodspeed = 75;

			gemsneeded = 50;
			amount = 250;
		}

    //Pickaxes
    let pick = player.data.equipment.mining.pickaxe.name
    let inv = player.data.inventory.items
    let pcoin = player.data.profile.coins
    let pickname = ''
    let pickfortune = 0
    let pickspeed = 0
    let pickcoins = 0
    let pickgems = 0
    let itemname = ''
    let itemamount = 0

    if(pick == 'Wood Pickaxe' && inv.find(item => item?.name == 'Cobblestone' && item?.amount >= 20) && pcoin >= 10000) {
      pickaxe_button.setDisabled(false)
      pickname = 'Stone Pickaxe'
      pickspeed = 15
      pickfortune = 20
      pickcoins = 10000
      itemname = 'Cobblestone'
      itemamount = 20
      
    } else if(pick == 'Stone Pickaxe' && inv.find(item => item?.name == 'Iron Ingot' && item?.amount >= 25) && pcoin >= 50000) {
      pickaxe_button.setDisabled(false)
      pickname = 'Iron Pickaxe'
      pickspeed = 30
      pickfortune = 40
      pickcoins = 50000
      itemname = 'Iron Ingot'
      itemamount = 25

    } else if(pick == 'Iron Pickaxe' && inv.find(item => item?.name == 'Mithril' && item?.amount >= 30) && pcoin >= 90000) {
      pickaxe_button.setDisabled(false)
      pickname = 'Mithril Pickaxe'
      pickspeed = 45
      pickfortune = 80
      pickcoins = 90000
      itemname = 'Mithril'
      itemamount = 30
      
    } else if(pick == 'Mithril Pickaxe' && inv.find(item => item?.name == 'Titanium' && item?.amount >= 40) && pcoin >= 125000) {
      pickaxe_button.setDisabled(false)
      pickname = 'Titanium Pickaxe'
      pickspeed = 60
      pickfortune = 100
      pickcoins = 125000
      itemname = 'Titanium'
      itemamount = 40
      
    } else if(pick == 'Titanium Pickaxe' && inv.find(item => item?.name == 'Gold Ingot' && item?.amount >= 80) && pcoin >= 250000) {
      pickaxe_button.setDisabled(false)
      pickname = 'Stonk'
      pickspeed = 75
      pickfortune = 140
      pickcoins = 250000
      itemname = 'Gold Ingot'
      itemamount = 80
      
    } else if(pick == 'Stonk' && inv.find(item => item?.name == 'Gemstone' && item?.amount >= 100) && pcoin >= 2000000) {
      pickaxe_button.setDisabled(false)
      pickname = 'Gemstone Gauntlet'
      pickspeed = 100
      pickfortune = 200
      pickcoins = 2000000
      itemname = 'Gemstone'
      itemamount = 100
      
    } else if(pick == 'Gemstone Gauntlet') {    

    }

		//Sword Upgrades
		if (
			swordinv.find((item) => item.name == "Tactician's Sword") &&
			coins > 5000000 &&
			!swordinv.find((item) => item.name == 'Leaping Sword')
		) {
			sword_button.setDisabled(false);
			choosen = 'Leaping Sword';
			swordcost = 5000000;
		} else if (
			swordinv.find((item) => item.name == 'Zombie Sword') &&
			coins > 1000000 &&
			!swordinv.find((item) => item.name == 'Leaping Sword')
		) {
			sword_button.setDisabled(false);
			choosen = "Tactician's Sword";
			swordcost = 1000000;
		} else if (
			swordinv.find((item) => item.name == 'Golem Sword') &&
			coins > 100000 &&
			!swordinv.find((item) => item.name == 'Zombie Sword')
		) {
			sword_button.setDisabled(false);
			choosen = 'Zombie Sword';
			swordcost = 100000;
		} else if (
			swordinv.find((item) => item.name == 'Undead Sword') &&
			coins > 50000 &&
			!swordinv.find((item) => item.name == 'Golem Sword')
		) {
			sword_button.setDisabled(false);
			choosen = 'Golem Sword';
			swordcost = 50000;
		} else if (
			swordinv.find((item) => item.name == 'Fist') &&
			coins > 15000 &&
			!swordinv.find((item) => item.name == 'Undead Sword')
		) {
			sword_button.setDisabled(false);
			choosen = 'Undead Sword';
			swordcost = 15000;
		}

		//Armor Upgrades
		if (
			armorinv.find((item) => item.name == 'Frozen Blaze Armor') &&
			coins > 10000000 &&
			!armorinv.find((item) => item.name === 'Superior Dragon Armor')
		) {
			armor_button.setDisabled(false);
			choosen2 = 'Superior Dragon Armor';
			armorcost = 10000000;
		} else if (
			armorinv.find((item) => item.name === 'Tarantula Armor') &&
			coins > 5000000 &&
			!armorinv.find((item) => item.name === 'Frozen Blaze Armor')
		) {
			armor_button.setDisabled(false);
			choosen2 = 'Frozen Blaze Armor';
			armorcost = 5000000;
		} else if (
			armorinv.find((item) => item.name === 'Monster Hunter Armor') &&
			coins > 1000000 &&
			!armorinv.find((item) => item.name === 'Tarantula Armor')
		) {
			armor_button.setDisabled(false);
			choosen2 = 'Tarantula Armor';
			armorcost = 1000000;
		} else if (
			armorinv.find((item) => item.name === 'Golem Armor') &&
			coins > 500000 &&
			!armorinv.find((item) => item.name === 'Monster Hunter Armor')
		) {
			armor_button.setDisabled(false);
			choosen2 = 'Monster Hunter Armor';
			armorcost = 500000;
		} else if (
			armorinv.find((item) => item.name === 'Leaflet Armor') &&
			coins > 100000 &&
			!armorinv.find((item) => item.name === 'Golem Armor')
		) {
			armor_button.setDisabled(false);
			choosen2 = 'Golem Armor';
			armorcost = 100000;
		} else if (
			armorinv.find((item) => item.name === 'Naked') &&
			coins > 50000 &&
			!armorinv.find((item) => item.name === 'Leaflet Armor')
		) {
			armor_button.setDisabled(false);
			choosen2 = 'Leaflet Armor';
			armorcost = 50000;
		}

		//Booster Cookie
		if (player.data.profile.gems >= 4) {
			cookie_button.setDisabled(false);
		}

		//Adding Buttons to row
		if (rod.name != 'Rod of the Sea' && row.components.length < 4) {
			row.addComponents(rod_button);
		} else if (rod.name != 'Rod of the Sea' && row2.components.length < 4) {
			row2.addComponents(rod_button);
		}

		if (player.data.misc.booster_cookie.active == false && row.components.length < 4) {
			row.addComponents(cookie_button);
		} else if (player.data.misc.booster_cookie.active == false && row2.components.length < 4) {
			row2.addComponents(cookie_button);
		}

		if (!swordinv.find((item) => item.name == 'Leaping Sword') && row.components.length < 4) {
			row.addComponents(sword_button);
		} else if (!swordinv.find((item) => item.name == 'Leaping Sword') && row2.components.length < 4) {
			row2.addComponents(sword_button);
		}

		if (!armorinv.find((item) => item.name == 'Superior Dragon Armor') && row.components.length < 4) {
			row.addComponents(armor_button);
		} else if (!armorinv.find((item) => item.name == 'Superior Dragon Armor') && row2.components.length < 4) {
			row2.addComponents(armor_button);
		}

    if (player.data.equipment.mining.pickaxe.name != 'Gemstone Gauntlet' && row.components.length < 4) {
			row.addComponents(pickaxe_button);
		} else if (player.data.equipment.mining.pickaxe.name != 'Gemstone Gauntlet' && row2.components.length < 4) {
			row2.addComponents(pickaxe_button);
    }

		row.addComponents(cancel_button);

		let shopembed = new Discord.MessageEmbed()
			.setTitle('Skyblock Simulator Shop')
			.setDescription(
				'Upgrades or items you can buy will show up here. (If it is empty, you cannot buy anything 😭)'
			)
			.setFooter(getFooter(player))
			.setColor(getColor(player));

		//Rod Fields
		if (rod.name == 'Fishing Rod') {
			shopembed.addField(
				'Prismarine Rod',
				'**Cost:** 5k coins + 10 lilypads\n\n**Stats:**\n`5 α`, `10% 🎣`',
				true
			);
		} else if (rod.name == 'Prismarine Rod') {
			shopembed.addField('Sponge Rod', '**Cost:** 25k coins + 20 lilypads\n\n**Stats:**\n`10 α`, `20% 🎣`', true);
		} else if (rod.name == 'Sponge Rod') {
			shopembed.addField(
				'Speedster Rod',
				'**Cost:** 50k coins + 30 lilypads\n\n**Stats:**\n`15 α`, 30% 🎣',
				true
			);
		} else if (rod.name == 'Speedster Rod') {
			shopembed.addField(
				"Farmer's Rod",
				'**Cost:** 100k coins + 50 lilypads\n\n**Stats:**\n`20 α`, `40% 🎣`',
				true
			);
		} else if (rod.name == "Farmer's Rod") {
			shopembed.addField(
				'Challenging Rod',
				'**Cost:** 250k coins + 75 lilypads\n\n**Stats:**\n`25 α`, `50% 🎣`',
				true
			);
		} else if (rod.name == 'Challenging Rod') {
			shopembed.addField(
				'Rod of Champions',
				'**Cost:** 500k coins + 100 lilypads\n\n**Stats:**\n`30 α`, `60% 🎣`',
				true
			);
		} else if (rod.name == 'Rod of Champions') {
			shopembed.addField(
				'Rod of Legends',
				'**Cost:** 1M coins + 150 lilypads\n\n**Stats:**\n`40 α`, `70% 🎣`',
				true
			);
		} else if (rod.name == 'Rod of Legends') {
			shopembed.addField(
				'Rod of the Sea',
				'**Cost:** 50 gems + 250 lilypads\n\n**Stats:**\n`50 α`, `75% 🎣`',
				true
			);
		}

		//Cookie Field
		if (player.data.misc.booster_cookie.active == false) {
			shopembed.addField(
				'Booster Cookie',
				'**Cost:** 4 gems\n\n**Stats:**\n`10 ✯`, 10% overall stat increase',
				true
			);
		}

		//Sword Fields
		if (swordinv.find((item) => item.name == 'Leaping Sword')) {
		} else if (swordinv.find((item) => item.name == "Tactician's Sword")) {
			shopembed.addField(
				'Leaping Sword',
				'**Cost:** 5m coins\n\n**Stats:** `150 ⚔️`, `110 ❁`, `40 ☣`, `100 ☠`',
				true
			);
		} else if (swordinv.find((item) => item.name == 'Zombie Sword')) {
			shopembed.addField(
				"Tactician's Sword",
				'**Cost:** 1m coins\n\n**Stats:** `100 ⚔️`, `80 ❁`, `30 ☣`, `75 ☠`',
				true
			);
		} else if (swordinv.find((item) => item.name == 'Golem Sword')) {
			shopembed.addField(
				'Zombie Sword',
				'**Cost:** 100k coins\n\n**Stats:** `75 ⚔️`, `60 ❁`, `20 ☣`, `50 ☠`',
				true
			);
		} else if (swordinv.find((item) => item.name == 'Undead Sword')) {
			shopembed.addField(
				'Golem Sword',
				'**Cost:** 50k coins\n\n**Stats:** `50 ⚔️`, `40 ❁`, `10 ☣`, `30 ☠`',
				true
			);
		} else if (swordinv.find((item) => item.name == 'Fist')) {
			shopembed.addField('Undead Sword', '**Cost:** 15k coins\n\n**Stats:** `20 ⚔️`, `15 ❁`, `10 ☠`', true);
		}

		//Armor Fields
		if (armorinv.find((item) => item.name == 'Superior Dragon Armor')) {
		} else if (armorinv.find((item) => item.name == 'Frozen Blaze Armor')) {
			shopembed.addField(
				'Superior Dragon Armor',
				'**Cost:** 10m coins\n\n**Stats:** `300 ❤`, `150 ❈`, `150 ❁`, `40 ☣`, `150 ☠`, `15 ✯`',
				true
			);
		} else if (armorinv.find((item) => item.name == 'Tarantula Armor')) {
			shopembed.addField(
				'Frozen Blaze Armor',
				'**Cost:** 5m coins\n\n**Stats:** `200 ❤`, `150 ❈`, `100 ❁`, `15 ☣`, `50 ☠`',
				true
			);
		} else if (armorinv.find((item) => item.name == 'Monster Hunter Armor')) {
			shopembed.addField(
				'Tarantula Armor',
				'**Cost:** 1m coins\n\n**Stats:** `225 ❤`, `100 ❈`, `50 ❁`, `25 ☣`, `75 ☠`',
				true
			);
		} else if (armorinv.find((item) => item.name == 'Golem Armor')) {
			shopembed.addField(
				'Monster Hunter Armor',
				'**Cost:** 500k coins\n\n**Stats:** `150 ❤`, `60 ❈`, `30 ❁`, `15 ☣`, `40 ☠`',
				true
			);
		} else if (armorinv.find((item) => item.name == 'Leaflet Armor')) {
			shopembed.addField(
				'Golem Armor',
				'**Cost:** 100k coins\n\n**Stats:** `100 ❤`, `30 ❈`, `10 ❁`, `10 ☣`, `20 ☠`',
				true
			);
		} else if (armorinv.find((item) => item.name == 'Naked')) {
			shopembed.addField(
				'Leaflet Armor',
				'**Cost:** 50k coins\n\n**Stats:** `50 ❤`, `10 ❈`, `5 ☣`, `10 ☠`',
				true
			);
		}

		//Filter and Collector
		const filter = (i) => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		};

		let list = [row];
		if (row2.components.length > 0) {
			list = [row, row2];
		}

		const menu = await interaction.editReply({
			embeds: [shopembed],
			components: list,
		});

		await menu
			.awaitMessageComponent({
				filter,
				componentType: 'BUTTON',
				time: 60000,
			})
			.then(async (i) => {
				const { customId: id } = i;

				if (id == 'rod') {
					//Upgrade Rod
					if (gemsneeded != 0) {
						//If Max Rod
						await collection.updateOne(
							{ _id: interaction.user.id },
							{ $inc: { 'data.profile.gems': -gemsneeded } },
							{ upsert: true }
						);
					} else {
						await collection.updateOne(
							{ _id: interaction.user.id },
							{ $inc: { 'data.profile.coins': -cost } },
							{ upsert: true }
						);
					}
					await collection.updateOne(
						{ _id: interaction.user.id },
						{
							$set: {
								'data.equipment.fishing.rod.name': rodname,
								'data.equipment.fishing.rod.sea_creature_chance': rodscc,
								'data.equipment.fishing.rod.fishing_speed': rodspeed,
								reforge: 'None',
								recombobulated: false,
							},
						},
						{ upsert: true }
					);

					await collection.updateOne(
						{
							_id: interaction.user.id,
							'data.inventory.items.name': sellitem,
						},
						{ $inc: { 'data.inventory.items.$.amount': -amount } },
						{ upsert: true }
					);
					if (gemsneeded != 0) {
						const finished = new Discord.MessageEmbed()
							.setTitle('Rod Upgarded')
							.setFooter(getFooter(player))
							.setDescription(`Purchased **${rodname}** for 50 gems and ${amount} Lilypads.`)
							.setColor('GREEN');

						interaction.editReply({
							embeds: [finished],
							components: [],
						});
					} else {
						const finished = new Discord.MessageEmbed()
							.setFooter(getFooter(player))
							.setTitle('Rod Upgarded')
							.setDescription(`Purchased **${rodname}** for ${cost} coins and ${amount} lilypads.`)
							.setColor('GREEN');

						interaction.editReply({
							embeds: [finished],
							components: [],
						});
					}
				} else if (id == 'cookie') {
					let expirationtime = Math.floor(Date.now() / 1000) + 172800;

					await collection.updateOne(
						{ _id: interaction.user.id },
						{ $inc: { 'data.profile.gems': -4 } },
						{ upsert: true }
					);

					await collection.updateOne(
						{ _id: interaction.user.id },
						{
							$set: {
								'data.misc.booster_cookie.active': true,
								'data.misc.booster_cookie.expires': expirationtime,
							},
						},
						{ upsert: true }
					);

					const purchased = new Discord.MessageEmbed()
						.setFooter(getFooter(playef))
						.setDescription('Purchased Booster Cookie')
						.setColor('GREEN');

					interaction.editReply({
						embeds: [purchased],
						components: [],
					});
				} else if (id == 'sword') {
					let item = dungloot[choosen];
					await collection.updateOne(
						{ _id: interaction.user.id },
						{
							$push: {
								'data.inventory.sword': {
									name: choosen,
									damage: item.damage,
									strength: item.strength,
									crit_chance: item.crit_chance,
									crit_damage: item.crit_damage,
									recombobulated: item.recombobulated,
									reforge: 'None',
								},
							},
						},
						{ upsert: true }
					);
					await collection.updateOne(
						{ _id: interaction.user.id },
						{ $inc: { 'data.profile.coins': -swordcost } },
						{ upsert: true }
					);
					const lootembed = new Discord.MessageEmbed()
						.setDescription(
							`**${choosen}** purchased! Use \`/sb wardrobe\` to equip it.
            `
						)
						.setColor('GREEN')
						.setFooter(getFooter(player));
					return interaction.editReply({
						embeds: [lootembed],
						components: [],
					});
				} else if (id == 'armor') {
					let item = dungloot[choosen2];
					await collection.updateOne(
						{ _id: interaction.user.id },
						{
							$push: {
								'data.inventory.armor': {
									name: choosen2,
									health: item.health,
									defense: item.defense,
									strength: item.strength,
									crit_chance: item.crit_chance,
									crit_damage: item.crit_damage,
									magic_find: item.magic_find,
									sea_creature_chance: item.sea_creature_chance,
									recombobulated: item.recombobulated,
									reforge: 'None',
								},
							},
						},
						{ upsert: true }
					);
					await collection.updateOne(
						{ _id: interaction.user.id },
						{ $inc: { 'data.profile.coins': -armorcost } },
						{ upsert: true }
					);
					const lootembed = new Discord.MessageEmbed()
						.setDescription(`**${choosen2}** purchased! Use \`/sb wardrobe\` to equip it.`)
						.setColor('GREEN')
						.setFooter(getFooter(player));
					return interaction.editReply({
						embeds: [lootembed],
						components: [],
					});
				} else if(id == 'pickaxe') {

          await collection.updateOne(
    { _id: interaction.user.id },
    {
      $set: {
        'data.equipment.mining.pickaxe.name': pickname,
        'data.equipment.mining.pickaxe.mining_fortune': pickfortune,
        'data.equipment.mining.pickaxe.mining_speed': pickspeed,
        'data.equipment.mining.pickaxe.recombobulated': false,
        'data.equipment.mining.pickaxe.reforge': 'None'
      },
    },
    { upsert: true }
  );
  await collection.updateOne(
						{
							_id: interaction.user.id,
							'data.inventory.items.name': itemname,
						},
						{ $inc: { 'data.inventory.items.$.amount': -itemamount } },
						{ upsert: true }
					);
          await collection.updateOne(
						{
							_id: interaction.user.id
						},
						{ $inc: { 'data.profile.coins': -pickcoins } },
						{ upsert: true }
					);

          const finished = new Discord.MessageEmbed()
							.setFooter(getFooter(player))
							.setTitle('Pickaxe Upgarded')
							.setDescription(`Purchased **${pickname}** for ${pickcoins} coins and ${itemamount} ${itemname}.`)
							.setColor('GREEN');

						interaction.editReply({
							embeds: [finished],
							components: [],
						});

        } else {
					const cancelled = new Discord.MessageEmbed()
						.setTitle('Menu Cancelled')
						.setColor('RED')
						.setFooter(getFooter(player));
					interaction.editReply({
						embeds: [cancelled],
						components: [],
					});
					return;
				}
			})
			.catch((err) => console.log(''));
	},
};
