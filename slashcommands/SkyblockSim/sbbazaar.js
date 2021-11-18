const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');
const { caps, errEmbed } = require('../../constants/Functions/general.js');
const { ah_items } = require('../../constants/Simulator/Json/items.js')

module.exports = {
	name: 'sbbazaar',
	description: 'a',
	usage: 'sbsettings (Setting Name)',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: [],
	cooldown: 10,
	async execute(interaction, mclient) {

    if(interaction.user.id != '570267487393021969') return interaction.editReply('WIP')

    const collection = mclient.db('SkyblockSim').collection('Players');
    const collection2 = mclient.db('SkyblockSim').collection('bazaar');
    
    const player = await collection.findOne({ _id: interaction.user.id });

    if (player === null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No Profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			interaction.editReply({ embeds: [noprofile] });
			return;
		}


    //handling bazaar stuff
    const action = interaction.options.getString('action')
    const itemname = interaction.options.getString('item-name')
    const amount = interaction.options.getInteger('amount')

    if(action != 'overview' && (!itemname || !amount)) {
      return interaction.editReply({embeds: [errEmbed("Item name and Amount are required for this action.", true)]})
    }

    if(ah_items.includes(caps(itemname))) {
      return interaction.editReply({embeds: [errEmbed("You can't sell any Items to the Bazaar which can be auctioned.", true)]})
    }

    if(!player.data.inventory.items.find(item => item.name.toLowerCase() == itemname.toLowerCase() || item.amount > 0)) {
      return interaction.editReply({embeds: [errEmbed(`Couldn't find any \`${caps(itemname)}\` in your inventory.`)]})
    }

    if(action == 'buy-order') {

    } else if(action == 'sell-order') {
      
    } else if(action == 'buy-instantly') {

    } else if(action == 'sell-instantly') {

    } else if(action == 'buy-instantly') {

    } else if(action == 'overview') {
      
    }


  }
}