
import { SETTINGS, SETTINGS_CHANGE, SETTINGS_CURRENTACCOUNT } from "./types";

const initDone = true;

export const init = () => {
	return new Promise((resolve, reject) => {
		//dispatch({type: SETTINGS.SUCCESS});
		if(initDone) 
			resolve('fine');
		else
			reject('init error');
		resolve('finial');
	});
};

export const change = (value) => {
	return dispatch => {

		// first 
		dispatch({type: SETTINGS_CHANGE.PENDING});

		// api call

		// finial
		dispatch({
			type: SETTINGS_CHANGE.SUCCESS,
			payload: value
		})
	};
};

export const currentAccount = (account_name) => {
	return dispatch => {

		dispatch({type: SETTINGS_CURRENTACCOUNT.PENDING});

		// call someting, example api

		dispatch({
			type: SETTINGS_CURRENTACCOUNT.SUCCESS,
			payload: {
				currentAccount: account_name
			}
		});		

	};
};
