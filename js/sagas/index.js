/* eslint-disable no-constant-condition */
import { delay } from "redux-saga";
import { take, put, call, fork, select, all } from 'redux-saga/effects'

import { watchUserLogin, watchUserRegister, watchUserUnLock } from "./users.saga";
import { watchTransaction } from "./comm.saga";


export default function* root() {
	console.log("=====[index.sagas.js]::root - ");
	yield all([
		fork(watchUserRegister),
		fork(watchUserLogin),
		fork(watchTransaction),
		fork(watchUserUnLock),
	]);
}