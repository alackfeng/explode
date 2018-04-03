

module.exports = {
  isDebuggingInChrome: true,
  testMenuEnabled: false,
  nodeList: [
    { url: 'ws://119.23.52.40:11011',     location: 'comm.node.china' },
    { url: 'ws://54.169.30.79:11011', location: 'comm.node.usa' },
    //{ url: 'ws://39.108.54.180:11011',  location: 'comm.node.hongkong' },
    // {url: "ws://119.23.40.206:21011", location: "comm.node.china"},
    // {url: "wss://blockasset.org/ws", 	location: "Newest NODE"},
    // {url: "ws://106.14.2.1:11011", 		location: "comm.node.usa"},
    // {url: "ws://39.108.54.180:11011", location: "comm.node.last"},
    // {url: "ws://119.23.52.40:11011", 	location: "comm.node.hongkong"},
  ],
  faucetAddress: 'http://54.169.30.79:11015', // https://assetfun.net/faucet",
  update: {
    url: 'https://www.pgyer.com/apiv2/app/check',
    version: {
      ios: '1.1-3',
      android: '1.1-3',
      web: '1.1-3',
    },
    androidKey: {
      api: '97863b98cd55f9b414c334ba7599c4db',
      app: 'ff22e82bd0ae5570c6e2565fa0ce7509',
    },
    iosKey: {
      api: '97863b98cd55f9b414c334ba7599c4db',
      app: '9f567de0996628600f896b90d546bcdc',
    },
  },
};
