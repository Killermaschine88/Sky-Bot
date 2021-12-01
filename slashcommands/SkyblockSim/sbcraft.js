const Discord = require('discord.js');
const sets = require('../../constants/Simulator/Json/dungeonloot.json');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');
const { addItems } = require('../../constants/Functions/simulator.js');
const { errEmbed } = require('../../constants/Functions/general.js');

module.exports = {
	name: 'sbcraft',
	description: 'a',
	usage: 'sbsettings (Setting Name)',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: [],
	cooldown: 10,
	async execute(interaction, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: interaction.user.id });

		if (player === null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			await interaction.editReply({ embeds: [noprofile] });
			return;
		}

		const inv = player.data.inventory.items;
		const inv2 = player.data.inventory.armor;

		//Embed and Select Menu
		const embed = new Discord.MessageEmbed()
			.setTitle('Crafting')
			.setDescription('Available items with their respective stats and cost\n')
			.setFooter(getFooter(player))
			.setColor(getColor(player));

		const row = new Discord.MessageActionRow();

		const craftmenu = new Discord.MessageSelectMenu().setCustomId('craftmenu').setMaxValues(1).setMinValues(1);

		if (!inv2.find((armor) => armor.name == 'Shark Scale Armor')) {
			embed.addField(
				'Shark Scale Armor',
				'**Stats:** `200 ❤`, `120 ❈`, `75 ❁`, `25 ☣`, `90 ☠`, `10 α`\n\n**Cost:** 100 Shark Fin and 100 Lilypads',
				true
			);
      craftmenu.addOptions([
			{
				label: 'Shark Scale Armor',
				value: 'sharkscale'
			},
      ])
		}

		embed.addField('Deep Sea Orb', '**Stats:** `10 α`\n\n**Cost:** 75 Lilypads and 50 Shark Fin', true)
		embed.addField('Hardened Wood', '**Stats:** `5 α`\n\n**Cost:** 25 Lilypads', true)
		embed.addField('Lucky Dice', '**Stats:** `7 α`, `5 ✯`\n\n**Cost:** 50 Lilypads and 25 Shark Fin', true)
		embed.addField('Onyx', '**Stats:** `10 ☘`\n\n**Cost:** 50 Emeralds', true)
		embed.addField('Diamonite', '**Stats:** `20 ☘`\n\n**Cost:** 75 Diamonds', true)
		embed.addField('Rock Gemstone', '**Stats:** `30 ☘`\n\n**Cost:** 100 Gemstones', true)
		embed.addField('Warped Stone', '**Stats:** `20 ❁`, `10 ☣`, `30 ☠`\n\n**Cost:**\n150 Ender Pearls and 100 Obsidian', true)

    const reforgestones = {
      fishing: ['hardenedwood', 'luckydice', 'deepseaorb'],
      mining: ['onyx', 'diamonite', 'rockgemstone'],
	  combat: ['warpedstone']
    }

		craftmenu.addOptions([
			{
				label: 'Deep Sea Orb',
				value: 'deepseaorb'
			},
			{
				label: 'Hardened Wood',
				value: 'hardenedwood'
			},
			{
				label: 'Lucky Dice',
				value: 'luckydice'
			},
			{
				label: 'Onyx',
				value: 'onyx'
			},
			{
				label: 'Diamonite',
				value: 'diamonite'
			},
			{
				label: 'Rock Gemstone',
				value: 'rockgemstone'
			},
			{
				label: 'Warped Stone',
				value: 'warpedstone'
			}
		]);

		row.addComponents(craftmenu);

		if (embed.fields.length == 0) {
			embed.addField('All craftable items owned', '\u200B', true);
		}

		const menu = await interaction.editReply({ embeds: [embed], components: [row] });

		// Wait for a selectbox option to be chosen and then
		// send a leaderboard of the selected type
		const filter = (i) => i.customId === 'craftmenu' && i.user.id === interaction.user.id;
		const leaderCollector = await menu.createMessageComponentCollector({
			filter,
			componentType: 'SELECT_MENU',
			time: 300000,
		});

		leaderCollector.on('collect', async (i) => {
			const id = i.values[0];

			if (
				inv.find((item) => item.name == 'Shark Fin' && item.amount >= 100) &&
				inv.find((item) => item.name == 'Lilypad' && item.amount >= 100) &&
				!inv2.find((armor) => armor.name == 'Shark Scale Armor')
			) {
				const item = sets['Shark Scale Armor'];
				embed.setDescription('Crafted **Shark Scale Armor**');
				embed.fields = [];
				embed.setColor('GREEN');

				collection.updateOne(
					{ _id: interaction.user.id },
					{
						$push: {
							'data.inventory.armor': {
								name: 'Shark Scale Armor',
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
					{ _id: interaction.user.id, 'data.inventory.items.name': 'Shark Fin' },
					{ $inc: { 'data.inventory.items.$.amount': -100 } },
					{ upsert: true }
				);
				await collection.updateOne(
					{ _id: interaction.user.id, 'data.inventory.items.name': 'Lilypad' },
					{ $inc: { 'data.inventory.items.$.amount': -100 } },
					{ upsert: true }
				);
			} else if (reforgestones.fishing.includes(id) || reforgestones.mining.includes(id) || reforgestones.combat.includes(id)) {
        
        let reforge_stone = '';
        let item1 = 0;
        let amount1 = 0;
        let item2 = 0;
        let amount2 = 0;

        if(id === 'hardenedwood') reforge_stone = 'Hardened Wood', item1 = 'Lilypad', amount1 = 25;
        else if(id === 'luckydice') reforge_stone = 'Lucky Dice', item1 = 'Shark Fin', amount1 = 25, item2 = 'Lilypad', amount2 = 50;
        else if(id === 'onyx') reforge_stone = 'Onyx', item1 = 'Emerald', amount1 = 50;
        else if(id === 'diamonite') reforge_stone = 'Diamonite', item1 = 'Diamond', amount1 = 75;
        else if(id === 'rockgemstone') reforge_stone = 'Rock Gemstone', item1 = 'Gemstone', amount1 = 100;
		else if(id === 'warpedstone') reforge_stone = 'Warped Stone', item1 = 'Ender Pearl', amount1 = 150, item2 = 'Obsidian', amount2 = 100;
		else if(id === 'deepseaorb') reforge_stone = 'Deep Sea Orb', item1 = 'Lilypad', amount1 = 75, item2 = 'Shark Fin', amount2 = 50;

        let itemcheck1 = inv.find((item) => item.name == item1 && item.amount >= amount1)
        let itemcheck2 = 'a'


        if(item2 != 0 && amount2 != 0) {
          itemcheck2 = inv.find((item) => item.name == item2 && item.amount >= amount2)
        }

        if(!itemcheck1 || !itemcheck2) {
          return await interaction.editReply({embeds: [errEmbed("Can't craft item because of missing materials.")], components: []})
        }

        const updatePlayer = addItems(reforge_stone, 1, player);

        await collection.replaceOne({ _id: interaction.user.id }, updatePlayer);

        await collection.updateOne(
          { _id: interaction.user.id, 'data.inventory.items.name': item1 },
          { $inc: { 'data.inventory.items.$.amount': -amount1 } },
          { upsert: true }
        );

        if(item2 && amount2) {
          await collection.updateOne(
            { _id: interaction.user.id, 'data.inventory.items.name': item2 },
            { $inc: { 'data.inventory.items.$.amount': -amount2 } },
            { upsert: true }
          );
        }

        embed.setDescription(`Crafted **${reforge_stone}**`);
        embed.fields = [];
        embed.setColor('GREEN');

        return await interaction.editReply({ embeds: [embed], components: [] });

      } else {
				embed.setDescription("Can't craft item due to missing items, coins or you already own the Armor/Sword.");
				embed.fields = [];
				embed.setColor('RED');
			}

			await i.update({ embeds: [embed], components: [] });
		});

		leaderCollector.on('end', async (collected) => {

      await interaction.editReply({components: []})
      
		});
	},
};
