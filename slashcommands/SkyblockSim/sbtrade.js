const Discord = require('discord.js');
const { caps } = require('../../constants/Functions/general.js')
const { addItems } = require('../../constants/Functions/simulator.js')

module.exports = {
	name: 'sbtrade',
	description: 'a',
	usage: 'sbsettings (Setting Name)',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: [],
	cooldown: 10,
	async execute(interaction, mclient) {
		let action = interaction.options.getString('action');
		let user = interaction.options.getUser('user');
		let tradeitem = interaction.options.getString('trade-item');
		if (tradeitem) {
			tradeitem = tradeitem.toLowerCase();
		}
		let amount = interaction.options.getInteger('amount');

		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: interaction.user.id });

		const collection1 = mclient.db('SkyblockSim').collection('trades');
		let trades = await collection1.findOne({ _id: interaction.user.id });

		if (trades != null && (action == 'send-offer' || action == 'reply-offer')) {
			let ongoingtrade = new Discord.MessageEmbed()
				.setTitle('Ongoing Trade')
				.setDescription(
					`You already have an ongoing trade with <@!${trades.reciever.id}> (${trades.reciever.id}).\nAsk them to respond to it so you can continue trading`
				)
				.setColor('RED')
				.setFooter('Skyblock Simulator');

			return await interaction.editReply({ embeds: [ongoingtrade] });
		}

		if (action == 'send-offer') {
			if (!user.id || user.id == interaction.user.id || user.bot) {
				let nouserembed = new Discord.MessageEmbed()
					.setDescription('You cannot send trades to yourself, a bot, or an invalid user.')
					.setColor('RED')
					.setFooter('Skyblock Simulator');

				return await interaction.editReply({ embeds: [nouserembed] });
			}

			if (tradeitem == null || amount == null) {
				let invalid = new Discord.MessageEmbed()
					.setTitle('Trade item and amount are required for this action.')
					.setColor('RED')
					.setFooter('Skyblock Simulator');

				return await interaction.editReply({ embeds: [invalid] });
			}

			if (tradeitem.includes('coin')) {
				tradeitem = 'coins';

				if (amount > player.data.profile.coins) {
					let lowitemsembed = new Discord.MessageEmbed()
						.setTitle('Too few Items')
						.setDescription(
							`You only have ${player.data.profile.coins} ${tradeitem}, but tried to trade ${amount} ${tradeitem}.`
						)
						.setColor('RED')
						.setFooter('Skyblock Simulator');

					return await interaction.editReply({ embeds: [lowitemsembed] });
				}

				await collection1.updateOne(
					{ _id: interaction.user.id },
					{
						$set: {
							sender: {
								id: interaction.user.id,
								item: caps(tradeitem),
								amount: amount,
								accepted: false,
							},
							reciever: {
								id: user.id,
								item: 'None',
								amount: 0,
								accepted: false,
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

				let dmed = 'yes';
				try {
					let tradereq = new Discord.MessageEmbed()
						.setTitle(`Trade offer from ${interaction.user.tag}`)
						.setDescription(
							`Wants to trade **${amount} ${tradeitem}**.\n\nSend your offer back with \`/sb trade reply-offer @User/UserId Item amount\`.`
						);
					let fetched = await interaction.client.users.fetch(user.id);
					await fetched.send({ embeds: [tradereq] });
				} catch (e) {
					dmed = 'no';
				}

				let sentembed = new Discord.MessageEmbed()
					.setTitle('Trade sent')
					.setDescription(
						`Sent a trade to the user offering them **${amount} ${caps(
							tradeitem
						)}**.\nYou receive a DM when they reply to the offer\n\nUser DM'ed: ${dmed}`
					)
					.setColor('GREEN')
					.setFooter('Skyblock Simulator');

				return await interaction.editReply({ embeds: [sentembed] });
			}

			let finditem = player.data.inventory.items.find((item) => item.name == caps(tradeitem));

			if (finditem == undefined || (finditem.amount == 0 && amount < 0)) {
				let noitemembed = new Discord.MessageEmbed()
					.setTitle('No item found')
					.setDescription(
						`Could not find any items matching \`${caps(tradeitem)}\` or amount being above 0.` // I don't understand what this means
					)
					.setFooter('Skyblock Simulator')
					.setColor('RED');

				return await interaction.editReply({ embeds: [noitemembed] });
			}

			if (amount > finditem.amount) {
				let lowitemsembed = new Discord.MessageEmbed()
					.setTitle('Too few items')
					.setDescription(
						`You only have ${finditem.amount} ${tradeitem}, but tried to trade ${amount} ${tradeitem}.`
					)
					.setColor('RED')
					.setFooter('Skyblock Simulator');

				return await interaction.editReply({ embeds: [lowitemsembed] });
			}

			await collection1.updateOne(
				{ _id: interaction.user.id },
				{
					$set: {
						sender: {
							id: interaction.user.id,
							item: caps(tradeitem),
							amount: amount,
							accepted: false,
						},
						reciever: {
							id: user.id,
							item: 'None',
							amount: 0,
							accepted: false,
						},
					},
				},
				{ upsert: true }
			);

			await collection.updateOne(
				{
					_id: interaction.user.id,
					'data.inventory.items.name': caps(tradeitem),
				},
				{ $inc: { 'data.inventory.items.$.amount': -amount } },
				{ upsert: true }
			);

			let dmed = 'yes';
			try {
				let tradereq = new Discord.MessageEmbed()
					.setTitle(`Trade Offer from ${interaction.user.tag}`)
					.setDescription(
						`Wants to trade **${amount} ${tradeitem}**.\n\nSend your offer back with \`/sb trade reply-offer @User/UserId Item amount\`.`
					);
				let fetched = await interaction.client.users.fetch(user.id);
				await fetched.send({ embeds: [tradereq] });
			} catch (e) {
				dmed = 'no';
			}

			let sentembed = new Discord.MessageEmbed()
				.setTitle('Trade sent')
				.setDescription(
					`Sent a trade to the user offering them **${amount} ${caps(
						tradeitem
					)}**.\nYou receive a DM when they reply to the offer\n\nUser DM'ed: ${dmed}`
				)
				.setColor('GREEN')
				.setFooter('Skyblock Simulator');

			return await interaction.editReply({ embeds: [sentembed] });
		} else if (action == 'reply-offer') {
			if (!user.id || user.id == interaction.user.id || user.bot) {
				let nouserembed = new Discord.MessageEmbed()
					.setDescription('You cant send trades to yourself, a bot, or an invalid user.')
					.setColor('RED')
					.setFooter('Skyblock Simulator');

				return await interaction.editReply({ embeds: [nouserembed] });
			}
			let existingsent = await collection1.findOne({ _id: user.id });
			if (existingsent == null) {
				let embed = new Discord.MessageEmbed()
					.setTitle('This user has not sent you a trade')
					.setColor('RED')
					.setFooter('Skyblock Simulator');

				return await interaction.editReply({ embeds: [embed] });
			}

			if (tradeitem == null || amount == null) {
				let invalid = new Discord.MessageEmbed()
					.setTitle('Trade item and amount are required for this action.')
					.setColor('RED')
					.setFooter('Skyblock Simulator');

				return await interaction.editReply({ embeds: [invalid] });
			}

			if (tradeitem.includes('coin')) {
				tradeitem = 'Coins';

				if (amount > player.data.profile.coins) {
					let lowitemsembed = new Discord.MessageEmbed()
						.setTitle('Too few Items')
						.setDescription(
							`You only have ${player.data.profile.coins} ${tradeitem}, but tried to trade ${amount} ${tradeitem}.`
						)
						.setColor('RED')
						.setFooter('Skyblock Simulator');

					return await interaction.editReply({ embeds: [lowitemsembed] });
				}

				////////////////////////////////////////////////
				await collection1.updateOne(
					{ _id: user.id },
					{
						$set: {
							reciever: {
								id: interaction.user.id,
								item: caps(tradeitem),
								amount: amount,
								accepted: true,
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

				let dmed = 'yes';
				try {
					let tradereq = new Discord.MessageEmbed()
						.setTitle(`Trade offer from ${interaction.user.tag}`)
						.setDescription(
							`Wants to offer **${amount} ${tradeitem}** for the items you offered them.\n\nAccept or deny the trade with \`/sb trade accpet-offer/deny-offer @User/UserId\``
						);
					let fetched = await interaction.client.users.fetch(user.id);
					await fetched.send({ embeds: [tradereq] });
				} catch (e) {
					dmed = 'no';
				}

				let sentembed = new Discord.MessageEmbed()
					.setTitle('Trade sent')
					.setDescription(
						`Sent a trade to the user offering them **${amount} ${caps(
							tradeitem
						)}**.\nYou receive a DM when they reply to the offer\n\nUser DM'ed: ${dmed}`
					)
					.setColor('GREEN')
					.setFooter('Skyblock Simulator');

				return await interaction.editReply({ embeds: [sentembed] });
			}

			let finditem = player.data.inventory.items.find((item) => item.name == caps(tradeitem));

			if (finditem == undefined || (finditem.amount == 0 && amount < 0)) {
				let noitemembed = new Discord.MessageEmbed()
					.setTitle('No Item found.')
					.setDescription(`Couldn\'t find any items matching \`${caps(tradeitem)}\`.`)
					.setFooter('Skyblock Simulator')
					.setColor('RED');

				return await interaction.editReply({ embeds: [noitemembed] });
			}

			if (amount > finditem.amount) {
				let lowitemsembed = new Discord.MessageEmbed()
					.setTitle('Too few Items')
					.setDescription(
						`You only have ${finditem.amount} ${tradeitem}, but tried to trade ${amount} ${tradeitem}.`
					)
					.setColor('RED')
					.setFooter('Skyblock Simulator');

				return await interaction.editReply({ embeds: [lowitemsembed] });
			}

			await collection1.updateOne(
				{ _id: user.id },
				{
					$set: {
						reciever: {
							id: interaction.user.id,
							item: caps(tradeitem),
							amount: amount,
							accepted: true,
						},
					},
				},
				{ upsert: true }
			);

			await collection.updateOne(
				{
					_id: interaction.user.id,
					'data.inventory.items.name': caps(tradeitem),
				},
				{ $inc: { 'data.inventory.items.$.amount': -amount } },
				{ upsert: true }
			);

			let dmed = 'yes';
			try {
				let tradereq = new Discord.MessageEmbed()
					.setTitle(`Trade Offer from ${interaction.user.tag}`)
					.setDescription(
						`Wants to offer **${amount} ${tradeitem}** for the items you offered them.\n\nAccept or deny the trade with \`/sb trade accpet-offer/deny-offer @User/UserId\``
					);
				let fetched = await interaction.client.users.fetch(user.id);
				await fetched.send({ embeds: [tradereq] });
			} catch (e) {
				dmed = 'no';
			}

			let sentembed = new Discord.MessageEmbed()
				.setTitle('Trade sent')
				.setDescription(
					`Sent a trade to the user offering them **${amount} ${caps(
						tradeitem
					)}**.\nYou receive a DM when they reply to the offer\n\nUser DM'ed: ${dmed}`
				)
				.setColor('GREEN')
				.setFooter('Skyblock Simulator');

			return await interaction.editReply({ embeds: [sentembed] });
		} else if (action == 'accept-offer') {
			let offer = await collection1.findOne({ _id: interaction.user.id });
			if (offer == null) {
				let embed = new Discord.MessageEmbed()
					.setTitle('No outgoing trades to that user')
					.setColor('RED')
					.setFooter('Skyblock Simulator');

				return await interaction.editReply({ embeds: [embed] });
			}
			let user1 = await collection.findOne({ _id: offer.reciever.id });
			let user2 = await await collection.findOne({
				_id: offer.sender.id,
			});

			if (offer.sender.item == 'Coins') {
				await collection.updateOne(
					{ _id: offer.reciever.id },
					{
						$inc: {
							'data.profile.coins': offer.sender.amount,
						},
					},
					{ upsert: true }
				);
			} else {
				const updatePlayer = await addItems(offer.sender.item, offer.sender.amount, user1);

				await collection.replaceOne({ _id: offer.reciever.id }, updatePlayer);
			}

			if (offer.reciever.item == 'Coins') {
				await collection.updateOne(
					{ _id: offer.sender.id },
					{
						$inc: {
							'data.profile.coins': offer.reciever.amount,
						},
					},
					{ upsert: true }
				);
			} else {
				const updatePlayer1 = await addItems(offer.reciever.item, offer.reciever.amount, user2);

				await collection.replaceOne({ _id: offer.sender.id }, updatePlayer1);
			}

			try {
				let tradereq = new Discord.MessageEmbed()
					.setTitle(`Trade accepted`)
					.setDescription(`You received **${offer.reciever.amount}x ${offer.reciever.item}**`);
				let fetched = await interaction.client.users.fetch(offer.sender.id);
				await fetched.send({ embeds: [tradereq] });
			} catch (e) {}
			try {
				let tradereq = new Discord.MessageEmbed()
					.setTitle(`Trade accepted`)
					.setDescription(`You received **${offer.sender.amount}x ${offer.sender.item}**`);
				let fetched = await interaction.client.users.fetch(offer.reciever.id);
				await fetched.send({ embeds: [tradereq] });
			} catch (e) {}

			try {
				await collection1.deleteOne({ _id: interaction.user.id });
			} catch (e) {}

			let tradedone = new Discord.MessageEmbed()
				.setTitle('Trade accepted and complete')
				.setColor('GREEN')
				.setFooter('Skyblock Simulator');

			await interaction.editReply({ embeds: [tradedone] });
		} else if (action == 'deny-offer') {
			let offer = await collection1.findOne({ _id: interaction.user.id });
			if (offer == null) {
				let embed = new Discord.MessageEmbed()
					.setTitle('No outgoing trades to that user')
					.setColor('RED')
					.setFooter('Skyblock Simulator');

				return await interaction.editReply({ embeds: [embed] });
			}
			let user1 = await collection.findOne({ _id: offer.reciever.id });
			let user2 = await await collection.findOne({
				_id: offer.sender.id,
			});

			if (offer.reciever.item == 'Coins') {
				await collection.updateOne(
					{ _id: offer.reciever.id },
					{
						$inc: {
							'data.profile.coins': offer.reciever.amount,
						},
					},
					{ upsert: true }
				);
			} else {
				const updatePlayer = await addItems(offer.reciever.item, offer.reciever.amount, user1);

				await collection.replaceOne({ _id: offer.reciever.id }, updatePlayer);
			}

			if (offer.sender.item == 'Coins') {
				await collection.updateOne(
					{ _id: offer.sender.id },
					{
						$inc: {
							'data.profile.coins': offer.sender.amount,
						},
					},
					{ upsert: true }
				);
			} else {
				const updatePlayer1 = await addItems(offer.sender.item, offer.sender.amount, user2);

				await collection.replaceOne({ _id: offer.sender.id }, updatePlayer1);
			}

			try {
				let tradereq = new Discord.MessageEmbed()
					.setTitle(`Trade denied`)
					.setDescription(`**${offer.reciever.amount}x ${offer.reciever.item}** was returned to you.`);
				let fetched = await interaction.client.users.fetch(offer.reciever.id);
				await fetched.send({ embeds: [tradereq] });
			} catch (e) {}
			try {
				let tradereq = new Discord.MessageEmbed()
					.setTitle(`Trade denied`)
					.setDescription(`**${offer.sender.amount}x ${offer.sender.item}** was returned to you.`);
				let fetched = await interaction.client.users.fetch(offer.sender.id);
				await fetched.send({ embeds: [traddeniedereq] });
			} catch (e) {}

			try {
				await collection1.deleteOne({ _id: interaction.user.id });
			} catch (e) {}

			let tradedone = new Discord.MessageEmbed()
				.setTitle('Trade denied')
				.setColor('GREEN')
				.setFooter('Skyblock Simulator');

			await interaction.editReply({ embeds: [tradedone] });
		}
	},
};