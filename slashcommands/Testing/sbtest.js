const Discord = require('discord.js');
const getLevel = require('../../constants/Simulator/Functions/skilllvl.js');
const playerStats = require('../../constants/Simulator/Functions/playerStats.js');
const {
    getFooter,
    getColor
} = require('../../constants/Bot/embeds.js');
const {
    sleep
} = require('../../constants/Functions/general.js');
const {
    addItems
} = require('../../constants/Functions/simulator.js');
const lt = require('../../constants/Simulator/LootTables/loottables.js');

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
            .setDescription('Dragon Health: \`100000 ❤\`')

        const collector = menu.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 300000,
        });

        const drag_fighters = [];
        let eyes_placed = 0;
        let str = '';
        let drag_spawned = false;
        let drag_killed = false;
        let drag_health = 50000;
        let reason = '';
        let drag_fighting_array = [];
        let crystal_active = false;
        let dmg_interval;
        let drag_time;
        let crystal_interval;
        let crystal_interval_running = false;
        let dmg_interval_running = false;

        const timeout = setTimeout(() => {
            clearInterval(crystal_interval)
            collector.stop()
        }, 180000)

        collector.on('collect', async (i) => {
            await i.deferUpdate()

            if (eyes_placed >= 8) {
                clearTimeout(timeout)
                interaction.editReply({
                    embeds: [drag_embed],
                    components: [row1]
                })
                drag_spawned = true
                drag_time = setTimeout(() => {
                    reason = "Didn't kill Dragon in time."
                    return collector.stop()
                }, 60000)
            }

            if (drag_spawned && !crystal_interval_running) {
                crystal_interval = setInterval(() => {
                    if (drag_spawned && row1.components[0].disabled) {
                        crystal_active = true
                        row1.components[0].disabled = false
                    } else {
                        drag_health += 1500
                    }
                    crystal_interval_running = true
                }, 5000)
            }

            if (drag_spawned && !dmg_interval_running) {
                dmg_interval = setInterval(async () => {
                    dmg_interval_running = true
                    const updated = await removeHealth(drag_health, drag_fighters, collection)
                    drag_health = updated.health;
                    for (const fighter of updated.dmg) {
                        if (!drag_fighting_array.find(placer => placer.id == fighter.id)) {
                            drag_fighting_array.push({
                                id: fighter.id,
                                dmg: fighter.dmg,
                                name: fighter.name,
                                placed_eyes: fighter.placed_eyes
                            })
                        } else {
                            const index = drag_fighting_array.findIndex(x => x.id === fighter.id)
                            drag_fighting_array[index].dmg += fighter.dmg
                        }
                    }

                    drag_embed.setDescription(`Dragon Health: \`${drag_health.toLocaleString()} ❤\``)
                    drag_embed.fields = [];
                    drag_str = '';
                    for (const fighter of drag_fighting_array) {
                        const index = updated.dmg.findIndex(x => x.id = fighter.id)
                        drag_str += `${fighter.name} - \`${fighter.dmg.toLocaleString()} ⚔️\` \`(+${updated.dmg[index].dmg.toLocaleString()} ⚔️)\`\n`
                    }
                    drag_embed.addField('Damage dealt', `${drag_str}`, true)
                    drag_str = '';
                    interaction.editReply({
                        embeds: [drag_embed],
                        components: [row1]
                    })

                    if (drag_health <= 0) {
                        drag_killed = true
                        clearTimeout(drag_time)
                        clearInterval(dmg_interval)
                        crystal_active = false
                        clearInterval(crystal_interval)
                        collector.stop()
                    }
                }, 2000)
            }

            if (i.customId == 'placeeye' && !drag_spawned) {

                const player = await collection.findOne({
                    _id: i.user.id
                });

                if (!player) return interaction.followUp({
                    embeds: [noprofile]
                })

                if (player.data.inventory.items.find(item => item.name == 'Summoning Eye' && item.amount > 0)) {
                    eyes_placed++;

                    await collection.updateOne({
                        _id: i.user.id,
                        'data.inventory.items.name': 'Summoning Eye'
                    }, {
                        $inc: {
                            'data.inventory.items.$.amount': -1
                        }
                    });

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

            } else if (i.customId == 'removeeye' && !drag_spawned) {

                if (drag_fighters.find(fighter => fighter.id == i.user.id)) {
                    if (drag_fighters.find(fighter => fighter.id == i.user.id).placed_eyes > 0) {
                        eyes_placed--;
                        drag_fighters.find(fighter => fighter.id == i.user.id).placed_eyes--;
                        if (drag_fighters.find(fighter => fighter.id == i.user.id && fighter.placed_eyes == 0)) {
                            drag_fighters.splice(drag_fighters.findIndex(fighter => fighter.id == i.user.id), 1);
                        }
                        await collection.updateOne({
                            _id: i.user.id,
                            'data.inventory.items.name': 'Summoning Eye'
                        }, {
                            $inc: {
                                'data.inventory.items.$.amount': 1
                            }
                        });

                        array = findAndReplace(array, 'remove')
                    }
                } else {
                    interaction.followUp({
                        content: "You haven't placed any Summoning Eyes",
                        ephemeral: true
                    });
                }
            } else if (i.customId == 'destroycrystal' && drag_spawned) {

                row1.components[0].disabled = true
                crystal_active = false
                interaction.editReply({
                    embeds: [drag_embed],
                    components: [row1]
                })

            }

            if (drag_fighters.length > 0 && !drag_spawned) {
                for (const fighter of drag_fighters) {
                    str += `${fighter.name}: ${fighter.placed_eyes}\n`
                }
            } else {
                str += 'None'
            }

            if (!drag_spawned) {
                embed.fields = [];
                embed.addField('\u200B', `${displayArray(array)}`, true)
                embed.addField('Summoning Eyes placed', `${str}`, true)
                str = '';
                interaction.editReply({
                    embeds: [embed]
                })
            }
        });

        collector.on('end', async (collected) => {
            if (!drag_spawned) {
                if (drag_fighters.length > 0) {
                    for (const fighter of drag_fighters) {
                        if (fighter.placed_eyes == 0) continue;
                        await collection.updateOne({
                            _id: fighter.id,
                            'data.inventory.items.name': 'Summoning Eye'
                        }, {
                            $inc: {
                                'data.inventory.items.$.amount': fighter.placed_eyes
                            }
                        });
                    }
                }
                embed.setColor('RED')
                embed.setDescription('')
                embed.fields = [];
                embed.addField('Timed out', 'Not enough Summoning Eyes have been placed within the 3 Minutes', true)
                return interaction.editReply({
                    embeds: [embed],
                    components: []
                })
            } else if (drag_killed) {

                //calculate loot and add items
                /*
                 * eye placed 20 weight
                 * top 1-3 30/20/10 weight
                 */

                //sort by dmg
                drag_fighting_array = drag_fighting_array.sort((a, b) => b.dmg - a.dmg)

                //add weight for top 3 damage dealt and push to new array
                let weight = [];

                //add weight for each placer off drag_fighting_array
                for (let i = 0; i < drag_fighting_array.length; i++) {
                    let weight_num = 0;
                    if (i == 0) weight_num = 30;
                    else if (i == 1) weight_num = 20;
                    else if (i == 2) weight_num = 10;
                    else weight_num = 0;
                    weight.push({
                        id: drag_fighting_array[i].id,
                        weight: drag_fighting_array[i].placed_eyes * 20 + weight_num,
                        name: drag_fighting_array[i].name
                    })
                }

                clearInterval(dmg_interval)

                let loot_rewards = [];
                for (const player of weight) {
                    const rolled_loot = lt.dragon.roll(player.weight)
                    loot_rewards.push({
                        id: player.id,
                        name: player.name,
                        loot: rolled_loot
                    })
                }

                let end_str = '';
                for (const loot of loot_rewards) {
                    let rn = Math.floor(Math.random() * (10 - 1) + 1);

                    if (loot.loot == 'Dragon Fragments') {
                        const player = await collection.findOne({
                            _id: loot.id
                        })
                        const updatePlayer = addItems(loot.loot, rn, player);
                        await collection.replaceOne({
                            _id: loot.id
                        }, updatePlayer);

                        end_str += `${loot.name} got ${rn}x ${loot.loot}\n`
                    } else {
                        const player = await collect.findOne({
                            _id: loot.id
                        })
                        const updatePlayer = addItems(loot.loot, 1, player);
                        await collection.replaceOne({
                            _id: loot.id
                        }, updatePlayer);

                        end_str += `${loot.name} got ${loot.loot}\n`
                    }
                }

                const end_embed = new Discord.MessageEmbed()
                    .setTitle('Draon slain')
                    .setFooter(getFooter("Dragon's Nest"))
                    .setColor(getColor("Dragon's Nest"))
                    .setDescription(`${end_str}`)

                interaction.editReply({
                    embeds: [end_embed],
                    components: []
                })

            } else if (drag_spawned) {
                drag_embed.setColor('RED')
                drag_embed.addField('Dragon Fight stopped', `Reason: ${reason}`)
                return interaction.editReply({
                    embeds: [drag_embed],
                    components: []
                })
            }
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

function findAndReplace(array, state) {
    if (state == 'add') {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                if (array[i][j] == 1) {
                    array[i][j] = 2;
                    return array;
                }
            }
        }
    } else if (state == 'remove') {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                if (array[i][j] == 2) {
                    array[i][j] = 1;
                    return array;
                }
            }
        }
    }

}

//function to remove health from the enemy
async function removeHealth(health, drag_fighters, collection) {
    let hp = health;
    let dmg_array = [];
    for (const fighter of drag_fighters) {
        let player = await collection.findOne({
            _id: fighter.id
        });
        let ps = await playerStats(player);
        let combatlvl = getLevel(player.data.skills.combat).level;
        const crit = isCrit(ps.crit_chance)
        let dmg = 0;
        if (crit === 'yes') {
            dmg = Math.floor((5 + ps.damage) * (1 + ps.strength / 100) * (1 + combatlvl * 0.04)) * (1 + ps.crit_damage / 100);
        } else {
            dmg = Math.floor((5 + ps.damage) * (1 + ps.strength / 100) * (1 + combatlvl * 0.04));
        }
        dmg_array.push({
            id: fighter.id,
            dmg: dmg,
            name: fighter.name,
            placed_eyes: fighter.placed_eyes
        });
        hp -= dmg;
    }
    return {
        health: hp,
        dmg: dmg_array
    }
}

function isCrit(critchance) {
    let hit = Math.floor(Math.random() * 100) + 1;
    if (hit < critchance) {
        return 'yes';
    } else {
        return 'no';
    }
}