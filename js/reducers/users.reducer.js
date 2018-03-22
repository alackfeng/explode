
import { USERS_LOGIN, USERS_REGISTER, USERS_UNLOCK, LOAD_USERS, TRIGGER_USERS_REGISTER, TRIGGER_USERS_LOGIN, TRIGGER_USERS_UNLOCK, RESET_TRIGGER_USERS, SEARCH_ACCOUNT } from "../actions";

export const initialState = {
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
	entitySearch: {
		searchTerm: '',
		searchAccounts: []
	}
};

const usersReducer = (state = initialState, action = {}) => {
	
	console.log(">>>>>[users.reducer.js]::usersReducer - ", action.type, action);

	switch (action.type) {

		case RESET_TRIGGER_USERS:
		{
			
			const reg = action.oper === TRIGGER_USERS_REGISTER ? initialState.entityReg : state.entityReg;
			const login = action.oper === TRIGGER_USERS_LOGIN ? initialState.entityLogin : state.entityLogin;
			const unlock = action.oper === TRIGGER_USERS_UNLOCK ? initialState.entityUnLock : state.entityUnLock;

			return {
				...state,
				entityReg: {
					...reg
				},
				entityLogin: {
					...login
				},
				entityUnLock: {
					...unlock
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

			if(action.extra && (action.extra.type === 'open' || action.extra.type === 'close')) {
				const isOpen = action.extra.type === 'open';
				return {
					...state,
					entityUnLock: {
						isOpen: isOpen || false,
						isUnLock: state.entityUnLock.isUnLock || false,
						raw: {},
						transaction: [],
					}
				}				
			} else {

				const isLock = action.extra.type === 'lock' ? true : false ;

				return {
					...state,
					entityUnLock: {
						isOpen: state.entityUnLock.isOpen || false,
						isUnLock: action.username ? !isLock : false,
						raw: action || {},
						transaction: [],
					}
				}
			}

		}
		case USERS_REGISTER.SUCCESS:
		case USERS_REGISTER.REQUEST:
		case USERS_REGISTER.FAILURE: 
		case USERS_REGISTER.EVENT:
		{
			const reg_status = (action.type === USERS_REGISTER.SUCCESS) ? true : false;
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
		case USERS_LOGIN.EVENT:
		{
			const login_status = (action.type === USERS_LOGIN.SUCCESS) ? true : false;
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
		case USERS_UNLOCK.EVENT:
		{
			const isopen_status = (action.type === USERS_UNLOCK.SUCCESS) ? true /*false*/ : state.entityUnLock.isOpen;
			const unlock_status = (action.type === USERS_UNLOCK.SUCCESS) ? true : false;

			// 锁定不需要打开对话框
			const isLock = (state.entityUnLock.raw && state.entityUnLock.raw.extra && state.entityUnLock.raw.extra.type === 'lock') ? true : false ;

			return {
				...state,
				entityUnLock: {
					isOpen: isLock ? false : isopen_status,
					isUnLock: isLock ? false : unlock_status,
					raw: isLock ? {} : state.entityUnLock.raw,
					transaction: isLock ? [] : [{...action}, ...state.entityUnLock.transaction],
				}
			};
		}
		case SEARCH_ACCOUNT: {
			return {
				...state,
				entitySearch: {
					searchTerm: action.searchTerm,
					searchAccounts: action.searchAccounts,
				}
			}
		}
		case LOAD_USERS:
		default:
			return state;
	}
};
export default usersReducer;
