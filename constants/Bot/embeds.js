const COLORS = {
	ZOMBIE_GREEN: '#698362',
	LIGHT_BLUE: '#87CEEB',
	DEEP_GREY: '#4A4A4A',
	ORANGE: '#F76806',
	PURPUR: '#A171A4',
	BLACK: '#0A0A0A',
	WHITE: '#F0F0F0',
	GOLD: '#FFD700',
	GREY: '#BFBFBD',
};

const getColor = (playerOrString) => {
	const location = typeof playerOrString === 'string' ? playerOrString : playerOrString.data.misc.location;

	/*
		Hardcoded locations:
		• Pond (for fishing)
		• Dungeons (for dungeon)
	*/
	switch (location) {
		case 'Slimehill':
		case "Pigman's Den":
		case 'Graveyard':
			return COLORS.ZOMBIE_GREEN;

		case 'Diamond Reserve':
		case 'Crystal Hollows':
		case 'Lapis Quarry':
		case 'Pond':
			return COLORS.LIGHT_BLUE;

		case 'Gunpowder Mines':
		case 'Dwarven Mines':
		case 'Deep Caverns':
			return COLORS.DEEP_GREY;

		case 'Blazing Fortress':
		case 'Molten Castle':
		case 'Molten Bridge':
		case 'Lava Field':
			return COLORS.ORANGE;

		case 'The End':
    case 'End Gate':
    case 'Dragon\'s Nest':
    case 'Void Sepulture':
			return COLORS.PURPUR;

		case 'Obsidian Sanctuary':
		case 'Coal Mine':
			return COLORS.BLACK;

		case 'Lower Spiders Hill':
		case 'Upper Spiders Hill':
		case "Spider's Den":
		case 'Spider Cave':
		case 'Highlevel':
			return COLORS.WHITE;

		case 'Gold Mine':
			return COLORS.GOLD;

		case 'Dungeons':
		case 'Ruins':
		case 'Hub':
			return COLORS.GREY;

		default:
			return COLORS.WHITE;
	}
};

const getFooter = (playerOrString) => {
	const location = typeof playerOrString === 'string' ? playerOrString : playerOrString.data.misc.location;

	return `Skyblock Simulator • ${location} • /suggest idea`;
};

module.exports = { getColor, getFooter, COLORS };
