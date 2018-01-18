import {
  combineReducers,
} from 'redux';

import AppNavigator from '../../navigator';

import transient from '../reducers/transient';
import home from '../../containers/Home/reducer';
import { enterReducer } from "../../containers/Enter/reducer";
import { walletReducer } from "../../containers/Users/wallet.reducer";
import { settingsReducer } from "../../containers/Users/settings.reducer";
import { usersReducer } from "../../containers/Users/users.reducer";

export default {
  transient,
  nav: (state, action) => {
    return AppNavigator.router.getStateForAction(action, state) || state;
  },
  home,
  enter: enterReducer,
  wallet: walletReducer,
  settings: settingsReducer,
  users: usersReducer, 
};
