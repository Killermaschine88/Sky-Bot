const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');

module.exports = {
	name: 'sbdaily',
	description: 'a',
	usage: 'sbsettings (Setting Name)',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: [],
	cooldown: 10,
	async execute(interaction, mclient) {
		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: interaction.user.id });

		if (player == null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			await interaction.editReply({ embeds: [noprofile] });
			return;
		}

		let time_now = Math.floor(Date.now() / 1000);
		let last_claim = player.data.misc.daily.last_claimed;
		let next_claim = last_claim + 60 * 60 * 24;
		let failed_claim = last_claim + 60 * 60 * 48;
		let gems = 0;
		let streak = player.data.misc.daily.streak + 1;

		if (next_claim <= time_now) {
			if (streak % 7 == 0) {
				gems = streak / 7;
			}
			if (failed_claim <= time_now && last_claim != 0) {
				await collection.updateOne(
					{ _id: interaction.user.id },
					{
						$inc: {
							'data.profile.coins': 25000,
							'data.profile.gems': gems,
						},
					},
					{ upsert: true }
				);

				await collection.updateOne(
					{ _id: interaction.user.id },
					{
						$set: {
							'data.misc.daily.last_claimed': time_now,
							'data.misc.daily.streak': 1,
						},
					},
					{ upsert: true }
				);

				const failedstreak = new Discord.MessageEmbed();
				failedstreak.setTitle('Claimed Daily Reward');
				if (gems == 0) {
					failedstreak.setDescription(
						`Added <:coins:861974605203636253> **25k coins** to your profile, but unfortunately your streak has been reset 😢\nYou can claim again in **24 hours**`
					);
				} else {
					failedstreak.setDescription(
						`Added <:coins:861974605203636253> **25k coins** and <:gems:879264850348486696> **${gems} gems** to your profile, but unfortunately your streak has been reset 😢\nYou can claim again in **24 hours**`
					);
				}
				failedstreak.setFooter(`${getFooter(player)}\nDaily streak: 1`);
				failedstreak.setColor(getColor(player));

				await interaction.editReply({ embeds: [failedstreak] });
				return;
			} else {
				await collection.updateOne(
					{ _id: interaction.user.id },
					{
						$inc: {
							'data.profile.coins': 25000,
							'data.misc.daily.streak': 1,
							'data.profile.gems': gems,
						},
					},
					{ upsert: true }
				);

				await collection.updateOne(
					{ _id: interaction.user.id },
					{ $set: { 'data.misc.daily.last_claimed': time_now } },
					{ upsert: true }
				);

				const claimed = new Discord.MessageEmbed();
				claimed.setTitle('Claimed Daily Reward');
				if (gems == 0) {
					claimed.setDescription(
						`Added <:coins:861974605203636253> **25k coins** to your profile.\nYou can claim again in **24 hours**`
					);
				} else {
					claimed.setDescription(
						`Added <:coins:861974605203636253> **25k coins** and <:gems:879264850348486696> **${gems} gems** to your profile.\nYou can claim again in **24 hours**`
					);
				}
				claimed.setFooter(`${getFooter(player)}\nDaily streak: ${player.data.misc.daily.streak + 1}`);
				claimed.setColor(getColor(player));

				await interaction.editReply({ embeds: [claimed] });
				return;
			}
		} else {
			const tooEarly = new Discord.MessageEmbed()
				.setTitle("Can't claim daily reward yet")
				.setDescription(`You can do it again <t:${next_claim}:R>`)
				.setColor(getColor(player))
				.setFooter(getFooter(player));

			await interaction.editReply({ embeds: [tooEarly] });
			return;
		}
	},
};
