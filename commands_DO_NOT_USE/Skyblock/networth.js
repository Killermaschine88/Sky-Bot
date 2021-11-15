const Discord = require('discord.js');
const axios = require('axios');
const fetch = require('node-fetch');

module.exports = {
	name: 'networth',
	description: 'Get Networth Data for an Player',
	usage: 'networth (ign)',
	perms: 'None',
	folder: 'Skyblock',
	aliases: ['nw', 'net'],
	async execute(client, message, args) {
		let ign = args[0];

		if (ign == undefined) {
			message.channel.send('Provide an IGN to Check');
			return;
		}

		const waiting = new Discord.MessageEmbed().setTitle('Checking Player Data');

		const wait = await message.channel.send({ embeds: [waiting] });

		let net = await fetch(`http://db.superbonecraft.dk:8000/pages/${ign}`);
		nw = await net.json();

		let errtext = '';
		if (net.status == 400) {
			errtext = 'Invalid Username provided.';
		} else if (net.status == 500) {
			errtext = 'Internal Error';
		} else {
			errtext = 'Error';
		}

		if (net.status != 200) {
			const errorembed = new Discord.MessageEmbed()
				.setTitle('An Error occured!')
				.setDescription(`${errtext}`)
				.setColor('RED');
			wait.edit({ embeds: [errorembed] });
			return;
		}

		let total =
			Math.floor(nw.purse.total) +
			Math.floor(nw.banking.total) +
			Math.floor(nw.inventory.total) +
			Math.floor(nw.accessories.total) +
			Math.floor(nw.ender_chest.total) +
			Math.floor(nw.armor.total) +
			Math.floor(nw.wardrobe.total) +
			Math.floor(nw.vault.total) +
			Math.floor(nw.storage.total) +
			Math.floor(nw.pets.total);

		let armor = nw.armor;
		let wardrobe = nw.wardrobe;
		let inventory = nw.inventory;
		let ec = nw.ender_chest;
		let storage = nw.storage;
		let pets = nw.pets;
		let talis = nw.accessories;

		let armortext = '';
		let wardrobetext = '';
		let inventorytext = '';
		let ectext = '';
		let storagetext = '';
		let petstext = '';
		let talistext = '';

		let i = 0;
		let recomb = '<:recomb:881094744183275540>';

		if (armor.prices.length == 0) {
			armortext = 'API Disabled or no Items';
		} else {
			while (i < armor.prices.length) {
				if (armor.prices[i].item.recombobulated) {
					armortext +=
						armor.prices[i].item.name + ` ${recomb}` + ` **(${num(armor.prices[i].total)})**` + '\n';
					i += 1;
				} else {
					armortext += armor.prices[i].item.name + ` **(${num(armor.prices[i].total)})**` + '\n';
					i += 1;
				}
			}
			i = 0;
		}

		if (wardrobe.prices.length == 0) {
			wardrobetext = 'API Disabled or no Items';
		} else {
			while (i < wardrobe.prices.length) {
				if (wardrobe.prices[i].item.recombobulated) {
					wardrobetext +=
						wardrobe.prices[i].item.name + ` ${recomb}` + ` **(${num(wardrobe.prices[i].total)})**` + '\n';
					i += 1;
				} else {
					wardrobetext += wardrobe.prices[i].item.name + ` **(${num(wardrobe.prices[i].total)})**` + '\n';
					i += 1;
				}
			}
			i = 0;
		}

		if (inventory.prices.length == 0) {
			inventorytext = 'API Disabled or no Items';
		} else {
			while (i < inventory.prices.length) {
				if (inventory.prices[i].item?.recombobulated) {
					inventorytext +=
						inventory.prices[i].item.name +
						` ${recomb}` +
						` **(${num(inventory.prices[i].total)})**` +
						'\n';
					i += 1;
				} else {
					inventorytext += inventory.prices[i].item.name + ` **(${num(inventory.prices[i].total)})**` + '\n';
					i += 1;
				}
			}
			i = 0;
		}

		if (ec.prices.length == 0) {
			ectext = 'API Disabled or no Items';
		} else {
			while (i < ec.prices.length) {
				if (ec.prices[i].item?.recombobulated) {
					ectext += ec.prices[i].item.name + ` ${recomb}` + ` **(${num(ec.prices[i].total)})**` + '\n';
					i += 1;
				} else {
					ectext += ec.prices[i].item.name + ` **(${num(ec.prices[i].total)})**` + '\n';
					i += 1;
				}
			}
			i = 0;
		}

		if (storage.prices.length == 0) {
			storagetext = 'API Disabled or no Items';
		} else {
			while (i < storage.prices.length) {
				if (storage.prices[i].item?.recombobulated) {
					storagetext +=
						storage.prices[i].item.name + ` ${recomb}` + ` **(${num(storage.prices[i].total)})**` + '\n';
					i += 1;
				} else {
					storagetext += storage.prices[i].item.name + ` **(${num(storage.prices[i].total)})**` + '\n';
					i += 1;
				}
			}
			i = 0;
		}

		if (pets.prices.length == 0) {
			petstext = 'API Disabled or no Items';
		} else {
			while (i < pets.prices.length) {
				if (pets.prices[i].item?.recombobulated) {
					petstext +=
						pets.prices[i].item.tier +
						' ' +
						pets.prices[i].item.type +
						` ${recomb}` +
						` **(${num(pets.prices[i].total)})**` +
						'\n';
					i += 1;
				} else {
					petstext +=
						pets.prices[i].item.tier +
						' ' +
						pets.prices[i].item.type +
						` **(${num(pets.prices[i].total)})**` +
						'\n';
					i += 1;
				}
			}
			i = 0;
		}

		if (talis.prices.length == 0) {
			talistext = 'API Disabled or no Items';
		} else {
			while (i < talis.prices.length) {
				if (talis.prices[i].item?.recombobulated) {
					talistext +=
						talis.prices[i].item.name + ` ${recomb}` + ` **(${num(talis.prices[i].total)})**` + '\n';
					i += 1;
				} else {
					talistext += talis.prices[i].item.name + ` **(${num(talis.prices[i].total)})**` + '\n';
					i += 1;
				}
			}
			i = 0;
		}

		const endembed = new Discord.MessageEmbed()
			.setDescription(`${ign}'s Networth is ${total.toLocaleString()} (${num(total)})`)
			.addField(`<:coins:861974605203636253> Purse`, `${num(nw.purse.total)}`)
			.addField(`<:gold:869126927011708929> Bank`, `${num(nw.banking.total)}`)
			.addField(`<:tank:852079613051666472> Armor (${num(armor.total)})`, `${armortext}`)
			.addField(`<:armorstand:881177222440943657> Wardrobe (${num(wardrobe.total)})`, `${wardrobetext}`)
			.addField(`<:chest:881176353444085820> Inventory (${num(inventory.total)})`, `${inventorytext}`)
			.addField(`<:ec:881176371634794586> Ender Chest (${num(ec.total)})`, `${ectext}`)
			.addField(`<:backpack:881176409983303740> Storage (${num(storage.total)})`, `${storagetext}`)
			.addField(`<:taming:852069714493833227> Pets (${num(pets.total)})`, `${petstext}`)
			.addField(`<:talisbag:881176392178499634> Accessories (${num(talis.total)})`, `${talistext}`)
			.setColor('90EE90');

		wait.edit({ embeds: [endembed] });
	},
};

num = (num) => {
	if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/.0$/, '') + 'B';
	if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/.0$/, '') + 'M';
	if (num >= 1000) return (num / 1000).toFixed(1).replace(/.0$/, '') + 'K';
	return num;
};
