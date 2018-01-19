import { DO_STUFF, GET_RANDOM } from "../../actions";

export function getRandomNumber() {
  return {
    type: GET_RANDOM,
    payload: {
      random: Math.floor(Math.random() * 1e6),
    },
  };
}

export function doSomeStuff() {
  return {
    type: DO_STUFF,
    payload: {
      stuff: 2 + 2,
    },
  };
}
