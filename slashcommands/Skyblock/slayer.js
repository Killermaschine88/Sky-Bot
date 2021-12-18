const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'Slayer',
	description: "Shows the user's slayer data.",
	usage: 'slayer (IGN)',
	perms: 'None',
	folder: 'Skyblock',
	aliases: ['sl'],
	async execute(interaction) {
		var ign = interaction.options.getString('ign');

		var method = 'save';

		ign = ign.replace(/\W/g, ''); // removes weird characters

		const waitembed = new Discord.MessageEmbed()
			.setDescription('Checking for player data . . .')
			.setColor('ORANGE');

		const waitingembed = await interaction.editReply({
			embeds: [waitembed],
		});

		fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`).then((res) => {
			if (res.status != 200) {
				const nomcacc = new Discord.MessageEmbed()
					.setDescription(`No Minecraft account found for \`${ign}\``)
					.setColor('DC143C')
					.setTimestamp();
				interaction.editReply({ embeds: [nomcacc] });
				return;
			}
		}); // Test if IGN esists

		// ign = await getTrueIgn(ign);

		// At this point we know its a valid IGN, but not if it has skyblock profiles
		const apiData = await getApiData(ign, method);

		if (apiData.status != 200) {
			return interaction.editReply({
				embeds: [new Discord.MessageEmbed().setDescription(apiData.reason).setColor('DC143C').setTimestamp()],
			});
		}

		//all needed calculations
		const rxp = apiData.data.slayers.bosses.revenant.experience;
		let rrxp = Math.floor(rxp / 1000);
		if (rrxp > 999) {
			rrxp = Math.floor(rxp / 1000000) + '.' + Math.floor((rxp % 1000000) / 1000) + 'M';
		} else {
			rrxp = rrxp + 'K';
		}

		const txp = apiData.data.slayers.bosses.tarantula.experience;
		let ttxp = Math.floor(txp / 1000);
		if (ttxp > 999) {
			ttxp = Math.floor(txp / 1000000) + '.' + Math.floor((txp % 1000000) / 1000) + 'M';
		} else {
			ttxp = ttxp + 'K';
		}

		const sxp = apiData.data.slayers.bosses.sven.experience;
		let ssxp = Math.floor(sxp / 1000);
		if (ssxp > 999) {
			ssxp = Math.floor(sxp / 1000000) + '.' + Math.floor((sxp % 1000000) / 1000) + 'M';
		} else {
			ssxp = ssxp + 'K';
		}

		const exp = apiData.data.slayers.bosses.enderman.experience;
		let eexp = Math.floor(exp / 1000);
		if (eexp > 999) {
			eexp = Math.floor(exp / 1000000) + '.' + Math.floor((exp % 1000000) / 1000) + 'M';
		} else {
			eexp = eexp + 'K';
		}

		const totalxp = apiData.data.slayers.total_experience;
		let ttotalxp = Math.floor(totalxp / 1000);
		if (ttotalxp > 999) {
			ttotalxp = Math.floor(totalxp / 1000000) + '.' + Math.floor((totalxp % 1000000) / 1000) + 'M';
		} else {
			ttotalxp = ttotalxp + 'K';
		}

		const rlevel = apiData.data.slayers.bosses.revenant.level;
		const rfixed = rlevel.toFixed(0);
		const tlevel = apiData.data.slayers.bosses.tarantula.level;
		const tfixed = tlevel.toFixed(0);
		const slevel = apiData.data.slayers.bosses.sven.level;
		const sfixed = slevel.toFixed(0);
		const elevel = apiData.data.slayers.bosses.enderman.level;
		const efixed = elevel.toFixed(0);

		const r1 = apiData.data.slayers.bosses.revenant.kills.tier_1;
		const r2 = apiData.data.slayers.bosses.revenant.kills.tier_2;
		const r3 = apiData.data.slayers.bosses.revenant.kills.tier_3;
		const r4 = apiData.data.slayers.bosses.revenant.kills.tier_4;
		const r5 = apiData.data.slayers.bosses.revenant.kills.tier_5;

		const t1 = apiData.data.slayers.bosses.tarantula.kills.tier_1;
		const t2 = apiData.data.slayers.bosses.tarantula.kills.tier_2;
		const t3 = apiData.data.slayers.bosses.tarantula.kills.tier_3;
		const t4 = apiData.data.slayers.bosses.tarantula.kills.tier_4;
		const t5 = apiData.data.slayers.bosses.tarantula.kills.tier_5;

		const s1 = apiData.data.slayers.bosses.sven.kills.tier_1;
		const s2 = apiData.data.slayers.bosses.sven.kills.tier_2;
		const s3 = apiData.data.slayers.bosses.sven.kills.tier_3;
		const s4 = apiData.data.slayers.bosses.sven.kills.tier_4;
		const s5 = apiData.data.slayers.bosses.sven.kills.tier_5;

		const e1 = apiData.data.slayers.bosses.enderman.kills.tier_1;
		const e2 = apiData.data.slayers.bosses.enderman.kills.tier_2;
		const e3 = apiData.data.slayers.bosses.enderman.kills.tier_3;
		const e4 = apiData.data.slayers.bosses.enderman.kills.tier_4;
		const e5 = apiData.data.slayers.bosses.enderman.kills.tier_5;

		if (apiData.status != 200) {
			const apierror = new Discord.MessageEmbed()
				.setDescription(apiData.reason)
				.setColor('DC143C')
				.setTimestamp();
			waitingembed.edit({ embeds: [apierror] });
			return;
		}

		// IGN is valid and player has skyblock profiles

		if (apiData.data.skills.apiEnabled == false) {
			const noapion = new Discord.MessageEmbed()
				.setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
				.setDescription(
					'You currently have skills API disabled, please enable it in the skyblock menu and try again'
				)
				.setColor('DC143C')
				.setTimestamp();
			interaction.editReply({ embeds: [noapion] });
			return;
		}

		const slayerembed = new Discord.MessageEmbed()
			.setColor('7CFC00')
			.setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `http://sky.shiiyu.moe/stats/${ign}`)
			.setFooter(`${ign}'s Total slayer XP: ` + `${ttotalxp}`)
			/* .addFields(
           {name: `Slayer data for ${ign}`, value: getSlayers(apiData), inline: true},
      )*/

			.setDescription(`**Slayer data for ${ign}**`)
			.addFields(
				{
					name: `<:rev:852892164559732806> **Revenant [${rfixed}]**`,
					value: `Experience: **${rrxp}**\n\n **Slayer kills:** \n\`\`\`T1: ${r1}\nT2: ${r2}\nT3: ${r3}\nT4: ${r4}\nT5: ${r5}\`\`\``,
					inline: true,
				},
				{
					name: `<:tara:852892164392222740> **Tarantula [${tfixed}]**`,
					value: `Experience: **${ttxp}**\n\n **Slayer kills:** \n\`\`\`T1: ${t1}\nT2: ${t2}\nT3: ${t3}\nT4: ${t4}\nT5: ${t5}\`\`\``,
					inline: true,
				},
				{
					name: `<:sven:852892164299423754> **Sven [${sfixed}]**`,
					value: `Experience: **${ssxp}**\n\n **Slayer Kills:** \n\`\`\`T1: ${s1}\nT2: ${s2}\nT3: ${s3}\nT4: ${s4}\nT5: ${s5}\`\`\``,
					inline: true,
				},
				{
					name: `<:eman:854253314747924511> **Enderman [${efixed}]**`,
					value: `Experience: **${eexp}**\n\n **Slayer kills:** \n\`\`\`T1: ${e1}\nT2: ${e2}\nT3: ${e3}\nT4: ${e4}\nT5: ${e5}\`\`\``,
				}
			);

		interaction.editReply({ embeds: [slayerembed] });
		return;
	},
};

function getSlayers(apiData) {
	const rxp = apiData.data.slayers.bosses.revenant.experience;
	const txp = apiData.data.slayers.bosses.tarantula.experience;
	const sxp = apiData.data.slayers.bosses.sven.experience;
	const exp = apiData.data.slayers.bosses.enderman.experience;
	const rlevel = apiData.data.slayers.bosses.revenant.level;
	const tlevel = apiData.data.slayers.bosses.tarantula.level;
	const slevel = apiData.data.slayers.bosses.sven.level;
	const elevel = apiData.data.slayers.bosses.enderman.level;
	const r1 = apiData.data.slayers.bosses.revenant.kills.tier_1;
	const r2 = apiData.data.slayers.bosses.revenant.kills.tier_2;
	const r3 = apiData.data.slayers.bosses.revenant.kills.tier_3;
	const r4 = apiData.data.slayers.bosses.revenant.kills.tier_4;
	const r5 = apiData.data.slayers.bosses.revenant.kills.tier_5;
	const t1 = apiData.data.slayers.bosses.tarantula.kills.tier_1;
	const t2 = apiData.data.slayers.bosses.tarantula.kills.tier_2;
	const t3 = apiData.data.slayers.bosses.tarantula.kills.tier_3;
	const t4 = apiData.data.slayers.bosses.tarantula.kills.tier_4;
	const s1 = apiData.data.slayers.bosses.sven.kills.tier_1;
	const s2 = apiData.data.slayers.bosses.sven.kills.tier_2;
	const s3 = apiData.data.slayers.bosses.sven.kills.tier_3;
	const s4 = apiData.data.slayers.bosses.sven.kills.tier_4;
	const e1 = apiData.data.slayers.bosses.enderman.kills.tier_1;
	const e2 = apiData.data.slayers.bosses.enderman.kills.tier_2;
	const e3 = apiData.data.slayers.bosses.enderman.kills.tier_3;
	const e4 = apiData.data.slayers.bosses.enderman.kills.tier_4;

	return [
		`<:rev:852892164559732806> **Revenant [${rlevel}]**`,
		`Experience: **${rxp}**\n\n **Slayer kills:** \n\`\`\`T1: ${r1}\nT2: ${r2}\nT3: ${r3}\nT4: ${r4}\nT5: ${r5}\`\`\``,
		`<:tara:852892164392222740> **Tarantula [${tlevel}]**`,
		`Experience: **${txp}**\n\n **Slayer kills:** \n\`\`\`T1: ${t1}\nT2: ${t2}\nT3: ${t3}\nT4: ${t4}\`\`\``,
		`<:sven:852892164299423754> **Sven [${slevel}]**`,
		`Experience: **${sxp}**\n\n **Slayer kills:** \n\`\`\`T1: ${s1}\nT2: ${s2}\nT3: ${s3}\nT4: ${s4}\`\`\``,
		`<:eman:854253314747924511> **Enderman [${elevel}]**`,
		`Experience: **${exp}**\n\n **Slayer kills:** \n\`\`\`T1: ${e1}\nT2: ${e2}\nT3: ${e3}\nT4: ${e4}\`\`\``,
	].join('\n');
}

async function getUUID(ign) {
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
	const result = await response.json();
	return result.id;
}

async function getApiData(ign, method) {
	delete require.cache[require.resolve('../../constants/Bot/config.json')];
	const config = require('../../constants/Bot/config.json');

	const UUID = await getUUID(ign);
	const response = await fetch(`https://baltrazz.repl.co/v1/profiles/${UUID}/${method}?key=${config.apikey}`);
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
