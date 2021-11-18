const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');
const { caps } = require('../../constants/Functions/general.js');

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

    const collection = mclient.db('SkyblockSim').collection('bazaar');

    const action = interaction.options.getString('action')
    const itemname = interaction.options.getString('item-name')
    const amount = interaction.options.getInteger('amount')

    if(action == 'buy-order') {

    } else if(action == 'sell-order') {
      
    } else if(action == 'buy-instantly') {

    } else if(action == 'sell-instantly') {

    } else if(action == 'buy-instantly') {

    } else if(action == 'overview') {
      
    }


  }
}