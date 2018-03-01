

import { action, createRequestTypes, REQUEST, SUCCESS, FAILURE, EVENT  } from "./types";
import AccountApi from "../services/AccountApi";


// users action type
export const USERS_LOGIN 		= createRequestTypes('USERS_LOGIN');
export const USERS_REGISTER = createRequestTypes('USERS_REGISTER');
export const USERS_UNLOCK		= createRequestTypes('USERS_UNLOCK');

export const TRIGGER_USERS_LOGIN			= 'TRIGGER_USERS_LOGIN';
export const TRIGGER_USERS_REGISTER		= 'TRIGGER_USERS_REGISTER';
export const TRIGGER_USERS_UNLOCK			= 'TRIGGER_USERS_UNLOCK';

export const LOAD_USERS 							= 'LOAD_USERS';
export const RESET_TRIGGER_USERS 			= 'RESET_TRIGGER_USERS';

export const SEARCH_ACCOUNT 					= 'SEARCH_ACCOUNT';

/*
// users relation action call
user 相关action触发调用
*/

export const userRegister = {
	request: (username, regInfo) => (
		action(USERS_REGISTER[REQUEST], {username, regInfo})),
	success: (username, response) => action(USERS_REGISTER[SUCCESS], {username, response}),
	failure: (username, error) => action(USERS_REGISTER[FAILURE], {username, error}),
	notify: (username, event) => action(USERS_REGISTER[EVENT], {username, event}),
}

export const userLogin = {
	request: (username, password) => (
		action(USERS_LOGIN[REQUEST], {username, password})),
	success: (username, response) => action(USERS_LOGIN[SUCCESS], {username, response}),
	failure: (username, error) => action(USERS_LOGIN[FAILURE], {username, error}),
	notify: (username, event) => action(USERS_LOGIN[EVENT], {username, event}),
}

export const userUnlock = {
	request: login => action(USERS_UNLOCK[REQUEST], {login}),
	success: (login, response) => action(USERS_UNLOCK[SUCCESS], {login, response}),
	failure: (login, error) => action(USERS_UNLOCK[FAILURE], {login, error}),
	notify: (username, event) => action(USERS_UNLOCK[EVENT], {username, event}),
}

export const triggerUser = {
	login: ((username, password, requiredFields = []) => action(TRIGGER_USERS_LOGIN, {username, password, requiredFields})),
	register: ((username, regInfo = {}, requiredFields = []) => action(TRIGGER_USERS_REGISTER, {username, regInfo, requiredFields})),
	unlock: ((username, extra, requiredFields = []) => action(TRIGGER_USERS_UNLOCK, {username, extra, requiredFields})),
	load: (state => action(LOAD_USERS, {state})),
	reset: ((oper) => action(RESET_TRIGGER_USERS, {oper})),
}


/*
 * 搜索账号是否存在于区块上，不走SAGA模式，直接promise-> redux
*/

let accountSearchLock = {};

export const accountSearch = (start_symbol, limit = 50) => {

	let uid = `${start_symbol}+${limit}`;

	return dispatch => {

		if(!accountSearchLock[uid]) {
			accountSearchLock[uid] = true;

			return AccountApi.lookupAccounts(start_symbol, limit)
			.then(result => {
				console.info("[user.action.js]::accountSearch - get result : ", result);
				accountSearchLock[uid] = false;
				dispatch({
					type: SEARCH_ACCOUNT,
					searchTerm: start_symbol,
					searchAccounts: result, 
				})	

				return {
					type: SEARCH_ACCOUNT,
					searchTerm: start_symbol,
					searchAccounts: result, 
				};

			}).catch(error => {
				console.error("[user.action.js]::accountSearch - error : ", error);
			})
		}
		

	}
}




