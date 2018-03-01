
import { TRANSACTION_COMMON, TRIGGER_TRANSACTION_COMMON, CLOSE_TRANSACTION_COMMON } from "../actions";

export const initialState = {
	trans: {
		isOpen: false,
		reason: null,
		raw: {},
		transaction: [],
	},
};

const commReducer = (state = initialState, action = {}) => {
	
	console.log(">>>>>[comm.reducer.js]::commReducer - ", action.type, action);

	switch (action.type) {
		case TRIGGER_TRANSACTION_COMMON:
		{
			return {
				...state,
				trans: {
					isOpen: action.username ? true : false,
					raw: action || {},
					transaction: [],
				}
			}
		}
		case CLOSE_TRANSACTION_COMMON: {
			return {
				...state,
				trans: {
					trans: [], //应该清理历史 ...state.trans,
					raw: {},
					isOpen: false,
					reason: action.reason,
				}
			}
		}
		case TRANSACTION_COMMON.SUCCESS:
		case TRANSACTION_COMMON.REQUEST:
		case TRANSACTION_COMMON.FAILURE: 
		{
			return {
				...state,
				trans: {
					isOpen: true,
					raw: state.trans.raw,
					transaction: [{...action}, ...state.trans.transaction],
				}
			};
		}
		default:
			return state;
	}
};
export default commReducer;
