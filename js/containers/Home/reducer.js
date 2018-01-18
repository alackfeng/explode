import {
  REHYDRATE,
} from 'redux-persist';

import ActionTypes from '../../store/action_types.json';

const initState = {
  random: null,
};

export default function home(state = initState, action) {
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...state,
        ...action.payload.home,
      };
    }
    case ActionTypes.GET_RANDOM: {
      return {
        ...state,
        random: action.payload.random,
      };
    }
    default:
      return state;
  }
}
