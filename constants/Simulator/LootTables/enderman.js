const LootTable = require('../Functions/LootTable.js');

const enderman = new LootTable();

enderman.addItem('Ender Pearl', 90, false);
enderman.addItem('Eye of Ender', 60, false);
enderman.addItem('Enchanted Ender Pearl', 1, true);
enderman.addItem('Enchanted Eye of Ender', 1, true);

module.exports = enderman;
