const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const playerStats = require('../../constants/Simulator/Functions/playerStats.js');
const classLevel = require('../../constants/Simulator/Functions/dungeonlevel.js');
const skillLevel = require('../../constants/Simulator/Functions/skilllvl.js');
const lt = require('../../constants/Simulator/LootTables/loottables.js');
const dungloot = require('../../constants/Simulator/Json/dungeonloot.json');

module.exports = {
	name: 'sbdungeons',
	description: 'Settings for SkyblockSim',
	usage: 'sbsettings (Setting Name)',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: [],
	cooldown: 10,
	async execute(interaction, mclient) {
		const movePlayer = (movement, ignoreEvent) => {
			let [x, y] = location;

			if (movement === 'up') {
				var a = x - 1;
				var b = y;
			} else if (movement === 'left') {
				var a = x;
				var b = y - 1;
			} else if (movement === 'right') {
				var a = x;
				var b = y + 1;
			} else if (movement === 'down') {
				var a = x + 1;
				var b = y;
			}
			if (a == undefined || b == undefined) {
				collector.stop();
				test.fields = [];
				var noButtonedit = true;
				let crashembed = new MessageEmbed()
					.addField(
						'Dungeon Run Crashed',
						"**Reason:** User spammed a button.\nDon't spam the buttons; give the bot time to respond."
					)
					.setColor('RED');
				return interaction.followUp({
					embeds: [crashembed],
					ephemeral: true,
				});
			}
			if (map[a][b] == 0 || ((map[a][b] == 3 || map[a][b] == 4 || map[a][b] == 6) && !ignoreEvent))
				return [location, false];

			map[x][y] = 1;

			location = [a, b];

			const puzzle = map[a][b] == 5 ? true : false;
			map[a][b] = 2;
			return [location, puzzle];
		};
		const mapArray = () => {
			let string = '';
			let index = 0;
			for (const row of map) {
				for (const item of row) {
					index++;
					if (item == 0) string += wall;
					else if (item == 1 || item == 5) string += air;
					//  else if(item == 1) string += air
					//  else if(item == 5) string += '⚪'
					else if (item == 2) string += Player;
					else if (item == 3) string += puzzle;
					else if (item == 4) string += enemy;
					else if (item == 6) string += door;
					// reset the row
					if (index == map[0].length) (index = 0), (string += '\n');
				}
			}
			return string;
		};

		const nearEnemy = () => {
			if (location == undefined) {
				collector.stop();
				test.fields = [];
				var noButtonedit = true;
				let crashembed = new MessageEmbed()
					.addField(
						'Dungeon Run Crashed',
						"**Reason:** User spammed a button.\nDon't spam the buttons; give the bot time to respond."
					)
					.setColor('RED');
				return interaction.followUp({
					embeds: [crashembed],
					ephemeral: true,
				});
			}
			let [x, y] = location;

			let oldX = map[x];
			let upX = map[x - 1];
			let downX = map[x + 1];

			if (!oldX || !upX || !downX) return false;

			// Check if enemy is on the right
			if (oldX[y + 1] == 4) return [true, 'right'];
			// Check if enemy is on the left
			if (oldX[y - 1] == 4) return [true, 'left'];
			// Check if enemy is below
			if (downX[y] == 4) return [true, 'down'];
			// Check if enemy is above
			if (upX[y] == 4) return [true, 'up'];
			return false;
		};
		const nearPuzzle = () => {
			if (location == undefined) {
				collector.stop();
				test.fields = [];
				var noButtonedit = true;
				let crashembed = new MessageEmbed()
					.addField(
						'Dungeon Run Crashed',
						"**Reason:** User spammed a button.\nDon't spam the buttons; give the bot time to respond."
					)
					.setColor('RED');
				return interaction.followUp({
					embeds: [crashembed],
					ephemeral: true,
				});
			}
			let [x, y] = location;

			let oldX = map[x];
			let upX = map[x - 1];
			let downX = map[x + 1];

			if (!oldX || !upX || !downX) return false;

			// Check if puzzle is on the right
			if (oldX[y + 1] == 3) return [true, 'right'];
			// Check if puzzle is on the left
			if (oldX[y - 1] == 3) return [true, 'left'];
			// Check if puzzle is below
			if (downX[y] == 3) return [true, 'down'];
			// Check if puzzle is above
			if (upX[y] == 3) return [true, 'up'];
			return false;
		};
		const nearDoor = () => {
			if (location == undefined) {
				collector.stop();
				test.fields = [];
				var noButtonedit = true;
				let crashembed = new MessageEmbed()
					.addField(
						'Dungeon Run Crashed',
						"**Reason:** User spammed a button.\nDon't spam the buttons; give the bot time to respond."
					)
					.setColor('RED');
				return interaction.followUp({
					embeds: [crashembed],
					ephemeral: true,
				});
			}

			let [x, y] = location;

			let oldX = map[x];
			let upX = map[x - 1];
			let downX = map[x + 1];

			if (!oldX || !upX || !downX) return false;

			// Check if door is on the right
			if (oldX[y + 1] == 6) return [true, 'right'];
			// Check if door is on the left
			if (oldX[y - 1] == 6) return [true, 'left'];
			// Check if door is below
			if (downX[y] == 6) return [true, 'down'];
			// Check if door is above
			if (upX[y] == 6) return [true, 'up'];
			return false;
		};
		const dmgtaken = (php, mdmg) => {
			php -= mdmg;
			return php;
		};
		const dmgdealt = (mhp, pdmg) => {
			mhp -= pdmg;
			return mhp;
		};
		const sleep = async (ms) => {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
		};
		const isCrit = (critchance) => {
			return Math.random() * 100 < critchance ? true : false;
		};
		const updateTTT = (x, y, user) => {
			const emoji = user ? '🟩' : '🟥';
			let txt = '',
				index = 0;
			table[x][y] = emoji;

			for (const row of table) {
				for (const column of row) {
					index++;
					txt += ' **|** ' + column;
					if (index % 3 == 0) txt += ' **|**\n';
				}
			}
			return txt;
		};
		const wincheckTTT = () => {
			const [a, b, c] = table[0];
			const [d, e, f] = table[1];
			const [g, h, i] = table[2];

			if (
				a != fog &&
				b != fog &&
				c != fog &&
				d != fog &&
				e != fog &&
				f != fog &&
				g != fog &&
				h != fog &&
				i != fog
			) {
				if ((a == b && b == c && b != fog) || (a == d && d == g && d != fog) || (a == e && e == i && e != fog))
					return [true, a];
				if ((d == e && e == f && e != fog) || (b == e && e == h && e != fog) || (g == e && e == c && e != fog))
					return [true, e];
				if ((g == h && h == i && h != fog) || (c == f && f == i && f != fog)) return [true, i];
				else return [true, undefined];
			}
			if ((a == b && b == c && b != fog) || (a == d && d == g && d != fog) || (a == e && e == i && e != fog))
				return [true, a];
			if ((d == e && e == f && e != fog) || (b == e && e == h && e != fog) || (g == e && e == c && e != fog))
				return [true, e];
			if ((g == h && h == i && h != fog) || (c == f && f == i && f != fog)) return [true, i];
			else return [false, undefined];
		};
		const shuffle = (array) => {
			let currentIndex = array.length,
				randomIndex;

			while (currentIndex != 0) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;

				[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
			}

			return array;
		};

		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: interaction.user.id });

		const collection1 = mclient.db('SkyblockSim').collection('blockedchannels');

		if (!player) {
			const noprofile = new MessageEmbed()
				.setColor('RED')
				.setTitle('No Profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			return interaction.editReply({ embeds: [noprofile] });
		}

		//Checks if the Player already has an open Dungeon Run
		if (player.data.misc.in_dungeon) {
			const runopen = new MessageEmbed()
				.setTitle('You are already in a Dungeon.')
				.setDescription('Dungeons automatically close after 1 minute of inactivity')
				.setColor('RED')
				.setFooter('Skyblock Simulator');
			return interaction.editReply({ embeds: [runopen] });
		}

		//Players Stats
		let pstats = await playerStats(player);

		let combatlvl = skillLevel(player.data.skills.combat).level;

		let classlevel = classLevel(player.data.dungeons.class.selected.xp).level;
		let catalevel = classLevel(player.data.dungeons.xp).level;

		if (player.data.dungeons.class.selected.name == 'Assassin') {
			pstats.strength += 2 * classlevel;
		} else if (player.data.dungeons.class.selected.name == 'Berserker') {
			pstats.strength += 1 * classlevel;
			pstats.defense += 1 * classlevel;
		} else if (player.data.dungeons.class.selected.name == 'Tank') {
			pstats.health += 2 * classlevel;
			pstats.defense += 1 * classlevel;
		}

		//Variables needed for the Map
		let map = '';
		let location = [1, 1];
		let score = 100;
		let floor = null;

		//Vars needed for Chests
		let wood_loot = '';
		let gold_loot = '';
		let diamond_loot = '';
		let emerald_loot = '';
		let obsidian_loot = '';

		let f1_map_1 = [
			[0, 0, 6, 6, 0, 0, 0],
			[0, 2, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 0],
			[0, 0, 0, 0, 0, 0, 0],
		];

		let f2_map_1 = [
			[0, 0, 0, 6, 6, 0, 0, 0],
			[0, 2, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
		];

		let f3_map_1 = [
			[0, 0, 0, 6, 6, 0, 0, 0, 0],
			[0, 2, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 1, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
		];

		//Floor Selection
		const floors = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('f1')
				.setEmoji('852111493859115019')
				.setLabel('Floor 1')
				.setStyle('PRIMARY'),
			new MessageButton()
				.setCustomId('f2')
				.setEmoji('852111493909446686')
				.setLabel('Floor 2')
				.setStyle('PRIMARY'),
			new MessageButton().setCustomId('f3').setEmoji('852111493952176148').setLabel('Floor 3').setStyle('PRIMARY')
		);

		const floorSelect = new MessageEmbed()
			.setTitle('Dungeons Floor Selection')
			.setFooter('Skyblock Simulator')
			.setColor('GREY')
			.setDescription(
				'**<:bonzo:852111493859115019> Floor 1 (Combat 8)**\n**<:scarff:852111493909446686> Floor 2 (Cata 4)**\n**<:professor:852111493952176148> Floor 3 (Cata 8)**'
			);

		const menu = await interaction.editReply({
			embeds: [floorSelect],
			components: [floors],
		});

		const filter = (i) => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		};

		await menu
			.awaitMessageComponent({
				filter,
				componentType: 'BUTTON',
				time: 60000,
			})
			.then((i) => {
				const { customId: id } = i;

				if (id == 'f1') floor = 1;
				else if (id == 'f2') floor = 2;
				else if (id === 'f3') floor = 3;
				else {
					const cancelled = new MessageEmbed().setTitle('Menu Cancelled').setColor('RED');
					menu.edit({ embeds: [cancelled], components: [] });
					return;
				}
			})
			.catch((err) => menu.edit({ components: [] }));

		//console.log(floor)

		if (floor == null) {
			return menu.edit({ components: [] });
		}

		const invalidreqs = new MessageEmbed()
			.setTitle('Requirements not met')
			.setDescription(
				`**Requirements:**\nFloor 1 -> Combat 8\nFloor 2 -> Catacombs 4\nFloor 3 -> Catacombs 8\n\n**Your Stats**\nCombat: ${combatlvl}\nCatacombs: ${catalevel}\n`
			)
			.setColor('RED');

		if (floor == 1 && combatlvl <= 7) {
			menu.edit({ embeds: [invalidreqs], components: [] });
			return;
		} else if (floor == 2 && catalevel <= 4) {
			menu.edit({ embeds: [invalidreqs], components: [] });
			return;
		} else if (floor == 3 && catalevel <= 8) {
			menu.edit({ embeds: [invalidreqs], components: [] });
			return;
		}

		//Sets the Player into the Dungeon so they cant open another run.
		await collection.updateOne(
			{ _id: interaction.user.id },
			{ $set: { 'data.misc.in_dungeon': true } },
			{ upsert: true }
		);
		await collection1.updateOne(
			{ _id: interaction.channelId },
			{ $set: { blocked: true, user: interaction.user.id } },
			{ upsert: true }
		);

		//Variables needed for movement
		const up = new MessageButton().setCustomId('up').setLabel('⬆️').setStyle('PRIMARY');

		const down = new MessageButton().setCustomId('down').setLabel('⬇️').setStyle('PRIMARY');

		const left = new MessageButton().setCustomId('left').setLabel('⬅️').setStyle('PRIMARY');

		const right = new MessageButton().setCustomId('right').setLabel('➡️').setStyle('PRIMARY');

		const attack = new MessageButton().setCustomId('attack').setLabel('⚔️').setStyle('PRIMARY').setDisabled(true);

		const interact = new MessageButton()
			.setCustomId('interact')
			.setLabel('🖐️')
			.setStyle('PRIMARY')
			.setDisabled(true);

		const cancel = new MessageButton().setCustomId('cancel').setLabel('️C️a️n️c️e️l️').setStyle('DANGER');
		//Buttons for Loot
		const wood_button = new MessageButton()
			.setCustomId('wood')
			.setEmoji('882624301503754350')
			.setLabel('Chest')
			.setStyle('PRIMARY');
		const gold_button = new MessageButton()
			.setCustomId('gold')
			.setEmoji('869126927011708929')
			.setLabel('Chest')
			.setStyle('PRIMARY');
		const diamond_button = new MessageButton()
			.setCustomId('diamond')
			.setEmoji('869126926646788097')
			.setLabel('Chest')
			.setStyle('PRIMARY');
		const emerald_button = new MessageButton()
			.setCustomId('emerald')
			.setEmoji('869126927380779008')
			.setLabel('Chest')
			.setStyle('PRIMARY');
		const obsidian_button = new MessageButton()
			.setCustomId('obsidian')
			.setEmoji('869490639769853992')
			.setLabel('Chest')
			.setStyle('PRIMARY');

		const row1 = new MessageActionRow().addComponents(attack, up, interact, cancel);
		const row2 = new MessageActionRow().addComponents(left, down, right);
		const bossrow = new MessageActionRow().addComponents(attack, interact, cancel);
		const lootrow = new MessageActionRow().addComponents(wood_button, gold_button);

		var test = new MessageEmbed();
		test.setFooter('Skyblock Simulator');
		test.setColor('GREY');

		const Player = '🟩';
		const wall = '<:wall:876211886746636288>';
		const air = '<:air:876209923875303424>';
		const puzzle = '🟪';
		const enemy = '🧟';
		const door = '<:wooddoor:882163369174503435>';

		const puzzles = ['ttt', 'quiz'];

		let critchance = pstats.crit_chance;
		let php = pstats.health;
		let mhp = Math.random() < 0.5 ? 300 : 200; // Random mob hp at the moment
		let mdmg = Math.random() < 0.5 ? 50 : 25; // Random mob hp at the moment

		test.setDescription(`🎯 Score: **${score}**\n\n${mapArray(map)}`);

		// If puzzle or door is near, interact button activates
		row1.components[2].disabled = nearPuzzle()[0] || nearDoor()[0] ? false : true;
		// If enemy is near, fight button activates
		row1.components[0].disabled = nearEnemy()[0] ? false : true;

		// menu.edit({ embeds: [test], components: [row1, row2] })

		const collector = menu.createMessageComponentCollector({
			filter,
			componentType: 'BUTTON',
			time: 1000 * 60 * 5,
		});

		const row3 = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('1').setLabel('X').setStyle('SECONDARY'),
			new MessageButton().setCustomId('2').setLabel('X').setStyle('SECONDARY'),
			new MessageButton().setCustomId('3').setLabel('X').setStyle('SECONDARY')
		);
		const row4 = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('4').setLabel('X').setStyle('SECONDARY'),
			new MessageButton().setCustomId('5').setLabel('X').setStyle('SECONDARY'),
			new MessageButton().setCustomId('6').setLabel('X').setStyle('SECONDARY')
		);
		const row5 = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('7').setLabel('X').setStyle('SECONDARY'),
			new MessageButton().setCustomId('8').setLabel('X').setStyle('SECONDARY'),
			new MessageButton().setCustomId('9').setLabel('X').setStyle('SECONDARY')
		);
		const row6 = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('A').setLabel('A').setStyle('SECONDARY'),
			new MessageButton().setCustomId('B').setLabel('B').setStyle('SECONDARY'),
			new MessageButton().setCustomId('C').setLabel('C').setStyle('SECONDARY')
		);

		const fog = '🌫️';
		let table = [
			[fog, fog, fog],
			[fog, fog, fog],
			[fog, fog, fog],
		];

		const quizzes = [
			{
				question: "How many skills are there in Hypixel's Skyblock?",
				options: [
					['10', false],
					['11', false],
					['12', true],
				],
			},
			{
				question: `How much Catacombs XP do you need for level 50?`,
				options: [
					['569 Mil', true],
					['560 Mil', false],
					['575 Mil', false],
				],
			},
			{
				question: `How many pets are there?`,
				options: [
					['50', false],
					['54', false],
					['51', true],
				],
			},
			{
				question: `Who is the owner of Hypixel?`,
				options: [
					['hypxel', false],
					['hpixel', false],
					['hypixel', true],
				],
			},
			{
				question: `How many Talismans are there?`,
				options: [
					['77', true],
					['70', false],
					['73', false],
				],
			},
			{
				question: `Which non-boss and non-slayer mini-boss has the highest HP?`,
				options: [
					['Voidling Extremist', true],
					['Voidling Fanatic', false],
					['Voidling Fnatic', false],
				],
			},
			{
				question: `How many areas are there? (Excluding sub-areas)`,
				options: [
					['20', false],
					['22', true],
					['24', false],
				],
			},
		];

		let quiz, randomOptions;

		let inTTT = false,
			inQuiz = false,
			runFailed = false,
			runCancelled = false,
			bossFight = false,
			atLoot = false,
			runFinished = false;

		//grabbing random map from choosen floor
		if (floor == 1) {
			let maps = [f1_map_1];
			map = maps[Math.floor(Math.random() * maps.length)];
		} else if (floor == 2) {
			let maps = [f2_map_1];
			map = maps[Math.floor(Math.random() * maps.length)];
		} else if (floor == 3) {
			let maps = [f3_map_1];
			map = maps[Math.floor(Math.random() * maps.length)];
		}

		let mapx = '';
		let mapxarray = '';
		let mapy = '';
		let mapyarray = '';
		let finishedGenerating = false;

		let mobamount = '';
		let puzzleamount = '';
		let secretamount = '';
		let wallamount = '';

		let mobplaced = 0;
		let puzzleplaced = 0;
		let secretplaced = 0;
		let wallplaced = 0;

		if (floor == 1) {
			mapx = 7;
			mapxarray = [0, 1, 2, 3, 4, 5, 6];
			mapy = 7;
			mapyarray = [0, 1, 2, 3, 4, 5, 6];
			mobamount = 2;
			puzzleamount = 2;
			secretamount = 1;
			wallamount = 5;
		} else if (floor == 2) {
			mapx = 8;
			mapxarray = [0, 1, 2, 3, 4, 5, 6, 7];
			mapy = 8;
			mapyarray = [0, 1, 2, 3, 4, 5, 6, 7];
			mobamount = 2;
			puzzleamount = 3;
			secretamount = 2;
			wallamount = 6;
		} else if (floor == 3) {
			mapx = 9;
			mapxarray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
			mapy = 9;
			mapyarray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
			mobamount = 3;
			puzzleamount = 3;
			secretamount = 3;
			wallamount = 8;
		}

		while (finishedGenerating == false) {
			//let i = 0
			//i++
			// console.log(i)
			let mapxplace = mapxarray[Math.floor(Math.random() * mapx)];
			let mapyplace = mapyarray[Math.floor(Math.random() * mapy)];
			// console.log(map[mapxplace][mapyplace])

			if (
				map[mapxplace][mapyplace] == 1 &&
				map[mapxplace - 1][mapyplace] != 6 &&
				map[mapxplace + 1][mapyplace] != 6 &&
				map[mapxplace][mapyplace - 1] != 6 &&
				map[mapxplace][mapyplace + 1] != 6 &&
				map[mapxplace - 1][mapyplace] != 2 &&
				map[mapxplace + 1][mapyplace] != 2 &&
				map[mapxplace][mapyplace - 1] != 2 &&
				map[mapxplace][mapyplace + 1] != 2
			) {
				if (mobplaced < mobamount) {
					map[mapxplace][mapyplace] = 4;
					mobplaced += 1;
				} else if (puzzleplaced < puzzleamount) {
					map[mapxplace][mapyplace] = 3;
					puzzleplaced += 1;
				} else if (secretplaced != secretamount) {
					map[mapxplace][mapyplace] = 5;
					secretplaced += 1;
				} else if (wallplaced != wallamount) {
					map[mapxplace][mapyplace] = 0;
					wallplaced += 1;
				} else {
					finishedGenerating = true;
					//console.log(map)
				}
			}
		}
		test.setDescription(`🎯 Score: **${score}**\n\n${mapArray(map)}`);
		interaction.editReply({ embeds: [test], components: [row1, row2] });

		collector.on('collect', async (i) => {
			const { customId: id } = i;

			if (inTTT) {
				let x, y;
				if (test.fields.length > 0) {
					test.fields = []; // remove the addition field like the "killed a mod with x hp left" // no, ur dumb
					menu.edit({ embeds: [test] });
				}

				if (id == 1) (x = 0), (y = 0);
				else if (id == 2) (x = 0), (y = 1);
				else if (id == 3) (x = 0), (y = 2);
				else if (id == 4) (x = 1), (y = 0);
				else if (id == 5) (x = 1), (y = 1);
				else if (id == 6) (x = 1), (y = 2);
				else if (id == 7) (x = 2), (y = 0);
				else if (id == 8) (x = 2), (y = 1);
				else if (id == 9) (x = 2), (y = 2);

				test.description = updateTTT(x, y, true);

				if (x == 0) {
					if (y == 0) row3.components[0].disabled = true;
					else if (y == 1) row3.components[1].disabled = true;
					else if (y == 2) row3.components[2].disabled = true;
				} else if (x == 1) {
					if (y == 0) row4.components[0].disabled = true;
					else if (y == 1) row4.components[1].disabled = true;
					else if (y == 2) row4.components[2].disabled = true;
				} else if (x == 2) {
					if (y == 0) row5.components[0].disabled = true;
					else if (y == 1) row5.components[1].disabled = true;
					else if (y == 2) row5.components[2].disabled = true;
				}

				let rowPick = [0, 1, 2][Math.floor(Math.random() * 3)];
				let columnPick = [0, 1, 2][Math.floor(Math.random() * 3)];

				while (table[rowPick][columnPick] != fog) {
					rowPick = [0, 1, 2][Math.floor(Math.random() * 3)];
					columnPick = [0, 1, 2][Math.floor(Math.random() * 3)];
				}

				if (rowPick == 0) {
					if (columnPick == 0) row3.components[0].disabled = true;
					else if (columnPick == 1) row3.components[1].disabled = true;
					else if (columnPick == 2) row3.components[2].disabled = true;
				} else if (rowPick == 1) {
					if (columnPick == 0) row4.components[0].disabled = true;
					else if (columnPick == 1) row4.components[1].disabled = true;
					else if (columnPick == 2) row4.components[2].disabled = true;
				} else if (rowPick == 2) {
					if (columnPick == 0) row5.components[0].disabled = true;
					else if (columnPick == 1) row5.components[1].disabled = true;
					else if (columnPick == 2) row5.components[2].disabled = true;
				}

				let [W, E] = wincheckTTT();

				if (W) {
					const txt = E == '🟩' ? 'You won!' : E ? 'You lost...' : 'You tied';
					if (E == '🟩' || !E) {
						inTTT = false;
						score += 30;
						//await menu.edit({ embeds: [test], components: [row1, row2] })
						//await sleep(1000)
						test.description = `🎯 Score: **${score}** (+30)` + '\n\n' + mapArray();

						table = [
							[fog, fog, fog],
							[fog, fog, fog],
							[fog, fog, fog],
						]; // reset table for new tictactoe
						row1.components[2].disabled = true;
						row3.components[0].disabled = false;
						row3.components[1].disabled = false;
						row3.components[2].disabled = false;
						row4.components[0].disabled = false;
						row4.components[1].disabled = false;
						row4.components[2].disabled = false;
						row5.components[0].disabled = false;
						row5.components[1].disabled = false;
						row5.components[2].disabled = false; // reset components for new tictactoe // ew
						return await menu.edit({
							embeds: [test],
							components: [row1, row2],
						});
					} else {
						runFailed = false;
						inTTT = false;
						score -= 30;
						test.description = `🎯 Score: **${score}** (-30)` + '\n\n' + mapArray();
						table = [
							[fog, fog, fog],
							[fog, fog, fog],
							[fog, fog, fog],
						]; // reset table for new tictactoe
						row1.components[2].disabled = true;
						row3.components[0].disabled = false;
						row3.components[1].disabled = false;
						row3.components[2].disabled = false;
						row4.components[0].disabled = false;
						row4.components[1].disabled = false;
						row4.components[2].disabled = false;
						row5.components[0].disabled = false;
						row5.components[1].disabled = false;
						row5.components[2].disabled = false; // reset components for new tictactoe
						return await menu.edit({
							embeds: [test],
							components: [row1, row2],
						});
					}
				}

				test.description = updateTTT(rowPick, columnPick, false);

				let [w, e] = wincheckTTT();

				if (w) {
					const txt = e == '🟩' ? `You Won!!` : e ? `You Lost ...` : `You Tied`;
					if (e == '🟩' || !e) {
						inTTT = false;
						test.description += `\n${txt}`;
						//await menu.edit({ embeds: [test], components: [row1, row2] })
						//await sleep(1000)
						test.description = `🎯 Score: **${score}**` + '\n\n' + mapArray();

						table = [
							[fog, fog, fog],
							[fog, fog, fog],
							[fog, fog, fog],
						]; // reset table for new tictactoe
						row1.components[2].disabled = true;
						row3.components[0].disabled = false;
						row3.components[1].disabled = false;
						row3.components[2].disabled = false;
						row4.components[0].disabled = false;
						row4.components[1].disabled = false;
						row4.components[2].disabled = false;
						row5.components[0].disabled = false;
						row5.components[1].disabled = false;
						row5.components[2].disabled = false; // reset components for new tictactoe
						return await menu.edit({
							embeds: [test],
							components: [row1, row2],
						});
					} else {
						runFailed = false;
						inTTT = false;
						score -= 30;
						test.description = `🎯 Score: **${score}** (-30)` + '\n\n' + mapArray();
						table = [
							[fog, fog, fog],
							[fog, fog, fog],
							[fog, fog, fog],
						]; // reset table for new tictactoe
						row1.components[2].disabled = true;
						row3.components[0].disabled = false;
						row3.components[1].disabled = false;
						row3.components[2].disabled = false;
						row4.components[0].disabled = false;
						row4.components[1].disabled = false;
						row4.components[2].disabled = false;
						row5.components[0].disabled = false;
						row5.components[1].disabled = false;
						row5.components[2].disabled = false; // reset components for new tictactoe
						return await menu.edit({
							embeds: [test],
							components: [row1, row2],
						});
					}
				}
				await menu.edit({
					embeds: [test],
					components: [row3, row4, row5],
				});
			} else if (inQuiz) {
				/*if (test.fields.length > 0) {
          test.fields = []  // remove the addition field like the "killed a mod with x hp left"
      //    if(noButtonedit == false) {
          menu.edit({ embeds: [test] })
      //    }
        }*/
				test.fields = [];

				let rightChoise = '',
					i = 0;

				for (const option of randomOptions) {
					i++;
					if (option[1]) rightChoise = i;
				}

				if (rightChoise == 1) rightChoise = 'A';
				else if (rightChoise == 2) rightChoise = 'B';
				else if (rightChoise == 3) rightChoise = 'C';

				if (id == rightChoise) {
					inQuiz = false;
					// if(noButtonedit == false) {
					await menu.edit({
						embeds: [test],
						components: [row1, row2],
					});
					//    }
					await sleep(1000);
					score += 30;
					test.description = `🎯 Score: **${score}** (+30)` + '\n\n' + mapArray();

					return await menu.edit({
						embeds: [test],
						components: [row1, row2],
					});
				} else {
					runFailed = false;
					inQuiz = false;
					score -= 30;
					test.description = `🎯 Score: **${score}** (-30)` + '\n\n' + mapArray();
					//    if(noButtonedit == false) {
					await menu.edit({
						embeds: [test],
						components: [row1, row2],
					});
					//    }
				}
			} else if (id == 'up' || id == 'left' || id == 'right' || id == 'down') {
				const locationAndPuzzleCheck = movePlayer(id, false);
				location = locationAndPuzzleCheck[0];
				var puzzleOrNot = locationAndPuzzleCheck[1];
				test.fields = [];
				test.description = `🎯 Score: **${score}**` + '\n\n' + mapArray();
			} else if (id == 'attack') {
				const direction = nearEnemy()[1];
				let fightEnded = false;

				if (bossFight) {
					let pdmg = Math.floor((5 + pstats.damage) * (1 + pstats.strength / 100) * (1 + combatlvl * 0.04));

					const crit = isCrit(critchance); //Change Variable for Crit Chance and change way how crit returns
					if (crit) pdmg = Math.floor(pdmg * (1 + pstats.crit_damage / 100));

					php = dmgtaken(php, mdmg); //php = player health, pdmg = playerdmg
					mhp = dmgdealt(mhp, pdmg); //mhp = mob health, mdmg = mod damage

					if (php < 0) php = 0; // Avoid negative health
					if (mhp < 0) mhp = 0; // Avoid negative health

					test.fields = [];
					test.addField(
						`Battle`,
						`Player health: ❤️ ${php} HP (- ${mdmg})
                Boss health: ❤️ ${mhp} HP (-${crit ? '<:crit:870306942806020106>' : ''} ${pdmg})`
					);

					//   if(noButtonedit == false) {

					menu.edit({ embeds: [test], components: [bossrow] });
					//    }

					if (mhp <= 0) {
						fightEnded = true;
						test.fields = [];
						test.setColor('ORANGE');
						test.addField(`\u200B`, `Killed the boss with **❤️ ${php}** left, and you earned combat XP`); //Add combat xp var
						await collection.updateOne(
							//Add Combat XP from enemy Kill (do once mobs decided)
							{ _id: interaction.user.id },
							{ $inc: { 'data.skills.combat': 500 } },
							{ upsert: true }
						);

						//     if(noButtonedit == false) {

						menu.edit({ embeds: [test], components: [bossrow] });
						//    }

						await sleep(1000); // waiting a second so you can actually read the message
					} else if (php <= 0) {
						test.fields = [];
						test.setColor('RED');
						test.addField(`\u200B`, `Died to the boss, which had **❤️ ${mhp}** left.`);
						runFailed = true;
						return collector.stop();
					}
					if (fightEnded) {
						let preclaim = false;
						fightEnded = false;
						wood_loot = lt.wood.roll(pstats.magic_find);
						gold_loot = lt.gold.roll(pstats.magic_find);
						test.fields = [];
						test.description = '\n';
						if (isNaN(wood_loot)) {
							test.description += `<:oak_wood:882624301503754350> Wood Chest: **${wood_loot}\n**`;
						} else {
							test.description += `<:oak_wood:882624301503754350> Wood Chest: **${wood_loot} Coins\n**`;
						}
						if (isNaN(gold_loot)) {
							test.description += `<:gold:869126927011708929> Gold Chest: **${gold_loot}\n**`;
						} else {
							test.description += `<:gold:869126927011708929> Gold Chest: **${gold_loot} Coins\n**`;
						}
						if (floor == 2 && score >= 150) {
							diamond_loot = lt.diamond.roll(pstats.magic_find);
							test.description += `<:diamond:869126926646788097> Diamond Chest: **${diamond_loot}\n**`;
							lootrow.addComponents(diamond_button);
						} else if (floor == 3 && score >= 180) {
							diamond_loot = lt.diamond.roll(pstats.magic_find);
							emerald_loot = lt.emerald.roll(pstats.magic_find);
							if (isNaN(diamond_loot)) {
								test.description += `<:diamond:869126926646788097> Diamond Chest: **${diamond_loot}\n**`;
							} else {
								test.description += `<:diamond:869126926646788097> Diamond Chest: **${diamond_loot} Coins\n**`;
							}
							if (isNaN(emerald_loot)) {
								test.description += `<:emerald:869126927380779008> Emerald Chest: **${emerald_loot}\n**`;
							} else {
								test.description += `<:emerald:869126927380779008> Emerald Chest: **${emerald_loot} Coins\n**`;
							}
							lootrow.addComponents(diamond_button);
							lootrow.addComponents(emerald_button);
							preclaim = true;
						} else if (floor == 3 && score >= 150 && preclaim == false) {
							diamond_loot = lt.diamond.roll(pstats.magic_find);
							if (isNaN(diamond_loot)) {
								test.description += `<:diamond:869126926646788097> Diamond Chest: **${diamond_loot}\n**`;
							} else {
								test.description += `<:diamond:869126926646788097> Diamond Chest: **${diamond_loot} Coins\n**`;
							}

							lootrow.addComponents(diamond_button);
						}
						test.setColor('FFD700');
						atLoot = true;
						//    if(noButtonedit == false) {

						menu.edit({ embeds: [test], components: [lootrow] }); //add row for chests
						//    }
					}
				} else {
					// START FIGHT
					let pdmg = Math.floor((5 + pstats.damage) * (1 + pstats.strength / 100) * (1 + combatlvl * 0.04));

					const crit = isCrit(critchance); //Change Variable for Crit Chance and change way how crit returns
					if (crit) pdmg = Math.floor(pdmg * (1 + pstats.crit_damage / 100));

					php = dmgtaken(php, mdmg); //php = player health, pdmg = playerdmg
					mhp = dmgdealt(mhp, pdmg); //mhp = mob health, mdmg = mod damage

					if (php < 0) php = 0; // Avoid negative health
					if (mhp < 0) mhp = 0; // Avoid negative health

					test.fields = [];
					test.addField(
						`Battle`,
						`Player health: ❤️ ${php} (- ${mdmg})
                Mob health: ❤️ ${mhp} (-${crit ? '<:crit:870306942806020106>' : ''} ${pdmg})`
					);

					// when still in fight locks movement so he can't get out the fight
					row1.components[1].disabled = true; // up arrow
					row2.components[0].disabled = true; // left arrow
					row2.components[1].disabled = true; // down arrow
					row2.components[2].disabled = true; // right arrow

					menu.edit({ embeds: [test], components: [row1, row2] });

					if (mhp <= 0) {
						fightEnded = true;
						score += 20;
						test.fields = [];
						test.setColor('ORANGE');
						test.addField('\u200B', `Killed the enemy with **❤️ ${php}** left and earned combat XP`); //Add combat xp var
						await collection.updateOne(
							//Add Combat XP from enemy Kill (do once mobs decided)
							{ _id: interaction.user.id },
							{ $inc: { 'data.skills.combat': 50 } },
							{ upsert: true }
						);

						php = pstats.health; //reset player health
						mhp = Math.random() < 0.5 ? 300 : 200; // reset mob hp for new mob
						mdmg = Math.random() < 0.5 ? 50 : 25; // reset mob dmg for new mob

						// Unlocks arrows after mob is killed
						row1.components[0].disabled = true;
						row1.components[1].disabled = false; // up arrow
						row2.components[0].disabled = false; // left arrow
						row2.components[1].disabled = false; // down arrow
						row2.components[2].disabled = false; // right arrow
						menu.edit({ embeds: [test], components: [row1, row2] });

						await sleep(1000); // waiting a second so you can actually read the message
					} else if (php <= 0) {
						test.fields = [];
						test.setColor('RED');
						test.addField('\u200B', `Died to the enemy which had **❤️ ${mhp}** left.`);
						runFailed = true;
						return collector.stop();
					}
					// FINISH FIGHT

					if (fightEnded) {
						if (direction == undefined) {
							collector.stop();
							test.fields = [];
							var noButtonedit = true;
							let crashembed = new MessageEmbed()
								.addField(
									'Dungeon Run Crashed',
									"**Reason:** User spammed a button.\nDon't spam the buttons; give the bot time to respond."
								)
								.setColor('RED');
							return interaction.followUp({
								embeds: [crashembed],
								ephemeral: true,
							});
						}
						// console.log(direction + 'dir')
						location = movePlayer(direction, true)[0]; // replace the mob emoji only after mob is killed
						test.description = `🎯 Score: **${score}** (+20)` + '\n\n' + mapArray();
					}
					test.description = `🎯 Score: **${score}**` + '\n\n' + mapArray();
					menu.edit({ embeds: [test], components: [row1, row2] }); // Components need to get adjusted might be wrong
				}
			} else if (id == 'interact') {
				//console.log('bing')
				if (nearDoor()[0]) {
					// Lock arrows
					bossFight = true;
					bossrow.components[0].disabled = false;
					if (floor == 1) (mhp = 500), (mdmg = 100);
					else if (floor == 2) (mhp = 1000), (mdmg = 200);
					else if (floor == 3) (mhp = 2500), (mdmg = 350);
					test.fields = [];
					test.addField(
						`Battle`,
						`Player health: ❤️ ${php} HP
                Mob Health: ❤️ ${mhp} HP`
					);
					//  if(noButtonedit == false) {
					await menu.edit({ embeds: [test], components: [bossrow] });
					//    }
					const direction = nearDoor()[1];
				} else {
					const direction = nearPuzzle()[1];

					// START PUZZLE
					let puzzle = puzzles[Math.floor(Math.random() * puzzles.length)]; // get random puzzle
					//  console.log(puzzle)

					if (puzzle == 'ttt') {
						inTTT = true;
						const randomPick = [
							[0, 1, 2][Math.floor(Math.random() * 3)],
							[0, 1, 2][Math.floor(Math.random() * 3)],
						];
						const [rowPick, columnPick] = randomPick;

						test.setDescription(updateTTT(rowPick, columnPick, false));

						if (rowPick == 0) {
							if (columnPick == 0) row3.components[0].disabled = true;
							else if (columnPick == 1) row3.components[1].disabled = true;
							else if (columnPick == 2) row3.components[2].disabled = true;
						} else if (rowPick == 1) {
							if (columnPick == 0) row4.components[0].disabled = true;
							else if (columnPick == 1) row4.components[1].disabled = true;
							else if (columnPick == 2) row4.components[2].disabled = true;
						} else if (rowPick == 2) {
							if (columnPick == 0) row5.components[0].disabled = true;
							else if (columnPick == 1) row5.components[1].disabled = true;
							else if (columnPick == 2) row5.components[2].disabled = true;
						}

						// if(noButtonedit == false) {
						await menu.edit({
							embeds: [test],
							components: [row3, row4, row5],
						});
						//     }
					} else if (puzzle == 'quiz') {
						inQuiz = true;

						quiz = quizzes[Math.floor(Math.random() * quizzes.length)]; // Gets random quiz
						console.log(quiz);
						randomOptions = shuffle(quiz.options); // Shuffle the asnwers

						let answers = '',
							index = 0;

						for (const option of randomOptions) {
							// Create the randomized asnwers messsage
							const [choise, correct] = option; // Example: [ choise = 10, correct = false ]
							index++;
							if (index == 1) answers += `A) ${choise}\n`;
							else if (index == 2) answers += `B) ${choise}\n`;
							else if (index == 3) answers += `C) ${choise}`;
						}

						test.addField(quiz.question, answers, false);
						//if(noButtonedit == false) {
						await menu.edit({ embeds: [test], components: [row6] });
						//}
					}

					location = movePlayer(direction, true)[0]; // replace the mob emoji only after mob is killed
					if (!inTTT && !inQuiz) test.description = `🎯 Score: **${score}**` + '\n\n' + mapArray();
				}
			} else if (id == 'cancel') {
				runCancelled = true;
				return collector.stop();
			}

			// If puzzle or door is near, interact button activates
			row1.components[2].disabled = nearPuzzle()[0] || nearDoor()[0] ? false : true;
			// If enemy is near, fight button activates
			row1.components[0].disabled = nearEnemy()[0] ? false : true;

			//Adding the USER the loot
			if (atLoot) {
				let loot = '';
				let choosen = false;
				if (id == 'wood') {
					loot = wood_loot;
					choosen = true;
				} else if (id == 'gold') {
					loot = gold_loot;
					choosen = true;
				} else if (id == 'diamond') {
					loot = diamond_loot;
					choosen = true;
				} else if (id == 'emerald') {
					loot = emerald_loot;
					choosen = true;
				} else if (id == 'obsidian') {
				}
				if (!isNaN(loot) && choosen == true) {
					loot = Number(loot);
					await collection.updateOne(
						{ _id: interaction.user.id },
						{ $inc: { 'data.profile.coins': loot } },
						{ upsert: true }
					);

					const lootembed = new MessageEmbed()
						.setTitle(`Floor ${floor} Finished`)
						.setDescription(`<:coins:861974605203636253> **${loot}** coins added to your profile.`)
						.setColor('GREEN')
						.setFooter('Skyblock Simulator');
					//if(noButtonedit == false) {
					menu.edit({ embeds: [lootembed], components: [] });
					//  }
					runFinished = true;
					collector.stop();
				} else if (loot == 'Recombobulator 3000' && choosen == true) {
					let sellitem = loot;
					let amount = 1;
					player = await collection.findOne({
						_id: interaction.user.id,
					});

					const updatePlayer = addItem(sellitem, amount, player);

					await collection.replaceOne({ _id: interaction.user.id }, updatePlayer);

					const lootembed = new MessageEmbed()
						.setTitle(`Floor ${floor} Finished`)
						.setDescription(`<:recomb:881094744183275540> **${loot}** added to your profile.`)
						.setColor('GREEN')
						.setFooter('Skyblock Simulator');
					// if(noButtonedit == false) {
					menu.edit({ embeds: [lootembed], components: [] });
					//   }
					runFinished = true;
					collector.stop();
				} else {
					if (loot.includes('Armor') && choosen == true) {
						//handle armor here
						let item = dungloot[loot];
						let item2 = player.data.inventory.armor.find((armors) => armors.name == loot);

						if (item2 && item2.name == loot) {
							await collection.updateOne(
								{ _id: interaction.user.id },
								{ $inc: { 'data.profile.coins': item.coins } },
								{ upsert: true }
							);
							const lootembed = new MessageEmbed()
								.setTitle(`Floor ${floor} Finished`)
								.setDescription(
									`You already own <:tank:852079613051666472> **${loot}**, so I gave you <:coins:861974605203636253> **${num(
										item.coins
									)} coins** instead.`
								)
								.setColor('GREEN')
								.setFooter('Skyblock Simulator');
							// if(noButtonedit == false) {
							menu.edit({ embeds: [lootembed], components: [] });
							//  }
							runFinished = true;
							collector.stop();
						} else {
							await collection.updateOne(
								{ _id: interaction.user.id },
								{
									$push: {
										'data.inventory.armor': {
											name: loot,
											health: item.health,
											defense: item.defense,
											strength: item.strength,
											crit_chance: item.crit_chance,
											crit_damage: item.crit_damage,
											magic_find: item.magic_find,
											sea_creature_chance: item.sea_creature_chance,
											recombobulated: item.recombobulated,
											reforge: item.reforge,
										},
									},
								},
								{ upsert: true }
							);

							const lootembed = new MessageEmbed()
								.setTitle(`Floor ${floor} Finished`)
								.setDescription(`<:tank:852079613051666472> **${loot}** added to your orofile.`)
								.setColor('GREEN')
								.setFooter('Skyblock Simulator');
							//   if(noButtonedit == false) {
							menu.edit({ embeds: [lootembed], components: [] });
							//   }
							runFinished = true;
							collector.stop();
						}
					} else if (
						(loot.includes('Sword') ||
							loot.includes('Death') ||
							loot.includes('Blade') ||
							loot.includes('Dagger')) &&
						choosen == true
					) {
						//handle sword here
						let item = dungloot[loot];
						let item2 = player.data.inventory.sword.find((swords) => swords.name == loot);

						if (item2 && item2.name == loot) {
							await collection.updateOne(
								{ _id: interaction.user.id },
								{ $inc: { 'data.profile.coins': item.coins } },
								{ upsert: true }
							);
							const lootembed = new MessageEmbed()
								.setTitle(`Floor ${floor} Finished`)
								.setDescription(
									`You already own <:berserker:852079613052059658> **${loot}**, so I gave you <:coins:861974605203636253> **${num(
										item.coins
									)} coins** instead.`
								)
								.setColor('GREEN')
								.setFooter('Skyblock Simulator');
							//      if(noButtonedit == false) {
							menu.edit({ embeds: [lootembed], components: [] });
							//  }
							runFinished = true;
							collector.stop();
						} else {
							await collection.updateOne(
								{ _id: interaction.user.id },
								{
									$push: {
										'data.inventory.sword': {
											name: loot,
											damage: item.damage,
											strength: item.strength,
											crit_chance: item.crit_chance,
											crit_damage: item.crit_damage,
											recombobulated: item.recombobulated,
											reforge: item.reforge,
										},
									},
								},
								{ upsert: true }
							);

							const lootembed = new MessageEmbed()
								.setTitle(`Floor ${floor} Finished`)
								.setDescription(`<:berserker:852079613052059658> **${loot}** added to your profile.`)
								.setColor('GREEN')
								.setFooter('Skyblock Simulator');
							//  if(noButtonedit == false) {
							menu.edit({ embeds: [lootembed], components: [] });
							//   }
							runFinished = true;
							collector.stop();
						}
					}
				}
			}

			// check if on a secret
			if (puzzleOrNot) {
				test.addField('Secret Found', '\u200B');
				score += 20;
				test.description = `🎯 Score: **${score}** (+20)` + '\n\n' + mapArray();
			}
			if (!inTTT && !inQuiz && !bossFight)
				return test.setColor('GREY'), menu.edit({ embeds: [test], components: [row1, row2] });
		});
		collector.on('end', async (collected) => {
			try {
				await collection.updateOne(
					{ _id: interaction.user.id },
					{ $set: { 'data.misc.in_dungeon': false } },
					{ upsert: true }
				);

				let xpearned = '';
				let classselect = '';

				if (floor == 1) {
					xpearned = 50;
				} else if (floor == 2) {
					xpearned = 100;
				} else if (floor == 3) {
					xpearned = 300;
				} else if (floor == 4) {
					xpearned = 1000;
				} else if (floor == 5) {
					xpearned = 2000;
				} else if (floor == 6) {
					xpearned = 5000;
				} else if (floor == 7) {
					xpearned = 30000;
				}

				if (runFinished) {
					if (player.data.dungeons.class.selected.name == 'Assassin') {
						await collection.updateOne(
							{ _id: interaction.user.id },
							{
								$inc: {
									'data.dungeons.class.selected.xp': xpearned,
									'data.dungeons.class.available.assassin.xp': xpearned,
								},
							},
							{ upsert: true }
						);
					} else if (player.data.dungeons.class.selected.xp == 'Tank') {
						await collection.updateOne(
							{ _id: interaction.user.id },
							{
								$inc: {
									'data.dungeons.class.selected.xp': xpearned,
									'data.dungeons.class.available.tank.xp': xpearned,
								},
							},
							{ upsert: true }
						);
					} else if (player.data.dungeons.class.selected.xp == 'Berserker') {
						await collection.updateOne(
							{ _id: interaction.user.id },
							{
								$inc: {
									'data.dungeons.class.selected.xp': xpearned,
									'data.dungeons.class.available.berserker.xp': xpearned,
								},
							},
							{ upsert: true }
						);
					}

					await collection.updateOne(
						{ _id: interaction.user.id },
						{
							$inc: {
								'data.dungeons.xp': xpearned,
								'data.dungeons.total_runs': 1,
							},
						},
						{ upsert: true }
					);
				}

				await collection1.updateOne(
					{ _id: interaction.channelId },
					{ $set: { blocked: false } },
					{ upsert: true }
				);
				test.fields = [];
				if (runFailed) {
					test.addField('Dungeon Run Over', '**Reason**\n* Died to mob/boss');
				} else if (runCancelled) {
					test.addField('Dungeon Run Over', '**Reason**\n* Timed out or cancelled');
				} else if (runFinished) {
					return;
				} else if (runiscrashed) {
					test.addField(
						'Dungeon Run Crashed',
						"**Reason**\n* User spammed a button.\nDon't spam the buttons; give the bot time to respond."
					);
				}
				test.setColor('RED');
				await menu.edit({ embeds: [test], components: [] });
			} catch (e) {}
		});

		/*  } catch (e) {
      test.setDescription('An error occured!')
      test.setColor('Red')
    return interaction.editReply({embeds: [test], components: []})
  }*/
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
			item.amount += amount;
			return player;
		}
	}

	player.data.inventory.items.push({
		name: sellitem,
		amount: amount,
	});
	return player;
}

num = (num) => {
	if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/.0$/, '') + 'B';
	if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/.0$/, '') + 'M';
	if (num >= 1000) return (num / 1000).toFixed(1).replace(/.0$/, '') + 'K';
	return num;
};
