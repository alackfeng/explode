
import {
  Aes, ChainValidation, TransactionBuilder, TransactionHelper,
  FetchChain,
} from 'assetfunjs/es';
import WalletDb from './WalletDb';


/* eslint class-methods-use-this: ["error", { "exceptMethods":
  ["create_account", "transfer", "issue_asset"] }]
*/
class ApplicationApi {
  create_account(
    owner_pubkey,
    active_pubkey,
    new_account_name,
    registrar,
    referrer,
    referrer_percent
    // broadcast = false
  ) {
    ChainValidation.required(registrar, 'registrar_id');
    ChainValidation.required(referrer, 'referrer_id');

    console.log('=====[ApplicationApi.js]::create_account ------------ ');
    // return new Promise((resolve, reject) => {
    return Promise.all([
      FetchChain('getAccount', registrar),
      FetchChain('getAccount', referrer),
    ]).then((res) => {
      const [chain_registrar, chain_referrer] = res;
      console.log('=====[ApplicationApi.js]::create_account ------------ ', res);

      const tr = new TransactionBuilder();
      tr.add_type_operation('account_create', {
        fee: {
          amount: 0,
          asset_id: 0,
        },
        'registrar': chain_registrar.get('id'),
        'referrer': chain_referrer.get('id'),
        'referrer_percent': referrer_percent,
        'name': new_account_name,
        'owner': {
          'weight_threshold': 1,
          'account_auths': [],
          'key_auths': [[owner_pubkey, 1]],
          'address_auths': [],
        },
        'active': {
          'weight_threshold': 1,
          'account_auths': [],
          'key_auths': [[active_pubkey, 1]],
          'address_auths': [],
        },
        'options': {
          'memo_key': active_pubkey,
          'voting_account': '1.2.5',
          'num_witness': 0,
          'num_committee': 0,
          'votes': [],
        },
      });

      return tr; // 返回交易对象，再确认提交

      /* return WalletDb.process_transaction(
                tr,
                null, //signer_private_keys,
                broadcast
            ).then((res) => {
                console.log("process_transaction then", res);
                resolve();
            }).catch(err => {
                console.log("process_transaction catch", err);
                reject(err);
            }); */
    });
    // });
  }

  /**
    @param propose_account (or null) pays the fee to create the proposal, also used as memo from
  */
  transfer({ // OBJECT: { ... }
    from_account,
    to_account,
    amount,
    asset,
    memo,
    broadcast = true,
    encrypt_memo = true,
    optional_nonce = null,
    propose_account = null,
    fee_asset_id = '1.3.0',
  }) {
    const memo_sender = propose_account || from_account;

    // let unlock_promise = WalletUnlockActions.unlock();
    // 临时加载私钥，要提取到锁级别验证
    // WalletDb.validatePassword("1", true, "feng1");
    // if( WalletDb.isLocked() ) throw new Error("wallet locked");

    return Promise.all([
      FetchChain('getAccount', from_account),
      FetchChain('getAccount', to_account),
      FetchChain('getAccount', memo_sender),
      FetchChain('getAccount', propose_account),
      FetchChain('getAsset', asset),
      FetchChain('getAsset', fee_asset_id),
      // unlock_promise
    ]).then((res) => {
      const [
        chain_from, chain_to, chain_memo_sender, chain_propose_account,
        chain_asset, chain_fee_asset,
      ] = res;

      let memo_from_public;
      let memo_to_public;
      if (memo && encrypt_memo) {
        memo_from_public = chain_memo_sender.getIn(['options', 'memo_key']);

        // The 1s are base58 for all zeros (null)
        if (/111111111111111111111/.test(memo_from_public)) {
          memo_from_public = null;
        }

        memo_to_public = chain_to.getIn(['options', 'memo_key']);
        if (/111111111111111111111/.test(memo_to_public)) {
          memo_to_public = null;
        }
      }

      const propose_acount_id = propose_account ? chain_propose_account.get('id') : null;

      let memo_from_privkey;
      if (encrypt_memo && memo) {
        memo_from_privkey = WalletDb.getPrivateKey(memo_from_public);

        if (!memo_from_privkey) {
          throw new Error(`Missing private memo key for sender: ${memo_sender}`);
        }
      }

      let memo_object;
      if (memo && memo_to_public && memo_from_public) {
        const nonce = optional_nonce == null ?
          TransactionHelper.unique_nonce_uint64() :
          optional_nonce;

        let memo_message;
        if (encrypt_memo) {
          memo_message = Aes.encrypt_with_checksum(
            memo_from_privkey,
            memo_to_public,
            nonce,
            memo
          );
        }
        else if (Buffer.isBuffer(memo)) {
          memo_message = memo.toString('utf-8');
        }
        else {
          memo_message = memo;
        }

        memo_object = {
          from: memo_from_public,
          to: memo_to_public,
          nonce,
          message: memo_message,
        };
      }
      // Allow user to choose asset with which to pay fees #356
      const fee_asset = chain_fee_asset.toJS();

      let fee_asset_id_ = fee_asset_id;
      // Default to CORE in case of faulty core_exchange_rate
      if (fee_asset.options.core_exchange_rate.base.asset_id === '1.3.0' &&
                fee_asset.options.core_exchange_rate.quote.asset_id === '1.3.0') {
        fee_asset_id_ = '1.3.0';
      }

      const tr = new TransactionBuilder();
      const transfer_op = tr.get_type_operation('transfer', {
        fee: {
          amount: 0,
          asset_id: fee_asset_id_,
        },
        from: chain_from.get('id'),
        to: chain_to.get('id'),
        amount: { amount, asset_id: chain_asset.get('id') },
        memo: memo_object,
      });

      return tr.update_head_block().then(() => {
        if (propose_account) {
          tr.add_type_operation('proposal_create', {
            proposed_ops: [{ op: transfer_op }],
            fee_paying_account: propose_acount_id,
          });
        }
        else {
          tr.add_operation(transfer_op);
        }

        // 返回签名的交易对象，再二次确认提交 //return tr;
        return WalletDb.process_transaction(
          tr,
          null, // signer_private_keys,
          broadcast
          // true, or false, for second confirm
        );
      });
    });
  }


  issue_asset(
    to_account,
    from_account,
    asset_id,
    amount,
    memo,
    encrypt_memo = true,
    optional_nonce = null
  ) {
    // const unlock_promise = WalletUnlockActions.unlock();

    return Promise.all([
      FetchChain('getAccount', from_account),
      FetchChain('getAccount', to_account),
      // unlock_promise,
    ]).then((res) => {
      const [chain_memo_sender, chain_to] = res;

      let memo_from_public;
      let memo_to_public;
      if (memo && encrypt_memo) {
        memo_from_public = chain_memo_sender.getIn(['options', 'memo_key']);

        // The 1s are base58 for all zeros (null)
        if (/111111111111111111111/.test(memo_from_public)) {
          memo_from_public = null;
        }

        memo_to_public = chain_to.getIn(['options', 'memo_key']);
        if (/111111111111111111111/.test(memo_to_public)) {
          memo_to_public = null;
        }
      }

      let memo_from_privkey;
      if (encrypt_memo && memo) {
        // memo_from_privkey = WalletDb.getPrivateKey(memo_from_public);

        if (!memo_from_privkey) {
          throw new Error(`Missing private memo key for sender: ${from_account}`);
        }
      }

      let memo_object;
      if (memo && memo_to_public && memo_from_public) {
        const nonce = optional_nonce == null ?
          TransactionHelper.unique_nonce_uint64() :
          optional_nonce;


        let memo_message;
        if (encrypt_memo) {
          memo_message = Aes.encrypt_with_checksum(
            memo_from_privkey,
            memo_to_public,
            nonce,
            memo
          );
        }
        else if (Buffer.isBuffer(memo)) {
          memo_message = memo.toString('utf-8');
        }
        else {
          memo_message = memo;
        }

        memo_object = {
          from: memo_from_public,
          to: memo_to_public,
          nonce,
          message: memo_message,
        };
      }

      const tr = new TransactionBuilder();
      tr.add_type_operation('asset_issue', {
        fee: {
          amount: 0,
          asset_id: 0,
        },
        issuer: from_account,
        asset_to_issue: {
          amount,
          asset_id,
        },
        issue_to_account: to_account,
        memo: memo_object,
      });

      return tr; // 返回交易对象，再确认提交

      /* return WalletDb.process_transaction(tr, null, true) */
    });
  }
}

export default ApplicationApi;
