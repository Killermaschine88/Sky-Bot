const LootTable = require('../Functions/LootTable.js');

const spider = new LootTable();

spider.addItem('String', 70, false);
spider.addItem('Spider Eye', 70, false);
spider.addItem('Enchanted String', 1, true);
spider.addItem('Enchanted Spider Eye', 1, true);

module.exports = spider;
