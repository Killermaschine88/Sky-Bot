const Discord = require('discord.js');
const prefix = require('@replit/database');
const prefixx = new prefix();

module.exports = {
	name: 'Sbguide',
	description: 'Shows a Guide for Skyblock Simulator',
	usage: 'sbguide',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: [],
	cooldown: 10,
	async execute(client, message, args) {
		var gprefix = await prefixx.get(message.guild.id, { raw: false });
		if (gprefix === null) gprefix = '.';

		const guide = new Discord.MessageEmbed()
			.setTitle('Skyblock Simulator Guide')
			.setColor('90EE90')
			.setFooter(`${gprefix}help <CommandName> for some Extra Info`)
			.setDescription(
				`To start playing **Skyblock Simulator** type \`${gprefix}sbstart\` after doing so your Profile will be created and you can start playing by using \`${gprefix}sbfarm\`\n\n**Leaderboard**\nTo view the Leaderboard for the Top 5 Coins, Kills and Skills use \`${gprefix}sblb\`\n\n**Skill Grinding**\nYou can use \`${gprefix}mining\`, \`${gprefix}foraging\`, \`${gprefix}enchanting\`, \`${gprefix}farming\`, \`${gprefix}combat\`, \`${gprefix}fishing\`, \`${gprefix}alchemy\` and \`${gprefix}taming\` to earn Skill XP for those Skills\n(1 Minute Cooldown)\n\n**General Gameplay**\nYou kill Mobs using \`${gprefix}sbfarm\` sell their drops or use them to craft better Weapons or Magic Find Items\n\n**Vote Rewards**\nIf you vote for me at [Top.gg](https://top.gg/bot/839835292785704980) you earn **INCREASED MAGICFIND** when killing Mobs`
			);

		message.channel.send({ embeds: [guide] });
	},
};
