
import { SET_APP_READY, SET_APP_LOCALE, APP_FOREVER_SAVE_KEY, APP_FOREVER_USER_QUIT, APP_FOREVER_INIT_NODES, APP_FOREVER_UPDATE_NODES, APP_FOREVER_CHANGE_RPC_STATUS } from '../actions';

/*
// redux trigger
app 相关全局设置存储在本地上，
*/

export type AuthAccount = {
  username: string,
  chain_id: string,
  encrypted_key: string,
  password_pubkey: string,
  keys: {
    pubKey: string // "privKey"
  }
};

export type nodesApi = {
  url: string,
  location: string,
  status: string,
  latency: int,
};


const initState = {
  appReady: false,
  locale: 'en',
  authAccounts: [],
  currentAccount: null,
  nodesApi: [],
  nodeStatus: {
    url: null,
    status: null,
  },
};

/**
 * Data that shouldn't be persisted across sessions can be saved here
 */
export default function appReducer(state = initState, action) {
  console.log('>>>>>[app.reducer.js]::appReducer - ', action.type, action);

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
    case APP_FOREVER_USER_QUIT: {
      const original = state.authAccounts.filter((key) => {
        // /console.log("--------------------- original ", key);
        if (!key || !key.username || !action.username) {
          return;
        }
        return (key.username !== action.username);
      });

      const account = original.length ? original[0].username : null;

      return {
        ...state,
        authAccounts: [...original],
        currentAccount: account,
      };
    }
    case APP_FOREVER_SAVE_KEY: {
      const original = state.authAccounts.filter((key) => {
        // /console.log("--------------------- original ", key);
        if (!key || !key.username || !action.username) {
          return;
        }
        return (key.username !== action.username);
      });

      return {
        ...state,
        authAccounts: [...original, { username: action.username, authAccount: action.keys }],
        currentAccount: action.username,
      };
    }
    case APP_FOREVER_INIT_NODES: {
      return {
        ...state,
        nodesApi: action.nodes,
        nodeStatus: {
          url: null, // not use action.url,
          status: null,
        },
      };
    }
    case APP_FOREVER_UPDATE_NODES: {
      return {
        ...state,
        nodesApi: action.nodes ? action.nodes : state.nodesApi,
        nodeStatus: {
          url: action.url,
          status: action.url !== state.nodeStatus.url ? 'reset' : state.nodeStatus.status,
        },
      };
    }
    case APP_FOREVER_CHANGE_RPC_STATUS: {
      if (action.url !== state.nodeStatus.url) {
        return state;
      }

      // 只变更相应url的状态
      const changeStatus = (action.status === 'reconnect' ? state.nodeStatus.status : action.status);
      return {
        ...state,
        nodeStatus: {
          url: action.url ? action.url : state.nodeStatus.url,
          status: changeStatus,
        },
      };
    }
    default:
      return state;
  }
}
