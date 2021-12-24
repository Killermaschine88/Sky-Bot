const Discord = require('discord.js');
//const axios = require('axios')
const fetch = require('node-fetch');

module.exports = {
	name: 'networth',
	description: 'Get the net worth data for a player',
	usage: 'networth (ign)',
	perms: 'None',
	folder: 'Skyblock',
	aliases: ['nw', 'net'],
	async execute(interaction) {
		let ign = interaction.options.getString('name');

		delete require.cache[require.resolve('../../constants/Bot/config.json')];
		const config = require('../../constants/Bot/config.json');

		// npm install axios
		const axios = require(`axios`).default;
		// npm install axios
		try {
			let uuid = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${ign}`);

			let hypixelapi = await axios.default.get(
				`https://api.hypixel.net/skyblock/profiles?key=${config.apikey}&uuid=${uuid.data.id}`
			);
			//  console.log(hypixelapi.data)

			var data = await axios.default.post(
				`http://hypixelskyblock.superbonecraft.dk:8000/pages/${uuid.data.id}`,
				hypixelapi.data
			);
		} catch (e) {
			const embed = new Discord.MessageEmbed()
				.setTitle('ERROR')
				.setColor('RED')
				.setDescription('Invalid Minecraft username or user does not have a Skyblock profile.');
			return interaction.editReply({ embeds: [embed] });
		}

		nw = data.data;

		/* const waiting = new Discord.MessageEmbed()
      .setTitle('Checking Player Data')

    const wait = await interaction.editReply({ embeds: [waiting] })*/

		// let net = await fetch(`http://db.superbonecraft.dk:8000/pages/${ign}?api_key=${config.apikey}`)
		// nw = await net.json()

		let errtext = '';
		/* if (net.status == 404) {
      errtext = 'Status: 404\nReason: User not found within the Skyblock player base'
    } else if (net.status == 500) {
      errtext = 'Status: 500\nReason: Internal error'
    } else if (net.status == 429) {
      errtext = 'Status: 429\nReason: Something went wrong, please try again later'
    } else {
      errtext = 'Status: ' + net.status + '\nReason: ' + net.statusText
    }

    if (net.status != 200) {
      const errorembed = new Discord.MessageEmbed()
        .setTitle('An error occured!')
        .setDescription(`${errtext}`)
        .setColor('RED')
      wait.edit({ embeds: [errorembed] })
      return
    }*/

		ign = await getTrueIgn(ign);

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
		let arrow = '› '; //Alt arrow '→ '

		//Armor Section
		if (armor.prices.length == 0) {
			armortext = 'API disabled or no items';
		} else {
			while (i < armor.prices.length) {
				armortext += `${arrow}`;
				if (armor.prices[i].item.reforge != undefined) {
					armortext += `${caps(armor.prices[i].item.reforge)} `;
				}
				if (armor.prices[i].item.name != undefined) {
					armortext += `${armor.prices[i].item.name} `;
				}
				if (armor.prices[i].item.recombobulated == true) {
					armortext += `${recomb} `;
				}
				if (armor.prices[i].total != undefined) {
					armortext += `**(${num(armor.prices[i].total)})**\n`;
				}
				i += 1;
			}
			i = 0;
		}

		//Wardrobe Section
		if (wardrobe.prices.length == 0) {
			wardrobetext = 'API disabled or no items';
		} else {
			while (i < wardrobe.prices.length) {
				wardrobetext += `${arrow}`;
				if (wardrobe.prices[i].item.reforge != undefined) {
					wardrobetext += `${caps(wardrobe.prices[i].item.reforge)} `;
				}
				if (wardrobe.prices[i].item.name != undefined) {
					wardrobetext += `${wardrobe.prices[i].item.name} `;
				}
				if (wardrobe.prices[i].item.recombobulated == true) {
					wardrobetext += `${recomb} `;
				}
				if (wardrobe.prices[i].total != undefined) {
					wardrobetext += `**(${num(wardrobe.prices[i].total)})**\n`;
				}
				i += 1;
			}
			i = 0;
		}

		//Inventory Section
		if (inventory.prices.length == 0) {
			inventorytext = 'API disabled or no items';
		} else {
			while (i < inventory.prices.length) {
				inventorytext += `${arrow}`;
				if (inventory.prices[i].item.stack_size != 1 && inventory.prices[i].item.name != undefined) {
					inventorytext += `${inventory.prices[i].item.stack_size}x `;
				}
				if (inventory.prices[i].item.reforge != undefined) {
					inventorytext += `${caps(inventory.prices[i].item.reforge)} `;
				}
				if (inventory.prices[i].item.name != undefined) {
					inventorytext += `${inventory.prices[i].item.name} `;
				}
				if (inventory.prices[i].item.name == undefined) {
					inventorytext += `[Lvl ${inventory.prices[i].value.pet_level}] ${caps(
						inventory.prices[i].item.tier
					)} ${caps(inventory.prices[i].item.type)} `;
				}
				if (inventory.prices[i].item.recombobulated == true) {
					inventorytext += `${recomb} `;
				}
				if (inventory.prices[i].total != undefined) {
					inventorytext += `**(${num(inventory.prices[i].total)})**\n`;
				}
				i += 1;
			}
			i = 0;
		}

		//Enderchest Section
		if (ec.prices.length == 0) {
			ectext = 'API disabled or no items';
		} else {
			while (i < ec.prices.length) {
				ectext += `${arrow}`;
				if (ec.prices[i].item.stack_size != 1 && ec.prices[i].item.name != undefined) {
					ectext += `${ec.prices[i].item.stack_size}x `;
				}
				if (ec.prices[i].item.reforge != undefined) {
					ectext += `${caps(ec.prices[i].item.reforge)} `;
				}
				if (ec.prices[i].item.name != undefined) {
					ectext += `${ec.prices[i].item.name} `;
				}
				if (ec.prices[i].item.name == undefined) {
					ectext += `[Lvl ${ec.prices[i].value.pet_level}] ${caps(ec.prices[i].item.tier)} ${caps(
						ec.prices[i].item.type
					)} `;
				}
				if (ec.prices[i].item.recombobulated == true) {
					ectext += `${recomb} `;
				}
				if (ec.prices[i].total != undefined) {
					ectext += `**(${num(ec.prices[i].total)})**\n`;
				}
				i += 1;
			}
			i = 0;
		}

		//Storage Section
		if (storage.prices.length == 0) {
			storagetext = 'API disabled or no items';
		} else {
			while (i < storage.prices.length) {
				storagetext += `${arrow}`;
				if (storage.prices[i].item.stack_size != 1 && storage.prices[i].item.name != undefined) {
					storagetext += `${storage.prices[i].item.stack_size}x `;
				}
				if (storage.prices[i].item.reforge != undefined) {
					storagetext += `${caps(storage.prices[i].item.reforge)} `;
				}
				if (storage.prices[i].item.name != undefined) {
					storagetext += `${storage.prices[i].item.name} `;
				}
				if (storage.prices[i].item.name == undefined) {
					storagetext += `[Lvl ${storage.prices[i].value.pet_level}] ${caps(
						storage.prices[i].item.tier
					)} ${caps(storage.prices[i].item.type)} `;
				}
				if (storage.prices[i].item.recombobulated == true) {
					storagetext += `${recomb} `;
				}
				if (storage.prices[i].total != undefined) {
					storagetext += `**(${num(storage.prices[i].total)})**\n`;
				}
				i += 1;
			}
			i = 0;
		}

		//Pets Section
		if (pets.prices.length == 0) {
			petstext = 'API disabled or no items';
		} else {
			while (i < pets.prices.length) {
				petstext += `${arrow}`;
				if (pets.prices[i].item.type != undefined) {
					petstext += `[Lvl ${pets.prices[i].value.pet_level}] ${caps(pets.prices[i].item.tier)} ${caps(
						pets.prices[i].item.type
					)} `;
				}
				if (pets.prices[i].total != undefined) {
					petstext += `**(${num(pets.prices[i].total)})**\n`;
				}
				i += 1;
			}
			i = 0;
		}

		//Talisman Section
		if (talis.prices.length == 0) {
			talistext = 'API disabled or no items';
		} else {
			while (i < talis.prices.length) {
				talistext += `${arrow}`;
				if (talis.prices[i].item.reforge != undefined) {
					talistext += `${caps(talis.prices[i].item.reforge)} `;
				}
				if (talis.prices[i].item.name != undefined) {
					talistext += `${talis.prices[i].item.name} `;
				}
				if (talis.prices[i].item.recombobulated == true) {
					talistext += `${recomb} `;
				}
				if (talis.prices[i].total != undefined) {
					talistext += `**(${num(talis.prices[i].total)})**\n`;
				}
				i += 1;
			}
			i = 0;
		}

		const endembed = new Discord.MessageEmbed()
      .setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `http://sky.shiiyu.moe/stats/${ign}`)
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

		interaction.editReply({ embeds: [endembed] });
	},
};

num = (num) => {
	if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/.0$/, '') + 'B';
	if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/.0$/, '') + 'M';
	if (num >= 1000) return (num / 1000).toFixed(1).replace(/.0$/, '') + 'K';
	return num;
};

async function getTrueIgn(ign) {
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
	const result = await response.json();
	return result.name;
}

function caps(words) {
	words = words.replace('_', ' ');
	let separateWord = words.toLowerCase().split(' ');
	for (let i = 0; i < separateWord.length; i++) {
		separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
	}
	return separateWord.join(' ');
}
