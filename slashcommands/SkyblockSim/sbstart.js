const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');

module.exports = {
	name: 'sbstart',
	description: 'Creates your profile for Skyblock Simulator',
	usage: 'sbstart',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['sbcreate'],
	cooldown: 10,
	async execute(interaction, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: interaction.user.id });

		const start = new Discord.MessageEmbed()
			.setColor('90EE90')
			.setDescription('<a:wait:847471618272002059> Creating your profile...');

		const menu = await interaction.editReply({ embeds: [start] });

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

		let starttime = interaction.createdTimestamp / 1000;
		starttime = starttime.toFixed();
		if (player == null) {
			await collection.updateOne(
				{ _id: interaction.user.id },
				{
					$set: {
						data: {
							profile: {
								coins: 0,
								gems: 0,
								cute_name: profilename,
								started: starttime,
								name: interaction.user.username,
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
								mining_speed: 0,
								mining_fortune: 0,
							},
							skills: {
								mining: 0,
								foraging: 0,
								enchanting: 0,
								farming: 0,
								combat: 0,
								fishing: 0,
							},
							inventory: {
								items: [
									//Empty cause dropped Items go here
								],
								armor: [
									{
										name: 'Naked',
										recombobulated: false,
										health: 0,
										defense: 0,
										strength: 0,
										crit_chance: 0,
										crit_damage: 0,
										magic_find: 0,
										sea_creature_chance: 0,
										reforge: 'None',
									},
								],
								sword: [
									{
										name: 'Fist',
										recombobulated: false,
										damage: 0,
										strength: 0,
										crit_chance: 0,
										crit_damage: 0,
										reforge: 'None',
									},
								],
								talisman: [
									//Empty as talismans arent set to come yet
								],
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
							/*slayer: {
              zombie: {
xp: 0, kills: 0
              },
spider: {
xp: 0, kills: 0
},
wolf: {
xp: 0, kills: 0
},
enderman: {
xp: 0, kills: 0
},
            },*/
							dungeons: {
								xp: 0,
								total_runs: 0,
								class: {
									selected: { name: 'Assassin', xp: 0 },
									available: {
										assassin: { name: 'Assassin', xp: 0 },
										berserker: { name: 'Berserker', xp: 0 },
										tank: { name: 'Tank', xp: 0 },
									},
								},
							},
							settings: {
								imgshown: true,
								confirmation: true,
							},
							equipment: {
								combat: {
									sword: {
										name: 'Fist',
										damage: 0,
										strength: 0,
										crit_chance: 0,
										crit_damage: 0,
										recombobulated: false,
										reforge: 'None',
									},
									armor: {
										name: 'Naked',
										health: 0,
										defense: 0,
										strength: 0,
										crit_chance: 0,
										crit_damage: 0,
										magic_find: 0,
										sea_creature_chance: 0,
										recombobulated: false,
										reforge: 'None',
									},
								},
								fishing: {
									rod: {
										name: 'Fishing Rod',
										sea_creature_chance: 0,
										fishing_speed: 0,
										reforge: 'None',
										recombobulated: false,
									},
								},
								mining: {
									pickaxe: {
										name: 'Wood Pickaxe',
										mining_speed: 0,
										mining_fortune: 0,
										reforge: 'None',
										recombobulated: false,
									},
								},
							},
							misc: {
								location: 'Graveyard',
								is_fishing: false,
								is_mining: false,
								in_dungeon: false,
								is_massselling: false,
								auctions: 0,
								daily: {
									last_claimed: 0,
									streak: 0,
								},
								booster_cookie: {
									active: false,
									expires: 0,
								},
							},
						},
					},
				},
				{ upsert: true }
			);

			const created = new Discord.MessageEmbed()
				.setImage(
					'https://cdn.discordapp.com/attachments/860131688385478666/865211353491570708/maxresdefault.png'
				)
				.setColor('GREEN')
				.setTitle('<a:yes:847468695772987423> Profile Created!')
				.setDescription(
					`To start grinding coins, use \`/sb grind\`\nTo view a profile, use \`/sb info\`\nFor a **wiki** including most info check \`/sb wiki\``
				)
				.setFooter('Skyblock Simulator');

			menu.edit({ embeds: [created] });
			return;
		} else {
			const profilealready = new Discord.MessageEmbed()
				.setColor('ORANGE')
				.setTitle('You already have a profile')
				.setDescription(
					`Use \`/sb info\` to see your stats, \`/sb grind\` to earn coins and \`/sb wiki\` for info about the simulator.`
				)
				.setFooter('Skyblock Simulator');
			menu.edit({ embeds: [profilealready] });
		}
	},
};

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}
