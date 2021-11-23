const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');
const { caps, errEmbed } = require('../../constants/Functions/general.js');
const { addItems, getBazaarID, formatBZ, getEmoji } = require('../../constants/Functions/simulator.js');
const { ah_items, bazaar_items } = require('../../constants/Simulator/Json/items.js')

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
    
    let player = await collection.findOne({ _id: interaction.user.id });

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
    const bzid = interaction.options.getString('bazaar-id')

    //top lvl variables needed


    if(action == 'buy-order') {

      if(!itemname || !amount || !price) {
        return interaction.editReply({embeds: [errEmbed("Item name, amount and price are required for this action.", true)]})
      }

      if(!bazaar_items.includes(caps(itemname))) {
        return interaction.editReply({embeds: [errEmbed(`${itemname} can't be bought at the bazaar.`, true)]})
      }

      const itemcheck = await collection2.findOne({ _id: caps(itemname) })
      
      if(!itemcheck) {
        return interaction.editReply({embeds: [errEmbed(`No bazaar entry found for ${itemname} if you believe this is wrong contact **Baltraz#4874**`, true)]})
      }

      if(amount <= 0 || price <= 0) {
        return interaction.editReply({embeds: [errEmbed("Can't create sell offer for negative Items or negative Price.", true)]})
      }
      
      if(player.data.profile.coins < amount * price) {
        return interaction.editReply({embeds: [errEmbed("You don't have enough coins to setup this buy order.", true)]})
      }

      const bz_id = getBazaarID()

      await collection2.updateOne(
          { _id: caps(itemname) },
          {
            $push: {
              buy: {
                $each: [{
                  id: interaction.user.id,
                amount: amount,
                price: price,
                bz_id: bz_id
                }],
                $sort: {
                  price: -1
                },
              },
            },
          },
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
      .setDescription(`Created an buy order for ${amount} ${caps(itemname)}, buying them at ${price} coins each.`)
      .setColor('GREEN')
      .setFooter(getFooter(player))

      return interaction.editReply({embeds: [embed]})

    } else if(action == 'sell-order') {

      if(!itemname || !amount || !price) {
        return interaction.editReply({embeds: [errEmbed("Item name, amount and price are required for this action.", true)]})
      }

      if(!bazaar_items.includes(caps(itemname))) {
        return interaction.editReply({embeds: [errEmbed(`${itemname} can't be sold at the bazaar.`, true)]})
      }

      const itemcheck = await collection2.findOne({ _id: caps(itemname) })
      
      if(!itemcheck) {
        return interaction.editReply({embeds: [errEmbed(`No bazaar entry found for ${itemname} if you believe this is wrong contact **Baltraz#4874**`, true)]})
      }

      const founditem = player.data.inventory.items.find(item => item.name.toLowerCase() == itemname.toLowerCase())

      if(!founditem || founditem.amount <= 0) {
        return interaction.editReply({embeds: [errEmbed(`Couldn't find any ${caps(itemname)} in your inventory.`, true)]})
      }

      if(amount <= 0 || price <= 0) {
        return interaction.editReply({embeds: [errEmbed("Can't create sell offer for negative Items or negative Price.", true)]})
      }
      
      if(founditem.amount < amount) {
        amount = founditem.amount
      }

      const bz_id = getBazaarID()

      await collection2.updateOne(
          { _id: caps(itemname) },
          {
            $push: {
              sell: {
                $each: [{
                  id: interaction.user.id,
                amount: amount,
                price: price,
                bz_id: bz_id
                }],
                $sort: {
                  price: 1
                },
              },
            },
          },
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
      .setDescription(`Created an sell order for ${amount} ${caps(itemname)}, selling them at ${price} coins each.`)
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
          if(items.amount > (amount - amountfound)) {
            costfound += Number((items.price * (amount - amountfound)))
            amountfound += Number((amount - amountfound))
          } else {
            amountfound += items.amount
            costfound += (items.amount * items.price)
          }
          if(amountfound == amount) break;
      }

      const embed = new Discord.MessageEmbed()
      .setDescription(`Do you want to buy ${amountfound} ${caps(itemname)} for ${costfound} coins?`, true)
      .setColor('ORANGE')
      .setFooter(getFooter(player))

      const menu = await interaction.editReply({embeds: [embed], components: [row]})

      const filter = (i) => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		  };

      await menu.awaitMessageComponent({
				filter,
				componentType: 'BUTTON',
				time: 30000,
			})
			.then(async (i) => {
				const { customId: id } = i;

        if(id == 'yes') {
          if(player.data.profile.coins < costfound) {
            return interaction.editReply({embeds: [errEmbed(`Not enough coins to purchased ${caps(itemname)}`)], components: []})
          }

          //handle user buying items
          for(const items of item.sell) {
            if(amountfound == 0) break;
            if(items.amount <= amountfound) {
              //add player items
              player = await collection.findOne({ _id: interaction.user.id });
              const updatePlayer = addItems(caps(itemname), items.amount, player)
              await collection.replaceOne({ _id: interaction.user.id }, updatePlayer);

              //add seller coins
              await collection.updateOne(
                { _id: items.id },
                {
                  $inc: {
                    'data.profile.coins': items.price * items.amount
                  },
                },
                { upsert: true }
              );
              //remove items from db
              await collection2.updateOne(
                { _id: caps(itemname), "sell.bz_id": items.bz_id },
                { $set: { "sell.$.amount": 0 }},
                { upsert: true }
              )
              amountfound -= items.amount
            } else {
              player = await collection.findOne({ _id: interaction.user.id });
              const updatePlayer = addItems(caps(itemname), amountfound, player)
              await collection.replaceOne({ _id: interaction.user.id }, updatePlayer);

              //add seller coins
              await collection.updateOne(
                { _id: items.id },
                {
                  $inc: {
                    'data.profile.coins': items.price * amountfound
                  },
                },
                { upsert: true }
              );

              //updating sell orders
              await collection2.updateOne(
                { _id: caps(itemname), "sell.bz_id": items.bz_id },
                { $inc: { "sell.$.amount": -amountfound }},
                { upsert: true }
              )
              amountfound = 0
            }
          }

          //removing items from array
           collection2.updateOne(
                { },
                { $pull: { sell: { amount: 0 }},
                $inc: { total_bought: amount, total_spent: costfound }},
                { multi: true }
              )
          //removing buyer the coins
              await collection.updateOne(
                { _id: interaction.user.id },
                {
                  $inc: {
                    'data.profile.coins': -costfound
                  },
                },
                { upsert: true }
              );


          embed.setDescription(`Purchased Items successfully.`)
          embed.setColor('GREEN')

          return interaction.editReply({embeds: [embed], components: []})

        } else {
          embed.setDescription('Cancelled')
          embed.setColor('RED')
          return interaction.editReply({embeds: [embed], components: []})
        }

      }).catch((err) => interaction.editReply({components: []}));

    } else if(action == 'sell-instantly') {

      if(!itemname || !amount) {
        return interaction.editReply({embeds: [errEmbed("Item name and amount are required for this action.", true)]})
      }

      const founditem = player.data.inventory.items.find(item => item.name.toLowerCase() == itemname.toLowerCase())

      if(!founditem || founditem.amount <= 0) {
        return interaction.editReply({embeds: [errEmbed(`Couldn't find any ${caps(itemname)} in your inventory.`, true)]})
      }

      if(founditem.amount < amount) {
        amount = founditem.amount
      }

      const item = await collection2.findOne({ _id: caps(itemname) })

      if(item.buy.length == 0) {
        return interaction.editReply({embeds: [errEmbed(`Couldn't find any buy offers for ${caps(itemname)}.`, true)]})
      }

      let amountfound = 0
      let costfound = 0

      for(const items of item.buy) {
          if(items.amount > (amount - amountfound)) {
            costfound += Number((items.price * (amount - amountfound)))
            amountfound += Number((amount - amountfound))
          } else {
            amountfound += items.amount
            costfound += (items.amount * items.price)
          }
          if(amountfound == amount) break;
      }

      const embed = new Discord.MessageEmbed()
      .setDescription(`Do you want to sell ${amountfound} ${caps(itemname)} for ${costfound} coins?`, true)
      .setColor('ORANGE')
      .setFooter(getFooter(player))

      const menu = await interaction.editReply({embeds: [embed], components: [row]})

      const filter = (i) => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		  };
      
      await menu.awaitMessageComponent({
				filter,
				componentType: 'BUTTON',
				time: 30000,
			})
			.then(async (i) => {
				const { customId: id } = i;

        if(id == 'yes') {

          //handle user buying items
          for(const items of item.buy) {
            if(amountfound == 0) break;
            if(items.amount <= amountfound) {
              //add player items
              player = await collection.findOne({ _id: items.id });
              const updatePlayer = addItems(caps(itemname), items.amount, player)
              await collection.replaceOne({ _id: items.id }, updatePlayer);

              //add seller coins
              await collection.updateOne(
                { _id: interaction.user.id },
                {
                  $inc: {
                    'data.profile.coins': items.price * items.amount
                  },
                },
                { upsert: true }
              );
              //remove items from db
              await collection2.updateOne(
                { _id: caps(itemname), "buy.bz_id": items.bz_id },
                { $set: { "buy.$.amount": 0 }},
                { upsert: true }
              )
              amountfound -= items.amount
            } else {
              player = await collection.findOne({ _id: items.id });
              const updatePlayer = addItems(caps(itemname), amountfound, player)
              await collection.replaceOne({ _id: items.id }, updatePlayer);

              //add seller coins
              await collection.updateOne(
                { _id: interaction.user.id },
                {
                  $inc: {
                    'data.profile.coins': items.price * amountfound
                  },
                },
                { upsert: true }
              );

              //updating sell orders
              await collection2.updateOne(
                { _id: caps(itemname), "buy.bz_id": items.bz_id },
                { $inc: { "buy.$.amount": -amountfound }},
                { upsert: true }
              )
              amountfound = 0
            }
          }

          //removing items from array
           collection2.updateOne(
                { },
                { $pull: { buy: { amount: 0 }},
                $inc: { total_sold: amount, total_earned: costfound }},
                { multi: true }
              )
          //removing seller the items
              await collection.updateOne(
                { _id: interaction.user.id, 'data.inventory.items.name': caps(itemname) },
                {
                  $inc: {
                    'data.inventory.items.$.amount': -amount
                  },
                },
                { upsert: true }
              );


          embed.setDescription(`Sold Items successfully.`)
          embed.setColor('GREEN')

          return interaction.editReply({embeds: [embed], components: []})

        } else {
          embed.setDescription('Cancelled')
          embed.setColor('RED')
          return interaction.editReply({embeds: [embed], components: []})
        }

      }).catch((err) => interaction.editReply({components: []}));      

    } else if(action == 'item-info') {

      if(!itemname) {
        return interaction.editReply({embeds: [errEmbed("Item name is required for this action.", true)]})
      }

      const item = await collection2.findOne({ _id: caps(itemname) })

      if(!item) {
        return interaction.editReply({embeds: [errEmbed(`No bazaar entry found for ${itemname} if you believe this is wrong contact **Baltraz#4874**`, true)]})
      }

      let totalitems_buyoffer = 0
      let totalitems_selloffer = 0

      for(const items of item.buy) {
        if(item.buy.length <= 0) break;
        totalitems_buyoffer += items.amount
      }

      for(const items of item.sell) {
        if(item.sell.length <= 0) break;
        totalitems_selloffer += items.amount
      }

      const buy = {
        price: formatBZ(item.buy),
        offers: item.buy.length || 'None',
        total_amount: totalitems_buyoffer || 'None'
      }

      const sell = {
        price: formatBZ(item.sell),
        offers: item.sell.length || 'None',
        total_amount: totalitems_selloffer || 'None'
      }

      const embed = new Discord.MessageEmbed()
      .setTitle(`Bazaar Info for ${getEmoji(itemname)} ${caps(itemname)}`)
      .setColor('GREEN')
      .setFooter(getFooter(player))
      .setDescription(`Total items sold: ${item.total_sold} [${item.total_earned.toLocaleString()} coins]\nTotal items purchased: ${item.total_bought} [${item.total_spent.toLocaleString()} coins]`)
      .addField('Insta sell price', `${buy.price}\n`, true)
      .addField('Amount of buy offers', `${buy.offers}`, true)
      .addField('Amount of items in buy offers', `${buy.total_amount}`, true)
      .addField('Insta buy price', `${sell.price}\n`, true)
      .addField('Amount of sell offers', `${sell.offers}`, true)
      .addField('Amount of items in sell offers', `${sell.total_amount}`, true)


      interaction.editReply({embeds: [embed]})
      
    } else if(action == 'cancel-orders') {

      let buy_str = ''
      let sell_str = ''

      if(!itemname) {
        const allitems = await collection2.find({ }).toArray();

        for(const items of allitems) {
        if(items._id == 'info') continue;
        for(const item of items.buy) {
          if(item.id == interaction.user.id) {
            buy_str += `${items._id}: ${item.bz_id}\n`
          }
        }
        for(const item of items.sell) {
          if(item.id == interaction.user.id) {
            sell_str += `${items._id}: ${item.bz_id}\n`
          }
        }
      }

      if(buy_str.length <= 1) {
        buy_str = 'None\n'
      }
      if(sell_str.length <= 1) {
        sell_str = 'None\n'
      }

      const embed = new Discord.MessageEmbed()
      .setTitle('Found orders')
      .setColor(getColor('Bazaar'))
      .setFooter(getFooter('Bazaar'))
      .setDescription(`**Buy orders**\n${buy_str}\n**Sell orders**\n${sell_str}`)

      return interaction.editReply({embeds: [embed]})

      } else if(itemname && bzid) {

        const founditem = await collection2.findOne({ _id: caps(itemname) })

        if(!founditem) {
          return interaction.editReply({embeds: [errEmbed(`No bazaar entry found for ${itemname} if you believe this is wrong contact **Baltraz#4874**`, true)]})
        }

        const buycheck = founditem.buy.find(item => item.bz_id == bzid)
        const sellcheck = founditem.sell.find(item => item.bz_id == bzid)

        if(buycheck) {

          await collection.updateOne(
                { _id: interaction.user.id },
                {
                  $inc: {
                    'data.profile.coins': buycheck.amount * buycheck.price
                  },
                },
                { upsert: true }
              );
          await collection2.updateOne(
            { _id: caps(itemname) },
            { $pull: { buy: { bz_id: bzid }}},
            { upsert: true }
          )

          const embed = new Discord.MessageEmbed()
          .setTitle('Buy order cancelled')
          .setDescription(`Order with id ${bzid} cancelled and refunded you ${buycheck.amount * buycheck.price} coins.`)
          .setColor(getColor('Bazaar'))
          .setFooter(getFooter('Bazaar'))

          return interaction.editReply({embeds: [embed]})

        } else if(sellcheck) {

          await collection.updateOne(
                { _id: interaction.user.id, 'data.inventory.items.name': caps(itemname) },
                {
                  $inc: {
                    'data.inventory.items.$.amount': sellcheck.amount
                  },
                },
                { upsert: true }
              );

          await collection2.updateOne(
            { _id: caps(itemname) },
            { $pull: { sell: { bz_id: bzid }}},
            { upsert: true }
          )

          const embed = new Discord.MessageEmbed()
          .setTitle('Sell order cancelled')
          .setDescription(`Order with id ${bzid} cancelled and refunded you ${sellcheck.amount} ${caps(itemname)}.`)
          .setColor(getColor('Bazaar'))
          .setFooter(getFooter('Bazaar'))

          return interaction.editReply({embeds: [embed]})

        } else {

          return interaction.editReply({embeds: [errEmbed(`Couldn't find any buy or sell orders with\nID: ${bzid}\nItem: ${caps(itemname)}.\n\nTo find running orders use \`/sb bazaar cancel-orders\` without any extra input.`)]})

        }

      } else {
        return interaction.editReply({embeds: [errEmbed(`Item name and bazaar id are required for this action.`)]})
      }




    } else if(action == 'overview') {

      const allitems = await collection2.find({ }).toArray()

      let total_buyorder_items = 0
      let total_sellorder_items = 0
      let total_buyorders = 0
      let total_sellorders = 0

      for(const item of allitems) {
        if(item._id == 'info') continue;
        for(const sell_order of item.sell) {
          total_sellorder_items += sell_order.amount
        }
        for(const buy_order of item.buy) {
          total_buyorder_items += buy_order.amount
        }
        total_buyorders += item.buy.length
        total_sellorders += item.sell.length
      }

      const embed = new Discord.MessageEmbed()
      .setTitle('Bazaar Info')
      .setColor(getColor('Bazaar'))
      .setFooter(getFooter('Bazaar'))
      .addField(`Available item categories`, `${allitems.length -1}`, true)
      .addField('Total buy orders', `${total_buyorders}`, true)
      .addField('Total items in buy orders', `${total_buyorder_items}`, true)
      .addField('Total sell orders', `${total_sellorders}`, true)
      .addField('Total items in sell orders', `${total_sellorder_items}`, true)

      return interaction.editReply({embeds: [embed]})
    }


  }
}