
import { WALLET, NODE, CONNECT, ACCOUNTSEARCH } from "./types";

import willTransitionTo from "../../libs/routerTransition";
import ApplicationApi from "../../api/ApplicationApi";


export const nodeConnect = (nodes) => {
	return dispatch => {

		dispatch({type: NODE.PENDING});

		// call someting, example api to node
		console.log("+++++[wallet-action.js]::nodeConnect - call api...");

		willTransitionTo(null, null, (res) => {
			dispatch({
				type: NODE.SUCCESS,
				payload: {
					url: res,
					status: 1
				}
			});

		});

	};
};

// listen rpc callback , so node status

export const updateRpcConnectionStatus = (status) => {
	console.log("+++++[wallet-action.js]::updateRpcConnectionStatus - node rpc status - ", status);

	return {
			type: NODE.SUCCESS,
			payload: {
				status: status
			}
	};
};

// account search to node
let accountSearchs = {};

export const accountSearch = (start_symbol, limit = 50) => {
	let uid = `${start_symbol}_${limit}`;
	return dispatch => {
		if(!accountSearchs[uid]) {
			accountSearchs[uid] = true;
			
			dispatch({type: ACCOUNTSEARCH.PENDING});

			return ApplicationApi.lookupAccounts(start_symbol, limit)
				.then(result => {
					accountSearchs[uid] = false;

					// to reducer
					dispatch({
						type: ACCOUNTSEARCH.SUCCESS,
						payload: {
							searchTerm: start_symbol,
							accounts: result
						}
					});
				});
		}
	};
};


