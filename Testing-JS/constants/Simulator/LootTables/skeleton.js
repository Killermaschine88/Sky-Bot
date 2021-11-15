const LootTable = require('../Functions/LootTable.js');

const skeleton = new LootTable();

skeleton.addItem('Bone', 54, false);
skeleton.addItem('Enchanted Bone', 1, true);
skeleton.addItem('Arrow', 45, false);

module.exports = skeleton;
