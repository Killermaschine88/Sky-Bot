const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');
const { caps, errEmbed } = require('../../constants/Functions/general.js');
const { addItems, getBazaarID } = require('../../constants/Functions/simulator.js');
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
                { $pull: { sell: { amount: 0 }}},
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