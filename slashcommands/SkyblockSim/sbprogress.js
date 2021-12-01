const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');
const {
	getSwordProgress,
	getArmorProgress,
	getRodProgress,
	getPickaxeProgress,
} = require('../../constants/Functions/simulator.js');

module.exports = {
	name: 'sbprogress',
	description: 'a',
	usage: 'sbsettings (Setting Name)',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: [],
	cooldown: 10,
	async execute(interaction, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Players');

		if (interaction.options.getUser('user') != null) {
			var id = interaction.options.getUser('user').id;
		} else {
			var id = interaction.user.id;
		}

		var player = await collection.findOne({ _id: id });

		if (player == null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No profile found')
				.setDescription(`The specified user hasn\'t played Skyblock Simulator yet.`);
			await interaction.editReply({ embeds: [noprofile] });
			return;
		}

		let embed = new Discord.MessageEmbed()
			.setDescription(`**Skyblock Simulator progress for <@!${id}>**`)
			.setColor(getColor(player))
			.setFooter(getFooter(player));

		//Skills Completion
		let lvl50xp = 55172425;
		let miningxp = player.data.skills.mining;
		miningxp = ((miningxp / lvl50xp) * 100).toFixed(2);
		if (miningxp > 100) {
			miningxp = 100;
		}
		let fishingxp = player.data.skills.fishing;
		fishingxp = ((fishingxp / lvl50xp) * 100).toFixed(2);
		if (fishingxp > 100) {
			fishingxp = 100;
		}
		let combatxp = player.data.skills.combat;
		combatxp = ((combatxp / lvl50xp) * 100).toFixed(2);
		if (combatxp > 100) {
			combatxp = 100;
		}

		embed.addField(
			'Skills',
			`<:mining:852069714577719306> Mining: **${miningxp}%**\n<:combat:852069714527911956> Combat: **${combatxp}%**\n<:fishing:852069714359877643> Fishing: **${fishingxp}%**`,
			true
		);

		//Fishing Rod
		let rodname = player.data.equipment.fishing.rod.name;
		let rodnum = await getRodProgress(rodname);
		rodnum = ((rodnum / 9) * 100).toFixed(2);

		embed.addField('<:fishing:852069714359877643> Fishing Rod', `${rodnum}%`, true);

		//Pickaxe
		let pickaxename = player.data.equipment.mining.pickaxe.name;
		let pickaxenum = await getPickaxeProgress(pickaxename);
		pickaxenum = ((pickaxenum / 7) * 100).toFixed(2);

		embed.addField('<:mining:852069714577719306> Pickaxe', `${pickaxenum}%`, true);

		//Armor
		let armornum = await getArmorProgress(player);
		armornum = ((armornum / 11) * 100).toFixed(2);

		embed.addField('<:tank:852079613051666472> Armor', `${armornum}%`, true);

		//Sword
		let swordnum = await getSwordProgress(player);
		swordnum = ((swordnum / 10) * 100).toFixed(2);

		embed.addField('<:berserker:852079613052059658> Sword', `${swordnum}%`, true);

		//Dungeons
		let catamaxxp = 569809640;
		let cataxp = player.data.dungeons.xp;
		let assassinxp = player.data.dungeons.class.available.assassin.xp;
		let berserkerxp = player.data.dungeons.class.available.berserker.xp;
		let tankxp = player.data.dungeons.class.available.tank.xp;

		cataxp = ((cataxp / catamaxxp) * 100).toFixed(2);
		assassinxp = ((assassinxp / catamaxxp) * 100).toFixed(2);
		berserkerxp = ((berserkerxp / catamaxxp) * 100).toFixed(2);
		tankxp = ((tankxp / catamaxxp) * 100).toFixed(2);

		embed.addField(
			'Dungeons',
			`<:catacombs:854399510951624775> Dungeons: ${cataxp}%\n<:combat:852069714527911956> Assassin: ${assassinxp}%\n<:berserker:852079613052059658> Berserker: ${berserkerxp}%\n<:tank:852079613051666472> Tank: ${tankxp}%`,
			true
		);

		await interaction.editReply({ embeds: [embed] });
	},
};
