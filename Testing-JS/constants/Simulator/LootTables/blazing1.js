const LootTable = require('../Functions/LootTable.js');

const blazing1 = new LootTable();

blazing1.addItem('Gold Nugget', 70, false);
blazing1.addItem('Gold Ingot', 60, false);
blazing1.addItem('Blaze Rod', 60, false);
blazing1.addItem('Enchanted Gold', 1, true);
blazing1.addItem('Enchanted Blaze Powder', 1, true);

module.exports = blazing1;
