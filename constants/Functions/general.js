const Discord = require('discord.js')

const experience_table = [
    5000, 7500, 10000, 15000, 20000,
    30000, 50000, 75000, 100000, 200000,
    300000, 400000, 500000, 600000, 700000,
    800000, 900000, 1000000, 1100000, 1200000,
    1300000, 1400000, 1500000, 1600000, 1700000,
    1800000, 1900000, 2000000, 2100000, 2200000,
    2300000, 2400000, 2500000, 2600000, 2750000,
    2900000, 3100000, 3400000, 3700000, 4000000,
    4300000, 4600000, 4900000, 5200000, 5500000,
    5800000, 6100000, 6400000, 6700000, 7000000
]

function caps(words) {
  if(words.toLowerCase() == 'eye of ender') return 'Eye of Ender'
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
  }

  return embed
}

function sbnumberformatter(num, num2) {
	num = Number(num)
	if (num > 999999999) return Math.abs(num) > 999999999 ? Math.sign(num) * ((Math.abs(num) / 1000000000).toFixed(num2)) + 'B' : Math.sign(num) * Math.abs(num)
	if (num > 999999) return Math.abs(num) > 999999 ? Math.sign(num) * ((Math.abs(num) / 1000000).toFixed(num2)) + 'M' : Math.sign(num) * Math.abs(num)
	if (num > 999) return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(num2)) + 'K' : Math.sign(num) * Math.abs(num)
	if (num <= 999) return num.toFixed(0)
}

function getSbLevel(experience) {
	let level = 0;
	let experienceGroup = experience_table
	for (let toRemove of experienceGroup) {
		experience -= toRemove;
		if (experience < 0) return Math.min(level + (1 - (experience * -1) / toRemove), 50);
		level++;
	}
	return Math.floor(Math.min(level, 50), 2);
}
function addCommas(num) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toFixed(num, fixed) {
	let re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
	return num.toString().match(re)[0];
}

module.exports = { caps, sleep, errEmbed, sbnumberformatter, getSbLevel, addCommas, toFixed };
