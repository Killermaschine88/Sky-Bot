const Discord = require('discord.js');
const config = require('../constants/Bot/config.json');

module.exports = {
	name: 'interactionCreate',
	/**
	 *
	 * @param {Discord.Interaction} interaction
	 * @param {*} mclient
	 * @returns
	 */
	async execute(interaction, mclient) {
		if (interaction.isAutocomplete()) {
			const focused = interaction.options.getFocused();

			if (interaction.options.getSubcommand(false) == 'reforge') {
				let stones = [
					'Dragon Claw',
					'Wither Blood',
					'Warped Stone',
					'Deep Sea Orb',
					'Dragon Horn',
					'Precursor Gear',
					"Sadan's Brooch",
					'Onyx',
					'Diamonite',
					'Rock Gemstons',
					'Hardened Wood',
					'Lucky Dice',
					'Recombobulator 3000',
				];
				let found = [];
				let found2 = [];
				let seen = stones.filter((stone) => stone.toLowerCase().includes(focused) || stone.includes(focused));

				if (seen.length != 0) {
					let i = 0;
					for (const stone of seen) {
						if (i < 25) {
							found.push({
								name: stone,
								value: stone,
							});
						} else {
							break;
						}
					}
				}

				if (found.length != 0) {
					interaction.respond(found);
				} else {
					interaction.respond(found2);
				}
			} else if (interaction.options.getSubcommand(false) == 'sell') {
				const collection = mclient.db('SkyblockSim').collection('Players');
				let player = await collection.findOne({ _id: interaction.user.id });

				let items = '';
				let seen = '';
				let found = [];
				let found2 = [];

				if (player == null) {
					items = [
						'Hardstone',
						'Coal',
						'Iron Ingot',
						'Gold Ingot',
						'Lapis Lazuli',
						'Redstone',
						'Emerald',
						'Diamond',
						'Mithril',
						'Titanium',
						'Gemstone',
						'Lilypad',
						'Recombobulator 3000',
						'Gold Nugget',
						'Blaze Rod',
						'Enchanted Gold Ingot',
						'Enchanted Blaze Rod',
						'Magma Cream',
						'Bone',
						'Enchanted Magma Cream',
						'Enchanted Bone',
						'Enchanted Coal',
						'Ghast Tear',
						'Enchanted Ghast Tear',
						'Ender Pearl',
						'Enchanted Ender Pearl',
						'Eye of Ender',
						'Enchanted Eye of Ender',
						'Obsidian',
						'Enchanted Obsidian',
						'Summoning Eye',
						'Arrow',
						'Slimeball',
						'String',
						'Spider Eye',
						'Enchanted Slimeball',
						'Enchanted String',
						'Enchanted Spider Eye',
						'Rotten Flesh',
						'Carrot',
						'Potato',
						'Shark Fin',
					];
					seen = items.filter((item) => item.toLowerCase().includes(focused) || item.includes(focused));

					if (seen.length != 0) {
						let i = 0;
						for (const item of seen) {
							if (i < 15) {
								found.push({
									name: item,
									value: item,
								});
								i++;
							} else {
								break;
							}
						}
					}
				} else {
					items = player.data.inventory.items;
					seen = items.filter(
						(item) => item.amount != 0 && item.name.toLowerCase().includes(focused.toLowerCase())
					);
					//console.log(seen)
					if (seen.length != 0) {
						let i = 0;
						for (const item of seen) {
							//console.log(item)
							if (i < 15) {
								found.push({
									name: item.name,
									value: item.name,
								});
								i++;
							} else {
								break;
							}
						}
					}
				}
				//console.log(found)
				//console.log(items)

				// console.log(seen)
				//  return

				/*if (seen.length != 0) {
					let i = 0;
					for (const item of seen) {
						if (i < 10) {
							found.push({
								name: item,
								value: item,
							});
							i++;
						} else {
							break;
						}
					}
				}*/

				if (found.length != 0) {
					interaction.respond(found);
				} else {
					interaction.respond(found2);
				}
			}
		}

		if (!interaction.isCommand()) return;

		if (config.blacklistedusers.includes(interaction.user.id)) {
			let blockedembed = new Discord.MessageEmbed()
				.setTitle('User Blocked')
				.setDescription(
					'You are blocked from using this Bot if you think this is false join my [Support Server](https://discord.gg/Ca6XpTRQaR) and DM Baltraz#4874 to appeal.'
				)
				.setColor('RED');

			return interaction.reply({
				embeds: [blockedembed],
				ephemeral: true,
			});
		}

		let validchannels = ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'];
		if (!validchannels.includes(interaction.channel.type)) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Unsupported Channel')
				.setColor('ORANGE')
				.setDescription(
					'I only work in Text Channels and Threads please invite me to a Server using the attached Button or create an Thread and use me there.'
				)
				.setFooter('Sky Bot Dev');

			const row = new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setLabel('Bot Invite')
					.setURL(
						'https://discord.com/api/oauth2/authorize?client_id=839835292785704980&permissions=139653925953&scope=applications.commands%20bot'
					)
					.setStyle('LINK')
			);

			interaction.reply({
				embeds: [embed],
				components: [row],
				ephemeral: true,
			});
			return;
		}

		let commandExecute = interaction.commandName;

		if (interaction.options.getSubcommand(false) != null) {
			commandExecute = interaction.commandName + interaction.options.getSubcommand(false);
		}

		const collection1 = mclient.db('Sky-Bot').collection('settings');
		let settings = await collection1.findOne({
			_id: interaction.client.user.id,
		});

		if (settings.maintanance.state == true && interaction.user.id != '570267487393021969') {
			const maintan = new Discord.MessageEmbed()
				.setTitle('⚠️ Sky Bot Maintanance ⚠️')
				.setColor('ORANGE')
				.setDescription(
					`Maintanance Mode enabled because of **${settings.maintanance.reason}**!\nPlease wait while it is being worked on.`
				);
			return interaction.reply({ embeds: [maintan] });
		}

		if (interaction.commandName == 'sb') {
			const collection = mclient.db('SkyblockSim').collection('Players');
			let player = await collection.findOne({ _id: interaction.user.id });

			if (player != null) {
				let time_now = Math.floor(Date.now() / 1000);
				if (
					player.data.misc.booster_cookie.expires <= time_now &&
					player.data.misc.booster_cookie.active == true
				) {
					await collection.updateOne(
						{ _id: interaction.user.id },
						{
							$set: {
								'data.misc.booster_cookie.active': false,
								'data.misc.booster_cookie.expires': time_now,
							},
						},
						{ upsert: true }
					);
				}
			}

			const collection2 = mclient.db('SkyblockSim').collection('blockedchannels');
			let channel = await collection2.findOne({
				_id: interaction.channelId,
			});
			if (channel) {
				if (channel.user != interaction.user.id) {
					if (channel.blocked == true) {
						const blockedembed = new Discord.MessageEmbed()
							.setColor('ORANGE')
							.setTitle('Channel occupied')
							.setDescription(
								'This channel is already being used by someone to play dungeons or to fish/mime.\n\nTo reduce lag for them please consider inviting me to your own Server or creating a Thread to play there.'
							)
							.setFooter('Kind regards Sky Bot Developer');
						const row = new Discord.MessageActionRow().addComponents(
							new Discord.MessageButton()
								.setLabel('Bot Invite')
								.setURL(
									'https://discord.com/api/oauth2/authorize?client_id=839835292785704980&permissions=139653925953&scope=applications.commands%20bot'
								)
								.setStyle('LINK')
						);
						return interaction.reply({
							embeds: [blockedembed],
							components: [row],
							ephemeral: true,
						});
					}
				}
			}
		}

		const { cooldowns } = interaction.client;

		if (!cooldowns.has(commandExecute)) {
			cooldowns.set(commandExecute, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(commandExecute);
		let cd = interaction.client.slashcommands.get(commandExecute).cooldown;

		let cooldownAmount = (cd || 3) * 1000;

		/*//Owner Cooldown Bypass
		if (interaction.user.id === '570267487393021969') {
			cooldownAmount = 0
		}*/

		if (timestamps.has(interaction.user.id)) {
			let expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			/*const collection = mclient.db('Sky-Bot').collection('SkyblockSim')
    const found = await collection.findOne({ _id: message.author.id })

    //Phoenix Pet Cooldown Reduction
    let cdr1 = 0
    let cdr2 = 0
    let cdr3 = 0
    let cdr4 = 0

    if (found.phoenix === true) {
      cdr1 = 2000
    }
    if (found.dragon === true) {
      cdr2 = 2000
    }
    if (found.luckcharm === true) {
      cdr3 = 1000
    }
    if (found.enderman === true) {
      cdr4 = 1000
    }


    let reduced = cdr1 + cdr2 + cdr3 + cdr4*/
			let exptime = expirationTime;

			if (now < exptime && interaction.user.id !== '570267487393021969') {
				const timeLeft = (exptime - now) / 1000;
				let cdembed = new Discord.MessageEmbed()
					.setTitle('Command Cooldown')
					.setColor('ORANGE')
					.setDescription(
						`You need to wait **${timeLeft.toFixed(1)}s** before using **${commandExecute}** again.`
					);

				return interaction.reply({
					embeds: [cdembed],
					ephemeral: true,
				});
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
		/*console.log(timestamps)
    console.log(now)
    console.log(cooldownAmount)*/

		try {
			const collection = mclient.db('Sky-Bot').collection('commanduses');
			collection.updateOne({ _id: interaction.commandName }, { $inc: { uses: 1 } }, { upsert: true });

			await interaction.deferReply();
			await interaction.client.slashcommands.get(commandExecute).execute(interaction, mclient);
		} catch (error) {
			console.error(error);
			interaction.followUp({
				content: 'There was an error while executing this command and the Bot Dev has been notified.',
				ephemeral: true,
			});
			const errembed = new Discord.MessageEmbed()
				.setTitle(`Error occured when ${interaction.user.tag} used ${commandExecute}`)
				.setDescription(`${error.stack}`);
			await interaction.client.users.fetch('570267487393021969').then(async (user) => {
				await user.send({ embeds: [errembed] });
			});
		}
	},
};
