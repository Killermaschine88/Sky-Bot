const Discord = require('discord.js');
const pms = require('pretty-ms');
const prefix = require('@replit/database');
const prefixx = new prefix();
let osu = require('node-os-utils');
let cpu = osu.cpu;
let mem = osu.mem;
let drive = osu.drive;

module.exports = {
	name: 'Info',
	description: 'Shows some info about the Bot',
	usage: 'info',
	perms: 'None',
	folder: 'Bot',
	aliases: [],
	async execute(interaction) {
		//System Info
		let usage = await cpu.usage();
		let model = await cpu.model();

		let memory = await mem.info();
		let cores = await cpu.count();

		let driver = await drive.info();

		const infoembed = new Discord.MessageEmbed()
			.setTitle('Bot Info')
			.setColor('BLUE')
			.setDescription('Various information about the bot')
			.addFields(
				{
					name: '<:verifieddev:848830303472189461> Bot Dev',
					value: 'Baltraz#4874 [570267487393021969]',
					inline: true,
				},
				{
					name: '<:contributor:849605979589967922> Contributors',
					value: 'Odino, Chewie, Drango',
					inline: true,
				},
				{
					name: '<:support:848831144509177866> Support Server',
					value: '[Discord Support Server](https://discord.gg/Ca6XpTRQaR)',
					inline: true,
				},
				{
					name: 'ℹ️ Total Server Count',
					value: `\`${interaction.client.guilds.cache.size}\``,
					inline: true,
				},
				// {
				//	name: "ℹ️ Total User Count",
				// 	value: `\`${interaction.client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)}\``,
				// 	inline: true
				// },
				{
					name: '<:uptime:847474288884842567> Bot Uptime',
					value: `\`${pms(interaction.client.uptime)}\``,
					inline: true,
				},
				// { name: "Command Count", value: '\`58\`', inline: true },
				//  { name: "Event Count", value: '\`2\`', inline: true },
				{
					name: 'CPU',
					value: `\`${usage}% usage\n${cores} cores\``,
					inline: true,
				},
				{
					name: 'Memory Usage',
					value: `\`${memory.usedMemPercentage}%\n${memory.usedMemMb} MB / ${memory.totalMemMb} MB\``,
					inline: true,
				},
				{
					name: 'Hard Drive Usage',
					value: `\`${driver.usedPercentage}%\n${driver.usedGb} GB / ${driver.totalGb} GB\``,
					inline: true,
				}
			)
			.setFooter(`${model}`);

		interaction.editReply({ embeds: [infoembed] });
	},
};
