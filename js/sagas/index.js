/* eslint-disable no-constant-condition */
import { delay } from "redux-saga";
import { take, put, call, fork, select, all } from 'redux-saga/effects'
import { api, history } from '../services';
import * as actions from '../actions';
import { getUser, getRepo, getStarredByUser, getStargazersByRepo } from '../reducers/selectors';

import {watchUserLogin, watchUserRegister } from "./users.saga";

// each entity defines 3 creators { request, success, failure }
const { user, repo, starred, stargazers } = actions;

// url for first page
// urls for next pages will be extracted from the successive loadMore* requests
const firstPageStarredUrl = login => `users/${login}/starred`
const firstPageStargazersUrl = fullName => `repos/${fullName}/stargazers`


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
export const fetchUser       = fetchEntity.bind(null, user, api.fetchUser)
export const fetchRepo       = fetchEntity.bind(null, repo, api.fetchRepo)
export const fetchStarred    = fetchEntity.bind(null, starred, api.fetchStarred)
export const fetchStargazers = fetchEntity.bind(null, stargazers, api.fetchStargazers)

// load user unless it is cached
function* loadUser(login, requiredFields) {
  const user = yield select(getUser, login)
  if (!user || requiredFields.some(key => !user.hasOwnProperty(key))) {
    yield call(fetchUser, login)
  }
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

// trigger router navigation via history
function* watchNavigate() {
	console.log("=====[sagas.js]::watchNavigate - ");
	
	while(true) {
		try {

		console.log("=====[sagas.js]::watchNavigate - loop");
		const delay_3000 = yield delay(3000);
		console.log("=====[sagas.js]::watchNavigate - loop ", delay_3000);
		const {pathname} = yield take(actions.NAVIGATE)
		//yield history.push(pathname)

		} catch( e ) {
			const delay_1000 = yield delay(1000);
			console.error("=====[sagas.js]::watchNavigate catch error : ", delay_1000, e.message);
			continue;

		}
	}
}

// Fetches data for a User : user data + starred repos
function* watchLoadUserPage() {
	console.log("=====[sagas.js]::watchLoadUserPage - ");
	
	while(true) {
		console.log("=====[sagas.js]::watchLoadUserPage - loop");
		const {login, requiredFields = []} = yield take(actions.LOAD_USER_PAGE)

		yield fork(loadUser, login, requiredFields)
		//yield fork(loadStarred, login)
	}
}


export default function* root() {
	console.log("=====[sagas.js]::root - ");
	yield all([
		//fork(watchNavigate),
		//fork(watchLoadUserPage),
		fork(watchUserRegister),
		fork(watchUserLogin),
	]);
}