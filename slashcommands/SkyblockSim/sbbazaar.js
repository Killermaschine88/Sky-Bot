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

    const yes_button = new Discord.MessageButton()
			.setCustomId('yes')
      .setEmoji('847468695772987423')
			.setLabel('Yes')
			.setStyle('SUCCESS')

		const no_button = new Discord.MessageButton()
			.setCustomId('no')
      .setEmoji('847468672380829707')
			.setLabel('No')
			.setStyle('DANGER')
    
    const row = new Discord.MessageActionRow()
    .addComponents(yes_button, no_button)


    //handling bazaar stuff
    const action = interaction.options.getString('action')
    const itemname = interaction.options.getString('item')
    let amount = interaction.options.getInteger('amount')
    const price = interaction.options.getInteger('price')

    //top lvl variables needed


    if(action == 'buy-order') {

      if(!itemname || !amount || !price) {
        return interaction.editReply({embeds: [errEmbed("Item name, amount and price are required for this action.", true)]})
      }
      
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
      .setDescription(`Created an buy order for ${amount} ${caps(itemname)}, buying them for ${price} coins each.`)
      .setColor('GREEN')
      .setFooter(getFooter(player))

      return interaction.editReply({embeds: [embed]})

    } else if(action == 'sell-order') {

      if(!itemname || !amount || !price) {
        return interaction.editReply({embeds: [errEmbed("Item name, amount and price are required for this action.", true)]})
      }

      const founditem = player.data.inventory.items.find(item => item.name.toLowerCase() == itemname.toLowerCase())

      if(!founditem) {
        return interaction.editReply({embeds: [errEmbed(`Couldn't find any ${caps(itemname)} in your inventory.`, true)]})
      }
      
      if(founditem.amount < amount) {
        amount = founditem.amount
      }

      await collection2.updateOne(
          { _id: caps(itemname) },
          {
            $push: {
              'sell': {
                id: interaction.user.id,
                amount: amount,
                price: price
              }
            },
          },
          { upsert: true }
        );

      await collection.updateOne(
				{ _id: interaction.user.id, 'data.inventory.items.name': caps(itemname) },
				{
					$inc: {
						'data.inventory.items.$.amount': -amount
					},
				},
				{ upsert: true }
			);

      const embed = new Discord.MessageEmbed()
      .setDescription(`Created an sell order for ${amount} ${caps(itemname)}, selling them for ${price} coins each.`)
      .setColor('GREEN')
      .setFooter(getFooter(player))

      return interaction.editReply({embeds: [embed]})
      
    } else if(action == 'buy-instantly') {

      if(!itemname || !amount) {
        return interaction.editReply({embeds: [errEmbed("Item name and amount are required for this action.", true)]})
      }

      const founditem = player.data.inventory.items.find(item => item.name.toLowerCase() == itemname.toLowerCase())

      const item = await collection2.findOne({ _id: caps(itemname) })

      if(item.sell.length == 0) {
        return interaction.editReply({embeds: [errEmbed(`Couldn't find any sell offers for ${caps(itemname)}.`, true)]})
      }

      let amountfound = 0
      let costfound = 0

      for(const items of item.sell) {
        if(amountfound <= amount) {
          if(items.amount > (amount - amountfound)) {
            amountfound += (amount - amountfound)
            costfound += items.price * (amount - amountfound)
          } else {
            amountfound += items.amount
            costfound += items.amount * items.price
          }
        } else {
          break
        }
      }

      const embed = new Discord.MessageEmbed()
      .setDescription(`Do you want to buy ${amountfound} ${caps(itemname)} for ${costfound} (+10 Fee) coins?`, true)
      .setColor('ORANGE')
      .setFooter(getFooter(player))

      interaction.editReply({embeds: [embed], components: [row]})

      const filter = (i) => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		  };

      await interaction.channel
			.awaitMessageComponent({
				filter,
				componentType: 'BUTTON',
				time: 30000,
			})
			.then(async (i) => {
				const { customId: id } = i;

        if(id == 'yes') {

          //handle user buying items

          for(const items of item.sell) {
        if(amountfound <= amount) {
          if(items.amount > (amount - amountfound)) {
            amountfound += (amount - amountfound)
            costfound += items.price * (amount - amountfound)
          } else {
            amountfound += items.amount
            costfound += items.amount * items.price
          }
        } else {
          break
        }
      }

        } else {
          embed.setDescription('Cancelled')
          embed.setColor('RED')
          interaction.editReply({embeds: [embed], components: []})
        }

      }).catch((err) => interaction.editReply({components: []}));

    

      

    } else if(action == 'sell-instantly') {

      if(!itemname || !amount || !price) {
        return interaction.editReply({embeds: [errEmbed("Item name and amount are required for this action.", true)]})
      }

      const founditem = player.data.inventory.items.find(item => item.name.toLowerCase() == itemname.toLowerCase())

      if(!founditem) {
        return interaction.editReply({embeds: [errEmbed(`Couldn't find any ${caps(itemname)} in your inventory.`, true)]})
      }

      const item = await collection2.findOne({ _id: caps(itemname) })

      if(item.buy.length == 0) {
        return interaction.editReply({embeds: [errEmbed(`Couldn't find any buy offers for ${caps(itemname)}.`, true)]})
      }

    } else if(action == 'overview') {
      
    } else if(action == 'cancel-order') {

      if(!itemname) {
        const allitems = await collection2.find({ }).toArray();
      }
    }


  }
}