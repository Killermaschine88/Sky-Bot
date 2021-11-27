const Discord = require('discord.js');
const emoji = require('../../constants/Simulator/Json/emojis.json');
const mobs = require('../../constants/Simulator/Json/mobstats.json');
const getLevel = require('../../constants/Simulator/Functions/skilllvl.js');
const playerStats = require('../../constants/Simulator/Functions/playerStats.js');
const {
    getFooter,
    getColor
} = require('../../constants/Bot/embeds.js');

module.exports = {
    name: 'sbtest',
    description: 'Earn fishing XP',
    usage: 'sbfishing',
    perms: 'None',
    folder: 'SkyblockSim',
    aliases: ['fishing', 'fish'],
    cooldown: 20,
    async execute(interaction, mclient) {

        if (interaction.user.id != '570267487393021969') return

        const collection = mclient.db('SkyblockSim').collection('Players');

        const noprofile = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('No profile found')
            .setDescription(`Create a profile using \`/sb start\``);

        let array = [
            [0, 1, 1, 0],
            [1, 0, 0, 1],
            [1, 0, 0, 1],
            [0, 1, 1, 0],
        ];

        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId('placeeye')
                .setEmoji('869900884396638238')
                .setLabel('Place Eye')
                .setStyle('SUCCESS'),
                new Discord.MessageButton()
                .setCustomId('removeeye')
                .setEmoji('869900884396638238')
                .setLabel('Remove Eye')
                .setStyle('DANGER')
            )

        const row1 = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId('destroycrystal')
                .setEmoji('913770264607744050')
                .setLabel('Destroy Crystal')
                .setStyle('SECONDARY')
                .setDisabled(true)
            )

        const embed = new Discord.MessageEmbed()
            .setColor(getColor("Dragon's Nest"))
            .setFooter(getFooter("Dragon's Nest"))
          .setTitle('Dragon Altar')
            .setDescription(`Place Summoning Eyes using the attached Buttons once 8 Eyes are placed the Dragon fight will start.\nThe Menu will cancel after 3 Minutes.`)
      .addField('\u200B', `${displayArray(array)}`, true)
      .addField('Summoning Eyes placed', 'None', true)

        const menu = await interaction.editReply({
            embeds: [embed],
            components: [row]
        });

        const drag_embed = new Discord.MessageEmbed()
      .setTitle('Dragon Fight')
      .setColor(getColor("Dragon's Nest"))
      .setFooter(getFooter("Dragon's Nest"))

        const collector = menu.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 300000,
        });

        const drag_fighters = [];
        let eyes_placed = 0;
        let str = '';
        let drag_spawned = false;
        
      const timeout = setTimeout(() => {
        collector.stop()
      }, 180000)

        collector.on('collect', async (i) => {
            i.deferUpdate()
          if(eyes_placed >= 8) {
            clearTimeout(timeout)
            interaction.editReply({embeds: [drag_embed], components: [row1]})
            drag_spawned = true
          }

            if (i.customId == 'placeeye') {

                const player = await collection.findOne({
                    _id: i.user.id
                });

                if (!player) return interaction.followUp({
                    embeds: [noprofile]
                })

                if (player.data.inventory.items.find(item => item.name == 'Summoning Eye' && item.amount > 0)) {
                    eyes_placed++;

                    await collection.updateOne({ _id: i.user.id, 'data.inventory.items.name': 'Summoning Eye' }, {$inc: { 'data.inventory.items.$.amount': -1}});

                  array = findAndReplace(array, 'add')

                    if (!drag_fighters.find(fighter => fighter.id == i.user.id)) {
                        drag_fighters.push({
                            id: i.user.id,
                            placed_eyes: 1,
                          name: i.user.username
                        });
                    } else {
                        drag_fighters.find(fighter => fighter.id == i.user.id).placed_eyes++;
                    }

                } else {
                    interaction.followUp({
                        content: 'You don\'t have any Summoning Eyes to place.',
                        ephemeral: true
                    });
                }

            } else if (i.customId == 'removeeye') {

              if(drag_fighters.find(fighter => fighter.id == i.user.id)) {
                if(drag_fighters.find(fighter => fighter.id == i.user.id).placed_eyes > 0) {
                eyes_placed--;
                drag_fighters.find(fighter => fighter.id == i.user.id).placed_eyes--;
                if(drag_fighters.find(fighter => fighter.id == i.user.id && fighter.placed_eyes == 0)) {
                  drag_fighters.splice(drag_fighters.findIndex(fighter => fighter.id == i.user.id), 1);
                }
                await collection.updateOne({ _id: i.user.id, 'data.inventory.items.name': 'Summoning Eye' }, {$inc: { 'data.inventory.items.$.amount': 1}});

                  array = findAndReplace(array, 'remove')
                }
              } else {
                interaction.followUp({
                  content: "You haven't placed any Summoning Eyes",
                  ephemeral: true
                });
              }
            } else if(i.customId == 'id name') {
              
            }

          if(drag_fighters.length > 0 && !drag_spawned) {
            for(const fighter of drag_fighters) {
              str += `${fighter.name}: ${fighter.placed_eyes}\n`
            }
          } else {
            str += 'None'
          }

          if(!drag_spawned) {
            embed.fields = [];
            embed.addField('\u200B', `${displayArray(array)}`, true)
      embed.addField('Summoning Eyes placed', `${str}`, true)
            str = '';
            interaction.editReply({embeds: [embed]})
          }
            //console.log(drag_fighters)
        });

      collector.on('end', async (collected) => {
        if(!drag_spawned) {
        if(drag_fighters.length > 0) {
          for(const fighter of drag_fighters) {
            if(fighter.placed_eyes == 0) continue;
            await collection.updateOne({ _id: fighter.id, 'data.inventory.items.name': 'Summoning Eye' }, {$inc: { 'data.inventory.items.$.amount': fighter.placed_eyes}});
          }
        }
        }
        embed.setColor('RED')
        embed.setDescription('')
        embed.fields = [];
        embed.addField('Timed out', 'Not enough Summoning Eyes have been placed within the 3 Minutes', true)
        interaction.editReply({embeds: [embed], components: []})
      })


    }
};

//function to convert array into emojis
function displayArray(array) {
    let string = '';
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if (array[i][j] == 1) {
                string += '<:end_portal_frame_empty:913761513871921192>';
            } else if (array[i][j] == 0) {
                string += '<:air:876209923875303424>';
            } else if (array[i][j] == 2) {
                string += '<:end_portal_frame_filled:913761512957550612>'
            }
        }
        string += '\n';
    }
    return string;
}

function findAndReplace(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if (array[i][j] == 1) {
                array[i][j] = 2;
                return array;
            }
        }
    }
}

function findAndReplace(array, state){
  if(state == 'add') {
    for(let i = 0; i < array.length; i++){
    for(let j = 0; j < array[i].length; j++){
      if(array[i][j] == 1){
        array[i][j] = 2;
        return array;
      }
    }
  }
  } else if(state == 'remove') {
    for(let i = 0; i < array.length; i++){
    for(let j = 0; j < array[i].length; j++){
      if(array[i][j] == 2){
        array[i][j] = 1;
        return array;
      }
    }
  }
  }
  
}