const config = require('../../constants/Bot/config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'settings',
	description: 'Settings for Skybot',
	usage: 'se (name) (true/false)',
	perms: 'Dev',
	folder: 'Dev',
	aliases: ['se'],
	async execute(client, message, args, mclient) {
		if (message.author.id !== config.ownerID) return message.channel.send("Can't use this!");

		const collection = mclient.db('Sky-Bot').collection('settings');
		let settings = await collection.find({ _id: client.user.id });

		let setting = args[0];
		let state = args[1];
		let reason = args.slice(2).join(' ');

		if (!setting || !state) return message.channel.send('No input for setting or State.');

		if (state == 'true') {
			state = true;
		} else {
			state = false;
		}

		if (!reason) {
			reason = 'Important Bug Fixes';
		}

		/*await collection.updateOne(
      { _id: client.user.id },
      { $set: {
      maintanance: {
        state: false,
        reason: 'None'
      }
       } },
      { upsert: true })*/

		if (setting == 'maintanance') {
			await collection.updateOne(
				{ _id: client.user.id },
				{
					$set: {
						'maintanance.state': state,
						'maintanance.reason': reason,
					},
				},
				{ upsert: true }
			);
		}

		message.channel.send(`${setting} changed to ${state}.`);
	},
};
