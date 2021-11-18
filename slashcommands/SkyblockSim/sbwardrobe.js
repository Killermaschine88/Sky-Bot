const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');
const { caps, errEmbed } = require('../../constants/Functions/general.js')

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

    if (player === null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			interaction.editReply({ embeds: [noprofile] });
			return;
		}

      const itemname = interaction.options.getString('equipment-name')
      const swordinv = player.data.inventory.sword
      const armorinv = player.data.inventory.armor
      let type = ''

      const foundsword = swordinv.find(item => item.name == caps(itemname))
      const foundarmor = armorinv.find(item => item.name == caps(itemname))

      if(foundsword) {
        
        type = 'Sword'

        await collection.updateOne(
				{ _id: interaction.user.id },
				{
					$set: {
						'data.equipment.combat.sword.name': foundsword.name,
						'data.equipment.combat.sword.damage': foundsword.damage,
						'data.equipment.combat.sword.strength': foundsword.strength,
						'data.equipment.combat.sword.crit_chance': foundsword.crit_chance,
						'data.equipment.combat.sword.crit_damage': foundsword.crit_damage,
						'data.equipment.combat.sword.recombobulated': foundsword.recombobulated,
						'data.equipment.combat.sword.reforge': foundsword.reforge,
					},
				},
				{ upsert: true }
			);
        
      } else if(foundarmor) {
        
        type = 'Armor'

        await collection.updateOne(
				{ _id: interaction.user.id },
				{
					$set: {
						'data.equipment.combat.armor.name': foundarmor.name,
						'data.equipment.combat.armor.health': foundarmor.health,
						'data.equipment.combat.armor.defense': foundarmor.defense,
						'data.equipment.combat.armor.strength': foundarmor.strength,
						'data.equipment.combat.armor.crit_chance': foundarmor.crit_chance,
						'data.equipment.combat.armor.crit_damage': foundarmor.crit_damage,
						'data.equipment.combat.armor.magic_find': foundarmor.magic_find,
						'data.equipment.combat.armor.sea_creature_chance': foundarmor.sea_creature_chance,
						'data.equipment.combat.armor.recombobulated': foundarmor.recombobulated,
						'data.equipment.combat.armor.reforge': foundarmor.reforge,
					},
				},
				{ upsert: true }
			);
        
      } else {
        const err = new Discord.MessageEmbed()

        return interaction.editReply({embeds: [errEmbed(`Couldn't find any Armor or Sword matching \`${caps(itemname)}\`.`, true)]})
      }

      const embed = new Discord.MessageEmbed()
      .setTitle('Equipment changed.')
      .setColor('GREEN')
      .setDescription(`Successfully changed ${type} to ${caps(itemname)}.`)
      .setFooter(getFooter(player))

      return interaction.editReply({embeds: [embed]})
	},
};
