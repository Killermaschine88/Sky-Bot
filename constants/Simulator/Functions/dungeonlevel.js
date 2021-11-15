const leveling = require('./leveling.js');

function getCataLevelByXp(xp, extra = {}) {
	let xp_table;
	switch (extra.type) {
		case 'runecrafting':
			xp_table = leveling.dungeoneering;
			break;
		case 'dungeoneering':
			xp_table = leveling.dungeoneering_xp;
			break;
		default:
			xp_table = leveling.dungeoneering_xp;
	}

	if (isNaN(xp)) {
		return {
			xp: 0,
			level: 0,
			xpCurrent: 0,
			xpForNext: xp_table[1],
			progress: 0,
			level_cap: 0,
			uncapped_level: 0,
		};
	}

	let xpTotal = 0;
	let level = 0;
	let uncappedLevel = 0;

	let xpForNext = Infinity;

	let levelCap = 1;
	let maxLevel = 1;

	if (extra.cap) {
		levelCap = extra.cap;
	}

	if (extra.skill) {
		if (leveling.default_skill_caps[extra.skill] && leveling.default_skill_caps[extra.skill] > levelCap) {
			levelCap = leveling.default_skill_caps[extra.skill];
		}

		if (leveling.maxed_skill_caps[extra.skill]) {
			maxLevel = leveling.maxed_skill_caps[extra.skill];
		}
	} else {
		levelCap = Object.keys(xp_table)
			.sort((a, b) => Number(a) - Number(b))
			.map((a) => Number(a))
			.pop();
	}

	if (levelCap > maxLevel) {
		maxLevel = levelCap;
	}

	for (let x = 1; x <= maxLevel; x++) {
		xpTotal += xp_table[x];

		if (xpTotal > xp) {
			xpTotal -= xp_table[x];
			break;
		} else {
			if (x <= levelCap) level = x;
			uncappedLevel = x;
		}
	}

	let xpCurrent = Math.floor(xp - xpTotal);

	if (level < levelCap) {
		xpForNext = Math.ceil(xp_table[level + 1]);
	}

	let progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));

	let levelWithProgress = getLevelWithProgress(xp, maxLevel, Object.values(xp_table));

	return {
		xp,
		level,
		maxLevel,
		xpCurrent,
		xpForNext,
		progress,
		levelCap,
		uncappedLevel,
		levelWithProgress,
	};
}

function getLevelWithProgress(experience, maxLevel, experienceGroup) {
	let level = 0;

	for (let toRemove of experienceGroup) {
		experience -= toRemove;
		if (experience < 0) {
			return Math.min(level + (1 - (experience * -1) / toRemove), maxLevel);
		}
		level++;
	}

	return Math.min(level, maxLevel);
}

module.exports = getCataLevelByXp;
