
/* eslint-disable no-constant-condition */
import { delay } from "redux-saga";
import { take, put, call, fork, select, all } from 'redux-saga/effects'
import { api, history } from '../services';
import * as actions from '../actions';
import { getUser, getRepo, getStarredByUser, getStargazersByRepo } from '../reducers/selectors';

// each entity defines 3 creators { request, success, failure }
const { user, repo, starred, stargazers } = actions;

const { userRegister, userLogin } = actions;

/***************************** Subroutines ************************************/

// resuable fetch Subroutine
// entity :  user | repo | starred | stargazers
// apiFn  : api.fetchUser | api.fetchRepo | ...
// id     : login | fullName
// url    : next page url. If not provided will use pass id to apiFn
function* fetchEntity(entity, apiFn, id, url) {
  yield put( entity.request(id) )
  const {response, error} = yield call(apiFn, url || id)
  if(response)
    yield put( entity.success(id, response) )
  else
    yield put( entity.failure(id, error) )
}
	
// yeah! we can also bind Generators
export const callUserRegister    = fetchEntity.bind(null, userRegister, api.fetchUser)
export const callUserLogin       = fetchEntity.bind(null, userLogin, api.fetchUser)


// load user unless it is cached
function* register(login, regInfo) {
	
	try {

		const user = yield select(getUser, login)
		if (!user || regInfo.some(key => !user.hasOwnProperty(key))) {
			yield call(callUserRegister, {login, regInfo})
		}

	} catch ( e ) {
		console.error("=====[users.saga.js]::register catch error : ", e.message);
	}
}

function* login(login, password) {
	const user = yield select(getUser, login);
	if(user && 1) {
		yield call(callUserLogin, {login, password});
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
		const delay_3000 = yield delay(3000);
		console.log("=====[users.saga.js]::watchUserRegister - loop ", delay_3000);
		const {username, regInfo} = yield take(actions.TRIGGER_USERS_REGISTER);
		console.log("=====[users.saga.js]::watchUserRegister - loop reginfo - ++++>", username);
		//const { password, registrar, referrer, referrer_percent, refcode } = regInfo;

		yield fork(register, username, regInfo);

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
		const delay_3000 = yield delay(3000);
		console.log("=====[users.saga.js]::watchUserLogin - loop ", delay_3000);
		const reginfo = yield take(actions.TRIGGER_USERS_LOGIN);
		console.log("=====[users.saga.js]::watchUserLogin - loop reginfo - ", reginfo);
		const { username, password, registrar, referrer, referrer_percent, refcode } = reginfo;

		yield fork(login, username, reginfo);

		} catch( e ) {
			const delay_1000 = yield delay(1000);
			console.error("=====[users.saga.js]::watchUserLogin catch error : ", delay_1000, e.message);
			continue;

		}
	}
}

