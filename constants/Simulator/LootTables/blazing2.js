const LootTable = require('../Functions/LootTable.js');

const blazing2 = new LootTable();

blazing2.addItem('Magma Cream', 70, false);
blazing2.addItem('Bone', 60, false);
blazing2.addItem('Coal', 60, false);
blazing2.addItem('Enchanted Magma Cream', 1, true);
blazing2.addItem('Enchanted Bone', 1, true);
blazing2.addItem('Enchanted Coal', 1, true);

module.exports = blazing2;
