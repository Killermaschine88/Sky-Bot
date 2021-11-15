const list = require('../../constants/Simulator/Json/prices.json');
const fetch = require('node-fetch');


function getAuctionID() {
	const first = Date.now().toString(36).slice(-3);
	const second = Math.random().toString(36).slice(-3);

	return first + second;
}

function addItems(mobdrop, amount, player) {
	if (!player.data.inventory.items) player.data.inventory.items = [];

	if (player.data.inventory.items.length === 0) {
		player.data.inventory.items.push({
			name: mobdrop,
			amount: amount,
		});
		return player;
	}

	for (const item of player.data.inventory.items) {
		if (item.name === mobdrop) {
			item.amount += amount;
			return player;
		}
	}

	player.data.inventory.items.push({
		name: mobdrop,
		amount: amount,
	});
	return player;
}

function getSwordProgress(player) {
	let inv = player.data.inventory.sword;
	let num = 0;

	if (inv.find((item) => item.name == 'Undead Sword')) {
		num++;
	} else if (inv.find((item) => item.name == 'Golem Sword')) {
		num++;
	} else if (inv.find((item) => item.name == 'Zombie Sword')) {
		num++;
	} else if (inv.find((item) => item.name == "Tactician's Sword")) {
		num++;
	} else if (inv.find((item) => item.name == 'Leaping Sword')) {
		num++;
	} else if (inv.find((item) => item.name == 'Dreadlord Sword')) {
		num++;
	} else if (inv.find((item) => item.name == 'Silent Death')) {
		num++;
	} else if (inv.find((item) => item.name == 'Zombie Knight Sword')) {
		num++;
	} else if (inv.find((item) => item.name == 'Adaptive Blade')) {
		num++;
	} else if (inv.find((item) => item.name == 'Livid Dagger')) {
		num++;
	}

	return num;
}

function getArmorProgress(player) {
	let inv = player.data.inventory.armor;
	let num = 0;

	if (inv.find((item) => item.name == 'Leaflet Armor')) {
		num++;
	} else if (inv.find((item) => item.name == 'Golem Armor')) {
		num++;
	} else if (inv.find((item) => item.name == 'Monster Hunter Armor')) {
		num++;
	} else if (inv.find((item) => item.name == 'Tarantula Armor')) {
		num++;
	} else if (inv.find((item) => item.name == 'Frozen Blaze Armor')) {
		num++;
	} else if (inv.find((item) => item.name == 'Superior Dragon Armor')) {
		num++;
	} else if (inv.find((item) => item.name == 'Rotten Armor')) {
		num++;
	} else if (inv.find((item) => item.name == 'Skeleton Master Armor')) {
		num++;
	} else if (inv.find((item) => item.name == 'Skeletor Armor')) {
		num++;
	} else if (inv.find((item) => item.name == 'Adaptive Armor')) {
		num++;
	} else if (inv.find((item) => item.name == 'Shadow Assassin Armor')) {
		num++;
	}

	return num;
}

function getRodProgress(rodname) {
	if (rodname == 'Fishing Rod') return 1;
	else if (rodname == 'Prismarine Rod') return 2;
	else if (rodname == 'Sponge Rod') return 3;
	else if (rodname == 'Speedster Rod') return 4;
	else if (rodname == "Farmer's Rod") return 5;
	else if (rodname == 'Challenging Rod') return 6;
	else if (rodname == 'Rod of Champions') return 7;
	else if (rodname == 'Rod of Legends') return 8;
	else if (rodname == 'Rod of the Sea') return 9;
}

function getPickaxeProgress(pickaxename) {
	if (pickaxename == 'Wood Pickaxe') return 1;
	else if (pickaxename == 'Stone Pickaxe') return 2;
	else if (pickaxename == 'Iron Pickaxe') return 3;
	else if (pickaxename == 'Mithril Pickaxe') return 4;
	else if (pickaxename == 'Titanium Pickaxe') return 5;
	else if (pickaxename == 'Stonk') return 6;
	else if (pickaxename == 'Gemstone Gauntlet') return 7;
}

function getPrice(sellitem) {
	if (sellitem == 'Coins' || sellitem == 'Potatoe') {
		return 0;
	}
	const itemprice = list.filter((item) => item.name == sellitem);

	price = itemprice[0].price;

	return price;
}

async function getPrice1(bzname) {
	const response = await fetch(`https://api.slothpixel.me/api/skyblock/bazaar/${bzname}`);
	return await response.json();
}

module.exports = { getAuctionID, addItems, getSwordProgress, getArmorProgress, getRodProgress, getPickaxeProgress, getPrice, getPrice1 };
