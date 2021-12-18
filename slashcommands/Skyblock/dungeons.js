const Discord = require('discord.js');
const fetch = require('node-fetch');
const apikey = process.env['apikey'];
const pms = require('pretty-ms');

module.exports = {
	name: 'Dungeons',
	usage: 'dungeons (IGN)',
	description: 'Show Dungeons stats for the mentioned User',
	folder: 'Skyblock',
	perms: 'None',
	aliases: ['d', 'cata'],
	async execute(interaction) {
		var ign = interaction.options.getString('ign');

		ign = ign.replace(/\W/g, ''); // removes weird characters

		fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`).then((res) => {
			if (res.status != 200) {
				const nomc = new Discord.MessageEmbed()
					.setDescription(`No Minecraft account found for \`${ign}\``)
					.setColor('DC143C')
					.setTimestamp();
				interaction.editReply({ embeds: [nomc] });
			}
		}); // Test if IGN esists

		ign = await getTrueIgn(ign);

		// At this point we know its a valid IGN, but not if it has skyblock profiles

		const waitembed = new Discord.MessageEmbed()
			.setDescription('Checking for player data . . .')
			.setColor('ORANGE');

		const waitingembed = await interaction.editReply({
			embeds: [waitembed],
		});

		const apiData = await getApiData(ign); // Gets all skyblock player data from Senither's Hypixel API Facade

		if (apiData.status != 200) {
			const errorembed = new Discord.MessageEmbed()
				.setDescription(apiData.reason)
				.setColor('DC143C')
				.setTimestamp();

			interaction.editReply({ embeds: [errorembed] });
			return;
		}

		if (!apiData.data.dungeons) {
			const nodungembed = new Discord.MessageEmbed()
				.setDescription("This player hasn't played Dungeons yet!")
				.setColor('ORANGE')
				.setTimestamp();
			interaction.editReply({ embeds: [nodungembed] });
			return;
		}

		// IGN is valid and player has skyblock profiles

		let tier7 = apiData.data.dungeons.types.catacombs.tier_completions.tier_7;
		if (!tier7) tier7 = 0;

		let tier6 = apiData.data.dungeons.types.catacombs.tier_completions.tier_6;
		if (!tier6) tier6 = 0;

		let tier5 = apiData.data.dungeons.types.catacombs.tier_completions.tier_5;
		if (!tier5) tier5 = 0;

		let tier4 = apiData.data.dungeons.types.catacombs.tier_completions.tier_4;
		if (!tier4) tier4 = 0;

		let tier3 = apiData.data.dungeons.types.catacombs.tier_completions.tier_3;
		if (!tier3) tier3 = 0;

		let tier2 = apiData.data.dungeons.types.catacombs.tier_completions.tier_2;
		if (!tier2) tier2 = 0;

		let tier1 = apiData.data.dungeons.types.catacombs.tier_completions.tier_1;
		if (!tier1) tier1 = 0;

		let value1 = apiData.data.dungeons.types.catacombs.best_score.tier_1;
		if (!value1) value1 = 0;
		if (value1) value1 = apiData.data.dungeons.types.catacombs.best_score.tier_1.value;

		let value2 = apiData.data.dungeons.types.catacombs.best_score.tier_2;
		if (!value2) value2 = 0;
		if (value2) value2 = apiData.data.dungeons.types.catacombs.best_score.tier_2.value;

		let value3 = apiData.data.dungeons.types.catacombs.best_score.tier_3;
		if (!value3) value3 = 0;
		if (value3) value3 = apiData.data.dungeons.types.catacombs.best_score.tier_3.value;

		let value4 = apiData.data.dungeons.types.catacombs.best_score.tier_4;
		if (!value4) value4 = 0;
		if (value4) value4 = apiData.data.dungeons.types.catacombs.best_score.tier_4.value;

		let value5 = apiData.data.dungeons.types.catacombs.best_score.tier_5;
		if (!value5) value5 = 0;
		if (value5) value5 = apiData.data.dungeons.types.catacombs.best_score.tier_5.value;

		let value6 = apiData.data.dungeons.types.catacombs.best_score.tier_6;
		if (!value6) value6 = 0;
		if (value6) value6 = apiData.data.dungeons.types.catacombs.best_score.tier_6.value;

		let value7 = apiData.data.dungeons.types.catacombs.best_score.tier_7;
		if (!value7) value7 = 0;
		if (value7) value7 = apiData.data.dungeons.types.catacombs.best_score.tier_7.value;

		let time1 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_1;
		if (!time1) time1 = 0;
		if (time1) time1 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_1.seconds;
		let min1 = Math.floor(time1 / 60);
		let sec1 = Math.floor(time1 % 60);

		let time2 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_2;
		if (!time2) time2 = 0;
		if (time2) time2 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_2.seconds;
		let min2 = Math.floor(time2 / 60);
		let sec2 = Math.floor(time2 % 60);

		let time3 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_3;
		if (!time3) time3 = 0;
		if (time3) time3 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_3.seconds;
		let min3 = Math.floor(time3 / 60);
		let sec3 = Math.floor(time3 % 60);

		let time4 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_4;
		if (!time4) time4 = 0;
		if (time4) time4 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_4.seconds;
		let min4 = Math.floor(time4 / 60);
		let sec4 = Math.floor(time4 % 60);

		let time5 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_5;
		if (!time5) time5 = 0;
		if (time5) time5 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_5.seconds;
		let min5 = Math.floor(time5 / 60);
		let sec5 = Math.floor(time5 % 60);

		let time6 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_6;
		if (!time6) time6 = 0;
		if (time6) time6 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_6.seconds;
		let min6 = Math.floor(time6 / 60);
		let sec6 = Math.floor(time6 % 60);

		let time7 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_7;
		if (!time7) time7 = 0;
		if (time7) time7 = apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_7.seconds;
		let min7 = Math.floor(time7 / 60);
		let sec7 = Math.floor(time7 % 60);

		let mtier7 = apiData.data.dungeons.types.catacombs.master_mode.tier_completions.tier_7;
		if (!mtier7) mtier7 = 0;

		let mtier6 = apiData.data.dungeons.types.catacombs.master_mode.tier_completions.tier_6;
		if (!mtier6) mtier6 = 0;

		let mtier5 = apiData.data.dungeons.types.catacombs.master_mode.tier_completions.tier_5;
		if (!mtier5) mtier5 = 0;

		let mtier4 = apiData.data.dungeons.types.catacombs.master_mode.tier_completions.tier_4;
		if (!mtier4) mtier4 = 0;

		let mtier3 = apiData.data.dungeons.types.catacombs.master_mode.tier_completions.tier_3;
		if (!mtier3) mtier3 = 0;

		let mtier2 = apiData.data.dungeons.types.catacombs.master_mode.tier_completions.tier_2;
		if (!mtier2) mtier2 = 0;

		let mtier1 = apiData.data.dungeons.types.catacombs.master_mode.tier_completions.tier_1;
		if (!mtier1) mtier1 = 0;

		let mvalue1 = apiData.data.dungeons.types.catacombs.master_mode.best_score.tier_1;
		if (!mvalue1) mvalue1 = 0;
		if (mvalue1) mvalue1 = apiData.data.dungeons.types.catacombs.master_mode.best_score.tier_1.value;

		let mvalue2 = apiData.data.dungeons.types.catacombs.master_mode.best_score.tier_2;
		if (!mvalue2) mvalue2 = 0;
		if (mvalue2) mvalue2 = apiData.data.dungeons.types.catacombs.master_mode.best_score.tier_2.value;

		let mvalue3 = apiData.data.dungeons.types.catacombs.master_mode.best_score.tier_3;
		if (!mvalue3) mvalue3 = 0;
		if (mvalue3) mvalue3 = apiData.data.dungeons.types.catacombs.best_score.tier_3.value;

		let mvalue4 = apiData.data.dungeons.types.catacombs.master_mode.best_score.tier_4;
		if (!mvalue4) mvalue4 = 0;
		if (mvalue4) mvalue4 = apiData.data.dungeons.types.catacombs.master_mode.best_score.tier_4.value;

		let mvalue5 = apiData.data.dungeons.types.catacombs.master_mode.best_score.tier_5;
		if (!mvalue5) mvalue5 = 0;
		if (mvalue5) mvalue5 = apiData.data.dungeons.types.catacombs.master_mode.best_score.tier_5.value;

		let mvalue6 = apiData.data.dungeons.types.catacombs.master_mode.best_score.tier_6;
		if (!mvalue6) mvalue6 = 0;
		if (mvalue6) mvalue6 = apiData.data.dungeons.types.catacombs.master_mode.best_score.tier_6.value;

		let mvalue7 = apiData.data.dungeons.types.catacombs.master_mode.best_score.tier_7;
		if (!mvalue7) mvalue7 = 0;
		if (mvalue7) mvalue7 = apiData.data.dungeons.types.catacombs.master_mode.best_score.tier_7.value;

		let mtime1 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_1;
		if (!mtime1) mtime1 = 0;
		if (mtime1) mtime1 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_1.seconds;
		let mmin1 = Math.floor(mtime1 / 60);
		let msec1 = Math.floor(mtime1 % 60);

		let mtime2 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_2;
		if (!mtime2) mtime2 = 0;
		if (mtime2) mtime2 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_2.seconds;
		let mmin2 = Math.floor(mtime2 / 60);
		let msec2 = Math.floor(mtime2 % 60);

		let mtime3 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_3;
		if (!mtime3) mtime3 = 0;
		if (mtime3) mtime3 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_3.seconds;
		let mmin3 = Math.floor(mtime3 / 60);
		let msec3 = Math.floor(mtime3 % 60);

		let mtime4 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_4;
		if (!mtime4) mtime4 = 0;
		if (mtime4) mtime4 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_4.seconds;
		let mmin4 = Math.floor(mtime4 / 60);
		let msec4 = Math.floor(mtime4 % 60);

		let mtime5 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_5;
		if (!mtime5) mtime5 = 0;
		if (mtime5) mtime5 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_5.seconds;
		let mmin5 = Math.floor(mtime5 / 60);
		let msec5 = Math.floor(mtime5 % 60);

		let mtime6 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_6;
		if (!mtime6) mtime6 = 0;
		if (mtime6) mtime6 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_6.seconds;
		let mmin6 = Math.floor(mtime6 / 60);
		let msec6 = Math.floor(mtime6 % 60);

		let mtime7 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_7;
		if (!mtime7) mtime7 = 0;
		if (mtime7) mtime7 = apiData.data.dungeons.types.catacombs.master_mode.fastest_time_s_plus.tier_7.seconds;
		let mmin7 = Math.floor(mtime7 / 60);
		let msec7 = Math.floor(mtime7 % 60);

		const foundresult = new Discord.MessageEmbed()
			.setTitle(`Dungeons Stats`)
			.setColor('7CFC00')
			.setFooter("Click their name to view their SkyShiiyu\n0m 0s means they haven't gotten an S+ on said floor.")
			.setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `http://sky.shiiyu.moe/stats/${ign}`)
			.setDescription(
				`Catacombs level: **${toFixed(
					apiData.data.dungeons.types.catacombs.level
				)}**\nSecrets count: **${toFixed(apiData.data.dungeons.secrets_found)}**`
			)
			.addFields(
				{
					name: '<:healer:852079613001990175> Healer Level',
					value: toFixed(apiData.data.dungeons.classes.healer.level),
					inline: true,
				},
				{
					name: '<:mage:852079612699607072> Mage Level',
					value: toFixed(apiData.data.dungeons.classes.mage.level),
					inline: true,
				},
				{
					name: '<:berserker:852079613052059658> Berserker Level',
					value: toFixed(apiData.data.dungeons.classes.berserker.level),
					inline: true,
				},
				{
					name: '<:archer:852079613042491402> Archer Level',
					value: toFixed(apiData.data.dungeons.classes.archer.level),
					inline: true,
				},
				{
					name: '<:tank:852079613051666472> Tank Level',
					value: toFixed(apiData.data.dungeons.classes.tank.level),
					inline: true,
				},

				{ name: '\u200b', value: '**Catacombs**' },

				{
					name: '<:bonzo:852111493859115019> Floor 1',
					value: `Completions: **${tier1}**\nFastest S+: **${min1}m ${sec1}s**\nBest score: **${value1}**`,
					inline: true,
				},
				{
					name: '<:scarff:852111493909446686> Floor 2',
					value: `Completions: **${tier2}**\nFastest S+: **${min2}m ${sec2}s**\nBest score: **${value2}**`,
					inline: true,
				},
				{
					name: '<:professor:852111493952176148> Floor 3',
					value: `Completions: **${tier3}**\nFastest S+: **${min3}m ${sec3}s**\nBest score: **${value3}**`,
					inline: true,
				},
				{
					name: '<:thorn:852111493990580284> Floor 4',
					value: `Completions: **${tier4}**\nFastest S+: **${min4}m ${sec4}s**\nBest score: **${value4}**`,
					inline: true,
				},
				{
					name: '<:livid:852111493784666123> Floor 5',
					value: `Completions: **${tier5}**\nFastest S+: **${min5}m ${sec5}s**\nBest score: **${value5}**`,
					inline: true,
				},
				{
					name: '<:sadan:852111495466582017> Floor 6',
					value: `Completions: **${tier6}**\nFastest S+: **${min6}m ${sec6}s**\nBest score: **${value6}**`,
					inline: true,
				},
				{
					name: '<:necron:852111495575765012> Floor 7',
					value: `Completions: **${tier7}**\nFastest S+: **${min7}m ${sec7}s**\nBest score: **${value7}**`,
					inline: true,
				},

				{ name: '\u200b', value: '**Master Catacombs**' },

				{
					name: '<:bonzo:852111493859115019> Floor 1',
					value: `Completions: **${mtier1}**\nFastest S+: **${mmin1}m ${msec1}s**\nBest score: **${mvalue1}**`,
					inline: true,
				},
				{
					name: '<:scarff:852111493909446686> Floor 2',
					value: `Completions: **${mtier2}**\nFastest S+: **${mmin2}m ${msec2}s**\nBest score: **${mvalue2}**`,
					inline: true,
				},
				{
					name: '<:professor:852111493952176148> Floor 3',
					value: `Completions: **${mtier3}**\nFastest S+: **${mmin3}m ${msec3}s**\nBest score: **${mvalue3}**`,
					inline: true,
				},
				{
					name: '<:thorn:852111493990580284> Floor 4',
					value: `Completions: **${mtier4}**\nFastest S+: **${mmin4}m ${msec4}s**\nBest score: **${mvalue4}**`,
					inline: true,
				},
				{
					name: '<:livid:852111493784666123> Floor 5',
					value: `Completions: **${mtier5}**\nFastest S+: **${mmin5}m ${msec5}s**\nBest score: **${mvalue5}**`,
					inline: true,
				},
				{
					name: '<:sadan:852111495466582017> Floor 6',
					value: `Completions: **${mtier6}**\nFastest S+: **${mmin6}m ${msec6}s**\nBest score: **${mvalue6}**`,
					inline: true,
				},
				{
					name: '<:necron:852111495575765012> Floor 7',
					value: `Completions: **${mtier7}**\nFastest S+: **${mmin7}m ${msec7}s**\nBest score: **${mvalue7}**`,
					inline: true,
				}
			);
		interaction.editReply({ embeds: [foundresult] });
	},
};

async function getUUID(ign) {
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
	const result = await response.json();
	return result.id;
}

async function getApiData(ign) {
	delete require.cache[require.resolve('../../constants/Bot/config.json')];
	const config = require('../../constants/Bot/config.json');

	const UUID = await getUUID(ign);
	const response = await fetch(`https://baltrazz.repl.co/v1/profiles/${UUID}/dungeons?key=${config.apikey}`);
	return await response.json();
}

async function getTrueIgn(ign) {
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
	const result = await response.json();
	return result.name;
}

function toFixed(num) {
	var re = new RegExp('^-?\\d+(?:.\\d{0,' + (2 || -1) + '})?');
	return num.toString().match(re)[0];
}
