const Discord = require('discord.js');
const config = require('../../constants/Bot/config.json');
const pms = require('pretty-ms');
const prefix = require('@replit/database');
const prefixx = new prefix();
const emojis = require('../../constants/Skyblock/allemojis.json');
const sourcebin = require('sourcebin');

module.exports = {
	name: 'Eval',
	description: 'Allows execution of Code from Discord. (Dev Only)',
	usage: 'eval <command snipet>',
	perms: 'Dev',
	folder: 'Dev',
	aliases: ['ev', 'e'],
	async execute(client, message, args) {
		if (message.author.id !== config.ownerID) return;

    if(!args) {
      return message.channel.send({emebds: [errEmbed('No args provided!')]})
    }

    const input = args.join(' ');
    
    (async () => {

      try {
     const evaled = await eval(input)

        return message.channel.send({embeds:[await sucEmbed(evaled, message, input)]});
      } catch (err) {
        return message.channel.send({embeds: [errEmbed(err.stack)]});
      }
    })();
    
	},
};

function errEmbed(msg) {
  const embed = new Discord.MessageEmbed()
  .setTitle('Error!')
  .setDescription(`\`\`\`\n${msg}\`\`\``)
  .setColor('RED')

  return embed
}

async function sucEmbed(output, message, input) {
  const type = typeof output
  const embed = new Discord.MessageEmbed()
  .setColor('GREEN')
  .addField('Input', `\`\`\`js\n${input}\`\`\``)

  if(type === 'object' || type === 'array') {
    let length;
    if(type === 'array') {
      length = getLength({output})
    } else {
      length = getLength(output)
    }
    if(length >= 3900) {
      const bin = await sourcebin.create(
				[
					{
						content: evaled,
						language: 'Javascript',
					},
				],
				{
					title: 'Output',
					description: 'Output',
				}
			);
      embed.setDescription(`${bin.url}`)
    } else {
      embed.setDescription(`\`\`\`js\n${JSON.stringify(output, null, 2)}\`\`\``)
    }
  } else if(type === 'string' || type === 'number') {
    embed.setDescription(`${output}`)
  } else if(type === 'null' || type === 'undefined') {
    embed.setColor('RED')
    embed.setDescription(`${output}`)
  }

  embed.setFooter(`Took: ${Date.now() - message.createdTimestamp}ms`)
  return embed
}

function getLength(obj) {
  let length = 0
  const first = Object.values(obj)
  const second = Object.keys(obj)

  for(const str of first) {
    if(typeof str !== 'string') {
      length += 50
      continue;
    }
    length += str.length
  }
  for(const str of second) {
    if(typeof str !== 'string') {
      length += 50
      continue;
    }
    length += str.length
  }

  return length
}