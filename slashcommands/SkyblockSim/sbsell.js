const Discord = require('discord.js');
const list = require('../../constants/Simulator/Json/prices.json');
const fetch = require('node-fetch');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');

module.exports = {
	name: 'sbsell',
	description: 'Sells items for Skyblock Simulator',
	usage: 'sbsell (Itemname) (Amount)',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['sell'],
	cooldown: 15,
	async execute(interaction, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: interaction.user.id });

		if (player === null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			return interaction.editReply({ embeds: [noprofile] });
		}

		if (player.data.misc.is_massselling) {
			const nosell = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('Selling blocked!')
				.setDescription('Selling blocked! You are currently mass-selling.')
				.setFooter(getFooter(player));
			return interaction.editReply({ embeds: [nosell] });
		}

		let sellall = interaction.options.getString('sell-all');
		let sellallcoins = 0;
		let sellallitems = 0;

		let date1 = Date.now();

		if (sellall == 'yes') {
			let b4embed = new Discord.MessageEmbed()
				.setTitle('Started selling all items...')
				.setColor('GREEN')
				.setFooter(getFooter(player));
			interaction.editReply({ embeds: [b4embed] });

			await collection.updateOne({ _id: interaction.user.id }, { $set: { 'data.misc.is_massselling': true } });
			for (const item of player.data.inventory.items) {
				if (item.amount != 0 && item.name != '') {
					let sellname = item.name.split(' ');
					sellname = sellname.join('_').toUpperCase();

					let price = await getPrice1(sellname);
					if (!price.error) {
						price = Number(price.quick_status.sellPrice.toFixed(2));

						const words = item.name.split(' ');

						for (let i = 0; i < words.length; i++) {
							words[i] = words[i][0].toUpperCase() + words[i].substr(1);
						}

						let sellitem = words.join(' ');
						let earned = price * item.amount;

						await collection.updateOne(
							{
								_id: interaction.user.id,
								'data.inventory.items.name': sellitem,
							},
							{
								$inc: {
									'data.inventory.items.$.amount': -item.amount,
								},
							}
						);
						await collection.updateOne(
							{ _id: interaction.user.id },
							{ $inc: { 'data.profile.coins': earned } }
						);
						sellallcoins += earned;
						sellallitems += item.amount;
					} else {
						let price = 0;
						const words = item.name.split(' ');

						for (let i = 0; i < words.length; i++) {
							words[i] = words[i][0].toUpperCase() + words[i].substr(1);
						}

						let sellitem = words.join(' ');

						price = getPrice(sellitem);
						price = Number(price);

						let earned = price * item.amount;

						await collection.updateOne(
							{
								_id: interaction.user.id,
								'data.inventory.items.name': sellitem,
							},
							{
								$inc: {
									'data.inventory.items.$.amount': -item.amount,
								},
							}
						);
						await collection.updateOne(
							{ _id: interaction.user.id },
							{ $inc: { 'data.profile.coins': earned } }
						);
						sellallcoins += earned;
						sellallitems += item.amount;
					}
				}
			}
			let date2 = Date.now();
			let taken = date2 - date1;
			if (taken < 1000) {
				taken = `\`${taken}\` milliseconds`;
			} else if (taken < 10000) {
				taken = `\`${taken / 1000}\` seconds`;
			}
			await collection.updateOne({ _id: interaction.user.id }, { $set: { 'data.misc.is_massselling': false } });
			let embed = new Discord.MessageEmbed()
				.setTitle('Sell all finished')
				.setColor('GREEN')
				.setFooter(getFooter(player))
				.setDescription(`Sold ${sellallitems} items for **${sellallcoins.toFixed(2)} coins**.\nTook ${taken}`);
			return interaction.editReply({ embeds: [embed] });
		}

		//Variables for Checks
		let amount = interaction.options.getInteger('amount');
		let price = '';

		let bzname = interaction.options.getString('item').split(' ');
		bzname = bzname.join('_').toUpperCase();

		let input = interaction.options.getString('item');
		const words = input.split(' ');

		for (let i = 0; i < words.length; i++) {
			words[i] = words[i][0].toUpperCase() + words[i].substr(1);
		}

		let sellitem = words.join(' ');

		const founditem = player.data.inventory.items.find((item) => item.name == sellitem);
		const itemindex = player.data.inventory.items.findIndex((item) => item.name === sellitem);

		if (founditem === undefined) {
			let invaliditemembed = new Discord.MessageEmbed()
				.setTitle('Invalid Item Name')
				.setColor('RED')
				.setDescription(`\`${sellitem}\` is not a valid item name or was not found in your inventory.`)
				.setFooter(getFooter(player));
			interaction.editReply({ embeds: [invaliditemembed] });
			return;
		}

		if (Math.sign(amount) <= 0) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Invalid Amount')
				.setColor('RED')
				.setFooter(getFooter(player))
				.setDescription('Cannot sell a negative number of items');
			return interaction.editReply({ embeds: [embed] });
		}

		//Check if more than 1 of said item exists
		if (founditem === undefined) {
			const noitems = new Discord.MessageEmbed()
				.setFooter(getFooter(player))
				.setColor('RED')
				.setDescription(`You don\'t have any ${sellitem} to be sold.`);
			interaction.editReply({ embeds: [noitems] });
			return;
		}

		//Check if a Number higher than the owned Amount is enterd
		if (founditem.amount < amount) {
			amount = founditem.amount;
		}

		//Get Price for the Item and Calculate earned coins
		let data = await getPrice1(bzname);

		if (data.error) {
			price = await getPrice(sellitem);
		} else {
			price = Math.floor(data.quick_status.sellPrice);
			sellitem = data.name;
		}
		let earnedcoins = price * amount;

		//Add Coins and remove Items
		if (earnedcoins) {
			//  const updatePlayer = addItem(sellitem, amount, player)
			//  console.log(amount)

			await collection.updateOne(
				{
					_id: interaction.user.id,
					'data.inventory.items.name': sellitem,
				},
				{ $inc: { 'data.inventory.items.$.amount': -amount } }
			);

			/* await collection.updateOne(
        { _id: interaction.user.id },
        { $inc: { 'data.profile.coins': earnedcoins } },
        { upsert: true }
      )*/

			//Remove Item if 0
			/*if (founditem.amount == 0) {
        let removeItem = updateItem(player, itemindex)

        await collection.replaceOne(
          { _id: interaction.user.id },
          removeItem
        )
      }*/

			await collection.updateOne(
				{ _id: interaction.user.id },
				{ $inc: { 'data.profile.coins': earnedcoins } },
				{ upsert: true }
			);

			const sold = new Discord.MessageEmbed()
				.setFooter(getFooter(player))
				.setColor('GREEN')
				.setDescription(
					`Successfully sold **${amount}x ${sellitem}** for **${earnedcoins.toLocaleString()} coins**`
				);
			interaction.editReply({ embeds: [sold] });
			return;
		}
	},
};

function addItem(sellitem, amount, player) {
	if (!player.data.inventory.items) player.data.inventory.items = [];

	if (player.data.inventory.items.length === 0) {
		player.data.inventory.items.push({
			name: sellitem,
			amount: amount,
		});
		return player;
	}

	for (const item of player.data.inventory.items) {
		if (item.name === sellitem) {
			item.amount -= amount;
			return player;
		}
	}

	player.data.inventory.items.push({
		name: sellitem,
		amount: amount,
	});
	return player;
}

function getPrice(sellitem) {
	if (sellitem == 'Coins' || sellitem == 'Potatoe') {
		return 0;
	}
	const itemprice = list.filter((item) => item.name == sellitem);

	price = itemprice[0].price;

	return price;
}

async function getPrice1(bzname) {
	const response = await fetch(`https://api.slothpixel.me/api/skyblock/bazaar/${bzname}`);
	return await response.json();
}

function updateItem(player, itemindex) {
	player.data.inventory.items.splice(itemindex, 1);
	return player;
}
