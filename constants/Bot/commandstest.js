const data = [
	{
		name: 'info',
		description: 'Shows Info about the Bot',
	},
	{
		name: 'suggest',
		description: 'Suggest Features/Report Bugs at the Bot',
		options: [
			{
				name: 'suggestion',
				description: 'Suggestion to send',
				type: 'STRING',
				required: true,
			},
		],
	},
	{
		name: 'invite',
		description: 'Shows the Bots Invite and Support Server',
	},
	{
		name: 'ping',
		description: "Shows the Bot's Ping",
	},
	{
		name: 'vote',
		description: 'Shows the Bots Vote Site',
	},
	/*{
    name: 'serverinfo',
    description: 'Shows Info about the server',
  },
  {
    name: 'userinfo',
    description: 'Shows the Info about a User',
    options: [
      {
        name: 'user',
        description: 'Discord User',
        type: 'USER',
        required: true,
      },
    ],
  },*/
	//Skyblock Features
	{
		name: 'bazaar',
		description: 'Gets Bazaar Data from an Item',
		options: [
			{
				name: 'item',
				description: 'Item Name',
				type: 'STRING',
				required: true,
			},
		],
	},
	{
		name: 'dungeons',
		description: 'Gets Dungeons Data from a Player',
		options: [
			{
				name: 'ign',
				description: 'Minecraft Name',
				type: 'STRING',
				required: true,
			},
		],
	},
	{
		name: 'hypixel',
		description: 'Gets Hypixel Data from a Player',
		options: [
			{
				name: 'ign',
				description: 'Minecraft Name',
				type: 'STRING',
				required: true,
			},
		],
	},
	{
		name: 'skyblockplayers',
		description: 'Shows the Current Online Skyblock Players',
	},
	{
		name: 'scammer',
		description: 'Checks if a Player is a Scammer',
		options: [
			{
				name: 'ign',
				description: 'Minecraft Name',
				type: 'STRING',
				required: true,
			},
		],
	},
	{
		name: 'skills',
		description: 'Gets Skill Data from a Player',
		options: [
			{
				name: 'ign',
				description: 'Minecraft Name',
				type: 'STRING',
				required: true,
			},
		],
	},
	{
		name: 'slayer',
		description: 'Gets Slayer Data from a Player',
		options: [
			{
				name: 'ign',
				description: 'Minecraft Name',
				type: 'STRING',
				required: true,
			},
		],
	},
	{
		name: 'stats',
		description: 'Gets Overall Data from a Player',
		options: [
			{
				name: 'ign',
				description: 'Minecraft Name',
				type: 'STRING',
				required: true,
			},
		],
	},
	{
		name: 'weight',
		description: 'Gets Weight Data from a Player',
		options: [
			{
				name: 'ign',
				description: 'Minecraft Name',
				type: 'STRING',
				required: true,
			},
		],
	},
	{
		name: 'networth',
		description: 'Calculates the Player Networth',
		options: [
			{
				name: 'name',
				description: 'Player IGN',
				type: 'STRING',
				required: true,
			},
		],
	},
	//Skyblock Simulator Commands
	{
		name: 'sb',
		description: 'Skyblock Simulator Commands',
		type: 'SUB_COMMAND_GROUP',
		options: [
			/*{
				name: 'dragon',
				description: 'Lets you place Summoning Eye to fight Dragons',
				type: 'SUB_COMMAND',
			},*/
			{
				name: 'grind',
				description: 'Lets you grind Mobs for Combat XP and Items',
				type: 'SUB_COMMAND',
			},
			{
				name: 'info',
				description: 'Shows information about yourself or a mentioned User',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'user',
						description: 'Discord User',
						type: 'USER',
					},
				],
			},
			{
				name: 'sell',
				description: 'Sell your farmed Items for Coins',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'item',
						description: 'Item to Sell',
						type: 'STRING',
						autocomplete: true,
						required: true,
					},
					{
						name: 'amount',
						description: 'Amount of said Item to sell',
						type: 'INTEGER',
						required: true,
					},
					{
						name: 'sell-all',
						description:
							'ALL SELLABLE ITEMS WILL BE SOLD!!! (If this is enabled just enter anything for the other Options)',
						type: 'STRING',
						required: false,
						choices: [
							{
								name: 'yes',
								value: 'yes',
							},
							{
								name: 'no',
								value: 'no',
							},
						],
					},
          {
						name: 'sell-excluded',
						description: 'Items to exclude at sell-all (Seperate them with a ,)',
						type: 'STRING',
						required: false,
            autocomplete: true,
					},
				],
			},
			{
				name: 'settings',
				description: 'Allows you to toggle Settings ON/OFF',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'choice',
						description: 'Choose the setting to enable/disabls',
						type: 'STRING',
						required: true,
						choices: [
							{
								name: 'Images Shown',
								value: 'imgshown',
							},
							{
								name: 'Confirmation Messages',
								value: 'confirmation',
							},
						],
					},
					{
						name: 'state',
						description: 'Specify if you want to enable/disable said setting',
						type: 'STRING',
						required: true,
						choices: [
							{
								name: 'enable',
								value: 'true',
							},
							{
								name: 'disable',
								value: 'false',
							},
						],
					},
				],
			},
			{
				name: 'start',
				description: 'Creates your Skyblock Simulator Profile',
				type: 'SUB_COMMAND',
			},
			{
				name: 'warp',
				description: 'Allows you to warp to different Areas of the Game',
				type: 'SUB_COMMAND',
			},
			{
				name: 'fishing',
				description: 'Opens a Pond and lets you fish',
				type: 'SUB_COMMAND',
			},
			{
				name: 'dungeons',
				description: 'Allows you to create a Dungeon Run',
				type: 'SUB_COMMAND',
			},
			{
				name: 'shop',
				description: 'Allows you to buy Upgrades',
				type: 'SUB_COMMAND',
			},
			{
				name: 'class',
				description: 'Lets you select a different Dungeon Class',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'choice',
						description: 'Available Classes',
						type: 'STRING',
						choices: [
							{
								name: 'Assassin',
								value: 'Assassin',
							},
							{
								name: 'Berserker',
								value: 'Berserker',
							},
							{
								name: 'Tank',
								value: 'Tank',
							},
						],
					},
				],
			},
			{
				name: 'wardrobe',
				description: 'Lets you select different Equipment',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'type',
						description: 'Available  Equipment Types',
						type: 'STRING',
						required: true,
						choices: [
							{
								name: 'sword',
								value: 'sword',
							},
							{
								name: 'armor',
								value: 'armor',
							},
						],
					},
					{
						name: 'itemid',
						description: 'Item Number',
						type: 'INTEGER',
						required: true,
					},
				],
			},
			{
				name: 'daily',
				description: 'Allows you to claim your Daily Reward',
				type: 'SUB_COMMAND',
			},
			{
				name: 'wiki',
				description: 'Displays the Wiki and Help Page for the Simulator',
				type: 'SUB_COMMAND',
			},
			{
				name: 'mining',
				description: 'Opens a Mine for you to gather Ores',
				type: 'SUB_COMMAND',
			},
			{
				name: 'reforge',
				description: 'Allows you to reforge Items to increase their Stats',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'choice',
						description: 'Type of Item to reforge',
						type: 'STRING',
						required: true,
						choices: [
							{
								name: 'armor',
								value: 'armor',
							},
							{
								name: 'sword',
								value: 'sword',
							},
							{
								name: 'pickaxe',
								value: 'pickaxe',
							},
							{
								name: 'rod',
								value: 'rod',
							},
						],
					},
					{
						name: 'itemid',
						description: 'Item Number',
						type: 'INTEGER',
						required: true,
					},
					{
						name: 'reforge-stone',
						description: 'Reforge Stone to apply',
						type: 'STRING',
						autocomplete: true,
						required: true,
					},
				],
			},
			{
				name: 'progress',
				description: 'Lets you view a Players Progress',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'user',
						description: 'User to view',
						type: 'USER',
						required: false,
					},
				],
			},
			{
				name: 'leaderboard',
				description: 'Allows you to view the TOP Players',
				type: 'SUB_COMMAND',
			},
			{
				name: 'trade',
				description: 'Lets you trade with the mentioned Player',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'action',
						description: 'send and reply require the optional fields',
						type: 'STRING',
						required: true,
						choices: [
							{
								name: 'send-offer',
								value: 'send-offer',
							},
							{
								name: 'reply-offer',
								value: 'reply-offer',
							},
							{
								name: 'accept-offer',
								value: 'accept-offer',
							},
							{
								name: 'deny-offer',
								value: 'deny-offer',
							},
						],
					},
					{
						name: 'user',
						description: 'User to trade',
						type: 'USER',
						required: true,
					},
					{
						name: 'trade-item',
						description: 'Can be Items or Coins',
						type: 'STRING',
						required: false,
					},
					{
						name: 'amount',
						description: 'Amount of said Trade Item to offer',
						type: 'INTEGER',
						required: false,
					},
				],
			},
			{
				name: 'craft',
				type: 'SUB_COMMAND',
				description: 'Craft Items',
			},
			{
				name: 'auction',
				type: 'SUB_COMMAND',
				description: 'Buy and Sell Items',
				options: [
					{
						name: 'action',
						description: 'Action to execute',
						type: 'STRING',
						required: true,
						choices: [
							{
								name: 'create',
								value: 'create',
							},
							{
								name: 'bid',
								value: 'bid',
							},
							{
								name: 'view',
								value: 'view',
							},
							{
								name: 'list',
								value: 'list',
							},
						],
					},
					{
						name: 'item',
						description: 'Item to auction',
						type: 'STRING',
						required: false,
            autocomplete: true,
					},
					{
						name: 'duration',
						description: 'Duration for how long the Item should be auctioned (in Hours)',
						type: 'INTEGER',
						required: false,
					},
					{
						name: 'start-bid',
						description: 'Starting Bid for the Item to Auction',
						type: 'INTEGER',
						required: false,
					},
					{
						name: 'bid-amount',
						description: 'Amount of Coins to Bid on Item',
						type: 'INTEGER',
						required: false,
					},
					{
						name: 'auction-id',
						description: 'Used to view Auction Info for said Auction ID',
						type: 'STRING',
						required: false,
					},
				],
			},
		],
	},
];

module.exports.data = data;
