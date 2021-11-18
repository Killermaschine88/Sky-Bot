const Discord = require('discord.js')

function caps(words) {
	let separateWord = words.toLowerCase().split(' ');
	for (let i = 0; i < separateWord.length; i++) {
		separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
	}
	return separateWord.join(' ');
}

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

function errEmbed(errorText, footer) {
  const embed = new Discord.MessageEmbed()
  .setTitle('An error occured.')
  .setColor('RED')
  .setDescription(errorText)

  if(footer) {
    embed.setFooter('Skyblock Simulator • Skyblock Hub • /suggest idea')
  } else {
    embed.setFooter('Sky Bot')
  }

  return embed
}

module.exports = { caps, sleep, errEmbed };
