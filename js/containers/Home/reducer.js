import {
  REHYDRATE,
} from 'redux-persist';

import { GET_RANDOM } from "../../actions";

const initState = {
  random: null,
};

export default function home(state = initState, action) {
  switch (action.type) {
    case GET_RANDOM: {
      return {
        ...state,
        random: action.payload.random,
      };
    }
    default:
      return state;
  }
}
