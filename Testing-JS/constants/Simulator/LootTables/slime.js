const LootTable = require('../Functions/LootTable.js');

const slime = new LootTable();

slime.addItem('Slimeball', 40, false);
slime.addItem('String', 40, false);
slime.addItem('Spider Eye', 40, false);
slime.addItem('Enchanted Slimeball', 2, true);
slime.addItem('Enchanted String', 2, true);
slime.addItem('Enchanted Spider Eye', 2, true);

module.exports = slime;
