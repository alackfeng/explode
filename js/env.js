

"use strict";

module.exports = {
	isDebuggingInChrome: true,
	testMenuEnabled: false,
	nodeList: [
		//{url: "wss://blockasset.org/ws", location: "Newest NODE"},
		//{url: "ws://106.14.2.1:11011", location: "Pre Node"},
		//{url: "ws://39.108.54.180:11011", location: "Pre Node1", status: 'pending', latency: 0},
		//{url: "ws://119.23.52.40:11011", location: "Pre Node2", status: 'pending', latency: 0},
		{url: "ws://119.23.40.206:11011", location: "Dev Node", status: 'pending', latency: 0},
	],
	faucetAddress: "http://119.23.40.206:11015", //http://119.23.52.40:11015",
};