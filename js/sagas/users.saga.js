
/* eslint-disable no-constant-condition */
import { delay } from "redux-saga";
import { take, put, call, fork, select, all } from 'redux-saga/effects'
import { api, history,  } from '../services';
import usersBox from "../services/user.box";
import * as actions from '../actions';
import { getUser, getRepo, getStarredByUser, getStargazersByRepo } from '../reducers/selectors';

// each entity defines 3 creators { request, success, failure }
const { user, repo, starred, stargazers } = actions;

const { userRegister, userLogin, appSaveKey } = actions;

import { ChainStore, FetchChain } from "assetfunjs/es";

/***************************** Subroutines ************************************/
// resuable fetch Subroutine
// entity :  user | repo | starred | stargazers
// apiFn  : api.fetchUser | api.fetchRepo | ...
// id     : login | fullName
// info    : next page url. If not provided will use pass id to apiFn
function* fetchEntity(entity, apiFn, id, info) {
  yield put( entity.request(id, info) )
  const {response, error} = yield call(apiFn, id, info)
  console.warn("=====[users.saga.js]::fetchEntity - response, ", response, error);

  if(response)
    yield put( entity.success(id, response) )
  else
    yield put( entity.failure(id, error) )
  
  return {response, error};
}
	
// yeah! we can also bind Generators
export const callUserRegister    = fetchEntity.bind(null, userRegister, usersBox.createAccountWithPassword)
export const callUserLogin       = fetchEntity.bind(null, userLogin, usersBox.loginUser)


// 保存私钥
function* saveKey(generateKey, account_name, password, response) {
	let {privKey : owner_private} = generateKey(account_name, "owner", password);
    let {privKey: active_private} = generateKey(account_name, "active", password);

    yield put( appSaveKey(account_name, [
    	{type: "owner", privKey: owner_private.toWif(), pubKey: owner_private.toPublicKey().toString()},
    	{type: "active", privKey: active_private.toWif(), pubKey: active_private.toPublicKey().toString()}
    ]) );
    //yield put( appSaveKey(account_name, {type: "active", privKey: active_private.toWif(), pubKey: active_private.toPublicKey().toString()}) );
}

export const callSaveKey = saveKey.bind(null, usersBox.generateKeyFromPassword);

function* fetchAccount(username) {

	try {

		console.log("=====[users.saga.js]::fetchAccount - fetch user <", username);
		const res = yield call(FetchChain, "getAccount", username);
		/*.then((ret) => {
	    console.log("=====[users.saga.js]::fetchAccount - createAccount : getAccount is : ", ret);
	  }).catch(err => {
	    console.error("=====[users.saga.js]::fetchAccount - createAccount : getAccount is : err ", err);
	  });*/

	  console.log("=====[users.saga.js]::fetchAccount - createAccount : getAccount is : ", JSON.stringify(res));

	} catch ( e ) {
		console.error("=====[users.saga.js]::register catch error : ", e);

	}

}

// load user unless it is cached
function* register(username, regInfo, requiredFields) {
	
	try {

		const { user } = yield select(getUser, username)
		console.log("=====[users.saga.js]::register - exists user: ", user)
		if (!user || requiredFields.some(key => !user.hasOwnProperty(key))) {
			
			const {response, error} = yield call(callUserRegister, username, regInfo);
			yield call(fetchAccount, username);

			if(response) { // save key
				console.log("=====[users.saga.js]::register - register user <", username, "> ok : ", response);

				
				yield call(callSaveKey, username, regInfo.password, response);
			}
		}

	} catch ( e ) {
		console.error("=====[users.saga.js]::register catch error : ", e.message);
		//设置到缓存中用于界面提示
		yield put( userRegister.failure(username, e.message) );
	}
}

function* login(username, password, requiredFields) {
	
	try {

		let { user } = yield select(getUser, username)
		
		user = user && user.length ? user[0] : null;
		

		if (!user || requiredFields.some(key => !user.hasOwnProperty(key))) {

			console.log("=====[users.saga.js]::login - not exists user: ", user)
			 const {response, error} = yield call(callUserLogin, username, password)

			 if(response) { // save key
				console.log("=====[users.saga.js]::login - login user <", username, "> ok : ", response);

				let saveKeys = [];
				Object.keys(response.private).forEach((key) => {
					saveKeys.push({privKey: response.private[key].toWif(), pubKey: key});
				});

				yield put( appSaveKey(username, saveKeys));
			}

		} else {
			console.log("=====[users.saga.js]::login - exists user: ", user);
			//用户存在，验证密码有效性
		}

	} catch ( e ) {
		console.error("=====[users.saga.js]::login catch error : ", e.message);
		yield put( userRegister.failure(username, e.message) );
	}
}



/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

// trigger router navigation via history
export function* watchUserRegister() {
	console.log("=====[users.saga.js]::watchUserRegister - ");
	
	while(true) {
		try {

		console.log("=====[users.saga.js]::watchUserRegister - loop");
		//const delay_3000 = yield delay(3000);
		//console.log("=====[users.saga.js]::watchUserRegister - loop ", delay_3000);

		const {username, regInfo, requiredFields = []} = yield take(actions.TRIGGER_USERS_REGISTER);
		console.log("=====[users.saga.js]::watchUserRegister - loop reginfo - ++++>", username);
		//const { password, registrar, referrer, referrer_percent, refcode } = regInfo;

		yield fork(register, username, regInfo, requiredFields);

		} catch( e ) {
			const delay_1000 = yield delay(1000);
			console.error("=====[users.saga.js]::watchUserRegister catch error : ", delay_1000, e.message);
			continue;

		}
	}
}

export function* watchUserLogin() {
	console.log("=====[users.saga.js]::watchUserLogin - ");
	
	while(true) {
		try {

		console.log("=====[users.saga.js]::watchUserLogin - loop");
		//const delay_3000 = yield delay(3000);
		//console.log("=====[users.saga.js]::watchUserLogin - loop ", delay_3000);
		const {username, password, requiredFields = []} = yield take(actions.TRIGGER_USERS_LOGIN);
		console.log("=====[users.saga.js]::watchUserLogin - loop login info - ", username, password);

		yield fork(login, username, password, requiredFields);

		} catch( e ) {
			const delay_1000 = yield delay(1000);
			console.error("=====[users.saga.js]::watchUserLogin catch error : ", delay_1000, e.message);
			continue;

		}
	}
}

