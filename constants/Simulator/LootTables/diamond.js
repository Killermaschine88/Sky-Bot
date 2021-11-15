const LootTable = require('../Functions/LootTable.js');

const diamond = new LootTable();

diamond.addItem('5000', 100, false);
diamond.addItem('7500', 100, false);
diamond.addItem('15000', 100, false);
diamond.addItem('Recombobulator 3000', 1, true);
diamond.addItem('Skeletor Armor', 4, true);
diamond.addItem('Adaptive Armor', 1, true);
diamond.addItem('Adaptive Blade', 2, true);

module.exports = diamond;
