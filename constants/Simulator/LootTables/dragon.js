const LootTable = require('../Functions/LootTable.js');

const dragon = new LootTable();

dragon.addItem('Dragon Fragments', 250, false);
dragon.addItem('Dragon Claw', 5, true)
dragon.addItem('Dragon Horn', 5, true)
dragon.addItem('Aspect of the Dragons', 1, true)

module.exports = dragon;
