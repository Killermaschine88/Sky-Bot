const LootTable = require('../Functions/LootTable.js');

const emerald = new LootTable();

emerald.addItem('10000', 100, false);
emerald.addItem('12000', 100, false);
emerald.addItem('15000', 100, false);
emerald.addItem('Recombobulator 3000', 1, true);
emerald.addItem('Shadow Assassin Armor', 0.3, true);
emerald.addItem('Livid Dagger', 0.5, true);

module.exports = emerald;
