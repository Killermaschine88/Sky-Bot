const LootTable = require('../Functions/LootTable.js');

const obsidian = new LootTable();

obsidian.addItem('15000', 33, false);
obsidian.addItem('17500', 33, false);
obsidian.addItem('20000', 33, false);
obsidian.addItem('Recombobulator 3000', 1, true);

module.exports = obsidian;
