import { Apis } from "assetfunjs-ws";
import {Aes, ChainValidation, TransactionBuilder, TransactionHelper, ops, FetchChain, ChainStore} from "assetfunjs/es";


class Api {
	lookupAccounts(startChar, limit) {
		return Apis.instance().db_api().exec("lookup_accounts", [
			startChar, limit
		]);
	}

	create_account(
      owner_pubkey,
      active_pubkey,
      new_account_name,
      registrar,
      referrer,
      referrer_percent,
      broadcast = false
  ) {

    ChainValidation.required(registrar, "registrar_id");
    ChainValidation.required(referrer, "referrer_id");

    return new Promise((resolve, reject) => {
        return Promise.all([
            FetchChain("getAccount", registrar),
            FetchChain("getAccount", referrer)
        ]).then((res)=> {
            let [ chain_registrar, chain_referrer ] = res;

            let tr = new TransactionBuilder();
            tr.add_type_operation("account_create", {
                fee: {
                    amount: 0,
                    asset_id: 0
                },
                "registrar": chain_registrar.get("id"),
                "referrer": chain_referrer.get("id"),
                "referrer_percent": referrer_percent,
                "name": new_account_name,
                "owner": {
                    "weight_threshold": 1,
                    "account_auths": [],
                    "key_auths": [[ owner_pubkey, 1 ]],
                    "address_auths": []
                },
                "active": {
                    "weight_threshold": 1,
                    "account_auths": [ ],
                    "key_auths": [[ active_pubkey, 1 ]],
                    "address_auths": []
                },
                "options": {
                    "memo_key": active_pubkey,
                    "voting_account": "1.2.5",
                    "num_witness": 0,
                    "num_committee": 0,
                    "votes": [ ]
                }
            });

            resolve(tr);
            /*return WalletDb.process_transaction(
                tr,
                null, //signer_private_keys,
                broadcast
            ).then((res) => {
                console.log("process_transaction then", res);
                resolve();
            }).catch(err => {
                console.log("process_transaction catch", err);
                reject(err);
            });*/
        });
    });
  }

}

export default new Api();