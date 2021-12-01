const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');

module.exports = {
	name: 'sbwarp',
	description: 'Warp to Areas / Worlds',
	usage: 'sbwarp (World/Area) (World Name/ Area Name)\nNames are Case Sensitive',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['warp', 'w'],
	cooldown: 10,
	async execute(interaction, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: interaction.user.id });

		if (player === null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			return await interaction.editReply({ embeds: [noprofile] });
		}

		let activity = player.data.misc.is_fishing
			? 'fishing'
			: player.data.misc.is_mining
			? 'mining'
			: player.data.misc.in_dungeon
			? 'in a dungeon'
			: '';
		if (activity) {
			const activityEmbed = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('Warp Blocked')
				.setDescription(`Warping blocked! You are currently ${activity}!`)
				.setFooter(getFooter(player));
			return await interaction.editReply({ embeds: [activityEmbed] });
		}

		//Some Values
		let type = '';
		let island = '';
		let location = '';
		let combatxp = player.data.skills.combat;
		let miningxp = player.data.skills.mining;
		let foragingxp = player.data.skills.foraging;
		let combatareas = ['Hub', "Spider's Den", 'Blazing Fortress', 'The End'];

		const start = new Discord.MessageEmbed()
			.setTitle('Skyblock Simulator Warps')
			.setFooter(getFooter(player))
			.setColor(getColor(player))
			.setDescription('Choose the island type you want to travel to');

		const row = new Discord.MessageActionRow().addComponents(
			new Discord.MessageButton()
				.setEmoji('852069714527911956')
				.setCustomId('combat')
				.setLabel('Combat Areas')
				.setStyle('PRIMARY'),
			new Discord.MessageButton()
				.setEmoji('852069714577719306')
				.setCustomId('mining')
				.setLabel('Mining Areas')
				.setStyle('PRIMARY'),
			/*new Discord.MessageButton()
          .setEmoji('852069714451759114')
          .setCustomId('farming')
          .setLabel('Farming')
          .setStyle('PRIMARY'),
        new Discord.MessageButton()
          .setEmoji('852069714447695872')
          .setCustomId('foraging')
          .setLabel('Foraging')
          .setStyle('PRIMARY'),*/
			new Discord.MessageButton().setCustomId('cancel').setLabel('Cancel').setStyle('DANGER')
		);

		const menu = await interaction.editReply({
			embeds: [start],
			components: [row],
		});

		const filter = (i) => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		};

		//Decide what Skill the Area is
		await menu
			.awaitMessageComponent({
				filter,
				componentType: 'BUTTON',
				time: 60000,
			})
			.then(async (i) => {
				if (i.customId === 'combat') {
					type = 'combat';
				} else if (i.customId === 'mining') {
					type = 'mining';
				} else if (i.customId === 'farming') {
					type = 'farming';
				} else if (i.customId === 'foraging') {
					type = 'foraging';
				} else {
					const cancelled = new Discord.MessageEmbed().setTitle('Menu Cancelled').setColor('RED');
					await interaction.editReply({ embeds: [cancelled], components: [] });
					return;
				}
			})
			.catch((err) => interaction.editReply({ components: [] }));

		//Main Menu for each of the Skills
		if (type === 'combat') {
			const combatembed = new Discord.MessageEmbed()
				.setTitle('Skyblock Simulator Combat Islands')
				.setFooter(getFooter(player))
				.setColor(getColor(player))
				.setDescription('Available islands and their drops.')
				.addField(
					'Hub (combat level 0)',
					`<:rotten_flesh:869900884409221191><:potatoe:869900884593762304><:carrot:869900884300165230>\n<:bone:869900884405002270><:arrow:869900884379832320>`,
					true
				)
				.addField(
					'Spiders Den (combat level 1)',
					`<:string:869908281215299635><:spider_eye:869908281341132830><:slimeball:869900884308549653>`,
					true
				)
				.addField(
					'Blazing Fortress (combat level 5)',
					`<:gold_nugget:869900883977183244><:gold:869126927011708929><:magma_cream:869900884144947201>\n<:ghast_tear:869900884337905684><:blaze_rod:869900884358860820><:bone:869900884405002270>\n<:coal:869126927062028298>`,
					true
				)
				.addField(
					'The End (combat level 12)',
					`<:ender_pearl:869900884337913896><:eye_of_ender:869900884367257650><:arrow:869900884379832320>\n<:obsidian:869490639769853992><:bone:869900884405002270><:summoning_eye:869900884396638238>`,
					true
				);

			const b1 = new Discord.MessageButton()
				.setEmoji('869917093506744380')
				.setCustomId('hub')
				.setLabel('Hub')
				.setStyle('PRIMARY');
			const b2 = new Discord.MessageButton()
				.setEmoji('870267065502662719')
				.setCustomId('spidersden')
				.setLabel('Spiders Den')
				.setStyle('PRIMARY');
			const b3 = new Discord.MessageButton()
				.setEmoji('870267065796268032')
				.setCustomId('blazingfortress')
				.setLabel('Blazing Fortress')
				.setStyle('PRIMARY');
			const b4 = new Discord.MessageButton()
				.setEmoji('870267065737576458')
				.setCustomId('theend')
				.setLabel('The End')
				.setStyle('PRIMARY');
			const b5 = new Discord.MessageButton().setCustomId('cancel').setLabel('Cancel').setStyle('DANGER');

			if (combatxp < 50) {
				b2.setDisabled(true);
				b3.setDisabled(true);
				b4.setDisabled(true);
			} else if (combatxp < 1175) {
				b3.setDisabled(true);
				b4.setDisabled(true);
			} else if (combatxp < 22425) {
				b4.setDisabled(true);
			}

			//add b4 back for the end once added
			const row = new Discord.MessageActionRow().addComponents(b1, b2, b3, b4, b5);
			await interaction.editReply({ embeds: [combatembed], components: [row] });
		} else if (type === 'mining') {
			const miningembed = new Discord.MessageEmbed()
				.setTitle('Skyblock Simulator Mining Islands')
				.setFooter(getFooter(player))
				.setColor(getColor(player))
				.setDescription('Available islands and their ores')
				.addField(
					'Coal Mine (mining level 0)',
					'<:cobblestone:869126927124938832><:coal:869126927062028298>',
					true
				)
				.addField(
					'Gold Mine (mining level 1)',
					'<:cobblestone:869126927124938832><:coal:869126927062028298><:iron:869126927082991636>\n<:gold:869126927011708929>',
					true
				)
				.addField(
					'Deep Caverns (mining level 5)',
					'<:cobblestone:869126927124938832><:coal:869126927062028298><:iron:869126927082991636>\n<:gold:869126927011708929><:lapis:869126926986530847><:redstone:869126927263367168>\n<:emerald:869126927380779008><:diamond:869126926646788097><:obsidian:869490639769853992>',
					true
				)
				.addField(
					'Dwarven Mines (mining level 12)',
					'<:cobblestone:869126927124938832><:coal:869126927062028298><:iron:869126927082991636>\n<:gold:869126927011708929><:lapis:869126926986530847><:redstone:869126927263367168>\n<:emerald:869126927380779008><:diamond:869126926646788097><:mithril:869126927141711902>\n<:titanium:869126927368220763>',
					true
				)
				.addField(
					'Crystal Hollows (mining level 15)',
					'<:coal:869126927062028298><:iron:869126927082991636><:gold:869126927011708929>\n<:lapis:869126926986530847><:redstone:869126927263367168><:emerald:869126927380779008>\n<:diamond:869126926646788097><:mithril:869126927141711902><:titanium:869126927368220763>\n<:hardstone:869126926797799475><:gemstone:869126927137533972>',
					true
				);

			const b0 = new Discord.MessageButton()
				.setEmoji('869126927062028298')
				.setCustomId('coalmine')
				.setLabel('Coal Mine')
				.setStyle('PRIMARY');
			const b1 = new Discord.MessageButton()
				.setEmoji('870269472311750696')
				.setCustomId('goldmine')
				.setLabel('Gold Mine')
				.setStyle('PRIMARY');
			const b2 = new Discord.MessageButton()
				.setEmoji('870269471946833981')
				.setCustomId('deepcaverns')
				.setLabel('Deep Caverns')
				.setStyle('PRIMARY');
			const b3 = new Discord.MessageButton()
				.setEmoji('869126927141711902')
				.setCustomId('dwarvenmines')
				.setLabel('Dwarven Mines')
				.setStyle('PRIMARY');
			const b4 = new Discord.MessageButton()
				.setEmoji('869126927137533972')
				.setCustomId('crystalhollows')
				.setLabel('Crystal Hollows')
				.setStyle('PRIMARY');
			const b5 = new Discord.MessageButton().setCustomId('cancel').setLabel('Cancel').setStyle('DANGER');

			if (miningxp < 50) {
				b1.setDisabled(true);
				b2.setDisabled(true);
				b3.setDisabled(true);
				b4.setDisabled(true);
			} else if (miningxp < 1175) {
				b2.setDisabled(true);
				b3.setDisabled(true);
				b4.setDisabled(true);
			} else if (miningxp < 22425) {
				b3.setDisabled(true);
				b4.setDisabled(true);
			} else if (miningxp < 67425) {
				b4.setDisabled(true);
			}

			const row = new Discord.MessageActionRow().addComponents(b0, b1, b2);
			const row1 = new Discord.MessageActionRow().addComponents(b3, b4, b5);
			await interaction.editReply({ embeds: [miningembed], components: [row, row1] });
		} else if (type === 'farming') {
		} else if (type === 'foraging') {
		} else {
			const cancelled = new Discord.MessageEmbed().setTitle('Menu Cancelled').setColor('RED');
			await interaction.editReply({ embeds: [cancelled], components: [] });
			return;
		}

		if (type === 'combat') {
			await menu
				.awaitMessageComponent({
					filter,
					componentType: 'BUTTON',
					time: 60000,
				})
				.then(async (i) => {
					if (i.customId === 'hub') {
						island = 'Hub';
					} else if (i.customId === 'spidersden') {
						island = "Spider's Den";
					} else if (i.customId === 'blazingfortress') {
						island = 'Blazing Fortress';
					} else if (i.customId === 'theend') {
						island = 'The End';
					} else if (i.customId === 'cancel') {
						const cancelled = new Discord.MessageEmbed().setTitle('Menu Cancelled').setColor('RED');
						await interaction.editReply({ embeds: [cancelled], components: [] });
						return;
					}
				})
				.catch((err) => interaction.editReply({ components: [] }));
		} else if (type === 'mining') {
			await menu
				.awaitMessageComponent({
					filter,
					componentType: 'BUTTON',
					time: 60000,
				})
				.then(async (i) => {
					if (i.customId === 'coalmine') {
						location = 'Coal Mine';
					} else if (i.customId === 'goldmine') {
						location = 'Gold Mine';
					} else if (i.customId === 'deepcaverns') {
						island = 'Deep Caverns';
					} else if (i.customId === 'dwarvenmines') {
						location = 'Dwarven Mines';
					} else if (i.customId === 'crystalhollows') {
						location = 'Crystal Hollows';
					} else if (i.customId === 'cancel') {
						const cancelled = new Discord.MessageEmbed().setTitle('Menu Cancelled').setColor('RED');
						await interaction.editReply({ embeds: [cancelled], components: [] });
						return;
					}
				})
				.catch((err) => interaction.editReply({ components: [] }));
		} else if (type === 'farming') {
		} else if (type === 'foraging') {
		}

		//Different Area for Combat Islands
		if (combatareas.includes(island)) {
			if (island === 'Hub') {
				const hubwarp = new Discord.MessageEmbed()
					.setTitle('Skyblock Simulator Hub Areas')
					.setFooter(getFooter(player))
					.setColor(getColor(player))
					.setDescription(
						'Available areas and their drops\n Graveyard (combat level 0) <:rotten_flesh:869900884409221191><:carrot:869900884300165230><:potatoe:869900884593762304>\nRuins (combat level 1) <:bone:869900884405002270>\nHighlevel (combat level 2) <:bone:869900884405002270><:arrow:869900884379832320>'
					);

				const b1 = new Discord.MessageButton()
					.setEmoji('869900884409221191')
					.setCustomId('graveyard')
					.setLabel('Graveyard')
					.setStyle('PRIMARY');
				const b2 = new Discord.MessageButton()
					.setEmoji('869900884405002270')
					.setCustomId('ruins')
					.setLabel('Ruins')
					.setStyle('PRIMARY');
				const b3 = new Discord.MessageButton()
					.setEmoji('869900884379832320')
					.setCustomId('highlevel')
					.setLabel('Highlevel')
					.setStyle('PRIMARY');
				const b4 = new Discord.MessageButton().setCustomId('cancel').setLabel('Cancel').setStyle('DANGER');

				if (combatxp < 50) {
					b2.setDisabled(true);
					b3.setDisabled(true);
				} else if (combatxp < 175) {
					b3.setDisabled(true);
				}

				const row = new Discord.MessageActionRow().addComponents(b1, b2, b3, b4);

				await interaction.editReply({ embeds: [hubwarp], components: [row] });

				await menu
					.awaitMessageComponent({
						filter,
						componentType: 'BUTTON',
						time: 60000,
					})
					.then(async (i) => {
						if (i.customId === 'graveyard') {
							location = 'Graveyard';
						} else if (i.customId === 'ruins') {
							location = 'Ruins';
						} else if (i.customId === 'highlevel') {
							location = 'Highlevel';
						} else {
							const cancelled = new Discord.MessageEmbed().setTitle('Menu Cancelled').setColor('RED');
							await interaction.editReply({ embeds: [cancelled], components: [] });
							return;
						}
					})
					.catch((err) => interaction.editReply({ components: [] }));
			} else if (island === "Spider's Den") {
				// why tf is all this hard-coded
				// who in their right mind does not modularise this
				const spiderwarp = new Discord.MessageEmbed()
					.setTitle('Skyblock Simulator Hub Areas')
					.setFooter(getFooter(player))
					.setColor(getColor(player))
					.setDescription(
						'Available areas and their drops\n\nLower Spiders Hill (combat level 1) <:string:869908281215299635><:spider_eye:869908281341132830>\nUpper Spiders Hill (combat level 3) <:string:869908281215299635><:spider_eye:869908281341132830>\nSpider Cave (combat level 4) <:string:869908281215299635><:spider_eye:869908281341132830><:slimeball:869900884308549653>'
					);

				const b1 = new Discord.MessageButton()
					.setEmoji('869908281215299635')
					.setCustomId('lowerhill')
					.setLabel('Lower Spiders Hill')
					.setStyle('PRIMARY');
				const b2 = new Discord.MessageButton()
					.setEmoji('869908281341132830')
					.setCustomId('upperhill')
					.setLabel('Upper Spiders Hill')
					.setStyle('PRIMARY');
				const b3 = new Discord.MessageButton()
					.setEmoji('869900884308549653')
					.setCustomId('spidercave')
					.setLabel('Spider Cave')
					.setStyle('PRIMARY');
				const b4 = new Discord.MessageButton().setCustomId('cancel').setLabel('Cancel').setStyle('DANGER');

				if (combatxp < 375) {
					b2.setDisabled(true);
					b3.setDisabled(true);
				} else if (combatxp < 675) {
					b3.setDisabled(true);
				}

				const row = new Discord.MessageActionRow().addComponents(b1, b2, b3, b4);

				await interaction.editReply({ embeds: [spiderwarp], components: [row] });

				await menu
					.awaitMessageComponent({
						filter,
						componentType: 'BUTTON',
						time: 60000,
					})
					.then(async (i) => {
						if (i.customId === 'lowerhill') {
							location = 'Lower Spiders Hill';
						} else if (i.customId === 'upperhill') {
							location = 'Upper Spiders Hill';
						} else if (i.customId === 'spidercave') {
							location = 'Spider Cave';
						} else {
							const cancelled = new Discord.MessageEmbed().setTitle('Menu Cancelled').setColor('RED');
							await interaction.editReply({ embeds: [cancelled], components: [] });
							return;
						}
					})
					.catch((err) => interaction.editReply({ components: [] }));
			} else if (island === 'Blazing Fortress') {
				const blazingwarp = new Discord.MessageEmbed()
					.setTitle('Skyblock Simulator Blazing Fortress Areas')
					.setFooter(getFooter(player))
					.setColor(getColor(player))
					.setDescription(
						'Available areas and their drops\n\nMolten Castle (combat level 5) <:gold_nugget:869900883977183244><:gold:869126927011708929><:blaze_rod:869900884358860820>\nMolten Bridge (combat level 8) <:magma_cream:869900884144947201><:coal:869126927062028298><:bone:869900884405002270>\nLava Field (combat level 10) <:magma_cream:869900884144947201><:ghast_tear:869900884337905684>'
					);

				const b1 = new Discord.MessageButton()
					.setEmoji('869900884358860820')
					.setCustomId('moltencastle')
					.setLabel('Molten Castle')
					.setStyle('PRIMARY');
				const b2 = new Discord.MessageButton()
					.setEmoji('869900884144947201')
					.setCustomId('moltenbridge')
					.setLabel('Molten Bridge')
					.setStyle('PRIMARY');
				const b3 = new Discord.MessageButton()
					.setEmoji('869900884337905684')
					.setCustomId('lavafield')
					.setLabel('Lava Field')
					.setStyle('PRIMARY');
				const b4 = new Discord.MessageButton().setCustomId('cancel').setLabel('Cancel').setStyle('DANGER');

				if (combatxp < 4425) {
					b2.setDisabled(true);
					b3.setDisabled(true);
				} else if (combatxp < 9925) {
					b3.setDisabled(true);
				}

				const row = new Discord.MessageActionRow().addComponents(b1, b2, b3, b4);

				await interaction.editReply({ embeds: [blazingwarp], components: [row] });

				await menu
					.awaitMessageComponent({
						filter,
						componentType: 'BUTTON',
						time: 60000,
					})
					.then(async (i) => {
						if (i.customId === 'moltencastle') {
							location = 'Molten Castle';
						} else if (i.customId === 'moltenbridge') {
							location = 'Molten Bridge';
						} else if (i.customId === 'lavafield') {
							location = 'Lava Field';
						} else {
							const cancelled = new Discord.MessageEmbed().setTitle('Menu Cancelled').setColor('RED');
							await interaction.editReply({ embeds: [cancelled], components: [] });
							return;
						}
					})
					.catch((err) => interaction.editReply({ components: [] }));
			} else if (island === 'The End') {

        const blazingwarp = new Discord.MessageEmbed()
					.setTitle('Skyblock Simulator The End Areas')
					.setFooter(getFooter(player))
					.setColor(getColor(player))
					.setDescription('Available areas and their drops\n\nEnd Gate (combat level 12) <:ender_pearl:869900884337913896><:eye_of_ender:869900884367257650>\nDragon\'s Nest (combat lvl 14) <:ender_pearl:869900884337913896><:eye_of_ender:869900884367257650><:arrow:869900884379832320><:obsidian:869490639769853992><:bone:869900884405002270><:summoning_eye:869900884396638238>\nVoid Sepulture (combat lvl 16) <:ender_pearl:869900884337913896><:eye_of_ender:869900884367257650>');

				const b1 = new Discord.MessageButton()
					.setEmoji('869900884337913896')
					.setCustomId('endgate')
					.setLabel('End Gate')
					.setStyle('PRIMARY');
				const b2 = new Discord.MessageButton()
					.setEmoji('869900884396638238')
					.setCustomId("dragonnest")
					.setLabel("Dragon's Nest")
					.setStyle('PRIMARY');
				const b3 = new Discord.MessageButton()
					.setEmoji('869900884367257650')
					.setCustomId('void')
					.setLabel('Void Sepulture')
					.setStyle('PRIMARY');
				const b4 = new Discord.MessageButton().setCustomId('cancel').setLabel('Cancel').setStyle('DANGER');

				if (combatxp < 47425) {
					b2.setDisabled(true);
					b3.setDisabled(true);
				} else if (combatxp < 67425) {
					b3.setDisabled(true);
				}

				const row = new Discord.MessageActionRow().addComponents(b1, b2, b3, b4);

				await interaction.editReply({ embeds: [blazingwarp], components: [row] });

				await menu
					.awaitMessageComponent({
						filter,
						componentType: 'BUTTON',
						time: 60000,
					})
					.then(async (i) => {
						if (i.customId === 'endgate') {
							location = 'End Gate';
						} else if (i.customId === 'dragonnest') {
							location = "Dragon's Nest";
						} else if (i.customId === 'void') {
							location = 'Void Sepulture';
						} else {
							const cancelled = new Discord.MessageEmbed().setTitle('Menu Cancelled').setColor('RED');
							await interaction.editReply({ embeds: [cancelled], components: [] });
							return;
						}
					})
					.catch((err) => interaction.editReply({ components: [] }));
			}
		} else if (island === 'Deep Caverns') {
			//Different Areas at the Deep Caverns
			const cavernswarp = new Discord.MessageEmbed()
				.setTitle('Skyblock Simulator Deep Caverns Areas')
				.setFooter(getFooter(player))
				.setColor(getColor(player))
				.setDescription(
					"Available areas and their ores\n\nGunpowder Mines (mining level 5) <:cobblestone:869126927124938832><:coal:869126927062028298><:iron:869126927082991636><:gold:869126927011708929>\nLapis Quarry (mining level 6) <:cobblestone:869126927124938832><:lapis:869126926986530847>\nPigman's Den (mining level 7) <:cobblestone:869126927124938832><:redstone:869126927263367168>\nSlimehill (mining level 8) <:cobblestone:869126927124938832><:emerald:869126927380779008>\nDiamond Reserve (mining level 9) <:cobblestone:869126927124938832><:diamond:869126926646788097>\nObsidian Sanctuary (mining level 10) <:cobblestone:869126927124938832><:diamond:869126926646788097><:obsidian:869490639769853992>"
				);

			const b1 = new Discord.MessageButton()
				.setEmoji('869126927082991636')
				.setCustomId('gunpowdermines')
				.setLabel('Gunpowder Mines')
				.setStyle('PRIMARY');
			const b2 = new Discord.MessageButton()
				.setEmoji('869126926986530847')
				.setCustomId('lapisquarry')
				.setLabel('Lapis Quarry')
				.setStyle('PRIMARY');
			const b3 = new Discord.MessageButton()
				.setEmoji('869126927263367168')
				.setCustomId('pigmansden')
				.setLabel("Pigman's Den")
				.setStyle('PRIMARY');
			const b4 = new Discord.MessageButton()
				.setEmoji('869126927380779008')
				.setCustomId('slimehill')
				.setLabel('Slimehill')
				.setStyle('PRIMARY');
			const b5 = new Discord.MessageButton()
				.setEmoji('869126926646788097')
				.setCustomId('diamondreserve')
				.setLabel('Diamond Reserve')
				.setStyle('PRIMARY');
			const b6 = new Discord.MessageButton()
				.setEmoji('869490639769853992')
				.setCustomId('obsidiansanctuary')
				.setLabel('Obsidian Sanctuary')
				.setStyle('PRIMARY');
			const b7 = new Discord.MessageButton().setCustomId('cancel').setLabel('Cancel').setStyle('DANGER');

			if (miningxp < 1925) {
				b2.setDisabled(true);
				b3.setDisabled(true);
				b4.setDisabled(true);
				b5.setDisabled(true);
				b6.setDisabled(true);
			} else if (miningxp < 2925) {
				b3.setDisabled(true);
				b4.setDisabled(true);
				b5.setDisabled(true);
				b6.setDisabled(true);
			} else if (miningxp < 4425) {
				b4.setDisabled(true);
				b5.setDisabled(true);
				b6.setDisabled(true);
			} else if (miningxp < 6425) {
				b5.setDisabled(true);
				b6.setDisabled(true);
			} else if (miningxp < 9925) {
				b6.setDisabled(true);
			}

			const row = new Discord.MessageActionRow().addComponents(b1, b2, b3, b4);
			const row1 = new Discord.MessageActionRow().addComponents(b5, b6, b7);

			await interaction.editReply({ embeds: [cavernswarp], components: [row, row1] });

			await menu
				.awaitMessageComponent({
					filter,
					componentType: 'BUTTON',
					time: 60000,
				})
				.then(async (i) => {
					if (i.customId === 'gunpowdermines') {
						location = 'Gunpowder Mines';
					} else if (i.customId === 'lapisquarry') {
						location = 'Lapis Quarry';
					} else if (i.customId === 'pigmansden') {
						location = "Pigman's Den";
					} else if (i.customId === 'slimehill') {
						location = 'Slimehill';
					} else if (i.customId === 'diamondreserve') {
						location = 'Diamond Reserve';
					} else if (i.customId === 'obsidiansanctuary') {
						location = 'Obsidian Sanctuary';
					} else {
						const cancelled = new Discord.MessageEmbed().setTitle('Menu Cancelled').setColor('RED');
						await interaction.editReply({ embeds: [cancelled], components: [] });
						return;
					}
				})
				.catch((err) => interaction.editReply({ components: [] }));
		}

		//Warping User to Location
		if (location) {
			const confirm = new Discord.MessageEmbed()
				.setTitle(`Travel to ${location}`)
				.setColor('ORANGE')
				.setFooter(getFooter(player))
				.setDescription(`Are you sure you want to travel to the **${location}**`);
			const row = new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton().setCustomId('confirm').setLabel('Confirm').setStyle('SUCCESS'),
				new Discord.MessageButton().setCustomId('cancel').setLabel('Cancel').setStyle('DANGER')
			);
			// interaction.editReply({ embeds: [confirm], components: [row] })

			if (player.data.settings.confirmation == true) {
				await interaction.editReply({ embeds: [confirm], components: [row] });

				await menu
					.awaitMessageComponent({
						filter,
						componentType: 'BUTTON',
						time: 60000,
					})
					.then(async (i) => {
						if (i.customId === 'confirm') {
							await collection.updateOne(
								{ _id: interaction.user.id },
								{ $set: { 'data.misc.location': location } },
								{ upsert: true }
							);

							const travelled = new Discord.MessageEmbed()
								.setDescription(`Travelled to the **${location}**.`)
								.setColor(getColor(player))
								.setFooter(getFooter(player));
							await interaction.editReply({ embeds: [travelled], components: [] });
						} else {
							const cancelled = new Discord.MessageEmbed()
								.setTitle('Cancelled Traveling')
								.setColor('RED');
							await interaction.editReply({ embeds: [cancelled], components: [] });
							return;
						}
					})
					.catch((err) => interaction.editReply({ components: [] }));
			} else {
				await collection.updateOne(
					{ _id: interaction.user.id },
					{ $set: { 'data.misc.location': location } },
					{ upsert: true }
				);

				const travelled = new Discord.MessageEmbed()
					.setDescription(`Travelled to the **${location}**.`)
					.setColor(getColor(player))
					.setFooter(getFooter(player));
				await interaction.editReply({ embeds: [travelled], components: [] });
			}
		}
	},
};
