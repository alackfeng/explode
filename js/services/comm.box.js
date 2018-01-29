
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
		let extra = [];
		let second_confirm = parameters.second_confirm || true;


		if(method === 'transfer') {
			transPromise = application_api.transfer(parameters);
		}
		else {
			console.warn("=====[CommBox.js]::handle NOT FOUND method < ", method);
		}

		return transPromise.then(tr => {

			console.log("=====[CommBox.js]::handle - transPromise tr: ", tr);
			if(second_confirm)
				return {response: {type: 'second_confirm', transaction: tr, extra: extra}, error: null};
			else 
				return {response: {type: 'origin_confirm', transaction: tr, extra: extra}, error: null};

		}).catch(err => {
			
			console.log("=====[CommBox.js]::handle - transPromise err: ", err);
			return {response: null, error: err || 'CommBox handle: Something bad happened'};
		});

	}

	broadcast(method, parameters) {
		console.log("=====[CommBox.js]::broadcast - call ", method);
		let err = null;

		return WalletDb.broadcast_second_confirm(parameters.transaction).then(res => {

			console.log("=====[CommBox.js]::broadcast - Promise result: ", res);
			return {response: {trx_id: res[0].id, trx_block_num: res[0].block_num}, error: null};
		}).catch(err => {
			
			console.log("=====[CommBox.js]::broadcast - Promise err: ", err);
			return {response: null, error: err || 'CommBox handle: Something bad happened'};
		});

	}
}

export default new CommBox();

