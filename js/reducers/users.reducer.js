
import { USERS, USERS_LOGIN, USERS_REGISTER, USER_UNLOCK, TRIGGER_USERS_REGISTER, TRIGGER_USERS_LOGIN } from "../actions";

export const initialUsersState = {
	inited: null, 
	regStatus: {
		username: '',
		regInfo: [],
		isRegister: false,
	},
	registers: [],
	loginStatus: {
		username: '',
		password: '',
		isLogin: false,
	},
	isLocked: true,
};

const usersReducer = (state = initialUsersState, action = {}) => {
	
	console.log(">>>>>[users.reducer.js]::usersReducer - ", action.type, action);

	switch (action.type) {
		case USERS.REQUEST: {	// USERS
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
		case TRIGGER_USERS_REGISTER:
		{
			return {
				...state,
				regStatus: {
					username: action.username || '',
					regInfo: action.regInfo || [],
					isRegister: action.username ? true : false,
				}
			}
		}
		case TRIGGER_USERS_LOGIN:
		{
			return {
				...state,
				loginStatus: {
					username: action.username || '',
					password: action.password || '',
					isLogin: action.username ? true : false,
				},
			}
		}
		case USERS_REGISTER.SUCCESS:
		case USERS_REGISTER.REQUEST:
		case USERS_REGISTER.FAILURE: 
		{
			const reg_status = (action.type === USERS_REGISTER.REQUEST) ? true : false; //!state.isRegister;
			return {
				...state,
				registers: [...state.registers, {...action}],
				isRegister: reg_status
			};
		}

		case USER_UNLOCK.REQUEST: {
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
export default usersReducer;
