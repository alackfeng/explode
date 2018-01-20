
import { SET_APP_READY, SET_APP_LOCALE, APP_FOREVER_SAVE_KEY, APP_FOREVER_INIT_NODES, APP_FOREVER_CHANGE_RPC_STATUS } from '../actions';

import { TRIGGER_USERS_REGISTER, TRIGGER_USERS_LOGIN } from "../actions";

/*
// redux trigger
app 相关全局设置存储在本地上，
*/

const initState = {
  appReady: false,
  locale: 'en',
  users: {},
  transactions: [],
  accounts: [],
  currentAccount: null,
  nodesApi: [],
  nodeStatus: {
    url: null,
    status: null,
  }
};

/**
 * Data that shouldn't be persisted across sessions can be saved here
 */
export default function appReducer(state = initState, action) {

  //DEBUG console.log(">>>>>[app.reducer.js]::appReducer - ", action.type, action);

  switch (action.type) {
    case SET_APP_READY: {
      return {
        ...state,
        appReady: action.appReady,
      };
    }
    case SET_APP_LOCALE: {
      return {
        ...state,
        locale: action.locale,
      };
    }
    case TRIGGER_USERS_LOGIN: {
      return {
        ...state,
        transactions: [...state.transactions, action],
      };
    }
    case TRIGGER_USERS_REGISTER: {
      return {
        ...state,
        //transactions: [...state.transactions, action],
      };
    }
    case APP_FOREVER_SAVE_KEY: {
      return {
        ...state,
        accounts: [...state.accounts, {username: action.username, keys: action.keys}],
        currentAccount: action.username,
      }
    }
    case APP_FOREVER_INIT_NODES: {
      return {
        ...state,
        nodesApi: action.nodes,
        nodeStatus: {
          url: action.url,
          status: state.nodeStatus.status
        }
      }
    }
    case APP_FOREVER_CHANGE_RPC_STATUS: {
      return {
        ...state,
        nodeStatus: {
          url: state.nodeStatus.url,
          status: action.status,
        }
      }
    }
    default:
      return state;
  }
}
