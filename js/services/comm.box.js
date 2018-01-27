
import WalletDb from "./WalletDb";

import {ChainStore, PrivateKey, key, Aes, FetchChain} from "assetfunjs/es";
import {Apis, ChainConfig} from "assetfunjs-ws";

import ApplicationApi from "./ApplicationApi";
let application_api = new ApplicationApi();

let TRACE = false;

class CommBox {

	constructor() {
		console.log("=====[CommBox.js]::constructor - call ");
	}

	/*
	 * 分发不同的方法调用，如transfer\create_asset etc
	 * method: transfer | create_asset | issue_asset
	 * parameters: 方法所需要的参数，如transfer中的from|to|memo|amount|assettype etc
	*/
	handle(method, parameters) {
		console.log("=====[CommBox.js]::handle - call ", method);
		let transPromise = null;

		if(method === 'transfer')
			transPromise = application_api.transfer(parameters);
		else {
			console.warn("=====[CommBox.js]::handle NOT FOUND method < ", method);
		}

		return transPromise.then(tr => {

			console.log("=====[CommBox.js]::handle - transPromise tr: ", tr);
			return {response: {type: 'second_confirm', transaction: tr, extra: []}, error: null};
		}).catch(err => {
			
			console.log("=====[CommBox.js]::handle - transPromise err: ", err);
			return {response: null, error: err || 'CommBox handle: Something bad happened'};
		});

	}
}

export default new CommBox();

