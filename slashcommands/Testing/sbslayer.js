const Discord = require('discord.js');
const { getFooter, getColor } = require('../../constants/Bot/embeds.js');
const { errEmbed } = require('../../constants/Functions/general.js');
const slayerLevel = require('../../constants/Simulator/Functions/slayerLevel.js');

module.exports = {
	name: 'sbslayer',
	description: 'starts slayer',
	usage: 'sblb',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: [],
	cooldown: 5,
	async execute(interaction, mclient) {

    if(interaction.user.id != '570267487393021969') return interaction.editReply('WIP')

		const collection = mclient.db('SkyblockSim').collection('Players');
		let player = await collection.findOne({ _id: interaction.user.id });
    
		if (player === null) {
			const noprofile = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('No profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			interaction.editReply({ embeds: [noprofile] });
			return;
		}

    const zombie = {
      xp: player.data.slayer.zombie.xp,
      kills:  player.data.slayer.zombie.kills
    }
    const spider = {
      xp: player.data.slayer.spider.xp,
      kills:  player.data.slayer.spider.kills
    }
    const wolf = {
      xp: player.data.slayer.wolf.xp,
      kills:  player.data.slayer.wolf.kills
    }
    const enderman = {
      xp: player.data.slayer.enderman.xp,
      kills:  player.data.slayer.enderman.kills
    }

    //embed to choose slayer type with buttons
    const embed = new Discord.MessageEmbed()
      .setColor(getColor(player))
      .setTitle('Choose a slayer type')
      .setDescription('You can choose a slayer type by clicking on the corresponding button')
      .setFooter(getFooter(player));

    const row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
      .setCustomId('zombie')
      .setLabel('Revenant Horror')
      .setStyle('PRIMARY')
      .setEmoji('852892164559732806'),
      new Discord.MessageButton()
      .setCustomId('spider')
      .setLabel('Tarantula Broodfather')
      .setStyle('PRIMARY')
      .setEmoji('852892164392222740'),
      new Discord.MessageButton()
      .setCustomId('wolf')
      .setLabel('Sven Packmaster')
      .setStyle('PRIMARY')
      .setEmoji('852892164299423754'),
      new Discord.MessageButton()
      .setCustomId('enderman')
      .setLabel('Voidgloom Seraph')
      .setStyle('PRIMARY')
      .setEmoji('854253314747924511')
    )

    const menu = await interaction.editReply({ embeds: [embed], components: [row] });

    const filter = (i) => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		};

    let type = '';

    await menu.awaitMessageComponent({
      filter,
      component: 'BUTTON',
      time: 60000,
    }).then(async (i) => {
      const { customId: id } = i;

      if(id === 'zombie'){
        type = 'zombie';
      } else if(id === 'spider'){
        type = 'spider';
      } else if(id === 'wolf'){
        type = 'wolf';
      } else if(id === 'enderman'){
        type = 'enderman';
      } else {
        return interaction.editReply({ embeds: [errEmbed('You did not choose a slayer type')]});
      }


    }).catch((err) => {})

    let array = [
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
		];

    //randomly replace an 0 in the array with 1 based on the slayer level
    let mobamount = 1;
    if(type === 'zombie') {
      const level = slayerLevel(zombie.xp).level;
      mobamount = level < 4 ? 6 : 10
    } else if(type === 'spider') {
      const level = slayerLevel(spider.xp).level;
      mobamount = level < 4 ? 6 : 10
    } else if(type === 'wolf') {
      const level = slayerLevel(wolf.xp).level;
      mobamount = level < 4 ? 6 : 10
    } else if(type === 'enderman') {
      const level = slayerLevel(wolf.xp).level;
      mobamount = level < 4 ? 6 : 10
    }

    for(let i = 0; i < mobamount * 2; i++){
      let x = Math.floor(Math.random() * 5);
      let y = Math.floor(Math.random() * 5);
      array[x][y] = 1;
    }

    const row2 = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
      .setCustomId('attack1')
      .setLabel('Attack')
      .setStyle('PRIMARY'),
      new Discord.MessageButton()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle('DANGER')
    )

    const row3 = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
      .setCustomId('attack2')
      .setLabel('Attack')
      .setStyle('PRIMARY'),
      new Discord.MessageButton()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle('DANGER')
    )

    const slayerembed = new Discord.MessageEmbed()
      .setColor(getColor(player))
      .setTitle('Slayer')
      .setDescription(displayArray(array, type))
      .setFooter(getFooter(player));

      interaction.editReply({ embeds: [slayerembed], components: [row2] });

      const collector = menu.createMessageComponentCollector({
        filter,
        componentType: 'BUTTON',
        time: 60000,
      });

      //boss stats
      let mhp = 0;
      let mdmg = 0;
      

      //craete a collector to listen for buttons
      collector.on('collect', async (i) => {
        const { customId: id } = i;

        if(id === 'attack1') {
          array = findAndReplace(array);
          slayerembed.setDescription(displayArray(array, type));

          if(!checkArray(array)){
            interaction.editReply({ embeds: [slayerembed], components: [row3], content: 'You have slain the monster!' });
          }
          interaction.editReply({ embeds: [slayerembed], components: [row2] });
        } else if(id === 'attack2') {

        } else if(id === 'cancel') {
          return interaction.editReply({ embeds: [errEmbed('You cancelled the slayer boss')] });
        }
        });

      collector.on('end', (collected, reason) => {
        slayerembed.setColor('RED');
        slayerembed.setDescription('Cancelled');
      })
  }
};

//function to find a 1 in provided array and replace it with 0 then return the array
function findAndReplace(array){
  for(let i = 0; i < array.length; i++){
    for(let j = 0; j < array[i].length; j++){
      if(array[i][j] == 1){
        array[i][j] = 0;
        return array;
      }
    }
  }
}

//function to turn the numbers in the array into emojis and display them
function displayArray(array, type){
  let emoji = '';
  let string = '';
  if(type == 'zombie'){
    emoji = '<:zombie:852892164559732806>';
  } else if(type == 'spider'){
    emoji = '<:spider:852892164392222740>';
  } else if(type == 'wolf'){
    emoji = '<:wolf:852892164299423754>';
  } else if(type == 'enderman'){
    emoji = '<:enderman:854253314747924511>';
  }
  for(let i = 0; i < array.length; i++){
    for(let j = 0; j < array[i].length; j++){
      if(array[i][j] == 1){
        string += emoji;
      } else if(array[i][j] == 0){
        string += '<:air:876209923875303424>';
      }
    }
    string += '\n';
  }
  return string;
}

//function to check if a 1 is remaining in the array  and return true if there is
function checkArray(array){
  for(let i = 0; i < array.length; i++){
    for(let j = 0; j < array[i].length; j++){
      if(array[i][j] == 1){
        return true;
      }
    }
  }
  return false;
}