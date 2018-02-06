
import { USERS_LOGIN, USERS_REGISTER, USERS_UNLOCK, LOAD_USERS, TRIGGER_USERS_REGISTER, TRIGGER_USERS_LOGIN, TRIGGER_USERS_UNLOCK, RESET_TRIGGER_USERS } from "../actions";

export const initialUsersState = {
	entityReg: {
		isRegister: false,
		raw: {},
		transaction: [],
	},
	entityLogin: {
		isLogin: false,
		raw: {},
		transaction: [],
	},
	entityUnLock: {
		isOpen: false,
		isUnLock: false,
		raw: {},
		transaction: [],
	},
};

const usersReducer = (state = initialUsersState, action = {}) => {
	
	console.log(">>>>>[users.reducer.js]::usersReducer - ", action.type, action);

	switch (action.type) {
		case RESET_TRIGGER_USERS:
		{
			return {
				...state,
				entityReg: {
					isRegister: false,
					raw: {},
					transaction: [],
				},
				entityLogin: {
					isLogin: false,
					raw: {},
					transaction: [],
				}
			}
		}
		case TRIGGER_USERS_REGISTER:
		{
			return {
				...state,
				entityReg: {
					isRegister: action.username ? true : false,
					raw: action || {},
					transaction: [],
				}
			}
		}
		case TRIGGER_USERS_LOGIN:
		{
			return {
				...state,
				entityLogin: {
					isLogin: action.username ? true : false,
					raw: action || {},
					transaction: [],
				}
			}
		}
		case TRIGGER_USERS_UNLOCK:
		{


			return {
				...state,
				entityUnLock: {
					isOpen: (action.extra && action.extra.isOpen) || false,
					isUnLock: action.username ? true : false,
					raw: action || {},
					transaction: [],
				}
			}
		}
		case USERS_REGISTER.SUCCESS:
		case USERS_REGISTER.REQUEST:
		case USERS_REGISTER.FAILURE: 
		{
			const reg_status = (action.type === USERS_REGISTER.REQUEST) ? true : false; //!state.isRegister;
			return {
				...state,
				entityReg: {
					isRegister: reg_status,
					raw: state.entityReg.raw,
					transaction: [{...action}, ...state.entityReg.transaction],
				}
			};
		}
		case USERS_LOGIN.SUCCESS:
		case USERS_LOGIN.REQUEST:
		case USERS_LOGIN.FAILURE: 
		{
			const login_status = (action.type === USERS_LOGIN.REQUEST) ? true : false; //!state.isRegister;
			return {
				...state,
				entityLogin: {
					isLogin: login_status,
					raw: state.entityLogin.raw,
					transaction: [{...action}, ...state.entityLogin.transaction],
				}
			};
		}
		case USERS_UNLOCK.SUCCESS:
		case USERS_UNLOCK.REQUEST:
		case USERS_UNLOCK.FAILURE:
		{
			const unlock_status = (action.type === USERS_UNLOCK.REQUEST) ? true : false; //!state.isRegister;
			return {
				...state,
				entityUnLock: {
					isUnLock: unlock_status,
					raw: state.entityUnLock.raw,
					transaction: [{...action}, ...state.entityUnLock.transaction],
				}
			};
		}
		case LOAD_USERS:
		default:
			return state;
	}
};
export default usersReducer;
