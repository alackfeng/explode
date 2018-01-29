
/* eslint-disable no-constant-condition */
import { delay } from "redux-saga";
import { take, put, call, fork, select, all, race } from 'redux-saga/effects'

import CommBox from "../services/comm.box";
import { getUser } from '../reducers/selectors';

import * as actions from '../actions';
const { triggerTrans, transCommon } = actions;

function perfParamStore(parameters) {
	
	let outParams = null;
	const inParams = parameters;
	console.log("=====[comm.saga.js]::perfParamStore - in parameters ", inParams);

	if(inParams.transaction) {
		outParams = {...inParams, transaction: inParams.transaction.serialize()};	
	} else {
		outParams = inParams;
	}

	console.log("=====[comm.saga.js]::perfParamStore - out parameters ", outParams);
	return outParams;
}

/***************************** Subroutines ************************************/
// resuable fetch Subroutine
// entity :  user | repo | starred | stargazers
// apiFn  : api.fetchUser | api.fetchRepo | ...
// id     : login | fullName
// info    : next page url. If not provided will use pass id to apiFn
function* fetchEntity(entity, apiFn, id, info) {
  yield put( entity.request(id, perfParamStore(info)) )
  const {response, error} = yield call(apiFn, id, info)
  console.warn("=====[comm.saga.js]::fetchEntity - response, ", response, error);

  if(response)
    yield put( entity.success(id, perfParamStore(response)) )
  else
    yield put( entity.failure(id, error) )
  
  return {response, error};
}
	
// yeah! we can also bind Generators
export const callTransaction      	= fetchEntity.bind(null, transCommon, CommBox.handle)
export const callBroadcast       		= fetchEntity.bind(null, transCommon, CommBox.broadcast)


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

				console.log("=====[comm.saga.js]::transaction - transaction user <", username, ">:-", method, " ok : ", response);
				// other handle????

				// 二次确认等待UI返回 confirm or cancel
				if(response.type && response.type === "second_confirm") {
					// broadcast, 
					// 调用交易流程

					const { timeout, waitBroad } = yield race({
						timeout: call(delay, 100000),
						waitBroad: take(actions.TRIGGER_SECOND_CONFIRM),
					});

					if(timeout) {
						console.log("=====[comm.saga.js]::broadcast - transaction user <", username, "timeout... over ");
						yield put(triggerTrans.close('timeout')); //关闭交易对话框
					} else {
						console.log("=====[comm.saga.js]::broadcast - transaction user <", username, ">:-call... ", waitBroad);

						method = waitBroad.method || "broadcast";

						if(waitBroad.event === actions.TRIGGER_SECOND_CONFIRM_YES) { //确认提交广播，
							
							const {response: responseB, error} = yield call(callBroadcast, method, {transaction: response.transaction});
							console.log("=====[comm.saga.js]::transaction - transaction user <", username, ">:-broadcast ok : ", responseB, error);

							yield put(triggerTrans.close('normal')); //关闭交易对话框
						}
						if(waitBroad.event === actions.TRIGGER_SECOND_CONFIRM_NO) { // 取消广播，
							
							yield put(triggerTrans.close('normal')); //关闭交易对话框
						}

					}

				}

				// 关闭交易二次确认框
				// test now yield put( triggerTrans.close());
			}

		} else {
			console.log("=====[comm.saga.js]::transaction - user: ", username, "用户未登录！！！");
			//用户存在，验证密码有效性
		}

	} catch ( e ) {
		console.error("=====[comm.saga.js]::transaction catch error : ", e.message);
		
		yield put( transCommon.failure(method, e.message) );
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
			console.error("=====[comm.saga.js]::watchTransaction catch error : ", delay_1000, error);
			const delay_1000 = yield delay(1000);
			continue;

		}
	}

	console.log("=====[comm.saga.js]::watchTransaction - end... ");
}

