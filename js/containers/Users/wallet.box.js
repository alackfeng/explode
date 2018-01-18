
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

import dictionary from "../../libs/dictionary.json";

import { restore } from "./wallet.actions";

let aes_private = null;
let _passwordKey = null;
// let transaction;

let TRACE = false;

const __BASE_URL__ = ".";
let dictJson = dictionary, AesWorker;
let __ELECTRON__ = false;
if (__ELECTRON__) {
    //AesWorker = require("worker-loader?inline!workers/AesWorker");
    //dictJson = require("json-loader!common/dictionary_en.json");
}


class WalletBox {

	cnostructor() {
		this.state = { wallet: null, saving_keys: false }
	}

	/** 
		This may result in a new wallet name being added, only in this case
    should a <b>create_wallet_password</b> be provided.
  */
  onSetWallet({wallet_name = "default", create_wallet_password, brnkey, resolve}) {

  		let call = resolve;
  		let callback = (res) => {
  			console.log("------------------------res:res ", res);
  			if(call) call(res);
  		};


  		return this.onCreateWallet(
                          create_wallet_password,
                          brnkey, //brainkey,
                          true, //unlock
                          wallet_name,
                          resolve
                      ).then(()=> {
                          console.log("===========-------------") //this.setState({current_wallet: wallet_name})
                          resolve("sssss");
                      });



      var p = new Promise( res => {
      		console.log("+++++++++++++++++ - ", wallet_name, create_wallet_password);
          if( /[^a-z0-9_-]/.test(wallet_name) || wallet_name === "" )
              throw new Error("Invalid wallet name")

          /* if(this.state.current_wallet === wallet_name) {
              res()
              return
          }

          var add
          if( ! this.state.wallet_names.has(wallet_name) ) {
              var wallet_names = this.state.wallet_names.add(wallet_name)
              add = iDB.root.setProperty("wallet_names", wallet_names)
              this.setState({wallet_names})
          } */

          var add;
          var current; // = iDB.root.setProperty("current_wallet", wallet_name)

          res( Promise.all([ add, current ]).then(()=>{
              // The database must be closed and re-opened first before the current
              // application code can initialize its new state.
              //iDB.close()
              //ChainStore.clearCache()
              //BalanceClaimActiveStore.reset()
              // Stores may reset when loadDbData is called
              //return iDB.init_instance().init_promise.then(()=>{
                  // Make sure the database is ready when calling CachedPropertyStore.reset()
                  //CachedPropertyStore.reset()
                  return Promise.all([
                      //WalletDb.loadDbData().then(()=>AccountStore.loadDbData()),
                      //PrivateKeyActions.loadDbData().then(()=>AccountRefsStore.loadDbData())
                  ]).then(()=>{
                      // Update state here again to make sure listeners re-render
                      //console.log("++++++++++++++++++ - create_wallet_password ", create_wallet_password);
                      if( ! create_wallet_password) {
                          //this.setState({current_wallet: wallet_name})
                          return
                      }

                      return this.onCreateWallet(
                          create_wallet_password,
                          brnkey, //brainkey,
                          true, //unlock
                          wallet_name,
                          callback
                      ).then(()=> {
                          console.log("---------------------------") //this.setState({current_wallet: wallet_name})
                      })
                  })
              //})
          }));

      }).catch( error => {
          console.error(error)
          return Promise.reject(error)
      })
      console.log("-----------------p", p);
      if(resolve) resolve(p)
  }

  getBrainKey() {
      let wallet = this.state.wallet;
      if(!wallet) {
      	throw new Error("missing Wallet brainkey");
      }
      if ( ! wallet.encrypted_brainkey) throw new Error("missing brainkey")
      if ( ! aes_private) throw new Error("wallet locked")
      let brainkey_plaintext = aes_private.decryptHexToText( wallet.encrypted_brainkey )
      return brainkey_plaintext
  }

  getBrainKeyPrivate(brainkey_plaintext = this.getBrainKey()) {
      if( ! brainkey_plaintext) throw new Error("missing brainkey")
      return PrivateKey.fromSeed( key.normalize_brainKey(brainkey_plaintext) )
  }


	onCreateWallet(
      password_plaintext,
      brainkey_plaintext,
      unlock = false,
      public_name = "default",
      callback
  ) {
      let walletCreateFct = (dictionary) => {
      		//console.log("===================== dictionary - ", dictionary);
          return new Promise( (resolve, reject) => {
          		//console.log("===================== dictionary, ");
              if( typeof password_plaintext !== 'string')
                  throw new Error("password string is required")

              let brainkey_backup_date
              if(brainkey_plaintext) {
                  if(typeof brainkey_plaintext !== "string")
                      throw new Error("Brainkey must be a string")

                  if(brainkey_plaintext.trim() === "")
                      throw new Error("Brainkey can not be an empty string")

                  if(brainkey_plaintext.length < 50)
                      throw new Error("Brainkey must be at least 50 characters long")

                  // The user just provided the Brainkey so this avoids
                  // bugging them to back it up again.
                  brainkey_backup_date = new Date()
              }
              let password_aes = Aes.fromSeed( password_plaintext )

              let encryption_buffer = key.get_random_key().toBuffer()
              // encryption_key is the global encryption key (does not change even if the passsword changes)
              let encryption_key = password_aes.encryptToHex( encryption_buffer )
              // If unlocking, local_aes_private will become the global aes_private object
              let local_aes_private = Aes.fromSeed( encryption_buffer )

              if( ! brainkey_plaintext)
                  brainkey_plaintext = key.suggest_brain_key(dictionary.en)
              else
                  brainkey_plaintext = key.normalize_brainKey(brainkey_plaintext)
              let brainkey_private = this.getBrainKeyPrivate( brainkey_plaintext )
              let brainkey_pubkey = brainkey_private.toPublicKey().toPublicKeyString()
              let encrypted_brainkey = local_aes_private.encryptToHex( brainkey_plaintext )

              let password_private = PrivateKey.fromSeed( password_plaintext )
              let password_pubkey = password_private.toPublicKey().toPublicKeyString()

              let wallet = {
                  public_name,
                  password_pubkey,
                  encryption_key,
                  encrypted_brainkey,
                  brainkey_pubkey,
                  brainkey_sequence: 0,
                  brainkey_backup_date,
                  created: new Date(),
                  last_modified: new Date(),
                  chain_id: Apis.instance().chain_id
              }

              //console.log("++++++[wallet.box.js]::onSetWallet - ", wallet);
              //resolve(wallet);
              restore({wallet_name: wallet.public_name, wallet_object: wallet});

              //WalletTcomb(wallet) // validation
              //let transaction = this.transaction_update()
              let add; // = idb_helper.add( transaction.objectStore("wallet"), wallet )
              let end; // = idb_helper.on_transaction_end(transaction).then( () => {
                  //this.state.wallet = wallet
                  //this.setState({ wallet })
                  if(unlock) {
                      aes_private = local_aes_private;
                      //WalletUnlockActions.unlock();
                  }
              //})
              Promise.all([ add, end ]).then(() => {
                  resolve();
              }).catch(err => {
                  reject(err);
              })
          })
      };

      if (1) { //__ELECTRON__) {
          return walletCreateFct(dictJson).then(res => {
          	callback(res);
          	console.log("--------------------- wallet ret rest - ", res);
          });
      } else {

          let dictionaryPromise = brainkey_plaintext ? null : fetch(`${__BASE_URL__}/dictionary.json`);
          return Promise.all([
              dictionaryPromise
          ]).then(res => {
              return brainkey_plaintext ? walletCreateFct(null) :
                  res[0].json().then(walletCreateFct);
          }).catch(err => {
              console.log("unable to fetch dictionary.json", err);
          });
      }
  }



}

export default new WalletBox();