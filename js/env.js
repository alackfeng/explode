

"use strict";

module.exports = {
	isDebuggingInChrome: true,
	testMenuEnabled: false,
	nodeList: [
		{url: "ws://54.169.30.79:11011", location: "comm.node.china"},
		{url: "ws://39.108.54.180:11011", 	location: "comm.node.hongkong"},
		{url: "ws://119.23.52.40:11011", 		location: "comm.node.usa"},

		//{url: "ws://119.23.40.206:21011", location: "comm.node.china"},
		//{url: "wss://blockasset.org/ws", 	location: "Newest NODE"},
		//{url: "ws://106.14.2.1:11011", 		location: "comm.node.usa"},
		//{url: "ws://39.108.54.180:11011", location: "comm.node.last"},
		//{url: "ws://119.23.52.40:11011", 	location: "comm.node.hongkong"},
	],
	faucetAddress: "http://54.169.30.79:11015", //https://assetfun.net/faucet",
	update: {
		url: 'https://www.pgyer.com/apiv2/app/check',
		version: {
			ios: '1.0-0',
			android: '1.0-0',
			web: '1.0-0',
		},
		androidKey: {
			api: '701b536596f0d86383bd090ed60bb0f9',
			app: '46c289a8f4c27fb49c7b1ab9abbb2439'
		},
		iosKey: {
			api: '701b536596f0d86383bd090ed60bb0f9',
			app: '580c635ffdae131c926066ad5b868edb'
		}
	}
};