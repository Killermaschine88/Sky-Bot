const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');

module.exports = {
	name: 'sbwardrobe',
	description: 'a',
	usage: 'sbsettings (Setting Name)',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: [],
	cooldown: 10,
	async execute(interaction, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: interaction.user.id });

		let type = interaction.options.getString('type');
		let number = interaction.options.getInteger('itemid');

		let sword = player.data.inventory.sword;
		let armor = player.data.inventory.armor;
		let item = '';

		if (player === null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			interaction.editReply({ embeds: [noprofile] });
			return;
		}

		if (number < 0) {
			const errembed = new Discord.MessageEmbed()
				.setTitle('Negative Number')
				.setDescription(`You can\'t enter a negative number.'`)
				.setColor('RED')
				.setFooter(getFooter(player));

			return interaction.editReply({ embeds: [errembed] });
		}

		if (type == 'sword' && sword.length <= number) {
			const errembed = new Discord.MessageEmbed()
				.setTitle('Invalid Item Number')
				.setDescription(
					`You don\'t own a sword with the ID \`${number}\`.\nCheck the sword category at \`/sb info\` to see what items you own.`
				)
				.setColor('RED')
				.setFooter(getFooter(player));

			return interaction.editReply({ embeds: [errembed] });
		}

		if (type == 'armor' && armor.length <= number) {
			const errembed = new Discord.MessageEmbed()
				.setTitle('Invalid Item Number')
				.setDescription(
					`You don\'t own an armor with the ID \`${number}\`.\nCheck the armor category at \`/sb info\` to see what items you own.`
				)
				.setColor('RED')
				.setFooter(getFooter(player));

			return interaction.editReply({ embeds: [errembed] });
		}

		if (type == 'sword') {
			item = sword[number];

			await collection.updateOne(
				{ _id: interaction.user.id },
				{
					$set: {
						'data.equipment.combat.sword.name': item.name,
						'data.equipment.combat.sword.damage': item.damage,
						'data.equipment.combat.sword.strength': item.strength,
						'data.equipment.combat.sword.crit_chance': item.crit_chance,
						'data.equipment.combat.sword.crit_damage': item.crit_damage,
						'data.equipment.combat.sword.recombobulated': item.recombobulated,
						'data.equipment.combat.sword.reforge': item.reforge,
					},
				},
				{ upsert: true }
			);

			let eqsword = '';
			if (item.reforge != 'None') {
				eqsword = item.reforge + ' ' + item.name;
			} else {
				eqsword = item.name;
			}

			const sucembed = new Discord.MessageEmbed()
				.setTitle('Sword Changed')
				.setDescription(`Successfully changed equipped sword to **${eqsword}**`)
				.setColor('GREEN')
				.setFooter(getFooter(player));

			return interaction.editReply({ embeds: [sucembed] });
		} else if (type == 'armor') {
			item = armor[number];
			await collection.updateOne(
				{ _id: interaction.user.id },
				{
					$set: {
						'data.equipment.combat.armor.name': item.name,
						'data.equipment.combat.armor.health': item.health,
						'data.equipment.combat.armor.defense': item.defense,
						'data.equipment.combat.armor.strength': item.strength,
						'data.equipment.combat.armor.crit_chance': item.crit_chance,
						'data.equipment.combat.armor.crit_damage': item.crit_damage,
						'data.equipment.combat.armor.magic_find': item.magic_find,
						'data.equipment.combat.armor.sea_creature_chance': item.sea_creature_chance,
						'data.equipment.combat.armor.recombobulated': item.recombobulated,
						'data.equipment.combat.armor.reforge': item.reforge,
					},
				},
				{ upsert: true }
			);

			let eqarmor = '';
			if (item.reforge != 'None') {
				eqarmor = item.reforge + ' ' + item.name;
			} else {
				eqarmor = item.name;
			}

			const sucembed = new Discord.MessageEmbed()
				.setTitle('Armor Changed')
				.setDescription(`Successfully changed equipped armor to **${eqarmor}**`)
				.setColor('GREEN')
				.setFooter(getFooter(player));

			return interaction.editReply({ embeds: [sucembed] });
		}
	},
};
