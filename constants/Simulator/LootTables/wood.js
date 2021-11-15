const LootTable = require('../Functions/LootTable.js');

const wood = new LootTable();

wood.addItem('1000', 100, false);
wood.addItem('1500', 100, false);
wood.addItem('2000', 100, false);
wood.addItem('Dreadlord Sword', 1, true);

module.exports = wood;
