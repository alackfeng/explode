import ActionTypes from '../../actions';

import { REGSITER } from "./type";

export const userRegister = (username, password) => {
	return dispatch => {
		dispatch({ 
			type: REGSITER.SUCCESS,
			payload: {
				username,
				password
			}
		});
	};
};