import { REHYDRATE } from "redux-persist";
import { USERS, USERS_LOGIN, USERS_REGISTER, USER_UNLOCK } from "./users.types";

export const initialUsersState = {
	inited: null, 
	pending: {
		inited: false,
		users: false,
		register: false,
		unlock: false,
	},
	isLocked: true,
	currentAccount: [],
};

export const usersReducer = (state = initialUsersState, action = {}) => {
	
	console.log(">>>>>[users.reducer.js]::usersReducer - ", action.type, action);

	switch (action.type) {
		case USERS.PENDING: {	// USERS
			return {
				...state,
				inited: 0,
			};
		}
		case USERS.SUCCESS: {
			return {
				...state,
				inited: 1,
				pending: {...state.pending, inited: 1}
			};
		}
		case USERS.ERROR: {
			return {
				...state,
				inited: -1,
			};
		}
		case USERS_REGISTER.PENDING: {
			return {
				...state,
				pending: {...state.pending, register: 1}
			};
		}
		case USERS_REGISTER.SUCCESS: {
			return {
				...state,
				pending: {...state.pending, register: false},
				...action.payload,
			}
		}
		case USER_UNLOCK.PENDING: {
			return {
				...state,
				pending: {...state.pending, unlock: 1}
			};
		}
		case USER_UNLOCK.SUCCESS: {
			return {
				...state,
				pending: {...state.pending, unlock: false},
				...action.payload,
			}
		}
		case USERS_LOGIN.SUCCESS: {
			return {
				...state,
				pending: {...state.pending, unlock: false},
				...action.payload,
			}
		}
		default:
			return state;
	}
};