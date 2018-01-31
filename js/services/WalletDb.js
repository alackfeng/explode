
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

let aes_private = null;
let _passwordKey =  null; 
//{"AFT5aNtKtnEnsQTxuyTZWT2nCAxWeDijj1hKr7vH2k2tTTQ5wFrBL": PrivateKey.fromWif("5KPvHg16A1GiYD5icwfVhFj75up2BXepukW9f9SMKyumcGXsc22")};
// let transaction;

let TRACE = false;

//let dictJson, AesWorker;

class WalletDB {

	constructor() {
    console.log("=====[WalletDB]::constructor - call ");

    this.state = { 
      wallet: {chain_id: "c6a9402f3aa854a533888ee3293e244c2f988261268e3fb36d8df359d6919288"}, 
      saving_keys: false,
      keys: {"AFT5aNtKtnEnsQTxuyTZWT2nCAxWeDijj1hKr7vH2k2tTTQ5wFrBL": "5KPvHg16A1GiYD5icwfVhFj75up2BXepukW9f9SMKyumcGXsc22"}
    };

    this.keys = {};

    this.confirm_transactions = true; // second confirm

	}

  broadcast_second_confirm(tr, broadcast_callback = ()=>null) {
    console.log("=====[WalletDB]::broadcast_second_confirm - call ", tr);
    return tr.broadcast(broadcast_callback);
  }

  process_transaction(tr, signer_pubkeys, broadcast, second_confirm = true, extra_keys = []) {
    const passwordLogin = true; //state.enter.isAuthenticated ; //SettingsStore.getState().settings.get("passwordLogin");
    console.log("=====[WalletDb.js]::process_transaction - passwordLogin : ", Apis.instance().chain_id, passwordLogin);

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
                console.log("=====[WalletDb.js]::process_transaction - get_potential_signatures: ", {pubkeys, addys});

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
                        console.log("=====[WalletDb.js]::process_transaction - private_key : ", private_key, pubkey_string);
                        tr.add_signer(private_key, pubkey_string)
                    }
                })
            }).then(()=> {
                if(broadcast) {
                    if(second_confirm && this.confirm_transactions) {
                        //let p = new Promise((resolve, reject) => {
                        //    ; //TransactionConfirmActions.confirm(tr, resolve, reject)
                        //})
                        return Promise.resolve(tr);
                    }
                    else
                        return tr.broadcast()

                } else
                    return tr.serialize()
            })
        })
    //})
  }

  onLock() {
    _passwordKey = null;
    aes_private = null;
  }

  isLocked() {
    return !(!!aes_private || !!_passwordKey);
  }


  decryptTcomb_PrivateKey(private_key_tcomb) {
    if( ! private_key_tcomb) return null
    if( this.isLocked() ) throw new Error("wallet locked")
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
    console.log("=====[WalletDb.js]::createAccountWithPassword - getTcomb_byPubkey : ", public_key);
    return this.state.keys[public_key];
  }

  /** @return ecc/PrivateKey or null */
  getPrivateKey(public_key) {
    if (_passwordKey) return _passwordKey[public_key];
    if(! public_key) return null
    if(public_key.Q) public_key = public_key.toPublicKeyString()
    let private_key_tcomb = this.getTcomb_byPubkey(public_key)
    if(! private_key_tcomb) return null
    return this.decryptTcomb_PrivateKey(private_key_tcomb)
  }

  /* 
  * inner call
  */
  generateKeyFromPassword = (accountName, role, password) => {
    let seed = accountName + role + password;
    let privKey = PrivateKey.fromSeed(seed);
    let pubKey = privKey.toPublicKey().toString();

    return {privKey, pubKey};
  }

  /** This also serves as 'unlock' */
  validatePassword( password, unlock = false, account = null, roles = ["active", "owner", "memo"] ) {
    if (account) {
        let id = 0;
        function setKey(role, priv, pub) {
            if (!_passwordKey) _passwordKey = {};
            _passwordKey[pub] = priv;

            console.log("=====[WalletDb.js]::validatePassword - setKey > ", id, role, priv, pub);
            id++;
            /*PrivateKeyStore.setPasswordLoginKey({
                pubkey: pub,
                import_account_names: [account],
                encrypted_key: null,
                id,
                brainkey_sequence: null
            }); */
        }

        /* Check if the user tried to login with a private key */
        let fromWif;
        try {
            fromWif = PrivateKey.fromWif(password);
        } catch(err) {

        }
        let acc = ChainStore.getAccount(account);
        let key;
        if (fromWif) {
            key = {privKey: fromWif, pubKey: fromWif.toPublicKey().toString()};
        }

        /* Test the pubkey for each role against either the wif key, or the password generated keys */
        roles.forEach(role => {
            if (!fromWif) {
                key = this.generateKeyFromPassword(account, role, password);
            }

            let foundRole = false;

            if (acc) {
                if (role === "memo") {
                    if (acc.getIn(["options", "memo_key"]) === key.pubKey) {
                        setKey(role, key.privKey, key.pubKey);
                        foundRole = true;
                    }
                } else {
                    acc.getIn([role, "key_auths"]).forEach(auth => {
                        if (auth.get(0) === key.pubKey) {
                            setKey(role, key.privKey, key.pubKey);
                            foundRole = true;
                            return false;
                        }
                    });

                    if (!foundRole) {
                        let alsoCheckRole = role === "active" ? "owner" : "active";
                        acc.getIn([alsoCheckRole, "key_auths"]).forEach(auth => {
                            if (auth.get(0) === key.pubKey) {
                                setKey(alsoCheckRole, key.privKey, key.pubKey);
                                foundRole = true;
                                return false;
                            }
                        });
                    }
                }
            }
        });

        return _passwordKey;

    } else {
        let wallet = this.state.wallet;
        try {
            let password_private = PrivateKey.fromSeed( password );
            let password_pubkey = password_private.toPublicKey().toPublicKeyString();
            if(wallet.password_pubkey !== password_pubkey) return false;
            if( unlock ) {
                let password_aes = Aes.fromSeed( password );
                let encryption_plainbuffer = password_aes.decryptHexToBuffer( wallet.encryption_key );
                aes_private = Aes.fromSeed( encryption_plainbuffer );
            }
            return true;
        } catch(e) {
            console.error(e);
            return false;
        }
    }
  }

  changePassword( old_password, new_password, unlock = false) {
      
  }

  saveKeys(username, password, extra) {

    console.log("=====[WalletDb.js]::saveKeys - ", username, password, extra);
    
    const account_name = username; 
    let {privKey : owner_private} = wallet_db.generateKeyFromPassword(account_name, "owner", password);
    let {privKey: active_private} = wallet_db.generateKeyFromPassword(account_name, "active", password);

    console.log("=====[WalletDb.js]::saveKeys - ACCOUNT :", account_name, "\n", active_private.toWif(),
      "\n", active_private.toPublicKey().toPublicKeyString(), "\n", owner_private.toPublicKey().toPublicKeyString());


    // 加密私钥
    let password_aes = Aes.fromSeed( password );
    let encryption_buffer = key.get_random_key().toBuffer();
    let encryption_key = password_aes.encryptToHex( encryption_buffer );
    let local_aes_private = Aes.fromSeed( encryption_buffer );

    let password_private = PrivateKey.fromSeed( password );
    let password_pubkey = password_private.toPublicKey().toPublicKeyString();

    let keys = {};
    keys[owner_private.toPublicKey().toPublicKeyString()] = local_aes_private.encryptToHex( owner_private.toWif() );
    keys[active_private.toPublicKey().toPublicKeyString()] = local_aes_private.encryptToHex( active_private.toWif() );

    let auth_user_object = {
      username: username,
      chain_id: Apis.instance().chain_id,
      encryption_key: encryption_key,
      password_pubkey: password_pubkey,
      keys: keys,
    }

    // 缓存到本地
    wallet_db.keys = keys;
    aes_private = local_aes_private; // 要改成多账号模式，

    return { auth: auth_user_object }; 
  }

  saveKey(private_key, account_names, public_key_string) {

  }

  /*
   * 初始化store数据到内存中，如privkey
  */
  loadDbData(data) {
    return data;
  }

}

let wallet_db = new WalletDB();
export default wallet_db;

