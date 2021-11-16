const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');

module.exports = {
	name: 'sbwiki',
	description: 'a',
	usage: 'sbwiki (Setting Namee)',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: [],
	cooldown: 10,
	async execute(interaction, mclient) {
		const collection = mclient.db('SkyblockSim').collection('events');
		let events = await collection.find({}).toArray();

		let mf_event = events[0];
		let shark_event = events[1];

		const embed = new Discord.MessageEmbed()
			.setTitle('Skyblock Simulator Wiki')
			.setColor(getColor('Skyblock'))
			.setFooter(getFooter('Skyblock'))
			.setDescription('Press the corresponding button to see the information of the desired item.');

		const button1 = new Discord.MessageButton().setCustomId('general').setLabel('General Info').setStyle('PRIMARY');
		const button2 = new Discord.MessageButton().setCustomId('symbols').setLabel('Symbols').setStyle('PRIMARY');
		const button3 = new Discord.MessageButton().setCustomId('events').setLabel('Events').setStyle('PRIMARY');
		const button4 = new Discord.MessageButton().setCustomId('dungeons').setLabel('Dungeons').setStyle('PRIMARY');
		const button5 = new Discord.MessageButton().setCustomId('reforges').setLabel('Reforges').setStyle('PRIMARY');

		const row1 = new Discord.MessageActionRow().addComponents(button1, button2, button3, button4, button5);
		//const row2 = new Discord.MessageActionRow().addComponents(button6);

		let menu = await interaction.editReply({
			embeds: [embed],
			components: [row1],
		});

		const filter = (i) => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		};

		const collector = menu.createMessageComponentCollector({
			filter,
			componentType: 'BUTTON',
			time: 858000,
		});

		collector.on('collect', async (i) => {
			if (i.customId == 'general') {
				const generalembed = new Discord.MessageEmbed()
					.setTitle('General Information')
          .addField('Voting', 'By voting [here](https://top.gg/bot/839835292785704980) you recieve 2 Gems, which are used to buy the best items and you also support my Developer.')
					.addField('Suggest Ideas', 'Use /suggest to send ideas or suggestions to be added at the bot. These will then be sent to <#909871468136001606> in my [Support Server](https://discord.gg/Ca6XpTRQaR)', true)
          .addField('Bug found?', 'Make sure to join my [Support Server](https://discord.gg/Ca6XpTRQaR) and report them in <#908702024902787132>. In return you get some buffs at the game.', true)
          .addField('Looking for help or advice?', 'You can ask for advice in <#908705612970479707> in my [Support Server](https://discord.gg/Ca6XpTRQaR)', true)
					.setColor(getColor('Skyblock'))
					.setFooter(getFooter('Skyblock'));

				menu.edit({ embeds: [generalembed] });
			} else if (i.customId == 'symbols') {
				const symbolembed = new Discord.MessageEmbed()
					.setTitle('Symbol Information')
					.setColor(getColor('Skyblock'))
					.setFooter(getFooter('Skyblock'))
					.setDescription(
						'`❤ Health`\n`❈ Defense`\n`⚔️ Damage`\n`❁ Strength`\n`☣ Crit chance`\n`☠ Crit damage`\n`✯ Magic find`\n`α Sea Creature chance`\n`🎣 Fishing speed`\n`⸕ Mining speed`\n`☘ Mining fortune`'
					);

				menu.edit({ embeds: [symbolembed] });
			} else if (i.customId == 'events') {
				let time = Date.now() / 1000;

				let eventembed = new Discord.MessageEmbed();
				eventembed.setTitle('Event Information');
				eventembed.setColor(getColor('Skyblock'));
				eventembed.setFooter(getFooter('Skyblock'));
				if (mf_event.enabled == false) {
					eventembed.addField(
						`Magic Find`,
						`Everyday from 6:00 - 8:00 (6 am - 8 am) and 16:00 - 18:00 (4:00 pm - 6:00 pm)\nEvent Active: ${mf_event.enabled}\nNext Event: <t:${mf_event.next_event}:R>`
					);
				} else {
					eventembed.addField(
						`Magic Find`,
						`Everyday from 6:00 - 8:00 (6 am - 8 am) and 16:00 - 18:00 (4:00 pm - 6:00 pm)\nEvent Active: ${mf_event.enabled}\nEvent End: <t:${mf_event.end_event}:R>`
					);
				}

				if (shark_event.enabled == false) {
					eventembed.addField(
						`Shark Fishing`,
						`Everyday from 9:00 - 11:00 (9 am - 11 am) and 20:00 - 22:00 (8:00 pm - 10:00 pm)\nEvent Active: ${shark_event.enabled}\nNext Event: <t:${shark_event.next_event}:R>`
					);
				} else {
					eventembed.addField(
						`Shark Fishing`,
						`Everyday from 9:00 - 11:00 (9 am - 11 am) and 20:00 - 22:00 (8:00 pm - 10:00 pm)\nEvent Active: ${shark_event.enabled}\nEvent End: <t:${shark_event.end_event}:R>`
					);
				}

				menu.edit({ embeds: [eventembed] });
			} else if (i.customId == 'dungeons') {
				let dungeonsembed = new Discord.MessageEmbed()
					.setTitle('Dungeons Information')
					.setColor(getColor('Skyblock'))
					.setFooter(getFooter('Skyblock'))
					.addField(
						'Classes',
						'Give bonuses inside Dungeon runs\n\nAssassin (`2 ❁` per class level)\nBerserker (`1 ❁` and `1 ❈` per class level)\nTank (`1 ❈` and `2 ❤` per class level)',
						true
					)
					.addField('Score', 'Used to determine the Loot Chests you will recieve after the dungeon run', true)
					.addField(
						'Puzzles',
						'Small puzzles like a quiz and tic-tac-toe are found in a dungeon run which grant 30 score.',
						true
					)
					.addField(
						'Loot Chests',
						'Spawn after defeating the Dungeon Boss\n\n<:oak_wood:882624301503754350> Chest (guaranteed)\n<:gold:869126927011708929> Chest (guaranteed)\n<:diamond:869126926646788097> Chest (min. F2 & min. 150 score)\n<:emerald:869126927380779008> Chest (min. F3 & min. 180 score)',
						true
					)
					.addField(
						'Dungeon Loot',
						'Found in Loot Chests at the end of the dungeon run.\nCurrently Recombobulators, 5 different armor sets and 5 different swords can be found in Loot Chests.',
						true
					);

				menu.edit({ embeds: [dungeonsembed] });
			} else if (i.customId == 'reforges') {
				let reforgeembed = new Discord.MessageEmbed()
					.setTitle('Reforge Information')
					.setColor(getColor('Skyblock'))
					.setFooter(getFooter('Skyblock'))
					.setDescription('**Format:** Reforge Stone Name (Reforge Bonus) [Reforge Name] {Item Origin}')
					.addField(
						'General Reforges',
						'Recombobulator 3000 (10% Item Stat increase) [] {Dungeons any Floor}',
						true
					)
					.addField(
						'Sword Reforges',
						'Dragon Claw (\`50 ❁\`, \`25 ☠\`) [Fabled] {Dragons}\nWither Blood (\`75 ❁\`) [Withered] {Dungeons}\nWarped Stone (\`20 ❁\`, \`10 ☣\`, \`30 ☠\`) [Warped] {}',
						true
					)
					.addField(
						'Armor Reforges',
						"Deep Sea Orb (\`10 α\`) [Submerged] {Fishing}\nDragon Horn (\`50 ❤\`, \`20 ❈\`, \`15 ❁\`, \`20 ☠\`, \`10 ✯\`) [Renowned] {Dragons}\nPrecursor Gear (\`25 ❁\`, \`10 ☣\`, \`50 ☠\`) [Ancient] {Dungeons}\nSadan's Brooch (\`75 ❤\`, \`25 ❈\`) [Empowered] {Dungeons}",
						true
					)
					.addField(
						'Fishing Rod Reforges',
						'Hardened Wood (\`5 α\`) [Stiff] {Fishing}\nLucky Dice (\`7 α\`, \`5 ✯\`) [Lucky] {Fishing}',
						true
					)
					.addField(
						'Pickaxe Reforges',
						'Onyx (\`10 ☘\`) [Fruitful] {Mining}\nDiamonite (\`20 ☘\`) [Fleet] {Mining}\nRock Gemstone (\`30 ☘\`) [Auspicious] {Mining}',
						true
					);

				menu.edit({ embeds: [reforgeembed] });
			}
		});
	},
};
