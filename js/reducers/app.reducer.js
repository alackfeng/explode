import { SET_APP_READY } from '../actions';

const initState = {
  appReady: false,
};

/**
 * Data that shouldn't be persisted across sessions can be saved here
 */
export default function appReducer(state = initState, action) {
  switch (action.type) {
    case SET_APP_READY: {
      return {
        ...state,
        appReady: action.appReady,
      };
    }
    default:
      return state;
  }
}
