const LootTable = require('../Functions/LootTable.js');

const wolf = new LootTable();

wolf.addItem('Bone', 99, false);
wolf.addItem('Enchanted Bone', 1, true);

module.exports = wolf;
