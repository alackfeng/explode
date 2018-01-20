
import { SET_APP_READY, SET_APP_LOCALE, } from '../actions';

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
    default:
      return state;
  }
}
