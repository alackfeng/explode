
import { action, createRequestTypes, REQUEST, SUCCESS, FAILURE  } from "./types";

// app action type 
export const DO_STUFF 		= 'DO_STUFF';
export const GET_RANDOM 	= 'GET_RANDOM';
export const SET_APP_READY 	= 'SET_APP_READY';
export const SET_APP_LOCALE	= 'SET_APP_LOCALE';

export const APP_FOREVER_SAVE_KEY = 'APP_FOREVER_SAVE_KEY';
export const APP_FOREVER_INIT_NODES = 'APP_FOREVER_INIT_NODES';
export const APP_FOREVER_CHANGE_RPC_STATUS = 'APP_FOREVER_CHANGE_RPC_STATUS';
export const APP_FOREVER_UPDATE_NODES = 'APP_FOREVER_UPDATE_NODES';

// 交易统一处理流程，需要进行二次确认的，
export const TRANSACTION_COMMON           = createRequestTypes('TRANSACTION_COMMON');

export const TRIGGER_TRANSACTION_COMMON   = 'TRIGGER_TRANSACTION_COMMON';
export const CLOSE_TRANSACTION_COMMON     = 'CLOSE_TRANSACTION_COMMON';
export const TRIGGER_SECOND_CONFIRM       = 'TRIGGER_SECOND_CONFIRM';
export const TRIGGER_SECOND_CONFIRM_YES   = 'TRIGGER_SECOND_CONFIRM_YES';
export const TRIGGER_SECOND_CONFIRM_NO    = 'TRIGGER_SECOND_CONFIRM_NO';

/*
// app relation action call
app 相关全局设置存储在本地上，
*/

export function setAppReady() {
	return {
		type: SET_APP_READY,
		appReady: true,
	};
}

export function setAppLocale(locale) {
	return {
		type: SET_APP_LOCALE,
		locale: locale || 'en',
	}
}

// some test
export function getRandomNumber() {
  return {
    type: GET_RANDOM,
    payload: {
      random: Math.floor(Math.random() * 1e6),
    },
  };
}

export function doSomeStuff() {
  return {
    type: DO_STUFF,
    payload: {
      stuff: 2 + 2,
    },
  };
}

export const appSaveKey = (username, keys=[]) => action(APP_FOREVER_SAVE_KEY, {username, keys})
export const updateRpcConnectionStatus = (status, url) => action(APP_FOREVER_CHANGE_RPC_STATUS, {status, url});
export const initConnect = (nodes, url) => action(APP_FOREVER_INIT_NODES, {nodes, url});
export const nodeConnect = (nodes, url) => action(APP_FOREVER_UPDATE_NODES, {nodes, url});

/* saga模式，自动化调用响应处理 */
export const transCommon = {
  request: (method, parameters) => action(TRANSACTION_COMMON[REQUEST], {method, parameters}),
  success: (method, response) => action(TRANSACTION_COMMON[SUCCESS], {method, response}),
  failure: (method, error) => action(TRANSACTION_COMMON[FAILURE], {method, error}),
}

// 触发交易使用
export const triggerTrans = {
  handle: ((username, method, parameters = {}, requiredFields = []) => action(TRIGGER_TRANSACTION_COMMON, {username, method, parameters, requiredFields})),
  close: ((reason) => action(CLOSE_TRANSACTION_COMMON, {reason})),
  confirm: ((event, method = "broadcast") => action(TRIGGER_SECOND_CONFIRM, {event, method})),
}

