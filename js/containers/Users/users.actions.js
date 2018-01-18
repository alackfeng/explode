
import { USERS, USERS_LOGIN, USERS_REGISTER, USER_UNLOCK } from "./users.types";

import UsersBox  from "./users.box";

export const init = () => {
	return dispatch => {
		dispatch({type: USERS.SUCCESS});
	};
};

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