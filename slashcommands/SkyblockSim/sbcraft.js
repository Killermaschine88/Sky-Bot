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
			interaction.editReply({ embeds: [noprofile] });
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
		}
    embed.addField('Hardened Wood', '**Stats:** `5 α`\n\n**Cost:** 40 Lilypads', true)
    embed.addField('Lucky Dice', '**Stats:** `7 α`, `5 ✯`\n\n**Cost:** 60 Lilypads and 30 Shark Fin', true)

    const reforgestones = {
      fishing: ['hardenedwood', 'luckydice'],
    }

		craftmenu.addOptions([
			{
				label: 'Shark Scale Armor',
				value: 'sharkscale'
			},
      {
        label: 'Hardened Wood',
        value: 'hardenedwood'
      },
      {
        label: 'Lucky Dice',
        value: 'luckydice'
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
			} else if (reforgestones.fishing.includes(id)) {
        if(id == 'hardenedwood' && inv.find((item) => item.name == 'Lilypad' && item.amount >= 40)) {
          embed.setDescription('Crafted **Hardened Wood**');
          embed.fields = [];
          embed.setColor('GREEN');

          const updatePlayer = addItems('Hardened Wood', 1, player);

			    await collection.replaceOne({ _id: interaction.user.id }, updatePlayer);

          await collection.updateOne(
            { _id: interaction.user.id, 'data.inventory.items.name': 'Lilypad' },
            { $inc: { 'data.inventory.items.$.amount': -40 } },
            { upsert: true }
          );
        } else if(id == 'luckydice' && inv.find((item) => item.name == 'Shark Fin' && item.amount >= 30) && inv.find((item) => item.name == 'Lilypad' && item.amount >= 60)) {
          embed.setDescription('Crafted **Lucky Dice**');
          embed.fields = [];
          embed.setColor('GREEN');

          const updatePlayer = addItems('Lucky Dice', 1, player);

          await collection.replaceOne({ _id: interaction.user.id }, updatePlayer);

          await collection.updateOne(
            { _id: interaction.user.id, 'data.inventory.items.name': 'Shark Fin' },
            { $inc: { 'data.inventory.items.$.amount': -30 } },
            { upsert: true }
          );
          await collection.updateOne(
            { _id: interaction.user.id, 'data.inventory.items.name': 'Lilypad' },
            { $inc: { 'data.inventory.items.$.amount': -60 } },
            { upsert: true }
          );
        } else {
          return interaction.editReply({ embeds: [errEmbed(`Can't craft Reforge Stone due to missing items or coins.`)], components: [] });
        }
        
			} else {
				embed.setDescription("Can't craft item due to missing items, coins or you already own the Armor/Sword.");
				embed.fields = [];
				embed.setColor('RED');
			}

			await i.update({ embeds: [embed], components: [] });
		});

		leaderCollector.on('end', async (collected) => {
      
		});
	},
};
