const config = require('../../constants/Bot/config.json');
const sourcebin = require('sourcebin');

module.exports = {
	name: 'Getcode',
	description: 'Sends the code for a given command to chat. (Dev Only)',
	usage: 'getcode <filename>',
	perms: 'Dev',
	folder: 'Dev',
	aliases: ['gc'],
	async execute(client, message, args) {
		if (message.author.id !== config.ownerID) return message.channel.send("Can't use this!");
		if (!args[0]) return message.channel.send('Please provide a valid Slash Command!');

		const code = client.slashcommands.get(args[0].toLowerCase()).execute.toString();

		if (code.length <= 1700) {
			message.channel.send(`\`\`\`js\n${code}\`\`\``);
		} else {
			const bin = await sourcebin.create(
				[
					{
						content: code,
						language: 'Javascript',
					},
				],
				{
					title: 'Code',
					description: 'Code',
				}
			);
			message.channel.send(`<${bin.url}>`);
		}
	},
};
