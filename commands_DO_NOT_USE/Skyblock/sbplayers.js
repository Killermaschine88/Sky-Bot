const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'Sbplayers',
	description: 'Shows the Amount of players at each area',
	usage: 'sbplayers',
	perms: 'None',
	folder: 'Skyblock',
	aliases: ['sbp'],
	async execute(client, message, args) {
		const apiData = await getApiData();

		const players = new Discord.MessageEmbed()
			.setTitle('Skyblock Player Count')
			.setColor('90EE90')
			.setDescription(
				`Hypixel Players: **${apiData.playerCount}**\nSkyblock Players: **${apiData.games.SKYBLOCK.players}**\n\n**General Islands**\nPrivate Island: **${apiData.games.SKYBLOCK.modes.dynamic.players}**\nHub: **${apiData.games.SKYBLOCK.modes.hub.players}**\nDungeon Hub: **${apiData.games.SKYBLOCK.modes.dungeon_hub.players}**\n\n**Mining Islands**\nGold Mine: **${apiData.games.SKYBLOCK.modes.mining_1.players}**\nDeep Caverns: **${apiData.games.SKYBLOCK.modes.mining_2.players}**\nDwarven Mines: **${apiData.games.SKYBLOCK.modes.mining_3.players}**\nCrystal Hollows: **${apiData.games.SKYBLOCK.modes.crystal_hollows.players}**\n\n**Farming Islands**\nThe Farming Islands: **${apiData.games.SKYBLOCK.modes.farming_1.players}**\n\n**Combat Islands**\nSpider's Den: **${apiData.games.SKYBLOCK.modes.combat_1.players}**\nBlazing Fortress: **${apiData.games.SKYBLOCK.modes.combat_2.players}**\nThe End: **${apiData.games.SKYBLOCK.modes.combat_3.players}**`
			);

		message.channel.send({ embeds: [players] });
	},
};

async function getApiData() {
	delete require.cache[require.resolve('../../config.json')];
	const config = require('../../config.json');

	const response = await fetch(`https://api.slothpixel.me/api/counts`);
	return await response.json();
}
