const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'Help',
	description: 'Help me',
	usage: 'help <Command Name>',
	perms: 'None',
	folder: 'QOL',
	aliases: [],
	async execute(client, message, args) {
		try {
			if (!args[0]) {
				const mainembed = new Discord.MessageEmbed()
					.setTitle('Sky Bot Help')
					.setDescription(
						'\n`help <Command Name>`\nFor a more Detailed view on Commands\n\nš¤ - Bot Help\nš§ - Config Help\nš² - Fun Help\nšØ - Moderation Help\nā - QOL Help\nšļø - Skyblock Help\nš - Skyblock Simulator\nš - Skyblock Simulator-Skills\nā ļø - Work in Progress Help'
					)
					.setColor('ORANGE')
					.setFooter('You have 30 Seconds to React then the Menu will stop working.');

				const menu = await message.channel.send({
					embeds: [mainembed],
				});

				menu.react('š¤')
					.then(() => menu.react('š§'))
					.then(() => menu.react('š²'))
					.then(() => menu.react('šØ'))
					.then(() => menu.react('ā'))
					.then(() => menu.react('šļø'))
					.then(() => menu.react('š'))
					.then(() => menu.react('š'))
					.then(() => menu.react('ā ļø'));

				const filter = (reaction, user) =>
					['š¤', 'š§', 'š²', 'šØ', 'ā', 'šļø', 'š', 'š', 'ā ļø'].includes(reaction.emoji.name) &&
					user.id === message.author.id;

				const collector = menu.createReactionCollector({
					filter,
					time: 60000,
				});

				collector.on('collect', (collected) => {
					const reaction = collected;
					let embed = getEmbed(reaction.emoji);
					if (embed.valid) menu.edit({ embeds: [embed.embed] });
				});

				collector.on('end', () => {
					//menu.reactions.removeAll()
				});
			}
		} catch (error) {
			console.log(error);
		}
		if (args[0]) {
			const name = args[0].toLowerCase();
			const command = message.client.commands.get(name);

			if (!command) {
				return message.channel.send({
					embeds: [
						new Discord.MessageEmbed()
							.setDescription(
								`Command \`${name}\` wasn\'t found.\nUse \`help\` to see all the Valid Commands. `
							)
							.setColor('RED'),
					],
				});
			}

			let embed = new Discord.MessageEmbed()
				.setAuthor(`Help -> ${command.folder} -> ${command.name}`)
				.setColor('616060');

			let aliases = '';
			if (!command.aliases[0]) {
				aliases = 'None';
			} else {
				aliases = command.aliases;
			}

			embed.setDescription(`${command.description}`);
			embed.addField('Permissions Needed to Execute', `${command.perms}`);
			embed.addField('Usage', `${command.usage}`);
			embed.addField('Aliases', `${aliases}`);

			return message.channel.send({ embeds: [embed] });
		}
	},
};

function getEmbed(emoji) {
	let tempEmbed = new Discord.MessageEmbed();
	tempEmbed.setFooter('help <Command Name> for a more detailed Command Info');
	let type = '';

	tempEmbed.setColor('ORANGE');

	switch (emoji.name) {
		case 'š¤':
			tempEmbed.setTitle('Bot Help');
			type = 'Bot';
			break;
		case 'š§':
			tempEmbed.setTitle('Config Help');
			type = 'Config';
			break;
		case 'š²':
			tempEmbed.setTitle('Fun Help');
			type = 'Fun';
			break;
		case 'šØ':
			tempEmbed.setTitle('Moderation Help');
			type = 'Moderation';
			break;
		case 'ā':
			tempEmbed.setTitle('QOL Help');
			type = 'QOL';
			break;
		case 'šļø':
			tempEmbed.setTitle('Skyblock Help');
			type = 'Skyblock';
			break;
		case 'š':
			tempEmbed.setTitle('Skyblock Simulator Help');
			type = 'SkyblockSim';
			break;
		case 'š':
			tempEmbed.setTitle('Skyblock Simulator Skills Help');
			type = 'SkyblockSim-Skills';
			break;
		case 'ā ļø':
			tempEmbed.setTitle('Work in Progress Help');
			type = 'WIP';
			break;
	}

	if (type.length > 2) {
		const commandFiles = fs.readdirSync(`./commands/${type}`).filter((file) => file.endsWith('.js'));
		const descriptions = [];

		commandFiles.forEach((file) => {
			const command = require(`../${type}/${file}`);
			let currentCommand = [];
			currentCommand.push(`\`${command.name.charAt(0).toUpperCase() + command.name.slice(1)}\``);
			currentCommand.push('-');
			currentCommand.push(command.description);
			descriptions.push(currentCommand.join(' '));
		});

		tempEmbed.setDescription(descriptions.join('\n'));

		return {
			embed: tempEmbed,
			valid: true,
		};
	} else {
		return {
			valid: false,
		};
	}
}
