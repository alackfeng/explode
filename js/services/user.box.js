
import { FetchChain } from 'assetfunjs/es';

import WalletDb from './WalletDb';
import ApplicationApi from './ApplicationApi';

import { faucetAddress as faucet_address } from '../env';


const application_api = new ApplicationApi();


const TRACE = false;

class UsersBox {
  constructor() {
    console.log('=====[users.box.js]::constructor - call ');
  }

  /*
  * call api create account use password
  */
  createAccountWithPassword = (login, {
    username, password, registrar, referrer, referrer_percent, refcode,
  }) => {
    if (login !== username) {
      console.error(
        '=====[users.box.js]::createAccountWithPassword - wrong username : ',
        login, username
      );
      throw new Error(JSON.stringify({ err_no: 11011, err_msg: 'call register param wrong' }));
    }

    const account_name = username;
    const { privKey: owner_private } =
      WalletDb.generateKeyFromPassword(account_name, 'owner', password);
    const { privKey: active_private } =
      WalletDb.generateKeyFromPassword(account_name, 'active', password);

    console.log(
      '=====[users.box.js]::createAccountWithPassword - create account:',
      account_name, active_private.toWif()
    );
    console.log(
      '=====[users.box.js]::createAccountWithPassword - new active pubkey',
      active_private.toPublicKey().toPublicKeyString()
    );
    console.log(
      '=====[users.box.js]::createAccountWithPassword - new owner pubkey',
      owner_private.toPublicKey().toPublicKeyString()
    );

    // return new Promise((resolve, reject) => {
    const create_account = () => {
      return application_api.create_account(
        owner_private.toPublicKey().toPublicKeyString(),
        active_private.toPublicKey().toPublicKeyString(),
        account_name,
        registrar, // registrar_id,
        referrer, // referrer_id,
        referrer_percent, // referrer_percent,
        true // broadcast
      ).then((tr) => {
        console.log('=====[users.box.js]::createAccountWithPassword - transaction: ', tr);
        return WalletDb.process_transaction(
          tr,
          null, // signer_private_keys,
          true
        ).then((res) => {
          console.log(
            '=====[users.box.js]::createAccountWithPassword - process_transaction then',
            res
          );
          // 设置到WalletDb
          return {
            response: res,
            extra: {
              privateKey: {
                privKey: active_private.toWif(),
                pubKey: active_private.toPublicKey().toPublicKeyString(),
              },
              currentAccount: account_name,
            },
          };
        }).catch((err) => {
          console.log(
            '=====[users.box.js]::createAccountWithPassword - process_transaction catch',
            err
          );
          // Promise.reject(err);
          return { response: null, error: err || 'Something bad happened' };
        });
        // resolve;
      }).catch(Promise.reject);
    };

    if (registrar) {
      // using another user's account as registrar
      return create_account();
    }
    else {
      // using faucet

      // faucet_address 可通过WalletDb去取配置，
      let faucetAddress = faucet_address; // SettingsStore.getSetting("faucet_address");
      if (window && window.location && window.location.protocol === 'https:') {
        faucetAddress = faucetAddress.replace(/http:\/\//, 'https://');
      }

      const create_account_promise = fetch(`${faucetAddress}/api/v1/accounts`, {
        method: 'post',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          'account': {
            'name': account_name,
            'owner_key': owner_private.toPublicKey().toPublicKeyString(),
            'active_key': active_private.toPublicKey().toPublicKeyString(),
            'memo_key': active_private.toPublicKey().toPublicKeyString(),
            // "memo_key": memo_private.private_key.toPublicKey().toPublicKeyString(),
            'refcode': refcode,
            'referrer': referrer,
          },
        }),
      }).then(r => r.json().then((res) => {
        if (TRACE) console.log('=====[users.box.js]::createAccountWithPassword -  res, ', res);
        if (!res || (res && res.error)) {
          return Promise.reject(res.error);
        }
        else {
          return Promise.resolve(res);
        }
      })); // /.catch(Promise.reject);

      return create_account_promise.then((result) => {
        if (TRACE) console.log('=====[users.box.js]::createAccountWithPassword - result, ', result);

        if (result && result.error) {
          return Promise.reject(result.error);
        }
        else {
          return Promise.resolve(result);
        }
      }).then(result => ({ response: result })).catch((error) => {
        if (TRACE) console.log('=====[users.box.js]::createAccountWithPassword - error, ', error);
        return { response: null, error: error || 'Something bad happened' };
      });
    }
    // });
  }


  loginUser = (username, password) => {
    const account_name = username;
    console.log('=====[users.box.js]::loginUser - param: ', account_name);

    const timeout = 19000;
    return FetchChain('getAccount', username, timeout).then((ret) => {
      console.log('=====[users.box.js]::loginUser - : getAccount is : ', ret);

      let result = null;
      let error = null;
      const validPassword = WalletDb.validatePassword(password, true, username);
      if (validPassword) {
        console.log('=====[users.box.js]::loginUser - : validPassword', validPassword);
        WalletDb.setPasswordKeys((keys) => {
          result = keys;
        });
        // result = {private: validPassword, username: username};
        return { response: 'ok', error, extradata: result };
      }
      else {
        console.error('=====[users.box.js]::loginUser - : validPassword', validPassword);
        error = { id: 1200003, message: 'invalid password' };
      }

      return { response: null, error, extradata: result };
    }).catch((error) => {
      console.error('=====[users.box.js]::loginUser - : getAccount is : err ', error);
      return { response: null, error: error || 'Something bad happened' };
    });
  }
}

export default new UsersBox();

