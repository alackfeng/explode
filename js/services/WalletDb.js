
import { ChainStore, PrivateKey, key, Aes } from 'assetfunjs/es';
import { Apis } from 'assetfunjs-ws'; // eslint-disable-line import/no-extraneous-dependencies


let aes_private = null;
let _passwordKey = null;

const TRACE = false;

/* eslint class-methods-use-this: ["error",
  { "exceptMethods": ["broadcast_second_confirm", "onLock", "isLocked", "loadDbData"] }]
*/

class WalletDB {
  constructor() {
    if (TRACE) console.log('=====[WalletDB]::constructor - call ');

    this.state = {
      auth: {},
      keys: {},
    };

    this.confirm_transactions = true; // second confirm

    this.saveKeys = this.saveKeys.bind(this);
    this.unLock = this.unLock.bind(this);
  }

  broadcast_second_confirm(tr, broadcast_callback = () => null) {
    console.log('=====[WalletDB]::broadcast_second_confirm - call ', tr);
    return tr.broadcast(broadcast_callback);
  }

  process_transaction(tr, signer_pubkeys, broadcast, second_confirm = true, extra_keys = []) {
    const passwordLogin = true; // state.enter.isAuthenticated ;
    // SettingsStore.getState().settings.get("passwordLogin");

    console.log(
      '=====[WalletDb.js]::process_transaction - passwordLogin : ',
      Apis.instance().chain_id, passwordLogin
    );

    if (!passwordLogin && Apis.instance().chain_id !== this.state.auth.chain_id) {
      return Promise.reject(`Mismatched chain_id; expecting ${
        this.state.auth.chain_id}, but got ${
        Apis.instance().chain_id}`);
    }

    if (this.isLocked()) throw new Error('wallet locked');

    // return WalletUnlockActions.unlock().then( () => {
    // AccountActions.tryToSetCurrentAccount();
    return Promise.all([
      tr.set_required_fees(),
      tr.update_head_block(),
    ]).then(() => {
      const signer_pubkeys_added = {};
      if (signer_pubkeys) {
        // Balance claims are by address, only the private
        // key holder can know about these additional
        // potential keys.
        const pubkeys = []; // PrivateKeyStore.getPubkeys_having_PrivateKey(signer_pubkeys)
        if (!pubkeys.length) {
          throw new Error('Missing signing key');
        }

        for (const pubkey_string of pubkeys) {
          const private_key = this.getPrivateKey(pubkey_string);
          tr.add_signer(private_key, pubkey_string);
          signer_pubkeys_added[pubkey_string] = true;
        }
      }

      return tr.get_potential_signatures().then(({ pubkeys, addys }) => {
        console.log(
          '=====[WalletDb.js]::process_transaction - get_potential_signatures: ',
          { pubkeys, addys }
        );

        const my_pubkeys = pubkeys;
        // PrivateKeyStore.getPubkeys_having_PrivateKey(pubkeys.concat(extra_keys), addys);

        // {//Testing only, don't send All public keys!
        //   let pubkeys_all = PrivateKeyStore.getPubkeys() // All public keys
        //    tr.get_required_signatures(pubkeys_all).then( required_pubkey_strings =>
        //      console.log('get_required_signatures all\t',required_pubkey_strings.sort(), pubkeys_all))
        //    tr.get_required_signatures(my_pubkeys).then( required_pubkey_strings =>
        //      console.log('get_required_signatures normal\t',required_pubkey_strings.sort(), pubkeys))
        // }
        return tr.get_required_signatures(my_pubkeys).then((required_pubkeys) => {
          for (const pubkey_string of required_pubkeys) {
            if (signer_pubkeys_added[pubkey_string]) continue;
            const private_key = this.getPrivateKey(pubkey_string);
            if (!private_key)
            // This should not happen, get_required_signatures will only
            // returned keys from my_pubkeys
            {
              throw new Error(`Missing signing key for ${pubkey_string}`);
            }
            console.log(
              '=====[WalletDb.js]::process_transaction - private_key : ',
              private_key, pubkey_string
            );
            tr.add_signer(private_key, pubkey_string);
          }
        });
      }).then(() => {
        if (broadcast) {
          if (second_confirm && this.confirm_transactions) {
            // let p = new Promise((resolve, reject) => {
            //    ; //TransactionConfirmActions.confirm(tr, resolve, reject)
            // })
            return Promise.resolve(tr);
          }
          else {
            return tr.broadcast();
          }
        }
        else {
          return tr.serialize();
        }
      });
    });
    // })
  }

  onLock() {
    _passwordKey = null;
    aes_private = null;
  }

  isLocked() {
    return !(!!aes_private || !!_passwordKey);
  }

  unLock(user, extra) {
    console.log('=====[WalletDb.js]::unLock - : ', user, extra);

    const { username, password, type } = extra;

    let res = null;

    if (type === 'unlock') {
      if (user.username !== username || !password) {
        return { error: 'unlock error, username not equre' };
      }

      const auth_user_object = user.authAccount;

      // 密码有效性
      const password_private = PrivateKey.fromSeed(password);
      const password_pubkey = password_private.toPublicKey().toPublicKeyString();
      if (auth_user_object.password_pubkey !== password_pubkey) {
        return { error: 'unlock false, invalid password' };
      }

      // 设置缓存
      console.log('=====[WalletDb.js]::unLock - auth_user_object : ', auth_user_object);
      this.state.auth = {
        username: auth_user_object.username,
        chain_id: auth_user_object.chain_id,
        encryption_key: auth_user_object.encryption_key,
        password_pubkey: auth_user_object.password_pubkey,
      };
      this.state.keys = auth_user_object.keys;

      // 解锁账号，
      const password_aes = Aes.fromSeed(password);
      const encryption_plainbuffer
        = password_aes.decryptHexToBuffer(auth_user_object.encryption_key);
      aes_private = Aes.fromSeed(encryption_plainbuffer);
      res = 'unlock success';
    }
    else {
      this.onLock();
      res = 'lock success';
    }

    console.log(
      '=====[WalletDb.js]::unLock - : ', type,
      this.state.auth, this.state.keys, aes_private
    );
    return { response: res };
  }


  decryptTcomb_PrivateKey(private_key_tcomb) {
    if (!private_key_tcomb) return null;
    if (this.isLocked()) throw new Error('wallet locked');
    if (_passwordKey && _passwordKey[private_key_tcomb.pubkey]) {
      return _passwordKey[private_key_tcomb.pubkey];
    }
    const private_key_hex = aes_private.decryptHex(private_key_tcomb); // .encrypted_key)
    return PrivateKey.fromBuffer(new Buffer(private_key_hex, 'hex'));
  }

  getTcomb_byPubkey(public_key) {
    if (!public_key) return null;
    if (public_key.Q) {
      public_key = public_key.toPublicKeyString();
    }
    console.log('=====[WalletDb.js]::createAccountWithPassword - getTcomb_byPubkey : ', public_key);
    return this.state.keys[public_key];
  }

  /** @return ecc/PrivateKey or null */
  getPrivateKey(public_key) {
    if (this.isLocked()) throw new Error('wallet locked');
    if (_passwordKey) return _passwordKey[public_key];
    if (!public_key) return null;
    if (public_key.Q) public_key = public_key.toPublicKeyString();
    const private_key_tcomb = this.getTcomb_byPubkey(public_key);
    if (!private_key_tcomb) return null;
    return this.decryptTcomb_PrivateKey(private_key_tcomb);
  }

  /*
  * inner call
  */
  generateKeyFromPassword = (accountName, role, password) => {
    const seed = accountName + role + password;
    const privKey = PrivateKey.fromSeed(seed);
    const pubKey = privKey.toPublicKey().toString();

    return { privKey, pubKey };
  }

  setPasswordKeys(passwordKeyCall) {
    if (_passwordKey && passwordKeyCall) {
      passwordKeyCall(_passwordKey);
      _passwordKey = null;
    }
  }
  /** This also serves as 'unlock' */
  validatePassword(password, unlock = false, account = null, roles = ['active', 'owner', 'memo']) {
    if (account) {
      let id = 0;
      _passwordKey = null; // 临时用于保存keys，

      function setKey(role, priv, pub) {
        if (!_passwordKey) _passwordKey = {};
        _passwordKey[pub] = priv;

        console.log('=====[WalletDb.js]::validatePassword - setKey > ', id, role, priv, pub);
        id++;
        /* PrivateKeyStore.setPasswordLoginKey({
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
      }
      catch (err) {

      }
      const acc = ChainStore.getAccount(account);
      let key;
      if (fromWif) {
        key = { privKey: fromWif, pubKey: fromWif.toPublicKey().toString() };
      }

      /* Test the pubkey for each role against either the wif key, or the password generated keys */
      roles.forEach((role) => {
        if (!fromWif) {
          key = this.generateKeyFromPassword(account, role, password);
        }

        let foundRole = false;

        if (acc) {
          if (role === 'memo') {
            if (acc.getIn(['options', 'memo_key']) === key.pubKey) {
              setKey(role, key.privKey, key.pubKey);
              foundRole = true;
            }
          }
          else {
            acc.getIn([role, 'key_auths']).forEach((auth) => {
              if (auth.get(0) === key.pubKey) {
                setKey(role, key.privKey, key.pubKey);
                foundRole = true;
                return false;
              }
            });

            if (!foundRole) {
              const alsoCheckRole = role === 'active' ? 'owner' : 'active';
              acc.getIn([alsoCheckRole, 'key_auths']).forEach((auth) => {
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

      return !!_passwordKey;
    }
    else {
      const wallet = this.state.auth;
      try {
        const password_private = PrivateKey.fromSeed(password);
        const password_pubkey = password_private.toPublicKey().toPublicKeyString();
        if (wallet.password_pubkey !== password_pubkey) return false;
        if (unlock) {
          const password_aes = Aes.fromSeed(password);
          const encryption_plainbuffer = password_aes.decryptHexToBuffer(wallet.encryption_key);
          aes_private = Aes.fromSeed(encryption_plainbuffer);
        }
        return true;
      }
      catch (e) {
        console.error(e);
        return false;
      }
    }
  }

  /* changePassword(old_password, new_password, unlock = false) {

  } */

  saveKeys(username, password, extra) {
    console.log('=====[WalletDb.js]::saveKeys - ', username, password, extra);

    // 加密私钥
    const password_aes = Aes.fromSeed(password);
    const encryption_buffer = key.get_random_key().toBuffer();
    const encryption_key = password_aes.encryptToHex(encryption_buffer);
    const local_aes_private = Aes.fromSeed(encryption_buffer);

    const password_private = PrivateKey.fromSeed(password);
    const password_pubkey = password_private.toPublicKey().toPublicKeyString();

    const keys = {};

    // 登录时已经验证有效密码，返回的extra
    if (extra && Object.keys(extra) && Object.keys(extra).length) {
      console.log('=====[WalletDb.js]::saveKeys - ACCOUNT extra :', extra);

      Object.keys(extra).forEach((key_) => {
        keys[key_] = local_aes_private.encryptToHex(extra[key_].toBuffer());
      });
    }
    else {
      // 注册时通过密码保存的
      const account_name = username;
      const { privKey: owner_private }
        = wallet_db.generateKeyFromPassword(account_name, 'owner', password);
      const { privKey: active_private }
        = wallet_db.generateKeyFromPassword(account_name, 'active', password);

      console.log(
        '=====[WalletDb.js]::saveKeys - ACCOUNT :', account_name,
        '\n', active_private.toWif(),
        '\n', active_private.toPublicKey().toPublicKeyString(),
        '\n', owner_private.toPublicKey().toPublicKeyString()
      );

      keys[owner_private.toPublicKey().toPublicKeyString()]
        = local_aes_private.encryptToHex(owner_private.toBuffer());
      keys[active_private.toPublicKey().toPublicKeyString()]
        = local_aes_private.encryptToHex(active_private.toBuffer());
    }


    const auth_user_object = {
      username,
      chain_id: Apis.instance().chain_id,
      encryption_key,
      password_pubkey,
      keys,
    };

    // 缓存到本地
    console.log('+++++++++++++++++++++= ', this, wallet_db);
    wallet_db.state.auth = {
      username: auth_user_object.username,
      chain_id: auth_user_object.chain_id,
      encryption_key: auth_user_object.encryption_key,
      password_pubkey: auth_user_object.password_pubkey,
    };
    wallet_db.state.keys = keys;

    console.log('+++++++++++++++++++++= ', this, wallet_db);

    aes_private = local_aes_private; // 要改成多账号模式，


    return { auth: auth_user_object };
  }

  /* saveKey(private_key, account_names, public_key_string) {

  } */

  /*
   * 初始化store数据到内存中，如privkey
  */
  loadDbData(data) {
    return data;
  }
}

const wallet_db = new WalletDB();
export default wallet_db;

