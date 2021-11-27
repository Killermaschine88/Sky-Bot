let CronJob = require('cron').CronJob;
let Discord = require('discord.js');
const { addItems } = require('../../constants/Functions/simulator.js');
const pms = require('pretty-ms');

async function start(client, mclient) {
	//Player Collection
	const collection = mclient.db('SkyblockSim').collection('Players');

	//Blocked Channel Collection
	const collection1 = mclient.db('SkyblockSim').collection('blockedchannels');

	//Event Collection
	const collection2 = mclient.db('SkyblockSim').collection('events');

	const collection3 = mclient.db('SkyblockSim').collection('auctions');

  const collection4 = mclient.db('Sky-Bot').collection('info')

  const eventchannel = '908000544868691990' //edit to 909717004783595552 on release

  //Changing Status
  let total_members = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const activities_list = [
    { type: 'PLAYING',  message: 'Skyblock Simulator'  },
    { type: 'PLAYING', message: `with ${total_members} members` },
      { type: 'PLAYING', message: `with ${client.guilds.cache.size} Servers` }
];
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);

        client.user.setActivity(activities_list[index].message, { type: activities_list[index].type });
    }, 300000);
  

  //Info for Website
  const info = new CronJob('0 */30 * * * *', async function () {
    const mem_usage = process.memoryUsage().heapUsed
    collection4.updateOne(
      { _id: 'info' },
      { $set: {
        mem_usage: mem_usage,
        guilds: client.guilds.cache.size,
        channels: client.channels.cache.size,
        uptime: pms(client.uptime)
      }},
      { upsert: true }
    )
  })
  info.start()

	//Updating the Fishing/Mining/Dungeon
	collection.updateMany(
		{},
		{
			$set: {
				'data.misc.is_fishing': false,
				'data.misc.is_mining': false,
				'data.misc.in_dungeon': false,
				'data.misc.is_massselling': false,
			},
		}
	);

	//Updating blocked channels
	collection1.updateMany({}, { $set: { blocked: false } });

	//Handling expire auctions
	const ahhandler = new CronJob('0 */10 * * * *', async function () {
		//handle here
		const auctions = await collection3.find({}).toArray();

		if (auctions.length != 0) {
			for (const ah of auctions) {
				if (Number((Date.now() / 1000).toFixed()) > ah.auction.expiration) {
					if (ah.item.last_bidtag == 'Starting Bid') {
						await collection.updateOne(
							{
								_id: ah.owner.id,
								'data.inventory.items.name': ah.item.name,
							},
							{ $inc: { 'data.inventory.items.$.amount': 1, 'data.misc.auctions': -1 } },
							{ upsert: true }
						);
						await collection3.deleteOne({ _id: ah._id });

						const nobids = new Discord.MessageEmbed()
							.setTitle(`Auction for ${ah.item.name} expired.`)
							.setDescription('No one bid on the item so it has been returned to the owner.')
							.setColor('GREEN')
							.setFooter('Skyblock Simulator • Auction House • /suggest idea');

						try {
							const user = await client.channels.fetch('909714104795664424');
							await user.send({ embeds: [nobids] });
						} catch (e) {}
					} else {
						await collection.updateOne(
							{
								_id: ah.owner.id,
							},
							{ $inc: { 'data.profile.coins': ah.item.bid, 'data.misc.auctions': -1 } },
							{ upsert: true }
						);

						const player = await collection.findOne({ _id: ah.item.last_bidid });

						const updatePlayer = addItems(ah.item.name, 1, player);

						await collection.replaceOne({ _id: ah.item.last_bidid }, updatePlayer);

						await collection3.deleteOne({ _id: ah._id });

						const nobids = new Discord.MessageEmbed()
							.setTitle(`Auction for ${ah.item.name} expired.`)
							.setDescription(
								`The item has been bought for ${ah.item.bid} Coins by ${ah.item.last_bidtag}.`
							)
							.setColor('GREEN')
							.setFooter('Skyblock Simulator • Auction House • /suggest idea');

						try {
							const user = await client.channels.fetch('909714104795664424');
							await user.send({ embeds: [nobids] });
						} catch (e) {}
					}
				}
			}
		}
	});
	ahhandler.start();

	//Event Embeds
	const mfoffembed = new Discord.MessageEmbed()
		.setTitle('🍀 Magic Find Event Disabled')
		.setDescription('The extra Magic Find has been disabled again.')
		.setFooter('Skyblock Simulator Events')
		.setColor('RED');

	const sharkoffembed = new Discord.MessageEmbed()
		.setTitle('🦈 Shark Fishing Event Disabled')
		.setDescription('The Shark Fishing has been disabled again.')
		.setFooter('Skyblock Simulator Events')
		.setColor('RED');

	//Event Jobs
	const mfon = new CronJob(
		'0 16 * * *',
		async function () {
			let timeleft = Number((Date.now() / 1000).toFixed(0)) + 2 * 60 * 60;
			const mfonembed = new Discord.MessageEmbed()
				.setTitle('🍀 Magic Find Event Enabled')
				.setDescription(
					`All Users now have **+15 Magic Find** for the **next 2 Hours** (Ends <t:${timeleft}:R>)`
				)
				.setColor('GREEN')
				.setFooter('Skyblock Simulator Events');

			let next_eventtime = Number((Date.now() / 1000).toFixed(0)) + 15 * 60 * 60;
			next_eventtime = Number(next_eventtime);
			let event_endtime = Number((Date.now() / 1000).toFixed(0)) + 2 * 60 * 60;
			event_endtime = Number(event_endtime);
			collection2.updateOne(
				{ _id: 'magic_find' },
				{
					$set: {
						enabled: true,
						next_event: next_eventtime,
						end_event: event_endtime,
					},
				},
				{ upsert: true }
			);

			client.channels
				.fetch(eventchannel)
				.then((channel) => channel.send({ embeds: [mfonembed] }).then((msg) => msg.crosspost()))
				.catch(console.error);
		},
		null,
		true,
		'Europe/Rome'
	);

	const mfon2 = new CronJob(
		'0 6 * * *',
		async function () {
			let timeleft = Number((Date.now() / 1000).toFixed(0)) + 2 * 60 * 60;
			const mfonembed = new Discord.MessageEmbed()
				.setTitle('🍀 Magic Find Event Enabled')
				.setDescription(
					`All Users now have **+15 Magic Find** for the **next 2 Hours** (Ends <t:${timeleft}:R>)`
				)
				.setColor('GREEN')
				.setFooter('Skyblock Simulator Events');

			let next_eventtime = Number((Date.now() / 1000).toFixed(0)) + 10 * 60 * 60;
			next_eventtime = Number(next_eventtime);
			let event_endtime = Number((Date.now() / 1000).toFixed(0)) + 2 * 60 * 60;
			event_endtime = Number(event_endtime);
			collection2.updateOne(
				{ _id: 'magic_find' },
				{
					$set: {
						enabled: true,
						next_event: next_eventtime,
						end_event: event_endtime,
					},
				},
				{ upsert: true }
			);

			client.channels
				.fetch(eventchannel)
				.then((channel) => channel.send({ embeds: [mfonembed] }).then((msg) => msg.crosspost()))
				.catch(console.error);
		},
		null,
		true,
		'Europe/Rome'
	);

	const mfoff = new CronJob(
		'0 18 * * *',
		async function () {
			collection2.updateOne({ _id: 'magic_find' }, { $set: { enabled: false } }, { upsert: true });

			client.channels
				.fetch(eventchannel)
				.then((channel) => channel.send({ embeds: [mfoffembed] }))
				.catch(console.error);
		},
		null,
		true,
		'Europe/Rome'
	);

	const mfoff2 = new CronJob(
		'0 8 * * *',
		async function () {
			collection2.updateOne({ _id: 'magic_find' }, { $set: { enabled: false } });

			client.channels
				.fetch(eventchannel)
				.then((channel) => channel.send({ embeds: [mfoffembed] }).then((msg) => msg.crosspost()))
				.catch(console.error);
		},
		null,
		true,
		'Europe/Rome'
	);

	const sharkon1 = new CronJob(
		'0 20 * * *',
		async function () {
			let timeleft = Number((Date.now() / 1000).toFixed(0)) + 2 * 60 * 60;
			const mfonembed = new Discord.MessageEmbed()
				.setTitle('🦈 Shark Fishing Event Enabled')
				.setDescription(
					`You can now rarely fish up Sharks whilst fishing for the **next 2 Hours** (Ends <t:${timeleft}:R>)`
				)
				.setColor('GREEN')
				.setFooter('Skyblock Simulator Events');

			let next_eventtime = Number((Date.now() / 1000).toFixed(0)) + 13 * 60 * 60;
			next_eventtime = Number(next_eventtime);
			let event_endtime = Number((Date.now() / 1000).toFixed(0)) + 2 * 60 * 60;
			event_endtime = Number(event_endtime);
			collection2.updateOne(
				{ _id: 'shark_fishing' },
				{
					$set: {
						enabled: true,
						next_event: next_eventtime,
						end_event: event_endtime,
					},
				},
				{ upsert: true }
			);

			client.channels
				.fetch(eventchannel)
				.then((channel) => channel.send({ embeds: [mfonembed] }).then((msg) => msg.crosspost()))
				.catch(console.error);
		},
		null,
		true,
		'Europe/Rome'
	);

	const sharkon2 = new CronJob(
		'0 9 * * *',
		async function () {
			let timeleft = Number((Date.now() / 1000).toFixed(0)) + 2 * 60 * 60;
			const mfonembed = new Discord.MessageEmbed()
				.setTitle('🦈 Shark Fishing Event Enabled')
				.setDescription(
					`You can now rarely fish up Sharks whilst fishing for the **next 2 Hours** (Ends <t:${timeleft}:R>)`
				)
				.setColor('GREEN')
				.setFooter('Skyblock Simulator Events');

			let next_eventtime = Number((Date.now() / 1000).toFixed(0)) + 10 * 60 * 60;
			next_eventtime = Number(next_eventtime);
			let event_endtime = Number((Date.now() / 1000).toFixed(0)) + 2 * 60 * 60;
			event_endtime = Number(event_endtime);
			collection2.updateOne(
				{ _id: 'shark_fishing' },
				{
					$set: {
						enabled: true,
						next_event: next_eventtime,
						end_event: event_endtime,
					},
				},
				{ upsert: true }
			);

			client.channels
				.fetch(eventchannel)
				.then((channel) => channel.send({ embeds: [mfonembed] }).then((msg) => msg.crosspost()))
				.catch(console.error);
		},
		null,
		true,
		'Europe/Rome'
	);

	const sharkoff1 = new CronJob(
		'0 22 * * *',
		async function () {
			collection2.updateOne({ _id: 'shark_fishing' }, { $set: { enabled: false } }, { upsert: true });

			client.channels
				.fetch(eventchannel)
				.then((channel) => channel.send({ embeds: [sharkoffembed] }).then((msg) => msg.crosspost()))
				.catch(console.error);
		},
		null,
		true,
		'Europe/Rome'
	);

	const sharkoff2 = new CronJob(
		'0 11 * * *',
		async function () {
			collection2.updateOne({ _id: 'shark_fishing' }, { $set: { enabled: false } }, { upsert: true });

			client.channels
				.fetch(eventchannel)
				.then((channel) => channel.send({ embeds: [sharkoffembed] }).then((msg) => msg.crosspost()))
				.catch(console.error);
		},
		null,
		true,
		'Europe/Rome'
	);

	//Starting Events
	mfon.start(); //Magic Find Enable (Evening)
	mfoff.start(); //Magic find Disable (Evrning)
	mfon2.start(); //Magic Find Enable (Morning)
	mfoff2.start(); //Magic Find Disableb(Morning)

	sharkon1.start();
	sharkon2.start();
	sharkoff1.start();
	sharkoff2.start();

	//Check if Events Running
	console.log(
		`Magic Find event running? Enable: ${mfon.running} ${mfon2.running}, Disable: ${mfoff.running} ${mfoff2.running}`
	);
	console.log(
		`Shark Fishing event running? Enable: ${sharkon1.running} ${sharkon2.running}, Disable: ${sharkoff1.running} ${sharkoff2.running}`
	);
	console.log(`AH Handler Running? ${ahhandler.running}`);
}

module.exports = start;
