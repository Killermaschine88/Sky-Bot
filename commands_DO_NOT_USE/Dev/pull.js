const Discord = require('discord.js');
const config = require('../../constants/Bot/config.json');
const { exec } = require('child_process');

module.exports = {
	name: 'pull',
	description: 'Pull Github Changes',
	usage: 'pl',
	perms: 'Dev',
	folder: 'Dev',
	aliases: ['pl'],
	async execute(client, message, args) {
		if (message.author.id !== config.ownerID) return message.channel.send("Can't use this!");

		//  exec('git stash')

		exec('git merge', (err, stdout, stderr) => {
			console.log({ err, stdout, stderr });

			if (stdout.includes('Already up to date.')) {
				message.channel.send("I'm up to date!");
				return;
			} else {
				const pulled = new Discord.MessageEmbed()
					.setTitle('Changes Pulled')
					.setDescription('```diff\n' + stdout + '\n```\n```diff\n' + stderr + '\n```');

				message.channel.send({ embeds: [pulled] });
			}
		});
	},
};
