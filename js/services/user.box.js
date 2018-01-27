
//import alt from "alt-instance";
//import BaseStore from "stores/BaseStore";

//import iDB from "idb-instance";
//import idb_helper from "idb-helper";
//import {cloneDeep} from "lodash";

//import PrivateKeyStore from "stores/PrivateKeyStore";
//import SettingsStore from "stores/SettingsStore";
//import {WalletTcomb} from "./tcomb_structs";
//import TransactionConfirmActions from "actions/TransactionConfirmActions";
//import WalletUnlockActions from "actions/WalletUnlockActions";
//import PrivateKeyActions from "actions/PrivateKeyActions";
//import AccountActions from "actions/AccountActions";
import {ChainStore, PrivateKey, key, Aes, FetchChain} from "assetfunjs/es";
import {Apis, ChainConfig} from "assetfunjs-ws";
//import AddressIndex from "stores/AddressIndex";

import { faucetAddress as faucet_address } from "../env";

import WalletDb from "./WalletDb";

import ApplicationApi from "./ApplicationApi";
let application_api = new ApplicationApi();

let aes_private = null;
let _passwordKey =  null; //{"AFT5aNtKtnEnsQTxuyTZWT2nCAxWeDijj1hKr7vH2k2tTTQ5wFrBL": PrivateKey.fromWif("5KPvHg16A1GiYD5icwfVhFj75up2BXepukW9f9SMKyumcGXsc22")};
// let transaction;

let TRACE = false;

let dictJson, AesWorker;


class UsersBox {

	constructor() {
        console.log("=====[users.box.js]::constructor - call ");

		/*this.state = { 
            wallet: {chain_id: "c6a9402f3aa854a533888ee3293e244c2f988261268e3fb36d8df359d6919288"}, 
            saving_keys: false,
            keys: {"AFT5aNtKtnEnsQTxuyTZWT2nCAxWeDijj1hKr7vH2k2tTTQ5wFrBL": "5KPvHg16A1GiYD5icwfVhFj75up2BXepukW9f9SMKyumcGXsc22"}
        };*/

        this.confirm_transactions = 0; // second confirm
	}

	/*
	 * call api create account 
	*/
  createAccountWithPassword = ( login, {username, password, registrar, referrer, referrer_percent, refcode}=regInfo ) => {

    if(login !== username) {
        console.error("=====[users.box.js]::createAccountWithPassword - wrong : ", login, username);
        throw new Error(JSON.stringify({err_no: 11011, err_msg: "call register param wrong"}));
        return;
    }
    
    const account_name = username;
    console.log("=====[users.box.js]::createAccountWithPassword - param: ", account_name);
    let {privKey : owner_private} = WalletDb.generateKeyFromPassword(account_name, "owner", password);
    let {privKey: active_private} = WalletDb.generateKeyFromPassword(account_name, "active", password);

    console.log("=====[users.box.js]::createAccountWithPassword - create account:", account_name);
    console.log("=====[users.box.js]::createAccountWithPassword - new active pubkey", active_private.toPublicKey().toPublicKeyString(), active_private.toWif());
    console.log("=====[users.box.js]::createAccountWithPassword - new owner pubkey", owner_private.toPublicKey().toPublicKeyString());

    //return new Promise((resolve, reject) => {
        let create_account = () => {
            return application_api.create_account(
                owner_private.toPublicKey().toPublicKeyString(),
                active_private.toPublicKey().toPublicKeyString(),
                account_name,
                registrar, //registrar_id,
                referrer, //referrer_id,
                referrer_percent, //referrer_percent,
                true //broadcast
            ).then((tr) => {
                
                console.log("=====[users.box.js]::createAccountWithPassword - transaction: ", tr);
                return WalletDb.process_transaction(
                    tr,
                    null, //signer_private_keys,
                    true
                ).then((res) => {
                    console.log("process_transaction then", res);
                    return {
                        response: res,
                        extra: {privateKey: {privKey: active_private.toWif(), pubKey: active_private.toPublicKey().toPublicKeyString()}, currentAccount: account_name}
                    };
                }).catch(err => {
                    console.log("process_transaction catch", err);
                    //Promise.reject(err);
                    return {response: null, error: err || 'Something bad happened'};
                });
                // resolve;

            }).catch(Promise.reject);
        };

        if(registrar) {
            // using another user's account as registrar
            return create_account();
        } else {
            // using faucet

            let faucetAddress = faucet_address; // SettingsStore.getSetting("faucet_address");
            if (window && window.location && window.location.protocol === "https:") {
                faucetAddress = faucetAddress.replace(/http:\/\//, "https://");
            }

            let create_account_promise = fetch( faucetAddress + "/api/v1/accounts", {
                method: "post",
                mode: "cors",
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    "account": {
                        "name": account_name,
                        "owner_key": owner_private.toPublicKey().toPublicKeyString(),
                        "active_key": active_private.toPublicKey().toPublicKeyString(),
                        "memo_key": active_private.toPublicKey().toPublicKeyString(),
                        //"memo_key": memo_private.private_key.toPublicKey().toPublicKeyString(),
                        "refcode": refcode,
                        "referrer": referrer
                    }
                })
            }).then(r => r.json().then(res => {
            	
                //console.log("=====[users.box.js]::createAccountWithPassword -  res, ", res);
                if (!res || (res && res.error)) {
                    return Promise.reject(res.error);
                } else {
                    return Promise.resolve(res);
                }
            })); ///.catch(Promise.reject);

            return create_account_promise.then(result => {
            	//console.log("=====[users.box.js]::createAccountWithPassword - result, ", result);

                if (result && result.error) {
                    return Promise.reject(result.error);
                } else {
                    return Promise.resolve(result);
                }
            }).then(
                result => ({response: result}),
            ).catch(error => {
                //console.log("=====[users.box.js]::createAccountWithPassword - error, ", error);
                return {response: null, error: error || 'Something bad happened'};
            });
        }
    //});
  }


  loginUser = (username, password) => {
    const account_name = username;
    console.log("=====[users.box.js]::loginUser - param: ", account_name, password);

    return FetchChain("getAccount", username).then((ret) => {
      console.log("=====[users.box.js]::loginUser - : getAccount is : ", ret);

      let result = null;
      let error = null;
      let validPassword = WalletDb.validatePassword(password, true, username);
      if(!!validPassword) {
        console.log("=====[users.box.js]::loginUser - : _passwordKey", validPassword);
        result = {private: validPassword, username: username};
      } else {
        console.error("=====[users.box.js]::loginUser - : _passwordKey", validPassword);
        error = "invalid password";
      }

      return {response: result, error: error};
    }).catch(error => {
      console.error("=====[users.box.js]::loginUser - : getAccount is : err ", error);
      return {response: null, error: error || 'Something bad happened'};
    });
  }

}

export default new UsersBox();

