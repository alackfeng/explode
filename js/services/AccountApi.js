import { Apis } from 'assetfunjs-ws'; // eslint-disable-line import/no-extraneous-dependencies

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["lookupAccounts"] }] */
class AccountApi {
  lookupAccounts(startChar, limit) {
    console.log('[AccountApi.js]::lookupAccounts - ', startChar);

    return Apis.instance().db_api().exec('lookup_accounts', [
      startChar, limit,
    ]);
  }
}

export default new AccountApi();
