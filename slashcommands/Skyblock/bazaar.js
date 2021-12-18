'use strict';
const Discord = require('discord.js');
const Fuse = require('fuse.js');
const fetch = require('node-fetch');

const list = require('../../constants/Skyblock/items.json');
const list2 = require('./list2.json');
const embedColour = '7CFC00';

module.exports = {
	name: 'Bazaar',
	description: 'Get bazaar data for an item',
	usage: 'bazaar (item)',
	perms: 'None',
	folder: 'Skyblock',
	aliases: ['bz'],
	async execute(interaction) {
		for (const key of Object.keys(list)) {
			if (list[key].bazaar === true) list2[key] = list[key];
		}

		const method = 'save';

		const item = interaction.options.getString('item');
		let result;

		const waitingEmbed = new Discord.MessageEmbed()
			.setTitle('Checking Bazaar Data')
			.setFooter("If I don't respond within 10 seconds, the item wasn't found or an error occurred");

		const wait = await interaction.editReply({ embeds: [waitingEmbed] });

		let apiData = await getApiData(item, method);

		if (apiData.error) {
			const options = {
				isCaseSensitive: false,
				threshold: 0.7,
				keys: ['name'],
			};

			const fuse = new Fuse(Object.keys(list2), options);

			const pattern = item;

			const itemlist = await fuse.search(pattern);

			result = itemlist[0].item;
		}

		apiData = await getApiData(result, method);

		const notfound = new Discord.MessageEmbed().setTitle(`Couldn't find item \`${result}\``).setDescription('Did you make a typo?');

		if (apiData.error) {
			interaction.editReply({ embeds: [notfound] });
		}

		// Related Items
		let related = '';
		if (typeof apiData.related === 'undefined') {
			related = 'None';
		} else if (apiData.related.length === 0) {
			related = 'None';
		} else {
			({ related } = apiData);
		}

		return interaction.editReply({
			embeds: [
				new Discord.MessageEmbed()
					.setTitle(`Bazaar data for ${result}`)
					.setColor(embedColour)
					.setAuthor(
						result,
						`https://sky.lea.moe/item/${result}`,
						`https://api.slothpixel.me/api/skyblock/bazaar/${result}`
					)
					.addFields(
						{
							name: 'Insta Sell Price',
							value: `${toFixed(apiData.quick_status.sellPrice).toLocaleString()}`,
							inline: true,
						},
						{
							name: 'Amount of Sell Offers',
							value: `${toFixed(apiData.quick_status.sellOrders).toLocaleString()}`,
							inline: true,
						},
						{
							name: 'Amount of Items in Sell Offers',
							value: `${apiData.quick_status.sellVolume.toLocaleString()}`,
							inline: true,
						},
						{
							name: 'Insta Buy Price',
							value: `${toFixed(apiData.quick_status.buyPrice).toLocaleString()}`,
							inline: true,
						},
						{
							name: 'Amount of Buy Offers',
							value: `${toFixed(apiData.quick_status.buyOrders).toLocaleString()}`,
							inline: true,
						},
						{
							name: 'Amount of Items in Buy Offers',
							value: `${apiData.quick_status.buyVolume.toLocaleString()}`,
							inline: true,
						},
						{
							name: 'Related Items',
							value: `${related}`,
							inline: false,
						}
					)
					.setFooter(`You searched for ${item}`)
			],
		});
	},
};

async function getApiData(result) {
	delete require.cache[require.resolve('../../constants/Bot/config.json')];
	const config = require('../../constants/Bot/config.json');

	const response = await fetch(`https://api.slothpixel.me/api/skyblock/bazaar/${result}?key=${config.apikey}`);
	// eslint-disable-next-line no-return-await
	return await response.json();
}

function toFixed(num) {
	const re = new RegExp(`^-?\\d+(?:.\\d{0,${2 || -1}})?`);
	return num.toString().match(re)[0];
}
