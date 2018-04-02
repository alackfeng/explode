import { Apis } from 'assetfunjs-ws';
import idb_helper from './idb-helper';
import iDBRoot from './idb-root';

const DB_VERSION = 1; // Initial value was 1
const DB_PREFIX = 'assetfun_v1';
const WALLET_BACKUP_STORES = [
  'wallet', 'private_keys', 'linked_accounts',
];

let current_wallet_name = 'default';

const upgrade = function (db, oldVersion) {
  // DEBUG console.log('... upgrade oldVersion',oldVersion)
  if (oldVersion === 0) {
    db.createObjectStore('wallet', { keyPath: 'public_name' });
    idb_helper.autoIncrement_unique(db, 'private_keys', 'pubkey');
    db.createObjectStore('linked_accounts', { keyPath: 'name' });
  }
  if (oldVersion < 2) {
    // Cache only, do not backup...
    db.createObjectStore('cached_properties', { keyPath: 'name' });
  }
};

/**
    Everything in this class is scopped by the database name.  This separates
    data per-wallet and per-chain.
*/
const getDatabaseName = function (
  current_wallet = current_wallet_name,
  chain_id = Apis.instance().chain_id
) {
  return [
    DB_PREFIX,
    chain_id ? chain_id.substring(0, 6) : '',
    current_wallet,
  ].join('_');
};

const openDatabase = function (database_name = this.getDatabaseName()) {
  return new Promise((resolve, reject) => {
    const openRequest = iDB.impl.open(database_name, DB_VERSION);

    openRequest.onupgradeneeded = function (e) {
      // DEBUG console.log('... openRequest.onupgradeneeded ' + database_name)
      // Don't resolve here, indexedDb will call onsuccess or onerror next
      upgrade(e.target.result, e.oldVersion);
    };

    openRequest.onsuccess = function (e) {
      // DEBUG console.log('... openRequest.onsuccess ' + database_name, e.target.result)
      const db = e.target.result;
      iDB.database_name = database_name;
      idb_helper.set_graphene_db(db);
      resolve(db);
    };

    openRequest.onerror = function (e) {
      // DEBUG console.log("... openRequest.onerror " + database_name,e.target.error, e)
      reject(e.target.error);
    };
  });
};

var iDB = (function () {
  let _instance;
  let idb;

  /** Be carefull not to call twice especially for a new database
       needing an upgrade...
    */
  function openIndexedDB(chain_id) {
    return iDB.root.getProperty('current_wallet', 'default').then((current_wallet) => {
      current_wallet_name = current_wallet;
      const database_name = getDatabaseName(current_wallet, chain_id);
      return openDatabase(database_name);
    });
  }

  function init(chain_id) {
    const promise = openIndexedDB(chain_id);
    promise.then((db) => {
      idb = db;
    });
    return {
      init_promise: promise,
      db: () => idb,
    };
  }

  return {
    WALLET_BACKUP_STORES,
    getDatabaseName,
    getCurrentWalletName: () => current_wallet_name,
    deleteDatabase(are_you_sure = false) {
      if (!are_you_sure) return 'Are you sure?';
      console.log('deleting', this.database_name);
      const req = iDB.impl.deleteDatabase(this.database_name);
      return req.result;
    },

    set_impl(impl) {
      this.impl = impl;
      this.root = new iDBRoot(this.impl);
    },

    set_chain_id(chain_id) {
      this.chain_id = chain_id;
      const chain_substring = chain_id ? chain_id.substring(0, 6) : '';
      this.root.setDbSuffix(`_${chain_substring}`);
    },

    init_instance(
      indexedDBimpl,
      chain_id = Apis.instance().chain_id
    ) {
      if (!_instance) {
        if (indexedDBimpl) {
          this.set_impl(indexedDBimpl);
          if ('__useShim' in indexedDBimpl) {
            this.impl.__useShim(); // always use shim
          }
        }
        this.set_chain_id(chain_id);
        _instance = init(chain_id);
      }
      return _instance;
    },

    instance() {
      if (!_instance) {
        throw new Error('Internal Database instance is not initialized');
      }
      return _instance;
    },

    close() {
      if (_instance) _instance.db().close();
      idb_helper.set_graphene_db(null);
      _instance = undefined;
    },

    add_to_store(store_name, value) {
      return new Promise((resolve, reject) => {
        const transaction = this.instance().db().transaction([store_name], 'readwrite');
        const store = transaction.objectStore(store_name);
        const request = store.add(value);
        request.onsuccess = () => {
          resolve(value);
        };
        request.onerror = (e) => {
          console.log("ERROR!!! add_to_store - can't store value in db. ", e.target.error.message, value);
          reject(e.target.error.message);
        };
      });
    },
    remove_from_store(store_name, value) {
      return new Promise((resolve, reject) => {
        const transaction = this.instance().db().transaction([store_name], 'readwrite');
        const store = transaction.objectStore(store_name);
        const request = store.delete(value);
        request.onsuccess = () => {
          resolve();
        };
        request.onerror = (e) => {
          console.log("ERROR!!! remove_from_store - can't remove value from db. ", e.target.error.message, value);
          reject(e.target.error.message);
        };
      });
    },
    load_data(store_name) {
      return new Promise((resolve, reject) => {
        const data = [];
        const transaction = this.instance().db().transaction([store_name], 'readonly');
        const store = transaction.objectStore(store_name);
        const request = store.openCursor();
        // request.oncomplete = () => { resolve(data); };
        request.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            data.push(cursor.value);
            cursor.continue();
          }
          else {
            resolve(data);
          }
        };
        request.onerror = (e) => {
          console.log("ERROR!!! open_store - can't get '`${store_name}`' cursor. ", e.target.error.message);
          reject(e.target.error.message);
        };
      });
    },

    /** Persisted to disk but not backed up.
            @return promise
        */
    getCachedProperty(name, default_value) {
      const db = this.instance().db();
      const transaction = db.transaction(['cached_properties'], 'readonly');
      const store = transaction.objectStore('cached_properties');
      return idb_helper.on_request_end(store.get(name)).then((event) => {
        const result = event.target.result;
        return result ? result.value : default_value;
      }).catch((error) => {
        console.error(error); throw error;
      });
    },

    /** Persisted to disk but not backed up. */
    setCachedProperty(name, value) {
      const db = this.instance().db();
      const transaction = db.transaction(['cached_properties'], 'readwrite');
      const store = transaction.objectStore('cached_properties');
      if (value && value.toJS) value = value.toJS(); // Immutable-js
      return idb_helper.on_request_end(store.put({ name, value }))
        .catch((error) => {
          console.error(error); throw error;
        });
    },

    backup(store_names = WALLET_BACKUP_STORES) {
      const promises = [];
      for (const store_name of store_names) {
        promises.push(this.load_data(store_name));
      }
      // Add each store name
      return Promise.all(promises).then((results) => {
        const obj = {};
        for (let i = 0; i < store_names.length; i++) {
          const store_name = store_names[i];
          if (store_name === 'wallet') {
            const wallet_array = results[i];
            // their should be only 1 wallet per database
            for (const wallet of wallet_array) {
              wallet.backup_date = new Date().toISOString();
            }
          }
          obj[store_name] = results[i];
        }
        return obj;
      });
    },
    restore(wallet_name, object) {
      const database_name = getDatabaseName(wallet_name);
      return openDatabase(database_name).then((db) => {
        const store_names = Object.keys(object);
        const trx = db.transaction(store_names, 'readwrite');
        for (const store_name of store_names) {
          const store = trx.objectStore(store_name);
          const records = object[store_name];
          for (const record of records) {
            store.put(record);
          }
        }
        return idb_helper.on_transaction_end(trx);
      });
    },
  };
}());

export default iDB;
