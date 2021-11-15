const LootTable = require('../Functions/LootTable.js');

const gold = new LootTable();

gold.addItem('3000', 200, false);
gold.addItem('4000', 200, false);
gold.addItem('6000', 200, false);
gold.addItem('Recombobulator 3000', 1, true);
gold.addItem('Rotten Armor', 2, true);
gold.addItem('Skeleton Master Armor', 2, true);
gold.addItem('Silent Death', 2, true);
gold.addItem('Zombie Knight Sword', 1, true);

module.exports = gold;
