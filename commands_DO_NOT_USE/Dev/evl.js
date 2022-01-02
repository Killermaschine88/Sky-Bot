const Discord = require('discord.js');
const config = require('../../constants/Bot/config.json');
const pms = require('pretty-ms');
const prefix = require('@replit/database');
const prefixx = new prefix();
const emojis = require('../../constants/Skyblock/allemojis.json');
const sourcebin = require('sourcebin');

module.exports = {
	name: 'Evall',
	description: 'Allows execution of Code from Discord. (Dev Only)',
	usage: 'eval <command snipet>',
	perms: 'Dev',
	folder: 'Dev',
	aliases: ['ev', 'e'],
	async execute(client, message, args) {
		if (message.author.id !== config.ownerID) return
		try {
      let content = ''
			var result = args.join(' ');
			let noResultArg = new Discord.MessageEmbed()
				.setColor('RED')
				.setDescription('ERROR: No valid eval args were provided');
			if (!result) return message.channel.send({ embeds: [noResultArg] });
			let evaled = await eval(await result);

			let resultSuccess = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setTitle('Eval Success')
				.addField(`<:input:849565147331559424> Input:\n`, '```js\n' + `${args.join(' ')}` + '```', false)

      if(typeof evaled === 'object') {
        console.log(evaled)
        if(evaled.toString().length >= 3900) {
          //sourcebin
        } else {
          content = 'e'
          resultSuccess.setDescription(`<:output:849565147348336650> Output:\n` + '\n\n' + '```js\n' + JSON.stringify(evaled, null, 4) + '```');
        }
      }

			message.channel.send({ embeds: [resultSuccess], content: `${content}` });
		} catch (error) {
			let resultError = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('An error has occured')
				.addField(`<:input:849565147331559424> Input:\n`, '```js\n' + `${result}` + '```', false)
				.addField(`<:output:849565147348336650>Output:\n`, '```js\n' + `${error.message}` + '```', true)
				.setDescription(`Error:\n\`\`\`${error}\`\`\``);
			return message.channel.send({ embeds: [resultError] });
		}
	},
};
