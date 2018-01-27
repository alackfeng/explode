
/* eslint-disable no-constant-condition */
import { delay } from "redux-saga";
import { take, put, call, fork, select, all } from 'redux-saga/effects'

import CommBox from "../services/comm.box";
import { getUser } from '../reducers/selectors';

import * as actions from '../actions';
const { triggerTrans, transCommon } = actions;

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
export const callTransaction       = fetchEntity.bind(null, transCommon, CommBox.handle)


/*
 * transaction common handle
*/
function* transaction(username, method, parameters, requiredFields) {
	
	try {

		// 用户是否登录状态
		let { user } = yield select(getUser, username);
		user = user && user.length ? user[0] : null;
		

		// 验证交易属性是否存在，后期优化 method->parameters[]
		if (user /*|| requiredFields.some(key => !user.hasOwnProperty(key))*/) {

			console.log("=====[comm.saga.js]::transaction - exists user: ", user, ", Begin handle transaction...")
			
			// 调用交易流程
			const {response, error} = yield call(callTransaction, method, parameters)

			if(response) { //返回交易二次确认信息

				console.log("=====[comm.saga.js]::transaction - transaction user <", username, "> ok : ", response);
				// other handle????

				// 关闭交易二次确认框
				// test now yield put( triggerTrans.close());
			}

		} else {
			console.log("=====[comm.saga.js]::transaction - user: ", username, "用户未登录！！！");
			//用户存在，验证密码有效性
		}

	} catch ( e ) {
		console.error("=====[comm.saga.js]::transaction catch error : ", e.message);
		yield put( userRegister.failure(username, e.message) );
	}
}



/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

export function* watchTransaction() {
	console.log("=====[comm.saga.js]::watchTransaction - start. ");
	
	let counter = 0;
	while(true) {
		try {

		counter = counter + 1; // up 1
		console.log("=====[comm.saga.js]::watchTransaction - loop counter : ", counter);

		const {username, method, parameters, requiredFields = []} = yield take(actions.TRIGGER_TRANSACTION_COMMON);
		console.log("=====[comm.saga.js]::watchTransaction - loop comm transaction - ", username, method, parameters);

		yield fork(transaction, username, method, parameters, requiredFields);

		} catch( e ) {
			
			const error = (e && e.message) ? e.message : e;
			console.error("=====[users.saga.js]::watchTransaction catch error : ", delay_1000, error);
			const delay_1000 = yield delay(1000);
			continue;

		}
	}

	console.log("=====[comm.saga.js]::watchTransaction - end... ");
}

