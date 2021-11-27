const Discord = require('discord.js');
const config = require('../constants/Bot/config.json');
const color = require('colorette');
const start = require('../constants/Bot/start.js');

module.exports = {
	name: 'ready',
	execute(client, mclient) {
		client.cooldowns = new Discord.Collection();
		console.log(
			String.raw`
${color.blue('  ________  __   ___  ___  ___      _______     ______  ___________')}  
${color.blue(' /"       )|/"| /  ")|"  \\/"  |    |   _  "\\   /    " \\("     _   ") ')}
${color.blue('(:   \\___/ (: |/   /  \\   \\  /     (. |_)  :) // ____  \\)__/  \\\\__/  ')}
${color.blue(' \\___  \\   |    __/    \\\\  \\/      |:     \\/ /  /    ) :)  \\\\_ /     ')}
${color.blue('  __/  \\\\  (// _  \\    /   /       (|  _  \\\\(: (____/ //   |.  |     ')}
${color.blue(' /" \\   :) |: | \\  \\  /   /        |: |_)  :)\\        /    \\:  |     ')}
${color.blue('(_______/  (__|  \\__)|___/         (_______/  \\"_____/      \\__|     ')}
                                                                     

${color.blue('[INFO]')}${color.blue(' ├─ Loaded')} ${color.green(client._eventsCount)} ${color.blue(
				' Event Listeners'
			)}  ${color.blue('[')}${color.green('+')}${color.blue('] Web Server')}
${color.blue('[INFO]')}${color.blue(' ├─ Loaded')} ${color.green(sc)} ${color.blue('Slash Commands')}   ${color.blue(
				'['
			)}${color.green('+')}${color.blue('] Database')}
${color.blue('[INFO]')}${color.blue(' └─ Loaded')} ${color.green(c)} ${color.blue('Commands')}         ${color.blue(
				'['
			)}${color.green('+')}${color.blue(
				'] Stress'
			)}                                                                        
		`.trim()
		);

		//Msging Owner on Restart
client.users.fetch('570267487393021969').then(async (user) => {
			await user.send(`Restarted`);
		});

		//Startup Stuff from function
start(client, mclient);
	},
};
