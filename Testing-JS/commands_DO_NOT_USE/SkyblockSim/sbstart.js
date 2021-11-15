const Discord = require('discord.js');
const prefix = require('@replit/database');
const prefixx = new prefix();

module.exports = {
	name: 'Sbstart',
	description: 'Creates your Profile for Skyblock Simulator',
	usage: 'sbstart',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['sbcreate'],
	cooldown: 10,
	async execute(client, message, args, mclient, gprefix) {
		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: message.author.id });

		const start = new Discord.MessageEmbed()
			.setColor('90EE90')
			.setDescription('<a:wait:847471618272002059> Creating Profile');

		const menu = await message.channel.send({ embeds: [start] });

		var gprefix = await prefixx.get(message.guild.id, { raw: false });
		if (gprefix === null) gprefix = '.';

		let profiles = [
			'🍎 Apple',
			'🍌 Banana',
			'🫐 Blueberry',
			'🥥 Coconut',
			'🥒 Cucumber',
			'🍇 Grapes',
			'🥝 Kiwi',
			'🍋 Lemon',
		];
		let profilename = profiles[Math.floor(Math.random() * profiles.length)];

		let starttime = message.createdTimestamp / 1000;
		starttime = starttime.toFixed();
		//if (player === null) {
		await collection.updateOne(
			{ _id: message.author.id },
			{
				$set: {
					data: {
						profile: {
							coins: 0,
							cute_name: profilename,
							started: starttime,
						},
						stats: {
							health: 100,
							defense: 0,
							damage: 5,
							strength: 0,
							crit_chance: 20,
							crit_damage: 50,
							magic_find: 0,
							sea_creature_chance: 20,
						},
						skills: {
							mining: 0,
							foraging: 0,
							enchanting: 0,
							farming: 0,
							combat: 0,
							fishing: 0,
							alchemy: 0,
							taming: 0,
						},
						inventory: {
							mining: {},
							foraging: {},
							farming: {},
							combat: {},
							fishing: {},
						},
						slayer: {
							zombiexp: 0,
							spiderxp: 0,
							wolfxp: 0,
							endermanxp: 0,
							zombiekills: 0,
							spiderkills: 0,
							wolfkills: 0,
							endermankills: 0,
						},
						dungeons: {
							xp: 0,
							class: 'None',
							secrets: 0,
						},
						settings: {
							imgshown: true,
						},
						equipment: {
							combat: {
								weapon: { name: 'Fist' },
								armor: { name: 'None' },
							},
							fishing: {
								armor: { name: 'None', sea_creature_chance: 0 },
								rod: {
									name: 'Fishing Rod',
									sea_creature_chance: 0,
									fishing_speed: 0,
								},
							},
						},
						misc: {
							voted: 0,
							location: 'Graveyard',
							is_fishing: false,
						},
					},
				},
			},
			{ upsert: true }
		);

		const created = new Discord.MessageEmbed()
			.setImage('https://cdn.discordapp.com/attachments/860131688385478666/865211353491570708/maxresdefault.png')
			.setColor('90EE90')
			.setTitle('<a:yes:847468695772987423> Profile Created')
			.setDescription(
				`To start Grinding Coins use \`${gprefix}sbgrind\` or \`${gprefix}sbfarm\`\nTo view your Profile or another Persons Profile use \`${gprefix}sbinfo (ID/@User)\`\n**FOR A GUIDE ON HOW TO PLAY USE \`${gprefix}sbguide\`**`
			)
			.setFooter("Skyblock Simulator\nValues in () aren't needed");

		menu.edit({ embeds: [created] });
		return;

		/* } else {
    const profilealready = new Discord.MessageEmbed()
      .setFooter('Values in () aren\'t needed')
      .setColor('90EE90')
      .setTitle('You already have a Profile')
      .setDescription(`Use \`${gprefix}sbinfo (ID/ @User)\` to see your Stats and \`${gprefix}sbgrind\` or \`${gprefix}sbfarm\` to earn Money`)
      .setFooter('Skyblock Simulator')
    menu.edit({ embeds: [profilealready] })
  }*/
	},
};

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}
