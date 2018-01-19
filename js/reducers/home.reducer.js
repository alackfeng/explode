
import { GET_RANDOM } from "../actions";

const initState = {
  random: null,
};

export default function homeReducer(state = initState, action) {

  //DEBUG console.log(">>>>>[home.reducer.js]::homeReducer - ", action.type, action);

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