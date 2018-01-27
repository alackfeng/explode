import { Apis } from "assetfunjs-ws";

class AccountApi {

	lookupAccounts(startChar, limit) {
		
		return Apis.instance().db_api().exec("lookup_accounts", [
			startChar, limit
		]);
	}
}

export default AccountApi;