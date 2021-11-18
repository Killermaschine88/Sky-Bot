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
    const itemname = interaction.options.getString('item')
    const amount = interaction.options.getInteger('amount')
    const price = interaction.options.getInteger('price')

    //top lvl variables needed


    if(action == 'buy-order') {

      if(!itemname || !amount || !price) {
        return interaction.editReply({embeds: [errEmbed("Item name and Amount are required for this action.", true)]})
      }

      /*const founditem = player.data.inventory.items.find(item => item.name.toLowerCase() == itemname.toLowerCase())

      if(!founditem) {
        return interaction.editReply({embeds: [errEmbed(`Couldn't find any ${caps(itemname)} in your inventory.`, true)]})
      } else if(founditem.amount < amount) {
        amount == founditem.amount
      }*/
      
      if(player.data.profile.coins < amount * price) {
        return interaction.editReply({embeds: [errEmbed("You don't have enough coins to setup this buy order.", true)]})
      }

      await collection2.updateOne(
          { _id: caps(itemname) },
          {
            $push: {
              'buy': {
                id: interaction.user.id,
                amount: amount,
                price: price
              }
            },
          },
          { upsert: true }
        );

      await collection.updateOne(
				{ _id: interaction.user.id },
				{
					$inc: {
						'data.profile.coins': -amount * price
					},
				},
				{ upsert: true }
			);

      const embed = new Discord.MessageEmbed()
      .setDescription(`Created an buy order for ${amount}x ${caps(itemname)} for ${price} coins each.`)
      .setColor('GREEN')
      .setFooter(getFooter(player))

      return interaction.editReply({embeds: [embed]})              

    } else if(action == 'sell-order') {

      if(!itemname || !amount || !price) {
        return interaction.editReply({embeds: [errEmbed("Item name and Amount are required for this action.", true)]})
      }

      const founditem = player.data.inventory.items.find(item => item.name.toLowerCase() == itemname.toLowerCase())

      if(!founditem) {
        return interaction.editReply({embeds: [errEmbed(`Couldn't find any ${caps(itemname)} in your inventory.`, true)]})
      } else if(founditem.amount < amount) {
        amount == founditem.amount
      }
      
    } else if(action == 'buy-instantly') {

      if(!itemname || !amount || !price) {
        return interaction.editReply({embeds: [errEmbed("Item name and Amount are required for this action.", true)]})
      }

      const founditem = player.data.inventory.items.find(item => item.name.toLowerCase() == itemname.toLowerCase())

      if(!founditem) {
        return interaction.editReply({embeds: [errEmbed(`Couldn't find any ${caps(itemname)} in your inventory.`, true)]})
      } else if(founditem.amount < amount) {
        amount == founditem.amount
      }

    } else if(action == 'sell-instantly') {

      if(!itemname || !amount || !price) {
        return interaction.editReply({embeds: [errEmbed("Item name and Amount are required for this action.", true)]})
      }

      const founditem = player.data.inventory.items.find(item => item.name.toLowerCase() == itemname.toLowerCase())

      if(!founditem) {
        return interaction.editReply({embeds: [errEmbed(`Couldn't find any ${caps(itemname)} in your inventory.`, true)]})
      } else if(founditem.amount < amount) {
        amount == founditem.amount
      }

    } else if(action == 'buy-instantly') {

      if(!itemname || !amount || !price) {
        return interaction.editReply({embeds: [errEmbed("Item name and Amount are required for this action.", true)]})
      }

      const founditem = player.data.inventory.items.find(item => item.name.toLowerCase() == itemname.toLowerCase())

      if(!founditem) {
        return interaction.editReply({embeds: [errEmbed(`Couldn't find any ${caps(itemname)} in your inventory.`, true)]})
      } else if(founditem.amount < amount) {
        amount == founditem.amount
      }

    } else if(action == 'overview') {
      
    } else if(action == 'cancel-order') {

      if(!itemname) {
        const allitems = await collection2.find({ }).toArray();
      }
    }


  }
}