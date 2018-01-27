import {
  combineReducers,
} from 'redux';

import AppNavigator from '../navigator';

import appReducer from "./app.reducer";
import homeReducer from "./home.reducer";
import usersReducer from "./users.reducer";
import commReducer from "./comm.reducer";

//import { enterReducer } from "../containers/Enter/reducer";
//import { walletReducer } from "../containers/Users/wallet.reducer";
//import { settingsReducer } from "../containers/Users/settings.reducer";

export default {
  app: appReducer,
  nav: (state, action) => {
    //DEBUG console.log("!!!!!!!!!!!!!!![Reducer.js]::nav - ", action);
    return AppNavigator.router.getStateForAction(action, state) || state;
  },
  home: homeReducer,
  users: usersReducer, 
  comm: commReducer,
  //enter: enterReducer,
  //wallet: walletReducer,
  //settings: settingsReducer,
  
};
