const emojis = require('./emojis.json')

module.exports = {
    getFarmingField: function getFarmingField(stage, crop, building) {
        if (crop === 'Wheat' && !building) {
            return `${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}${emojis['wheat_' + stage]}\n${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}`
        } else if (crop === 'Carrot' && !building) {
            return `${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}${emojis['carrot_' + stage]}\n${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}`
        } else if (crop === 'Potato' && !building) {
            return `${emojis['potato_' + stage]}${emojis['potato_' + stage]}${emojis['potato_' + stage]}${emojis['potato_' + stage]}${emojis['potato_' + stage]}${emojis['potato_' + stage]}${emojis['potato_' + stage]}${emojis['potato_' + stage]}${emojis['potato_' + stage]}${emojis['potato_' + stage]}${emojis['potato_' + stage]}${emojis['potato_' + stage]}${emojis['potato_' + stage]}${emojis['potato_' + stage]}${emojis['potato_' + stage]}\n${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}`
        } else if (crop === 'Pumpkin' && !building) {
            if (stage == 1) {
                return `${emojis.invisible}${emojis['stem_1']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}\n${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.invisible}`
            } else if (stage == 2) {
                return `${emojis.invisible}${emojis['stem_1']}${emojis.pumpkin}${emojis['stem_2']}${emojis.invisible}${emojis['stem_1']}${emojis.pumpkin}${emojis['stem_2']}${emojis.invisible}${emojis['stem_1']}${emojis.pumpkin}${emojis['stem_2']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}\n${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.invisible}`
            } else {
                return `${emojis.pumpkin}${emojis['stem_2']}${emojis.pumpkin}${emojis['stem_2']}${emojis.pumpkin}${emojis['stem_2']}${emojis.pumpkin}${emojis['stem_2']}${emojis.pumpkin}${emojis['stem_2']}${emojis.pumpkin}${emojis['stem_2']}${emojis.pumpkin}${emojis['stem_2']}${emojis.invisible}\n${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.invisible}`
            }
        } else if (crop === 'Melon' && !building) {
            if (stage == 1) {
                return `${emojis.invisible}${emojis['stem_1']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}\n${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.invisible}`
            } else if (stage == 2) {
                return `${emojis.invisible}${emojis['stem_1']}${emojis.melon}${emojis['stem_2']}${emojis.invisible}${emojis['stem_1']}${emojis.melon}${emojis['stem_2']}${emojis.invisible}${emojis['stem_1']}${emojis.melon}${emojis['stem_2']}${emojis.invisible}${emojis['stem_1']}${emojis.invisible}\n${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.invisible}`
            } else {
                return `${emojis.melon}${emojis['stem_2']}${emojis.melon}${emojis['stem_2']}${emojis.melon}${emojis['stem_2']}${emojis.melon}${emojis['stem_2']}${emojis.melon}${emojis['stem_2']}${emojis.melon}${emojis['stem_2']}${emojis.melon}${emojis['stem_2']}${emojis.invisible}\n${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.invisible}`
            }
        } else if (crop === 'Mushroom' && !building) {
            if (stage != 3) {
                return `\n${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}`
            } else {
                return `${emojis['brown_mushroom']}${emojis['red_mushroom']}${emojis['brown_mushroom']}${emojis['red_mushroom']}${emojis['red_mushroom']}${emojis['brown_mushroom']}${emojis['red_mushroom']}${emojis['brown_mushroom']}${emojis['red_mushroom']}${emojis['brown_mushroom']}${emojis['red_mushroom']}${emojis['brown_mushroom']}${emojis['red_mushroom']}${emojis['brown_mushroom']}${emojis['red_mushroom']}\n${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}${emojis.podzol}`
            }
        } else if (crop === 'Cactus' && !building) {
            if (stage == 1) {
                return `\n\n\n${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}`
            } else if (stage == 2) {
                return `\n\n${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}\n${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}`
            } else {
                return `\n${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}\n${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}${emojis.cactus}${emojis.invisible}\n${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}`
            }
        } else if (crop === 'Sugar Cane' && !building) {
            if (stage == 1) {
                return `\n\n${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}\n${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}`
            } else if (stage == 2) {
                return `\n${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}\n${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}\n${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}`
            } else {
                return `${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}\n${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}\n${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}${emojis.cane}\n${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}${emojis.sand}`
            }
        } else if (crop === 'Nether Wart' && !building) {
            return `${emojis['wart_' + stage]}${emojis['wart_' + stage]}${emojis['wart_' + stage]}${emojis['wart_' + stage]}${emojis['wart_' + stage]}${emojis['wart_' + stage]}${emojis['wart_' + stage]}${emojis['wart_' + stage]}${emojis['wart_' + stage]}${emojis['wart_' + stage]}${emojis['wart_' + stage]}${emojis['wart_' + stage]}${emojis['wart_' + stage]}${emojis['wart_' + stage]}${emojis['wart_' + stage]}\n${emojis.soulsand}${emojis.soulsand}${emojis.soulsand}${emojis.soulsand}${emojis.soulsand}${emojis.soulsand}${emojis.soulsand}${emojis.soulsand}${emojis.soulsand}${emojis.soulsand}${emojis.soulsand}${emojis.soulsand}${emojis.soulsand}${emojis.soulsand}${emojis.soulsand}`
        } else if (crop === 'Cocoa Beans' && !building) {
            return `${emojis.invisible}${emojis.jungle}${emojis['cocoa_' + stage]}${emojis.jungle}${emojis['cocoa_' + stage]}${emojis.jungle}${emojis['cocoa_' + stage]}${emojis.jungle}${emojis['cocoa_' + stage]}${emojis.jungle}${emojis['cocoa_' + stage]}${emojis.jungle}${emojis['cocoa_' + stage]}${emojis.jungle}${emojis.invisible}\n${emojis.invisible}${emojis.jungle}${emojis['cocoa_' + stage]}${emojis.jungle}${emojis['cocoa_' + stage]}${emojis.jungle}${emojis['cocoa_' + stage]}${emojis.jungle}${emojis['cocoa_' + stage]}${emojis.jungle}${emojis['cocoa_' + stage]}${emojis.jungle}${emojis['cocoa_' + stage]}${emojis.jungle}${emojis.invisible}\n${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}${emojis.dirt}`
        }
    },
    SkyShiiyuLink: {
        'Sugar Cane': 'https://sky.shiiyu.moe/item/SUGAR_CANE',
        'Nether Wart': 'https://sky.shiiyu.moe/item/NETHER_STALK',
        'Carrot': 'https://sky.shiiyu.moe/item/CARROT',
        'Pumpkin': 'https://sky.shiiyu.moe/item/PUMPKIN',
        'Cocoa Beans': 'https://sky.shiiyu.moe/item/INK_SACK:3',
        'Potato': 'https://sky.shiiyu.moe/item/POTATO_ITEM',
        'Wheat': 'https://sky.shiiyu.moe/item/WHEAT',
        'Melon': 'https://sky.shiiyu.moe/item/MELON',
        'Mushroom': 'https://sky.shiiyu.moe/item/RED_MUSHROOM',
        'Cactus': 'https://sky.shiiyu.moe/item/CACTUS'
    },
    farm_stats: {
        'Sugar Cane': {
            build_time: 172800000,
            cost: 1000000,
            exp: 0.9,
            money: 0.6,
        },
        'Nether Wart': {
            build_time: 172800000,
            cost: 1000000,
            exp: 0,
            money: 1,
        },
        'Carrot': {
            build_time: 144000000,
            cost: 900000,
            exp: 0.7,
            money: 0.8,
        },
        'Pumpkin': {
            build_time: 136800000,
            cost: 800000,
            exp: 1,
            money: 0.4,
        },
        'Wheat': {
            build_time: 100800000,
            cost: 600000,
            exp: 0.7,
            money: 0.1,
        },
        'Cocoa Beans': {
            build_time: 115200000,
            cost: 700000,
            exp: 0.6,
            money: 0.7,
        },
        'Potato': {
            build_time: 115200000,
            cost: 700000,
            exp: 0.7,
            money: 0.5,
        },
        'Melon': {
            build_time: 86400000,
            cost: 500000,
            exp: 0.3,
            money: 0.3,
        },
        'Mushroom': {
            build_time: 64800000,
            cost: 300000,
            exp: 0.2,
            money: 0.2,
        },
        'Cactus': {
            build_time: 43200000,
            cost: 200000,
            exp: 0.1,
            money: 0.1,
        }
    }
}