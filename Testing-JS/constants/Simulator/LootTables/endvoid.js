const LootTable = require('../Functions/LootTable.js');

const endvoid = new LootTable();

endvoid.addItem('Ender Pearl', 60, false);
endvoid.addItem('Eye of Ender', 50, false);
endvoid.addItem('Enchanted Ender Pearl', 3, true);
endvoid.addItem('Enchanted Eye of Ender', 3, true);

module.exports = endvoid;
