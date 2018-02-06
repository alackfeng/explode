
/* eslint-disable no-constant-condition */
import { delay } from "redux-saga";
import { take, put, call, fork, select, all } from 'redux-saga/effects'
import { api, history,  } from '../services';
import usersBox from "../services/user.box";
import WalletDb from "../services/WalletDb";

import { getUser } from '../reducers/selectors';

import * as actions from '../actions';
const { userRegister, userLogin, userUnlock,  appSaveKey } = actions;

import { ChainStore, FetchChain } from "assetfunjs/es";

const TRACE = false;

/***************************** Subroutines ************************************/

function* fetchEntity(entity, apiFn, id, info) {
  yield put( entity.request(id, info) )
  const {response, error, extradata} = yield call(apiFn, id, info)
  console.info("=====[users.saga.js]::fetchEntity - response, ", response, error, extradata);

  if(response)
    yield put( entity.success(id, response) )
  else
    yield put( entity.failure(id, error) )
  
  return {response, error, extradata};
}
	
// yeah! we can also bind Generators
export const callUserRegister    = fetchEntity.bind(null, userRegister, usersBox.createAccountWithPassword)
export const callUserLogin       = fetchEntity.bind(null, userLogin, usersBox.loginUser)
export const callUserUnLock 		 = fetchEntity.bind(null, userUnlock, WalletDb.unLock);


/*
 * 内部流程
 * checkLocalUser(username) - 检验用户是否存在于本地
 * fetchAccount(username)		- 检验区块是否存在用户
 * saveKeys 								- 注册后保存私钥到store中
*/

function* checkLocalUser(username) {
		let { user } = yield select(getUser, username);
		if(TRACE) console.log("=====[users.saga.js]::checkLocalUser - <", username, "> OBJECT : ", user);
		user = user && user.length ? user[0] : null;
		console.log("=====[users.saga.js]::checkLocalUser - <", username, "> OBJECT : ", user);
		return user;
}

function* fetchAccount(username) {

	try {
		console.log("=====[users.saga.js]::fetchAccount - fetch user <", username);
		const account = yield call(FetchChain, "getAccount", username);

	  console.log("=====[users.saga.js]::fetchAccount - : getAccount is : ", account.size || JSON.stringify(account));
	  return { account };

	} catch ( e ) {
		console.error("=====[users.saga.js]::fetchAccount catch error : ", e);
		return {};
	}
}

// 保存私钥
function* saveKeys(savekeys, account_name, password, response) {
	
	// 保存私钥到缓存中，并返回
	let { auth } = yield call(savekeys, account_name, password, response);
	console.log("=====[users.saga.js]::saveKeys - < ", account_name, auth);

	// 持久化到store中
	if(auth) {
		yield put( appSaveKey(account_name, auth) );
	} else {
		throw new Error("save key error");
	}
}
export const callSaveKeys = saveKeys.bind(null, WalletDb.saveKeys);

// 验证用户密码有效性 validatePassword
function* validatePassword(checkValid, account, password, unlock = false) {
	console.log("=====[users.saga.js]::validatePassword - < ", account, unlock);
	return { };
}
export const checkValidatePassword = validatePassword.bind(null, WalletDb.validatePassword);


function* unlockUser(unLock, username, extra, user) {

	let { res } = yield call(unLock, user, extra);
	console.log("=====[users.saga.js]::unlockUser - < ", username, res);

	return { res };
}
//export const callUserUnLock = unlockUser.bind(null, WalletDb.unLock);


/*
 * 用户注册主流程主逻辑：
 * 入参：
 * 	- username 	用户名
 * 	- regInfo		注册相关信息，包括 username, password, registrar, referrer, referrer_percent, refcode
 * 	- requiredFields 	注册必选参数校验
 * 出参：无
 * 返回：无，进入下一个循环
 * 异常：记录流程日志，返回给界面显示
*/
function* register(username, regInfo, requiredFields) {
	
	try {

		// 1. 检验用户是否存在于本地
		const user = yield call(checkLocalUser, username);

		if (!user || requiredFields.some(key => !user.hasOwnProperty(key))) {

			// 2. 本地用户不存在，检验区块是否存在用户，或直接注册去
			console.log("=====[users.saga.js]::register - not exists user: ", username)

			const { account } = {}; // temporary PS: yield call(fetchAccount, username);
			if(account) {
				console.log("=====[users.saga.js]::register - fetchAccount : ", username, "OK, ~Notification UI Block User exists");
				yield put( userRegister.success(username, "Block exists user") );
				return;
			}

			// 3. 调用注册通用流程
			const {response, error, extradata} = yield call(callUserRegister, username, regInfo);
			if(response) { 
				// 4. 注册成功返回，保存私钥到本地 save key
				console.log("=====[users.saga.js]::register - user Register <", username, "> ok : ", response);
				yield call(callSaveKeys, username, regInfo.password, null);

			} else {
				// 5. 注册返回错误，通知UI?，
				console.log("=====[users.saga.js]::register - user Register <", username, "> error : ", error);
			}
		} else {

			// 3. 用户存在，验证密码有效性
			console.log("=====[users.saga.js]::register - exists user: ", user, ", ~Notification UI Local User exists");
			alert("local exists user, check password Valid");
			yield put( userRegister.success(username, "local exists user") );
		}

	} catch ( e ) {
		console.error("=====[users.saga.js]::register catch error : ", e || e.message);
		
		//设置到缓存中用于界面提示
		yield put( userRegister.failure(username, e.message) );
	}
}

/*
 * 用户登录主流程主逻辑：
 * 入参：
 * 	- username 	用户名
 * 	- password	登录密码
 * 	- requiredFields 	必选参数校验
 * 出参：无
 * 返回：无，进入下一个循环
 * 异常：记录流程日志，返回给界面显示
*/
function* login(username, password, requiredFields) {
	
	try {

		// 1. 检验用户是否存在于本地
		const user = yield call(checkLocalUser, username);

		if (user || !user || requiredFields.some(key => !user.hasOwnProperty(key))) {

			console.log("=====[users.saga.js]::login - not exists user: ", user)
			 const {response, error, extradata} = yield call(callUserLogin, username, password)

			 if(response) { // save key
				console.log("=====[users.saga.js]::login - login user <", username, "> ok : ", response);

				//let saveKeys = [];
				//Object.keys(response.private).forEach((key) => {
				//	saveKeys.push({privKey: response.private[key].toWif(), pubKey: key});
				// });
				if(extradata) {
					console.log("=====[users.saga.js]::login - login user <", username, "> ok save keys : ", extradata);
					yield call(callSaveKeys, username, password, extradata);
					//yield put( appSaveKey(username, extradata));
				} else {
					alert("Login user Private not OK???");
				}

				
			}

		} else {
			//用户存在，验证密码有效性 validatePassword
			let { valid } = yield call(checkValidatePassword, username, password, true);
			console.log("=====[users.saga.js]::login - exists user: ", user, ", check valid - ", valid);
			if(valid) {
				yield put( userRegister.success(username, "local exists user") );
			} else {
				alert("login user not check valid!!!");
			}

		}

	} catch ( e ) {
		console.error("=====[users.saga.js]::login catch error : ", e || e.message);

		//设置到缓存中用于界面提示
		yield put( userLogin.failure(username, e.message) );
	}
}

/*
 * 用户解锁主流程主逻辑：
 * 入参：
 * 	- username 	用户名
 * 	- extra	附加信息，密码，锁etc
 * 	- requiredFields 	必选参数校验
 * 出参：无
 * 返回：无，进入下一个循环
 * 异常：记录流程日志，返回给界面显示
*/
function* unlock(username, extra, requiredFields) {
	
	try {

		// 1. 检验用户是否存在于本地
		const user = yield call(checkLocalUser, username);

		if (user || requiredFields.some(key => !user.hasOwnProperty(key))) {

			console.log("=====[users.saga.js]::login - exists user: ", user, "unlock it!")
			const {response, error, extradata} = yield call(callUserUnLock, user, extra)

			console.log("=====[users.saga.js]::login - unlock user <", username, "> ok : ", response, error, extradata);


		} else {

			console.log("=====[users.saga.js]::login - not exists user: ", user, ", Notification UI");
			alert("local not exists user");
			//yield put( userRegister.failure(username, "local not exists user") );

		}

	} catch ( e ) {
		console.error("=====[users.saga.js]::login catch error : ", e || e.message);

		//设置到缓存中用于界面提示
		yield put( userUnlock.failure(username, e.message) );
	}
}


/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

// trigger user register
export function* watchUserRegister() {
	if(TRACE) console.log("=====[users.saga.js]::watchUserRegister - ");
	
	while(true) {
		try {

		console.log("=====[users.saga.js]::watchUserRegister - loop");

		const {username, regInfo, requiredFields = []} = yield take(actions.TRIGGER_USERS_REGISTER);
		if(TRACE) console.log("=====[users.saga.js]::watchUserRegister - loop reg info - ++++>", username);

		yield fork(register, username, regInfo, requiredFields);

		} catch( e ) {
			// const delay_1000 = yield delay(1000);
			console.info("=====[users.saga.js]::watchUserRegister catch error : ", e);
			console.error("=====[users.saga.js]::watchUserRegister catch error : ", "delay_1000", e.message);
			continue;

		}
	}
}

// trigger user login
export function* watchUserLogin() {
	if(TRACE) console.log("=====[users.saga.js]::watchUserLogin - ");
	
	while(true) {
		try {

		console.log("=====[users.saga.js]::watchUserLogin - loop");

		const {username, password, requiredFields = []} = yield take(actions.TRIGGER_USERS_LOGIN);
		if(TRACE) console.log("=====[users.saga.js]::watchUserLogin - loop login info - ++++>", username);

		yield fork(login, username, password, requiredFields);

		} catch( e ) {
			//const delay_1000 = yield delay(1000);
			console.info("=====[users.saga.js]::watchUserLogin catch error : ", e);
			console.error("=====[users.saga.js]::watchUserLogin catch error : ", "delay_1000", e.message);
			continue;

		}
	}
}

// trigger user unlock
export function* watchUserUnLock() {
	if(TRACE) console.log("=====[users.saga.js]::watchUserUnLock - ");
	
	while(true) {
		try {

		console.log("=====[users.saga.js]::watchUserUnLock - loop");

		const {username, extra, requiredFields = []} = yield take(actions.TRIGGER_USERS_UNLOCK);
		console.log("=====[users.saga.js]::watchUserUnLock - loop unlock info - ++++>", username, extra);

		// 打开关闭解锁Modal
		if(extra && (extra.type === 'open' || extra.type === 'close')) {
			// 打开UnlockModal
		} //
		else
			// 触发解锁 
			yield fork(unlock, username, extra, requiredFields);

		} catch( e ) {
			//const delay_1000 = yield delay(1000);
			console.info("=====[users.saga.js]::watchUserUnLock catch error : ", e);
			console.error("=====[users.saga.js]::watchUserUnLock catch error : ", "delay_1000", e.message);
			continue;

		}
	}
}


