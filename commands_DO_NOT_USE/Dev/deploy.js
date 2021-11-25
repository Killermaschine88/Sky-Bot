const config = require('../../constants/Bot/config.json');
module.exports = {
	name: 'deploy',
	description: 'Deploy Slash Commands',
	usage: 'dp',
	perms: 'Dev',
	folder: 'Dev',
	aliases: ['dp'],
	async execute(client, message, args) {
		if (message.author.id !== config.ownerID) return message.channel.send("Can't use this!");

		if (!client.application?.owner) await client.application?.fetch();

		if (message.author.id === client.application?.owner.id) {
			const cmdfile = require('../../constants/Bot/commands.js');
			const cmdfile2 = require('../../constants/Bot/commandstest.js');

			if (!args[0]) {
				const command = await client.guilds.cache.get('869124249225429022')?.commands.set(cmdfile.data);

				//const command1 = await client.guilds.cache.get('905483235344121887')?.commands.set(cmdfile.data);
			} else {
				const command = await client.guilds.cache.get('869124249225429022')?.commands.set(cmdfile2.data);
        //const command = await client.guilds.cache.get('905483235344121887')?.commands.set(cmdfile2.data);
			}

			//client.commands.set([])
			message.channel.send('Commands deployed.');
		}
	},
};
