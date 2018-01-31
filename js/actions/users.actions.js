

import { action, createRequestTypes, REQUEST, SUCCESS, FAILURE  } from "./types";

// users action type
export const USERS_LOGIN 		= createRequestTypes('USERS_LOGIN');
export const USERS_REGISTER = createRequestTypes('USERS_REGISTER');
export const USERS_UNLOCK		= createRequestTypes('USERS_UNLOCK');

export const TRIGGER_USERS_LOGIN			= 'TRIGGER_USERS_LOGIN';
export const TRIGGER_USERS_REGISTER		= 'TRIGGER_USERS_REGISTER';
export const TRIGGER_USERS_UNLOCK			= 'TRIGGER_USERS_UNLOCK';

export const LOAD_USERS 							= 'LOAD_USERS';
export const RESET_TRIGGER_USERS 			= 'RESET_TRIGGER_USERS';

/*
// users relation action call
user 相关action触发调用
*/

export const userRegister = {
	request: (username, regInfo) => (
		action(USERS_REGISTER[REQUEST], {username, regInfo})),
	success: (username, response) => action(USERS_REGISTER[SUCCESS], {username, response}),
	failure: (username, error) => action(USERS_REGISTER[FAILURE], {username, error}),
}

export const userLogin = {
	request: (username, password) => (
		action(USERS_LOGIN[REQUEST], {username, password})),
	success: (username, response) => action(USERS_LOGIN[SUCCESS], {username, response}),
	failure: (username, error) => action(USERS_LOGIN[FAILURE], {username, error}),
}

export const userUnlock = {
	request: login => action(USERS_UNLOCK[REQUEST], {login}),
	success: (login, response) => action(USERS_UNLOCK[SUCCESS], {login, response}),
	failure: (login, error) => action(USERS_UNLOCK[FAILURE], {login, error}),
}

export const triggerUser = {
	login: ((username, password, requiredFields = []) => action(TRIGGER_USERS_LOGIN, {username, password, requiredFields})),
	register: ((username, regInfo = {}, requiredFields = []) => action(TRIGGER_USERS_REGISTER, {username, regInfo, requiredFields})),
	unlock: ((username, password, requiredFields = []) => action(TRIGGER_USERS_UNLOCK, {username, password, requiredFields})),
	load: (state => action(LOAD_USERS, {state})),
	reset: ((oper) => action(RESET_TRIGGER_USERS, {oper})),
}




