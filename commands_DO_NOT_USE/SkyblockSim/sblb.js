const Discord = require('discord.js');
const prefix = require('@replit/database');
const prefixx = new prefix();

module.exports = {
	name: 'Sblb',
	description: 'Shows Skyblock Simulator Leaderboard',
	usage: 'sblb',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['sbl'],
	cooldown: 10,
	async execute(client, message, args, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Main');
		const found1 = await collection.find({}).sort({ coins: -1 }).toArray();
		const k = await collection.find({}).sort({ tkills: -1 }).toArray();
		//Skill XP Leaderboard
		const mining1 = await collection.find({}).sort({ mining: -1 }).toArray();
		const foraging1 = await collection.find({}).sort({ foraging: -1 }).toArray();
		const enchanting1 = await collection.find({}).sort({ enchanting: -1 }).toArray();
		const farming1 = await collection.find({}).sort({ farming: -1 }).toArray();
		const combat1 = await collection.find({}).sort({ combat: -1 }).toArray();
		const fishing1 = await collection.find({}).sort({ fishing: -1 }).toArray();
		const alchemy1 = await collection.find({}).sort({ alchemy: -1 }).toArray();
		const taming1 = await collection.find({}).sort({ taming: -1 }).toArray();

		const lb = new Discord.MessageEmbed()
			.setTitle('Skyblock Simulator Leaderboard')
			.setFooter('Skyblock Simulator')
			.setColor('90EE90')

			.addField(
				'<:coins:861974605203636253> Most Coins',
				`1st <@${found1[0]._id}>: ${found1[0].coins}\n2nd <@${found1[1]._id}>: ${found1[1].coins}\n3rd <@${found1[2]._id}>: ${found1[2].coins}\n4th <@${found1[3]._id}>: ${found1[3].coins}\n5th <@${found1[4]._id}>: ${found1[4].coins}`,
				true
			)
			.addField(
				'<:berserker:852079613052059658> Most Kills',
				`1st <@${k[0]._id}>: ${k[0].tkills}\n2nd <@${k[1]._id}>: ${k[1].tkills}\n3rd <@${k[2]._id}>: ${k[2].tkills}\n4th <@${k[3]._id}>: ${k[3].tkills}\n5th <@${k[4]._id}>: ${k[4].tkills}`,
				true
			)
			.addField('\u200b', '\u200b', true)

			//Skill XP Leaderboard
			.addField(
				'<:mining:852069714577719306> Mining XP',
				`1st <@${mining1[0]._id}>: ${mining1[0].mining}\n2nd <@${mining1[1]._id}>: ${mining1[1].mining}\n3rd <@${mining1[2]._id}>: ${mining1[2].mining}\n4th <@${mining1[3]._id}>: ${mining1[3].mining}\n5th <@${mining1[4]._id}>: ${mining1[4].mining}`,
				true
			)

			.addField(
				'<:foraging:852069714447695872> Foraging XP',
				`1st <@${foraging1[0]._id}>: ${foraging1[0].foraging}\n2nd <@${foraging1[1]._id}>: ${foraging1[1].foraging}\n3rd <@${foraging1[2]._id}>: ${foraging1[2].foraging}\n4th <@${foraging1[3]._id}>: ${foraging1[3].foraging}\n5th <@${foraging1[4]._id}>: ${foraging1[4].foraging}`,
				true
			)

			.addField(
				'<:enchanting:852069714511659058> Enchanting XP',
				`1st <@${enchanting1[0]._id}>: ${enchanting1[0].enchanting}\n2nd <@${enchanting1[1]._id}>: ${enchanting1[1].enchanting}\n3rd <@${enchanting1[2]._id}>: ${enchanting1[2].enchanting}\n4th <@${enchanting1[3]._id}>: ${enchanting1[3].enchanting}\n5th <@${enchanting1[4]._id}>: ${enchanting1[4].enchanting}`,
				true
			)

			.addField(
				'<:farming:852069714451759114> Farming XP',
				`1st <@${farming1[0]._id}>: ${farming1[0].farming}\n2nd <@${farming1[1]._id}>: ${farming1[1].farming}\n3rd <@${farming1[2]._id}>: ${farming1[2].farming}\n4th <@${farming1[3]._id}>: ${farming1[3].farming}\n5th <@${farming1[4]._id}>: ${farming1[4].farming}`,
				true
			)

			.addField(
				'<:combat:852069714527911956> Combat XP',
				`1st <@${combat1[0]._id}>: ${combat1[0].combat}\n2nd <@${combat1[1]._id}>: ${combat1[1].combat}\n3rd <@${combat1[2]._id}>: ${combat1[2].combat}\n4th <@${combat1[3]._id}>: ${combat1[3].combat}\n5th <@${combat1[4]._id}>: ${combat1[4].combat}`,
				true
			)

			.addField(
				'<:fishing:852069714359877643> Fishing XP',
				`1st <@${fishing1[0]._id}>: ${fishing1[0].fishing}\n2nd <@${fishing1[1]._id}>: ${fishing1[1].fishing}\n3rd <@${fishing1[2]._id}>: ${fishing1[2].fishing}\n4th <@${fishing1[3]._id}>: ${fishing1[3].fishing}\n5th <@${fishing1[4]._id}>: ${fishing1[4].fishing}`,
				true
			)

			.addField(
				'<:alchemy:852069714480988180> Alchemy XP',
				`1st <@${alchemy1[0]._id}>: ${alchemy1[0].alchemy}\n2nd <@${alchemy1[1]._id}>: ${alchemy1[1].alchemy}\n3rd <@${alchemy1[2]._id}>: ${alchemy1[2].alchemy}\n4th <@${alchemy1[3]._id}>: ${alchemy1[3].alchemy}\n5th <@${alchemy1[4]._id}>: ${alchemy1[4].alchemy}`,
				true
			)

			.addField(
				'<:taming:852069714493833227> Taming XP',
				`1st <@${taming1[0]._id}>: ${taming1[0].taming}\n2nd <@${taming1[1]._id}>: ${taming1[1].taming}\n3rd <@${taming1[2]._id}>: ${taming1[2].taming}\n4th <@${taming1[3]._id}>: ${taming1[3].taming}\n5th <@${taming1[4]._id}>: ${taming1[4].taming}`,
				true
			);

		message.channel.send({ embeds: [lb] });
	},
};
