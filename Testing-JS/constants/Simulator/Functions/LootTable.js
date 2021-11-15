class LootTable {
	/**
	 * LootTable constructor
	 * @constructor
	 * @param {Object[]} tableObj - Object that initializes a table on class construction
	 * @param {string} tableObj[].name - Name of the item
	 * @param {number} tableObj[].weight - Drop weight of the item
	 * @param {boolean} tableObj[].rare - If the item is rare or not
	 */
	constructor(tableObj) {
		this.table = tableObj ?? [];
	}

	/**
	 * Adds an item to the LootTable
	 * @param {string} itemName - Name of the item
	 * @param {number} itemWeight - Drop weight of the item
	 * @param {boolean} itemIsRare - If the item is rare or not
	 */
	addItem(itemName, itemWeight, itemIsRare) {
		this.table.push({
			name: itemName,
			weight: itemWeight,
			rare: itemIsRare,
		});
	}

	/**
	 * Removes an item from the LootTable
	 * @param {string} itemName - Name of the item
	 */
	removeItem(itemName) {
		for (const item of this.table) {
			this.table = this.table.filter((item) => item.name !== itemName);
		}
	}

	/**
	 * Rolls an item from the LootTable using magic find
	 * @param {number} magicFind - The magic find to use
	 */
	roll(magicFind = 0) {
		if (this.table.length === 0) return null;

		let totalWeight = 0;
		let calcWeights = [];
		for (const item of this.table) {
			let itemWeight = item.weight;
			if (item.rare) {
				itemWeight = itemWeight * (1 + magicFind / 100);
			}

			totalWeight += itemWeight;
			calcWeights.push(itemWeight);
		}

		const randomNum = Math.floor(Math.random() * totalWeight + 1);
		let weightCheck = totalWeight;
		let choice;

		for (let i = 0; i < calcWeights.length; i++) {
			weightCheck -= calcWeights[i];

			if (weightCheck < randomNum) {
				choice = this.table[i];
				break;
			}
		}

		return choice.name;
	}
}

module.exports = LootTable;
