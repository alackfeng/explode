import { REHYDRATE } from "redux-persist";

import { WALLET, NODE, CONNECT, ACCOUNTSEARCH } from "./types";


export const initialState = {
	url: false,
	status: 0,
	accountsearch: [],
	DB_VERSION: 1,
	DB_PREFIX: "assetfun_v1",
	wallet: [
		{"public_name":"default","password_pubkey":"AFT4uikCAFxpbqpadPXxno5oNqDNcngbXVbVFBxEuJFXjiw3eP3YA","encryption_key":"6b46ebe12d210215d0b948e36c4dc1db7aa50633d79edf5aefa09ea22cd305b4a6bdb50893b57a37111ce7d5846ff3db","encrypted_brainkey":"661e0955c1d24d3da60de7417bc590c326db603ca83082f2e6e772bedfc3bd773df2d3fef56ba8ee4993e19e2c305a990b6288c0b52a1f7ccb078c48dbff44c54a754261e2407b5514a884b205498c5da7db9bca05e388b80a5c6b81f50a4e723539612c8b3b6cc447571a0ecec5adfb329962861588037e28f8e4d18641a68b","brainkey_pubkey":"AFT5j7TfnVa9hBTwWiMdz9vU3iNePUy7rKCEpvRNSfVu9yHfEoLRq","brainkey_sequence":{"$type":"number","$enc":"2"},"brainkey_backup_date":{"$type":"undefined"},"created":{"$type":"Date","$enc":1514512448460},"last_modified":{"$type":"Date","$enc":1514512661234},"chain_id":"1f17d122a5f217003d9210be64840aa2dcdc67c1bfeda363f1565b637900dec1","id":"default","backup_date":{"$type":"Date","$enc":1514512453166}}
	],
	private_keys: [
		{"import_account_names":{"$type":"undefined"},"encrypted_key":"8a09855b612d82ca3116baaff493132ff534f0ae3e0f46335d86a2234f17083a5d1efd84f908caae489ae99dee6862e9","pubkey":"AFT88UxNwFCLnGug9Y74GFWa9H321Pb6ENbpPdX1qB6JGeeGw5dDQ","brainkey_sequence":{"$type":"number","$enc":"0"},"id":{"$type":"number","$enc":"1"}},
		{"import_account_names":{"$type":"undefined"},"encrypted_key":"c0d667e47b4acf4fd09fc50f44457555d7b74d6dd402235ae0c0f4d3b39255a2be451c7c3dc05bd647b20929c4f130a0","pubkey":"AFT6jFMb5jeitMfptMPJ6uMZXRZNGxzkkqg6qjo7b9Zv9QbyN4A3Y","brainkey_sequence":{"$type":"number","$enc":"1"},"id":{"$type":"number","$enc":"2"}}	
	],
	linked_accounts: [
		{"name":"aft521","chainId":"1f17d122a5f217003d9210be64840aa2dcdc67c1bfeda363f1565b637900dec1"},
		{"name":"taurus","chainId":"1f17d122a5f217003d9210be64840aa2dcdc67c1bfeda363f1565b637900dec1"}
	],
	cached_properties: {
		"name":"backup_recommended",
		"value":true
	},
	properties: {
		wallet_names: 	{"name":"wallet_names","value":["default"]},
		current_wallet: {"name":"current_wallet","value":"default"},
		no_balance_address: {"name":"no_balance_address","value":["AFTHs5N5nED3pj8StKiSCosXsEmmtxYju6J6","AFTKGGFBbVPejgztAGTis2jcxshLGWJCDi2L","AFTM7vBZkbR17QZwmzbiLrUvtpkaRum7kcCn","AFTKwg7oJqHSghK1nZXKND3LZSLYaijU8r28","AFTErtG87VgLmppG66JwKNCi6U6HSwvvJ1Z7"]},
		AddressIndex: {"name":"AddressIndex","value":{"AFTHs5N5nED3pj8StKiSCosXsEmmtxYju6J6":"AFT8ULdkfvs1bPCvaqPXj9kbHgDPVtXdfCP5DyPKY7MttK5qEurDJ","AFTKwg7oJqHSghK1nZXKND3LZSLYaijU8r28":"AFT8ULdkfvs1bPCvaqPXj9kbHgDPVtXdfCP5DyPKY7MttK5qEurDJ","AFTFSD9ywEpGx9jWQLKAhiCWRC6JvaUi3SyY":"AFT88UxNwFCLnGug9Y74GFWa9H321Pb6ENbpPdX1qB6JGeeGw5dDQ","AFTBfefNFys7XU4y1BtXJiehmL9q27AGYk6C":"AFT6jFMb5jeitMfptMPJ6uMZXRZNGxzkkqg6qjo7b9Zv9QbyN4A3Y","AFTGsPBpgiW8dN9bER2mUPg7qnipg941A57V":"AFT88UxNwFCLnGug9Y74GFWa9H321Pb6ENbpPdX1qB6JGeeGw5dDQ","AFTKGGFBbVPejgztAGTis2jcxshLGWJCDi2L":"AFT8ULdkfvs1bPCvaqPXj9kbHgDPVtXdfCP5DyPKY7MttK5qEurDJ","AFT5atKMm9q7kjPnYimUHLRZDhVbiqM8KEQ9":"AFT6jFMb5jeitMfptMPJ6uMZXRZNGxzkkqg6qjo7b9Zv9QbyN4A3Y","AFTBAzE9igzxxFmHpkm8bod19nyBVHtZUM4U":"AFT6jFMb5jeitMfptMPJ6uMZXRZNGxzkkqg6qjo7b9Zv9QbyN4A3Y","AFTErtG87VgLmppG66JwKNCi6U6HSwvvJ1Z7":"AFT8ULdkfvs1bPCvaqPXj9kbHgDPVtXdfCP5DyPKY7MttK5qEurDJ","AFTLkMaj7tVPLr6RDFgHW8j6S7p9FRfE2cSr":"AFT88UxNwFCLnGug9Y74GFWa9H321Pb6ENbpPdX1qB6JGeeGw5dDQ","AFT3xPABRix6Ric6WGPsMbWFwGj78WTJgGAu":"AFT88UxNwFCLnGug9Y74GFWa9H321Pb6ENbpPdX1qB6JGeeGw5dDQ","AFT34WpghrfxhXLsjPLx8U5rnyfDf4vTEpyV":"AFT88UxNwFCLnGug9Y74GFWa9H321Pb6ENbpPdX1qB6JGeeGw5dDQ","AFTHuJ9YZGg1AqhcEbU4VRSUEzk6ocCmAtKK":"AFT6jFMb5jeitMfptMPJ6uMZXRZNGxzkkqg6qjo7b9Zv9QbyN4A3Y","AFTM7vBZkbR17QZwmzbiLrUvtpkaRum7kcCn":"AFT8ULdkfvs1bPCvaqPXj9kbHgDPVtXdfCP5DyPKY7MttK5qEurDJ","AFT51ydoWfFgQNXf1xbrovopEB6cANgjr8Kw":"AFT6jFMb5jeitMfptMPJ6uMZXRZNGxzkkqg6qjo7b9Zv9QbyN4A3Y"}}
	},
	settings: {
		apiLatencies: {"wss://blockasset.org/ws":1901,"wss://blockasset.net/ws":1326},
		currentAccount: "taurus",
		latencyChecks: 19,
		settings_v3: [],
		unfollowed_accounts: [],
		viewSettings_v1: {"activeSetting":0}
	}
};

export const walletReducer = (state = initialState, action = {}) => {
	
	console.log("+++++[wallet-reducer.js]::walletReducer - ", action.type, action);

	switch (action.type) {
		case NODE.PENDING: {
			return {
				...state,
				url: "null",
				status: 0
			};
		}
		case NODE.SUCCESS: {
			return {
				...state,
				...action.payload
			};
		}
		case NODE.ERROR: {
			return {
				...state,
				url: false,
				status: -1
			};
		}
		case ACCOUNTSEARCH.PENDING: {
			return {
				...state,
			}
		}
		case ACCOUNTSEARCH.SUCCESS: {
			return {
				...state,
				accountsearch: action.payload
			}
		}
		default:
			return state;
	}
};