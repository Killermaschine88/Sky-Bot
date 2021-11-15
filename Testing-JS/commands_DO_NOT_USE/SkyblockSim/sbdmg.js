const Discord = require('discord.js');
const prefix = require('@replit/database');
const prefixx = new prefix();

module.exports = {
	name: 'dmgtest',
	description: 'Test DMG System',
	usage: 'sbdmg',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['t'],
	cooldown: 10,
	async execute(client, message, args, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: message.author.id });

		if (player === null) {
			const nodata = new Discord.MessageEmbed()
				.setColor('RED')
				.setDescription(`No Profile found for <@${message.author.id}>`);
			message.channel.send({ embeds: [nodata] });
			return;
		}

		const start = new Discord.MessageEmbed()
			.setFooter('Skyblock Simulator')
			.setColor('90EE90')
			.setDescription(`Dmg Testing`);
		const row = new Discord.MessageActionRow().addComponents(
			new Discord.MessageButton().setCustomId('dmg').setLabel('Attack').setStyle('PRIMARY')
		);

		const menu = await message.channel.send({
			embeds: [start],
			components: [row],
		});

		//Player Stats
		let php = player.data.stats.health;
		let damage = player.data.stats.damage;
		let strength = player.data.stats.strength;
		let combatlvl = getLevelByXp(player.data.skills.combat).level;
		let critchance = player.data.stats.crit_chance;
		let critdmg = player.data.stats.crit_damage;
		let critted = '';
		let pdmg = '';

		//Mob Stats
		let mhp = 50;
		let mdmg = 4;

		const filter = (i) => {
			i.deferUpdate();
			return i.user.id === message.author.id;
		};

		const collector = menu.createMessageComponentCollector({
			filter,
			componentType: 'BUTTON',
			time: 60000,
		});

		collector.on('collect', async (i) => {
			if (i.customId === 'dmg' && php >= 0) {
				let crit = isCrit(critchance, critted);
				let pdmg = '';
				if (crit === 'yes') {
					pdmg =
						Math.floor((5 + damage) * (1 + strength / 100) * (1 + combatlvl * 0.04)) * (1 + critdmg / 100);
				} else {
					pdmg = Math.floor((5 + damage) * (1 + strength / 100) * (1 + combatlvl * 0.04));
				}

				php = dmgtaken(php, mdmg);
				mhp = dmgdealt(mhp, pdmg);

				const mobembed = new Discord.MessageEmbed().setFooter('Skyblock Simulator').setColor('90EE90');
				if (crit === 'yes') {
					mobembed.setDescription(
						`Player Health: ❤️ ${php} (- ${mdmg})\nMob Health: ❤️ ${mhp} (-<:crit:870306942806020106> ${pdmg})`
					);
				} else {
					mobembed.setDescription(`Player Health: ❤️ ${php} (- ${mdmg})\nMob Health: ❤️ ${mhp} (- ${pdmg})`);
				}
				menu.edit({ embeds: [mobembed] });

				if (i.customId === 'dmg' && mhp <= 0) {
					const killed = new Discord.MessageEmbed()
						.setFooter('Skyblock Simulator')
						.setColor('90EE90')
						.setDescription(`Killed the Enemy with **❤️ ${php}** left.`);

					menu.edit({ embeds: [killed], components: [] });
				} else if (i.customId === 'dmg' && php <= 0) {
					const died = new Discord.MessageEmbed()
						.setFooter('Skyblock Simulator')
						.setColor('90EE90')
						.setDescription(`Died to the Enemy which had **❤️ ${mhp}** left.`);

					menu.edit({ embeds: [died], components: [] });
				}
			}
		});
	},
};

function dmgtaken(php, mdmg) {
	php -= mdmg;
	return php;
}

function dmgdealt(mhp, pdmg) {
	mhp -= pdmg;
	return mhp;
}

function isCrit(critchance, critted) {
	let hit = Math.floor(Math.random() * 100) + 1;
	if (hit < critchance) {
		critted = 'yes';
		return critted;
	} else {
		critted = 'no';
		return critted;
	}
}
