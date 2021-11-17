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
	/*if (sellitem == 'Coins' || sellitem == 'Potatoe') {
		return 0;
  }*/
	const itemprice = list.filter((item) => item.name == sellitem);

  if(itemprice.length != 0) {
    	price = itemprice[0].price;
  } else {
    price = 5
  }

	return price;
}

async function getPrice1(bzname) {
	const response = await fetch(`https://api.slothpixel.me/api/skyblock/bazaar/${bzname}`);
	return await response.json();
}

function reforgeStats(player) {
  const swordrf = player.data.equipment.combat.sword.reforge
  const armorrf = player.data.equipment.combat.armor.reforge
  const rodrf = player.data.equipment.fishing.rod.reforge
  const pickrf = player.data.equipment.mining.pickaxe.reforge

  const health = 0, defense = 0, damage = 0, strength = 0, crit_chance = 0, crit_damage = 0, magic_find = 0, sea_creature_chance = 0, mining_speed = 0, mining_fortune = 0

  switch (swordrf) {
    case 'Fabled':
      strength += 50
      crit_damage += 25
      break;
    case 'Withered':
      strength += 75
      break;
    case 'Warped':
      strength += 20
      crit_chance += 10
      crit_damage += 30
      break;
  }

  switch (armorrf) {
    case 'Submerged':
      sea_creature_chance += 10
      break;
    case 'Renowned':
      health += 50
      defense += 20
      strength += 15
      crit_damage += 20
      magic_find += 10
      break;
    case 'Ancient':
      strength += 25
      crit_chance += 10
      crit_damage += 50
      break;
    case 'Empowered':
      health += 75
      defense += 25
      break;
  }

  switch (rodrf) {
    case 'Stiff':
      sea_creature_chance += 5
      break;
    case 'Lucky':
      sea_creature_chance += 7
      magic_find += 5
      break;
  }

  switch (pickrf) {
    case 'Fruitful':
      mining_fortune += 10
      break;
    case 'Fleet':
      mining_fortune += 20
      break;
    case 'Auspicious':
      mining_fortune += 30
      break;
  }

  return {
		health,
		defense,
		damage,
		strength,
		crit_chance,
		crit_damage,
		magic_find,
		sea_creature_chance,
		mining_speed,
		mining_fortune,
	};
}

module.exports = { getAuctionID, addItems, getSwordProgress, getArmorProgress, getRodProgress, getPickaxeProgress, getPrice, getPrice1, reforgeStats };
