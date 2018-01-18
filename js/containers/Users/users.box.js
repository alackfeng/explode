
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
import {ChainStore, PrivateKey, key, Aes} from "assetfunjs/es";
import {Apis, ChainConfig} from "assetfunjs-ws";
//import AddressIndex from "stores/AddressIndex";

import application_api from "../../api/ApplicationApi";
import { faucetAddress as faucet_address } from "../../env";

let aes_private = null;
let _passwordKey =  {"AFT5aNtKtnEnsQTxuyTZWT2nCAxWeDijj1hKr7vH2k2tTTQ5wFrBL": PrivateKey.fromWif("5KPvHg16A1GiYD5icwfVhFj75up2BXepukW9f9SMKyumcGXsc22")};
// let transaction;

let TRACE = false;

let dictJson, AesWorker;


class UsersBox {

	constructor() {
		this.state = { 
            wallet: {chain_id: "c6a9402f3aa854a533888ee3293e244c2f988261268e3fb36d8df359d6919288"}, 
            saving_keys: false,
            keys: {"AFT5aNtKtnEnsQTxuyTZWT2nCAxWeDijj1hKr7vH2k2tTTQ5wFrBL": "5KPvHg16A1GiYD5icwfVhFj75up2BXepukW9f9SMKyumcGXsc22"}
        };
	}


    process_transaction(state, tr, signer_pubkeys, broadcast, extra_keys = []) {
        const passwordLogin = state.enter.isAuthenticated ; //SettingsStore.getState().settings.get("passwordLogin");
        console.log("=====[users.box.js]::process_transaction - passwordLogin : ", Apis.instance().chain_id, passwordLogin);

        if(!passwordLogin && Apis.instance().chain_id !== this.state.wallet.chain_id)
            return Promise.reject("Mismatched chain_id; expecting " +
                this.state.wallet.chain_id + ", but got " +
                Apis.instance().chain_id)

        //return WalletUnlockActions.unlock().then( () => {
            //AccountActions.tryToSetCurrentAccount();
            return Promise.all([
                tr.set_required_fees(),
                tr.update_head_block()
            ]).then(()=> {
                let signer_pubkeys_added = {}
                if(signer_pubkeys) {
                    // Balance claims are by address, only the private
                    // key holder can know about these additional
                    // potential keys.
                    let pubkeys = []; //PrivateKeyStore.getPubkeys_having_PrivateKey(signer_pubkeys)
                    if( ! pubkeys.length)
                        throw new Error("Missing signing key")

                    for(let pubkey_string of pubkeys) {
                        let private_key = this.getPrivateKey(pubkey_string)
                        tr.add_signer(private_key, pubkey_string)
                        signer_pubkeys_added[pubkey_string] = true
                    }
                }

                return tr.get_potential_signatures().then( ({pubkeys, addys})=> {
                    console.log("=====[users.box.js]::process_transaction - get_potential_signatures: ", {pubkeys, addys});

                    let my_pubkeys = pubkeys; //PrivateKeyStore.getPubkeys_having_PrivateKey(pubkeys.concat(extra_keys), addys);

                    //{//Testing only, don't send All public keys!
                    //    let pubkeys_all = PrivateKeyStore.getPubkeys() // All public keys
                    //    tr.get_required_signatures(pubkeys_all).then( required_pubkey_strings =>
                    //        console.log('get_required_signatures all\t',required_pubkey_strings.sort(), pubkeys_all))
                    //    tr.get_required_signatures(my_pubkeys).then( required_pubkey_strings =>
                    //        console.log('get_required_signatures normal\t',required_pubkey_strings.sort(), pubkeys))
                    //}
                    return tr.get_required_signatures(my_pubkeys).then( required_pubkeys => {
                        for(let pubkey_string of required_pubkeys) {
                            if(signer_pubkeys_added[pubkey_string]) continue
                            let private_key = this.getPrivateKey(pubkey_string)
                            if( ! private_key)
                                // This should not happen, get_required_signatures will only
                                // returned keys from my_pubkeys
                                throw new Error("Missing signing key for " + pubkey_string)
                            console.log("=====[users.box.js]::process_transaction - fprivate_key : ", private_key, pubkey_string);
                            tr.add_signer(private_key, pubkey_string)
                        }
                    })
                }).then(()=> {
                    if(broadcast) {
                        if(this.confirm_transactions) {
                            let p = new Promise((resolve, reject) => {
                                ; //TransactionConfirmActions.confirm(tr, resolve, reject)
                            })
                            return p;
                        }
                        else
                            return tr.broadcast()

                    } else
                        return tr.serialize()
                })
            })
        //})
    }


    decryptTcomb_PrivateKey(private_key_tcomb) {
        if( ! private_key_tcomb) return null
        //if( this.isLocked() ) throw new Error("wallet locked")
        if (_passwordKey && _passwordKey[private_key_tcomb.pubkey]) {
            return _passwordKey[private_key_tcomb.pubkey];
        }
        let private_key_hex = aes_private.decryptHex(private_key_tcomb.encrypted_key)
        return PrivateKey.fromBuffer(new Buffer(private_key_hex, 'hex'))
    }

    getTcomb_byPubkey(public_key) {
        if(! public_key) return null;
        if(public_key.Q)
            public_key = public_key.toPublicKeyString();
        console.log("=====[users.box.js]::createAccountWithPassword - getTcomb_byPubkey : ", public_key);
        return this.state.keys[public_key];
    }

    /** @return ecc/PrivateKey or null */
    getPrivateKey(public_key) {
        if (_passwordKey) return _passwordKey[public_key];
        if(! public_key) return null
        if(public_key.Q) public_key = public_key.toPublicKeyString()
        let private_key_tcomb = this.getTcomb_byPubkey(public_key)
        if(! private_key_tcomb) return null
        return private_key_tcomb; //this.decryptTcomb_PrivateKey(private_key_tcomb)
    }

	/*
	 * call api create account 
	*/
  createAccountWithPassword( dispatch, state, account_name, password, registrar, referrer, referrer_percent, refcode ) {

    let {privKey : owner_private} = this.generateKeyFromPassword(account_name, "owner", password);
    let {privKey: active_private} = this.generateKeyFromPassword(account_name, "active", password);


    console.log("=====[users.box.js]::createAccountWithPassword - param: ", dispatch, state.users.inited);
    console.log("=====[users.box.js]::createAccountWithPassword - create account:", account_name);
    console.log("=====[users.box.js]::createAccountWithPassword - new active pubkey", active_private.toPublicKey().toPublicKeyString(), active_private.toWif());
    console.log("=====[users.box.js]::createAccountWithPassword - new owner pubkey", owner_private.toPublicKey().toPublicKeyString());

    return new Promise((resolve, reject) => {
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
                return this.process_transaction(
                    state,
                    tr,
                    null, //signer_private_keys,
                    true
                ).then((res) => {
                    console.log("process_transaction then", res);
                    resolve({privateKey: {privKey: active_private.toWif(), pubKey: active_private.toPublicKey().toPublicKeyString()}, currentAccount: account_name});
                }).catch(err => {
                    console.log("process_transaction catch", err);
                    reject(err);
                });
                // resolve;

            }).catch(reject);
        };

        if(1 || registrar) {
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
            		console.log("=====[users.box.js]::createAccountWithPassword -  res, ", res);
                if (!res || (res && res.error)) {
                    reject(res.error);
                } else {
                    resolve(res);
                }
            })).catch(reject);

            return create_account_promise.then(result => {
            		console.log("=====[users.box.js]::createAccountWithPassword - result, ", result);
                if (result && result.error) {
                    reject(result.error);
                } else {
                    resolve(result);
                }
            }).catch(error => {
                reject(error);
            });
        }
    });
  }


  /* 
   * inner call
   */
  generateKeyFromPassword(accountName, role, password) {
    let seed = accountName + role + password;
    let privKey = PrivateKey.fromSeed(seed);
    let pubKey = privKey.toPublicKey().toString();

    return {privKey, pubKey};
  }

}

export default new UsersBox();