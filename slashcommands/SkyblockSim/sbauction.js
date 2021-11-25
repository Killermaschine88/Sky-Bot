const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');
const { caps, errEmbed } = require('../../constants/Functions/general.js');
const { getAuctionID } = require('../../constants/Functions/simulator.js');
const { bazaar_items } = require('../../constants/Simulator/Json/items.js')

module.exports = {
	name: 'sbauction',
	description: 'a',
	usage: 'sbsettings (Setting Name)',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: [],
	cooldown: 10,
	async execute(interaction, mclient) {

		//Getting required DB Entries
		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: interaction.user.id });

		const collection2 = mclient.db('SkyblockSim').collection('auctions');

		if (player === null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No Profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			interaction.editReply({ embeds: [noprofile] });
			return;
		}

		const action = interaction.options.getString('action');
		const itemname = interaction.options.getString('item');
		const duration = interaction.options.getInteger('duration');
		const amount = interaction.options.getInteger('bid-amount');
		const auctionid = interaction.options.getString('auction-id');
		const startbid = interaction.options.getInteger('start-bid');

		const err = new Discord.MessageEmbed().setFooter(getFooter('Auction House')).setColor('RED');

		if (action == 'create') {
			if (player.data.misc.auctions == 3) {
				embed.setDescription(
					'You currently have 3 Auctions running, wait for them to finish to put up new ones.'
				);
				return interaction.editReply({ embeds: [err] });
			}

			if (!itemname || !duration || !startbid) {
				err.setDescription('Item name, duration and starting bid are required when creating an auction.');
				return interaction.editReply({ embeds: [err] });
			}

      if(duration <= 0 || startbid <= 0) {
        return interaction.editReply({embeds: [errEmbed("Can't input negative Values.", true)]})
      }

      if(bazaar_items.includes(caps(itemname))) {
        return interaction.editReply({embeds: [errEmbed("You can't auction any Items which can be sold at the Bazaar.", true)]})
      }

			if (
				!player.data.inventory.items.find(
					(item) => item.name.toLowerCase() == itemname.toLowerCase() && item.amount != 0
				)
			) {
				err.setDescription(`Can't find any ${caps(itemname)} in your Inventory.`);
				return interaction.editReply({ embeds: [err] });
			}

			let ahid = getAuctionID();
			const ahcheck = await collection2.findOne({ _id: ahid });
			if (ahcheck) {
				ahid = getAuctionID();
			}

			let expire_time = (Date.now() / 1000).toFixed();
			expire_time = Number(expire_time) + Number(duration * 60 * 60);

			await collection2.updateOne(
				{ _id: ahid },
				{
					$set: {
						owner: {
							id: interaction.user.id,
							tag: interaction.user.tag,
						},
						item: {
							name: caps(itemname),
							bid: startbid,
							last_bidid: 0,
							last_bidtag: 'Starting Bid',
						},
						auction: {
							expiration: expire_time,
						},
					},
				},
				{ upsert: true }
			);

			await collection.updateOne(
				{
					_id: interaction.user.id,
					'data.inventory.items.name': caps(itemname),
				},
				{ $inc: { 'data.inventory.items.$.amount': -1, 'data.misc.auctions': 1 } },
				{ upsert: true }
			);

			const ahmade = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setFooter(getFooter('Auction House'))
				.setDescription(
					`Successfully created Auction with ID **${ahid}** for **${caps(
						itemname
					)}** lasting for **${duration} hours**, with a starting bid of **${startbid.toLocaleString()} Coins.**`
				);

			const nobids = new Discord.MessageEmbed()
				.setTitle(`New Auction from ${interaction.user.tag} for ${caps(itemname)}`)
				.setDescription(
					`Auction ID: ${ahid}\nCurrent Bid: ${startbid.toLocaleString()} Coins from Starting Bid\nExpires <t:${expire_time}:R>`
				)
				.setColor('GREEN')
				.setFooter('Skyblock Simulator • Auction House • /suggest idea');

			try {
				const user = await interaction.client.channels.fetch('909715678368518145');
				await user.send({ embeds: [nobids] });
			} catch (e) {}

			return interaction.editReply({ embeds: [ahmade] });
		} else if (action == 'bid') {

			if (!amount || !auctionid) {
				err.setDescription('Amount of coins and auction id are required when bidding on an auction.');
				return interaction.editReply({ embeds: [err] });
			}

      if(amount <= 0) {
        return interaction.editReply({embeds: [errEmbed("Can't input negative Values.", true)]})
      }

			const ah = await collection2.findOne({ _id: auctionid });

			if (!ah) {
				err.setDescription(`Can't find any running auctions with id: ${auctionid}.`);
				return interaction.editReply({ embeds: [err] });
			}
			if (ah.item.last_bidid == interaction.user.id) {
				err.setDescription("You can't overbid yourself on an auction.");
				return interaction.editReply({ embeds: [err] });
			}

			if ((Date.now() / 1000).toFixed() > ah.auction.expiration) {
				err.setDescription('This auction has already expired.');
				return interaction.editReply({ embeds: [err] });
			}

			if (amount >= player.data.profile.coins || amount * 1.1 < ah.item.bid) {
				err.setDescription(
					"You don't have enough coins to bid on this auction or the bid amount isn't 10% more than the current bid."
				);
				return interaction.editReply({ embeds: [err] });
			}

			await collection2.updateOne(
				{ _id: auctionid },
				{
					$set: {
						item: {
							bid: amount,
							last_bidid: interaction.user.id,
							last_bidtag: interaction.user.tag,
							name: ah.item.name,
						},
					},
				},
				{ upsert: true }
			);

			await collection.updateOne(
				{
					_id: interaction.user.id,
				},
				{ $inc: { 'data.profile.coins': -amount } },
				{ upsert: true }
			);

			if (ah.item.last_bidid != 0) {
				await collection.updateOne(
					{
						_id: ah.item.last_bidid,
					},
					{ $inc: { 'data.profile.coins': ah.item.bid } },
					{ upsert: true }
				);
			}

			const embed = new Discord.MessageEmbed()
				.setDescription(`Successfully placed bid of ${amount} Coins on ${ah.item.name} with ID ${ah._id}`)
				.setColor('GREEN')
				.setFooter(getFooter('Auction House'));

			const nobids = new Discord.MessageEmbed()
				.setTitle(`New Auction Bid from ${interaction.user.tag} for ${ah.item.name}`)
				.setDescription(
					`Auction ID: ${ah._id}\nCurrent Bid: ${amount.toLocaleString()} Coins from ${
						interaction.user.tag
					}\nExpires <t:${ah.auction.expiration}:R>`
				)
				.setColor('GREEN')
				.setFooter('Skyblock Simulator • Auction House • /suggest idea');

			try {
				const user = await interaction.client.channels.fetch('909735572036255754');
				await user.send({ embeds: [nobids] });
			} catch (e) {}

			return interaction.editReply({ embeds: [embed] });
		} else if (action == 'list') {
			const auctions = await collection2.find({}).toArray();

			const embed = new Discord.MessageEmbed()
				.setColor(getColor('Auction House'))
				.setFooter(getFooter('Auction House'));

			if (!auctions || auctions.length == 0) {
				embed.setDescription('Currently no running auctions.');

				return interaction.editReply({ embeds: [embed] });
			}

			for (const ah of auctions) {
				if (embed.fields.length < 20) {
					embed.addField(
						`${ah.item.name} from ${ah.owner.tag}`,
						`Auction ID: ${ah._id}\nCurrent Bid: ${ah.item.bid} Coins from ${ah.item.last_bidtag}\nExpires <t:${ah.auction.expiration}:R>`,
						true
					);
				} else {
					break;
				}
			}

			return interaction.editReply({ embeds: [embed] });
		} else if (action == 'view') {
			if (!auctionid) {
				err.setDescription('An auction id is needed when viewing an auction.');
				return interaction.editReply({ embeds: [err] });
			}

			const ah = await collection2.findOne({ _id: auctionid });

			if (!ah) {
				err.setDescription(`No auction found with id: ${auctionid}`);
				return interaction.editReply({ embeds: [err] });
			}

			const embed = new Discord.MessageEmbed()
				.setColor(getColor('Auction House'))
				.setFooter(getFooter('Auction House'))
				.addField(
					`${ah.item.name} from ${ah.owner.tag}`,
					`Auction ID: ${ah._id}\nCurrent Bid: ${ah.item.bid} Coins from ${ah.item.last_bidtag}\nExpires <t:${ah.auction.expiration}:R>`,
					true
				);

			return interaction.editReply({ embeds: [embed] });
		}
	},
};
