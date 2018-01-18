import { REHYDRATE } from "redux-persist";
import { WALLET, WALLET_NEW, WALLET_DELETE, WALLET_DELETEALL, WALLET_RESTORE } from "./types";


export const initialWalletState = {
	inited: null, 
	pending: {
		inited: false,
		users: false,
		latencyChecks: 0,
	},
	DB_VERSION: 1,
	DB_PREFIX: "assetfun_v1",
	wallet: [
		{"public_name":"default","password_pubkey":"AFT4uikCAFxpbqpadPXxno5oNqDNcngbXVbVFBxEuJFXjiw3eP3YA","encryption_key":"6b46ebe12d210215d0b948e36c4dc1db7aa50633d79edf5aefa09ea22cd305b4a6bdb50893b57a37111ce7d5846ff3db","encrypted_brainkey":"661e0955c1d24d3da60de7417bc590c326db603ca83082f2e6e772bedfc3bd773df2d3fef56ba8ee4993e19e2c305a990b6288c0b52a1f7ccb078c48dbff44c54a754261e2407b5514a884b205498c5da7db9bca05e388b80a5c6b81f50a4e723539612c8b3b6cc447571a0ecec5adfb329962861588037e28f8e4d18641a68b","brainkey_pubkey":"AFT5j7TfnVa9hBTwWiMdz9vU3iNePUy7rKCEpvRNSfVu9yHfEoLRq","brainkey_sequence":{"$type":"number","$enc":"2"},"brainkey_backup_date":{"$type":"undefined"},"created":{"$type":"Date","$enc":1514512448460},"last_modified":{"$type":"Date","$enc":1514512661234},"chain_id":"1f17d122a5f217003d9210be64840aa2dcdc67c1bfeda363f1565b637900dec1","id":"default","backup_date":{"$type":"Date","$enc":1514512453166}}
	],
	private_keys: [],
	linked_accounts: [],
	cached_properties: {
		"name":"backup_recommended",
		"value":true
	},
	properties: {
		wallet_names: 	{"name":"wallet_names","value":["default"]},
		current_wallet: {"name":"current_wallet","value":"default"}
	},
};

export const walletReducer = (state = initialWalletState, action = {}) => {
	
	console.log(">>>>>[wallet.reducer.js]::walletReducer - ", action.type, action);

	switch (action.type) {
		case REHYDRATE: {	// REHYDRATE
			return {
				...state,
				...action.payload.wallet
			};
		}
		case WALLET.PENDING: {	// WALLET
			return {
				...state,
				inited: 0,
			};
		}
		case WALLET.SUCCESS: {
			return {
				...state,
				inited: 1,
				pending: {...state.pending, inited: 1}
			};
		}
		case WALLET.ERROR: {
			return {
				...state,
				inited: -1,
			};
		}
		case WALLET_NEW.PENDING: {	// WALLET_NEW
			return {
				...state,
				pending: {...state.pending, ...action.payload}
			};
		}
		case WALLET_NEW.SUCCESS: {
			return {
				...state,
				...action.payload
			};
		}
		case WALLET_NEW.ERROR: {
			return {
				...state,
			};
		}
		case WALLET_DELETE.PENDING: {	// WALLET_DELETE
			return {
				...state,
				pending: {...state.pending, ...action.payload}
			};
		}
		case WALLET_DELETE.SUCCESS: {
			return {
				...state,
				pending: {
					...state.pending,
					currentAccount: 'over'
				},
				...action.payload,
			};
		}
		case WALLET_DELETE.ERROR: {
			return {
				...state,
			};
		}
		case WALLET_RESTORE.PENDING: {	// WALLET_RESTORE
			return {
				...state,
				pending: {...state.pending, ...action.payload}
			};
		}
		case WALLET_RESTORE.SUCCESS: {
			return {
				...state,
				...action.payload
			};
		}
		case WALLET_RESTORE.ERROR: {
			return {
				...state,
			};
		}
		default:
			return state;
	}
};