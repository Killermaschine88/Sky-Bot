const LootTable = require('../Functions/LootTable.js');

const endnest = new LootTable();

endnest.addItem('Ender Pearl', 60, false);
endnest.addItem('Obsidian', 60, false);
endnest.addItem('Bone', 60, false);
endnest.addItem('Enchanted Ender Pearl', 5, true);
endnest.addItem('Enchanted Obsidian', 5, true);
endnest.addItem('Enchanted Bone', 5, true);
endnest.addItem('Summoning Eye', 1, true);

module.exports = endnest;
