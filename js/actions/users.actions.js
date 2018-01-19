

import { action, createRequestTypes, REQUEST, SUCCESS, FAILURE  } from "./types";

import { createActionSet } from "../components";

// users action type
export const USERS				= createRequestTypes('USERS');
export const USERS_LOGIN 		= createRequestTypes('USERS_LOGIN');
export const USERS_REGISTER 	= createRequestTypes('USERS_REGISTER');
export const USER_UNLOCK		= createRequestTypes('USER_UNLOCK');

export const USERS_INIT = 'USERS_INIT';
export const TRIGGER_USERS_LOGIN		= 'TRIGGER_USERS_LOGIN';
export const TRIGGER_USERS_REGISTER		= 'TRIGGER_USERS_REGISTER';

/*
// users relation action call
user 相关action触发调用
*/

//import UsersBox  from "./users.box";


export const user = {
	request: login => action(USERS[REQUEST], {login}),
	success: (login, response) => action(USERS[SUCCESS], {login, response}),
	failure: (login, error) => action(USERS[FAILURE], {login, error}),
}


export const userRegister = {
	request: (username, password, registrar, referrer, referrer_percent, refcode) => (
		action(USERS_REGISTER[REQUEST], {account_name, password, registrar, referrer, referrer_percent, refcode})),
	success: (username, response) => action(USERS_REGISTER[SUCCESS], {username, response}),
	failure: (username, error) => action(USERS_REGISTER[FAILURE], {username, error}),
}

export const userLogin = {
	request: (login, password) => (
		action(USERS_REGISTER[REQUEST], {login, password})),
	success: (login, response) => action(USERS_REGISTER[SUCCESS], {login, response}),
	failure: (login, error) => action(USERS_REGISTER[FAILURE], {login, error}),
}



export const triggerUser = {
	init: (state => action(USERS_INIT, {state})),
	login: ((login, password) => action(TRIGGER_USERS_LOGIN, {login, password})),
	register: ((username, regInfo = {}) => action(TRIGGER_USERS_REGISTER, {username, regInfo})),
}
//export const usersInit 			= state => action(USERS_INIT, {state});
//export const callUserLogin		= (login, password) => action(TRIGGER_USERS_LOGIN, {login, password});
//export const callUserRegister 	= (username, regInfo = []) => action(TRIGGER_USERS_REGISTER, {username, regInfo});


/*
export const createAccount = 
	(account_name, password, registrar, referrer, referrer_percent, refcode) => {

	return (dispatch, getState) => {

		console.log("=====[users.actions.js]::createAccount - param: ", dispatch, getState().users.inited);

		dispatch({type: USERS_REGISTER.PENDING});

		dispatch(unLock());

		// call api register
		return UsersBox.createAccountWithPassword(dispatch, getState(), account_name, password, registrar, referrer, referrer_percent, refcode)
			.then((res) => {
				
				console.log("=====[users.actions.js]::createAccount - ", res);
				// store sucess
				dispatch({
					type: USERS_REGISTER.SUCCESS,
					payload: res,
				});

				// 
				return account_name;
			});

	};
};

export const loginAccount = (account_name, password) => {
	console.log("=====[users.actions.js]::loginAccount - param: ", account_name, password);
	return {
		type: USERS_LOGIN.SUCCESS,
		payload: {
			username: account_name,
			password: password,
		}
	}
}

export const unLock = () => {
	

	return (dispatch, getState) => {

		console.log("=====[users.actions.js]::unLock - param: ", getState().users.inited);
		dispatch({type: USER_UNLOCK.PENDING});
	};
};
*/



