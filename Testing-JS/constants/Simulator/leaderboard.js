/**
 * The possible leaderboard types
 */
const TYPES = {
	COINS: {
		name: 'Coins',
		value: 'coins',
		data: 'data.profile.coins',
		emote: '<:coins:861974605203636253>',
	},
	COMBAT: {
		name: 'Combat',
		value: 'combatxp',
		data: 'data.skills.combat',
		emote: '<:combat:852069714527911956>',
	},
	FISHING: {
		name: 'Fishing',
		value: 'fishingxp',
		data: 'data.skills.fishing',
		emote: '<:fishing:852069714359877643>',
	},
	MINING: {
		name: 'Mining',
		value: 'miningxp',
		data: 'data.skills.mining',
		emote: '<:mining:852069714577719306>',
	},
	DUNGEONS: {
		name: 'Dungeons',
		value: 'dungeonsxp',
		data: 'data.dungeons.xp',
		emote: '<:catacombs:858745517025656863>',
	},
	ASSASSIN: {
		name: 'Assassin',
		value: 'assassinxp',
		data: 'data.dungeons.class.available.assassin.xp',
		emote: '🗡️',
	},
	TANK: {
		name: 'Tank',
		value: 'tankxp',
		data: 'data.dungeons.class.available.tank.xp',
		emote: '<:tank:852079613051666472>',
	},
	BERSERKER: {
		name: 'Berserker',
		value: 'berserkerxp',
		data: 'data.dungeons.class.available.berserker.xp',
		emote: '<:berserker:852079613052059658>',
	},
};

/**
 * This method is used to get a specific leaderboard type from a value.
 *
 * @param {*} type Leaderboard Type
 * @returns A specific leaderboard type
 */
const GetType = (type) => {
	switch (type) {
		case TYPES.COINS.value: {
			return TYPES.COINS;
		}
		case TYPES.COMBAT.value: {
			return TYPES.COMBAT;
		}
		case TYPES.FISHING.value: {
			return TYPES.FISHING;
		}
		case TYPES.MINING.value: {
			return TYPES.MINING;
		}
		case TYPES.DUNGEONS.value: {
			return TYPES.DUNGEONS;
		}
		case TYPES.ASSASSIN.value: {
			return TYPES.ASSASSIN;
		}
		case TYPES.TANK.value: {
			return TYPES.TANK;
		}
		case TYPES.BERSERKER.value: {
			return TYPES.BERSERKER;
		}
		default: {
			return null;
		}
	}
};

module.exports = {
	TYPES,
	GetType,
};
