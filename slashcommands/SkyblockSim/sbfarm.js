const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')
const prettyms = require('pretty-ms')
const emojis = require('../../constants/Simulator/Json/emojis.json')
const { getFarmingField, SkyShiiyuLink, farm_stats } = require('../../constants/Simulator/Json/farming')
const { sbnumberformatter, getSbLevel, addCommas, toFixed } = require('../../constants/Functions/general')

module.exports = {
    name: 'sbfarm',
	description: 'Farm your fields',
	usage: 'sbfarm',
	perms: 'None',
	folder: 'SkyblockSim',
	aliases: ['sbfarm', 'sbf', 'farm'],
	cooldown: 5,
    async execute(interaction, mclient) {
        const collection = mclient.db('SkyblockSim').collection('Players');
		let user = await collection.findOne({ _id: interaction.user.id });
        if (user === null) {
			const noprofile = new MessageEmbed()
				.setColor('RED')
				.setTitle('No Profile found')
				.setDescription(`Create a profile using \`/sb start\``);
			interaction.editReply({ embeds: [noprofile] });
			return;
		}
        
        const farming_menu_selections = {
            'Sugar Cane': {
                label: 'Sugar Cane',
                value: 'Sugar Cane',
                emoji: emojis.sugar_cane.id
            },
            'Nether Wart': {
                label: 'Nether Wart',
                value: 'Nether Wart',
                emoji: emojis.wart.id
            },
            'Carrot': {
                label: 'Carrot',
                value: 'Carrot',
                emoji: emojis.carrot.id
            },
            'Pumpkin': {
                label: 'Pumpkin',
                value: 'Pumpkin',
                emoji: emojis.pumpkin.id
            },
            'Cocoa Beans': {
                label: 'Cocoa Beans',
                value: 'Cocoa Beans',
                emoji: emojis.cocoa_beans.id
            },
            'Potato': {
                label: 'Potato',
                value: 'Potato',
                emoji: emojis.potato.id
            },
            'Wheat': {
                label: 'Wheat',
                value: 'Wheat',
                emoji: emojis.wheat.id
            },
            'Melon': {
                label: 'Melon',
                value: 'Melon',
                emoji: emojis.melon.id
            },
            'Mushroom': {
                label: 'Mushroom',
                value: 'Mushroom',
                emoji: emojis.mushroom.id
            },
            'Cactus': {
                label: 'Cactus',
                value: 'Cactus',
                emoji: emojis.cactus.id
            }
        }

        const yes_no_row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('SUCCESS')
                    .setCustomId('yes')
                    .setEmoji('828976739316662272'),
                new MessageButton()
                    .setStyle('DANGER')
                    .setCustomId('no')
                    .setEmoji('828976738976530454')
            )

     // console.log(user)


        const farm_types = Object.keys(farming_menu_selections)
        let farms_to_purchase = farm_types

        //build_time in ms
        let farms = '\n' + emojis.barrier + ' None'
        let options = []
        if (user.data.skills.farming.farms.length > 0) {
            farms = ''
            for (let i = 0; i < user.data.skills.farming.farms.length; i++) {
                farms += `\n→ **${user.data.skills.farming.farms[i]}**`
                if (user.data.skills.farming.owned_farms[user.data.skills.farming.farms[i]].done_building > Date.now()) {
                    farms += ` (Building: **${prettyms(user.data.skills.farming.owned_farms[user.data.skills.farming.farms[i]].done_building - Date.now(), { secondsDecimalDigits: 0 })}**)`
                } else {
                    if (user.data.skills.farming.owned_farms[user.data.skills.farming.farms[i]].done_regrowing > Date.now()) {
                        farms += ` (Regrowing: **${prettyms(user.data.skills.farming.owned_farms[user.data.skills.farming.farms[i]].done_regrowing - Date.now(), { secondsDecimalDigits: 0 })}**)`
                    } else {
                        farms += ' (**READY**)'
                    }
                }
                options.push(farming_menu_selections[user.data.skills.farming.farms[i]])
                farms_to_purchase = farms_to_purchase.filter(e => e !== user.data.skills.farming.farms[i])
            }
        }
        let can_buy_farms = true;
        if (farms_to_purchase.length <= 0) can_buy_farms = false


        const components = [ ]
        if (options.length <= 0) {
            components.push(new MessageActionRow().addComponents(new MessageButton().setStyle('PRIMARY').setCustomId('build').setLabel('Build a Farm').setDisabled(!can_buy_farms)))
        } else {
            components.push(new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('menu').setPlaceholder('Travel to farm').addOptions(options)))
            components.push(new MessageActionRow().addComponents(new MessageButton().setStyle('PRIMARY').setCustomId('build').setLabel('Build a Farm').setDisabled(!can_buy_farms)))
        }

        let collector1timeout = true
        let collector2timeout = true
        let collector3timeout = true

        let current_farm = null

        interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle('Farming')
                    .setColor(0x3585d0)
                    .setThumbnail('https://sky.shiiyu.moe/item/GOLD_HOE')
                    .setDescription(`${emojis.coin} Coins: **${sbnumberformatter(user.data.profile.coins, 2)}**\n${emojis.farming} Farming: **${toFixed(user.data.skills.farming.level, 2)}**\n\n**Farms**:${farms}`)
            ], components: components
        }).then(msg => {
            const filter = i => i.user.id === interaction.user.id;
            const collector = msg.createMessageComponentCollector({ filter: filter, time: 60000 })

            collector.on('collect', async i => {
                if (i.customId === 'build') {
                    let buy_options = []
                    const build_embed = new MessageEmbed()
                        .setTitle('Build a Farm')
                        .setColor(0x3585d0)
                        .setThumbnail('https://sky.shiiyu.moe/item/DIRT')
                        .setDescription(`${emojis.coin} Coins: **${sbnumberformatter(user.data.profile.coins, 2)}**\n${emojis.farming} Farming: **${toFixed(user.data.skills.farming.level, 2)}**`)
                    for (let i = 0; i < farms_to_purchase.length; i++) {
                        build_embed.addField(`${farms_to_purchase[i]}`, `${emojis.coin} Cost: **${sbnumberformatter(farm_stats[farms_to_purchase[i]].cost, 2)}**\n ${emojis.watch} Time: **${prettyms(farm_stats[farms_to_purchase[i]].build_time, { secondsDecimalDigits: 0 })}**\nExp: **${farm_stats[farms_to_purchase[i]].exp * 10}** / 10\nEarnings: **${farm_stats[farms_to_purchase[i]].money * 10}** / 10`, true)
                        buy_options.push(farming_menu_selections[farms_to_purchase[i]])
                    }
                    collector1timeout = false
                    collector.stop()
                    i.update({
                        embeds: [build_embed],
                        components: [new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('buy_menu').setPlaceholder('Buy Farm').addOptions(buy_options))]
                    }).then(() => {
                        const buy_menu_collector = msg.createMessageComponentCollector({ filter: filter, time: 120000 })

                        buy_menu_collector.on('collect', i => {
                            const selection = i.values[0]
                            collector2timeout = false
                            buy_menu_collector.stop()
                            const do_you_want_to_buy_this_embed = new MessageEmbed()
                                .setTitle(`Do you want to buy the **${selection}** farm?`)
                                .setDescription(`${emojis.coin} Cost: **${sbnumberformatter(farm_stats[selection].cost, 2)}**\n ${emojis.watch} Time: **${prettyms(farm_stats[selection].build_time, { secondsDecimalDigits: 0 })}**\nExp: **${farm_stats[selection].exp * 10}** / 10\nEarnings: **${farm_stats[selection].money * 10}** / 10`)
                                .setColor(0x3585d0)
                            i.update({ embeds: [do_you_want_to_buy_this_embed], components: [yes_no_row] }).then(() => {
                                const accept_collector = msg.createMessageComponentCollector({ filter: filter, time: 60000 })

                                accept_collector.on('collect', async i => {
                                    i.deferUpdate()
                                    collector3timeout = false
                                    accept_collector.stop()
                                    if (i.customId === 'yes') {
                                        if (user.data.profile.coins >= farm_stats[selection].cost) {
                                            if (!user.data.skills.farming.owned_farms) user.data.skills.farming.owned_farms = {}
                                            user.data.skills.farming.owned_farms[selection] = {
                                                done_building: Date.now() + farm_stats[selection].build_time,
                                                done_regrowing: Date.now(),
                                                level: 1
                                            }
                                            user.data.skills.farming.farms.push(selection)
                                            await collection.updateOne(
                                                { _id: interaction.user.id },
                                                {
                                                    $set: {
                                                        'data.skills.farming.owned_farms': user.data.skills.farming.owned_farms,
                                                        'data.skills.farming.farms': user.data.skills.farming.farms,
                                                        'data.profile.coins': user.data.profile.coins - farm_stats[selection].cost
                                                    },
                                                },
                                                { upsert: true }
                                            );
                                            return interaction.editReply({ embeds: [new MessageEmbed().setTitle(`Success`).setDescription(`${emojis.checkmark} Successfully bought the **${selection}** farm.`).setColor('GREEN')], components: [] })
                                        } else {
                                            return interaction.editReply({ embeds: [new MessageEmbed().setTitle('Error').setDescription(`${emojis.crossmark} You do not have enough money to buy this farm.`).setColor('RED')], components: [] })
                                        }
                                    } else {
                                        return interaction.editReply({ embeds: [new MessageEmbed().setTitle('Cancelled').setColor(constants.colors.red).setDescription(emojis.crossmark + ' You decided to not buy the **' + selection + '** farm')], components: [] })
                                    }
                                })
                                accept_collector.on('end', () => {
                                    if (collector3timeout) {
                                        interaction.editReply({ embeds: [do_you_want_to_buy_this_embed], components: [] })
                                    }
                                })
                            })
                        })
                        buy_menu_collector.on('end', () => {
                            if (collector2timeout) {
                                interaction.editReply({ embeds: [build_embed], components: [] })
                            }
                        })
                    })
                } else if (i.customId === 'menu') {
                    i.deferUpdate()
                    const farm_selection = i.values[0]
                    current_farm = farm_selection
                    let status = ''
                    let status_emoji = ''
                    let can_farm = false;
                    let done_building = true;
                    if (user.data.skills.farming.owned_farms[farm_selection].done_building > Date.now()) {
                        status = `Building: **${prettyms(user.data.skills.farming.owned_farms[farm_selection].done_building - Date.now(), { secondsDecimalDigits: 0 })}**`
                        status_emoji = emojis.clock
                        done_building = false
                    } else {
                        if (user.data.skills.farming.owned_farms[farm_selection].done_regrowing > Date.now()) {
                            status = `Regrowing: **${prettyms(user.data.skills.farming.owned_farms[farm_selection].done_regrowing - Date.now(), { secondsDecimalDigits: 0 })}**`
                            status_emoji = emojis.not_ready
                        } else {
                            status = 'Status: **READY**'
                            status_emoji = emojis.ready
                            can_farm = true
                        }
                    }
                    let regrowing_state = can_farm ? 3 : 1

                    if (done_building && can_farm) {
                        if ((user.data.skills.farming.owned_farms[farm_selection].done_regrowing - Date.now()) >= 0) regrowing_state = 1
                        if ((user.data.skills.farming.owned_farms[farm_selection].done_regrowing - Date.now()) > 1350000) regrowing_state = 2
                    }

                    const farm_embed = new MessageEmbed()
                        .setTitle(`**${farm_selection}** Farm`)
                        .setColor(0x3585d0)
                        .setThumbnail(SkyShiiyuLink[farm_selection])
                        .setDescription(`${emojis.coin} Coins: **${sbnumberformatter(user.data.profile.coins, 2)}**\n${emojis.farming} Farming: **${toFixed(user.data.skills.farming.level, 2)}**\n${status_emoji} ${status}\n\n\n${getFarmingField(regrowing_state, farm_selection, false)}`)
                    interaction.editReply({ embeds: [farm_embed], components: [new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('menu').setPlaceholder('Travel to farm').addOptions(options)), new MessageActionRow().addComponents(new MessageButton().setStyle('PRIMARY').setCustomId('farm').setLabel('Farm').setEmoji(emojis.farming.id).setDisabled(!can_farm))] })
                } else if (i.customId === 'farm') {
                    i.deferUpdate()
                    user.data.skills.farming.owned_farms[current_farm].done_regrowing = Date.now() + 2700000
                    user.data.skills.farming.xp += 75000 * farm_stats[current_farm].exp
                    user.data.skills.farming.level = getSbLevel(user.data.skills.farming.xp)
                    await collection.updateOne(
						{ _id: interaction.user.id },
						{
							$set: {
								'data.skills.farming.owned_farms': user.data.skills.farming.owned_farms,
								'data.skills.farming.xp': user.data.skills.farming.xp,
								'data.skills.farming.level': user.data.skills.farming.level,
                                'data.profile.coins': user.data.profile.coins + 25000 * farm_stats[current_farm].money,
							},
						},
						{ upsert: true }
					);
                    let status = `Regrowing: **${prettyms(user.data.skills.farming.owned_farms[current_farm].done_regrowing - Date.now(), { secondsDecimalDigits: 0 })}**`
                    let status_emoji = emojis.not_ready
                    const farmed_embed = new MessageEmbed()
                        .setTitle(`**${current_farm}** Farm`)
                        .setColor(0x3585d0)
                        .setThumbnail(SkyShiiyuLink[current_farm])
                        .setDescription(`${emojis.coin} Coins: **${sbnumberformatter(user.data.profile.coins, 2)}**\n${emojis.farming} Farming: **${toFixed(user.data.skills.farming.level, 2)}**\n${status_emoji} ${status}\n\n\n${getFarmingField(1, current_farm, false)}\n\n→ + **${addCommas(75000 * farm_stats[current_farm].exp)}** Farming Exp\n→ + **${addCommas(25000 * farm_stats[current_farm].money)}** Coins`)
                    interaction.editReply({ embeds: [farmed_embed], components: [new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('menu').setPlaceholder('Travel to farm').addOptions(options)), new MessageActionRow().addComponents(new MessageButton().setStyle('PRIMARY').setCustomId('farm').setLabel('Farm').setEmoji(emojis.farming.id).setDisabled(true))] })
                }
            })
            /*collector.on('end', () => {
                if (collector1timeout) {
                    interaction.editReply({
                        embeds: [new MessageEmbed()
                            .setTitle('Farming')
                            .setColor(0x3585d0)
                            .setThumbnail('https://sky.shiiyu.moe/item/HOE_OF_GREATER_TILLING')
                            .setDescription(`${emojis.coin} Coins: **${sbnumberformatter(user.data.profile.coins, 2)}**\n${emojis.farming} Farming: **${toFixed(user.data.farming.level, 2)}**\n\n**Farms**:${farms}`)], components: []
                    })
                }
            })*/
        })
    }
}
