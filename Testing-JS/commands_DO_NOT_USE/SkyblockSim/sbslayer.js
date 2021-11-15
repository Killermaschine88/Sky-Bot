const Discord = require('discord.js');
const prefix = require('@replit/database');
const prefixx = new prefix();

module.exports = {
	name: 'Sbslayer',
	description: 'Shows the Slayer Menu',
	usage: 'sbslayer',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['sbsl'],
	cooldown: 10,
	async execute(client, message, args, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Players');
		const player = await collection.findOne({ _id: message.author.id });

		var gprefix = await prefixx.get(message.guild.id, { raw: false });
		if (gprefix === null) gprefix = '.';

		if (player === null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No Profile found')
				.setDescription(`Create a Profile using \`${gprefix}sbstart\` or \`${gprefix}sbcreate\``);

			message.channel.send({ embeds: [noprofile] });
			return;
		}

		const start = new Discord.MessageEmbed()
			.setTitle('Skyblock Simulator Slayer Menu')
			.setColor('90EE90')
			.setFooter('Skyblock Simulator')
			.setDescription('Press the Corresponding Emoji for the Slayer you want to do.');

		const row = new Discord.MessageActionRow().addComponents(
			new Discord.MessageButton()
				.setEmoji('852892164559732806')
				.setCustomId('zombie')
				.setLabel('Revenant')
				.setStyle('PRIMARY'),
			new Discord.MessageButton()
				.setEmoji('852892164392222740')
				.setCustomId('spider')
				.setLabel('Tarantula')
				.setStyle('PRIMARY'),
			new Discord.MessageButton()
				.setEmoji('852892164299423754')
				.setCustomId('wolf')
				.setLabel('Sven')
				.setStyle('PRIMARY'),
			new Discord.MessageButton()
				.setEmoji('854253314747924511')
				.setCustomId('enderman')
				.setLabel('Voidgloom')
				.setStyle('PRIMARY'),
			new Discord.MessageButton().setCustomId('end').setLabel('Cancel').setStyle('DANGER')
		);
		const menu = await message.channel.send({
			embeds: [start],
			components: [row],
		});

		let coins = player.data.profile.coins;
		let choosen = '';
		let tier = '';
		let slayercost = '';
		let slayerxp = '';
		let color = '';

		const filter = (i) => {
			i.deferUpdate();
			return i.user.id === message.author.id;
		};

		await menu
			.awaitMessageComponent({
				filter,
				componentType: 'BUTTON',
				time: 30000,
			})
			.then((i) => {
				if (i.customId === 'zombie') {
					choosen = 'Revenant';
				} else if (i.customId === 'spider') {
					choosen = 'Tarantula';
				} else if (i.customId === 'wolf') {
					choosen = 'Sven';
				} else if (i.customId === 'enderman') {
					choosen = 'Voidgloom';
				} else if (i.customId === 'end') {
					const cancelled = new Discord.MessageEmbed().setTitle('Menu cancelled').setColor('RED');
					menu.edit({ components: [], embeds: [cancelled] });
					return;
				}
				menu.edit({ components: [] });
			})
			.catch((err) => menu.edit({ components: [] }));

		if (choosen) {
			const tembed = new Discord.MessageEmbed()
				.setTitle(`${choosen} Slayer Menu`)
				.setColor('90EE90')
				.setFooter('Skyblock Simulator')
				.setDescription(
					`Decide the Tier of ${choosen} Slayer you want to fight.\n\n**Cost per Slayer**\nT1: **2.5k Coins**\nT2: **7.5k Coins**\nT3: **10kCoins**\nT4: **50k Coins**`
				);
			const trow = new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton().setCustomId('t1').setLabel('Tier 1').setStyle('PRIMARY'),
				new Discord.MessageButton().setCustomId('t2').setLabel('Tier 2').setStyle('PRIMARY'),
				new Discord.MessageButton().setCustomId('t3').setLabel('Tier 3').setStyle('PRIMARY'),
				new Discord.MessageButton().setCustomId('t4').setLabel('Tier 4').setStyle('PRIMARY'),
				new Discord.MessageButton().setCustomId('end').setLabel('Cancel').setStyle('DANGER')
			);
			menu.edit({ embeds: [tembed], components: [trow] });
		}

		await menu
			.awaitMessageComponent({
				filter,
				componentType: 'BUTTON',
				time: 30000,
			})
			.then((i) => {
				if (i.customId === 't1') {
					tier = 'T1';
				} else if (i.customId === 't2') {
					tier = 'T2';
				} else if (i.customId === 't3') {
					tier = 'T3';
				} else if (i.customId === 't4') {
					tier = 'T4';
				} else if (i.customId === 'end') {
					const cancelled = new Discord.MessageEmbed().setTitle('Menu cancelled').setColor('RED');
					menu.edit({ components: [], embeds: [cancelled] });
					return;
				}
				menu.edit({ components: [] });
			})
			.catch((err) => menu.edit({ components: [] }));

		if (tier === 'T1') {
			slayercost = 2500;
			slayerxp = 5;
		} else if (tier === 'T2') {
			slayercost = 7500;
			slayerxp = 25;
		} else if (tier === 'T3') {
			slayercost = 10000;
			slayerxp = 100;
		} else if (tier === 'T4') {
			slayercost = 50000;
			slayerxp = 500;
		}

		if (!slayerxp) {
			const cancelled = new Discord.MessageEmbed().setTitle('Menu cancelled').setColor('RED');
			menu.edit({ components: [], embeds: [cancelled] });
			return;
		}

		if (choosen === 'Revenant' && coins > slayercost) {
			color = '90EE90';
			await collection1.updateOne({ _id: message.author.id }, { $inc: { coins: -slayercost } }, { upsert: true });
			await collection2.updateOne(
				{ _id: message.author.id },
				{ $inc: { zombiexp: slayerxp, zombiekills: 1 } },
				{ upsert: true }
			);
		} else if (choosen === 'Tarantula' && coins > slayercost) {
			color = 'GREY';
			await collection1.updateOne({ _id: message.author.id }, { $inc: { coins: -slayercost } }, { upsert: true });
			await collection2.updateOne(
				{ _id: message.author.id },
				{ $inc: { spiderxp: slayerxp, spiderkills: 1 } },
				{ upsert: true }
			);
		} else if (choosen === 'Sven' && coins > slayercost) {
			color = 'WHITE';
			await collection1.updateOne({ _id: message.author.id }, { $inc: { coins: -slayercost } }, { upsert: true });
			await collection2.updateOne(
				{ _id: message.author.id },
				{ $inc: { wolfxp: slayerxp, wolfkills: 1 } },
				{ upsert: true }
			);
		} else if (choosen === 'Voidgloom' && coins > slayercost) {
			color = 'PURPLE';
			await collection1.updateOne({ _id: message.author.id }, { $inc: { coins: -slayercost } }, { upsert: true });
			await collection2.updateOne(
				{ _id: message.author.id },
				{ $inc: { endermanxp: slayerxp, endermankills: 1 } },
				{ upsert: true }
			);
		}
		if (!color || !tier) {
			const poor = new Discord.MessageEmbed()
				.setTitle('Insuffucicient Coins')
				.setColor('RED')
				.setFooter('Skyblock Simulator')
				.setDescription(`You can\'t afford to kill a **${tier} ${choosen}** Slayer!`);
			menu.edit({ embeds: [poor], components: [] });
			return;
		}

		const killed = new Discord.MessageEmbed()
			.setColor(`${color}`)
			.setTitle('Killed Slayer Boss')
			.setDescription(
				`Successfully killed the **${tier} ${choosen} Slayer** Boss and earned **${slayerxp} ${choosen} Slayer XP**.`
			);
		menu.edit({ embeds: [killed], components: [] });
	},
};

function sleep(ms) {
	return new Promise((resolve) => setTimeout(() => resolve(), ms));
}
