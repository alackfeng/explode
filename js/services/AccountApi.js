import { Apis } from "assetfunjs-ws";

class AccountApi {

	lookupAccounts(startChar, limit) {
		console.log("[AccountApi.js]::lookupAccounts - ", startChar);
		
		return Apis.instance().db_api().exec("lookup_accounts", [
			startChar, limit
		]);
	}
}

export default new AccountApi();