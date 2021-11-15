const LootTable = require('../Functions/LootTable.js');

const zombie = new LootTable();

zombie.addItem('Rotten Flesh', 80, false);
zombie.addItem('Carrot', 10, true);
zombie.addItem('Potato', 10, true);

module.exports = zombie;
