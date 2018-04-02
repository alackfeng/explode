import { REHYDRATE } from 'redux-persist';
import { SETTINGS, SETTINGS_CHANGE, SETTINGS_CURRENTACCOUNT } from './types';


export const initialSettingsState = {
  inited: null,
  pending: {
    inited: false,
    currentAccount: false,
    latencyChecks: 0,
  },
  locale: 'zh',
  apiLatencies: { 'wss://blockasset.org/ws': 1901, 'wss://blockasset.net/ws': 1326 },
  currentAccount: 'taurus',
  latencyChecks: 19,
  settings_v3: [],
  unfollowed_accounts: [],
  viewSettings_v1: { 'activeSetting': 0 },
};

export const settingsReducer = (state = initialSettingsState, action = {}) => {
  console.log('+++++[settings.reducer.js]::settingsReducer - ', action.type, action);

  switch (action.type) {
    case REHYDRATE: {	// REHYDRATE
      return {
        ...state,
        ...action.payload,
      };
    }
    case SETTINGS.PENDING: {	// SETTINGS
      return {
        ...state,
        inited: 0,
      };
    }
    case SETTINGS.SUCCESS: {
      return {
        ...state,
        inited: 1,
      };
    }
    case SETTINGS.ERROR: {
      return {
        ...state,
        inited: -1,
      };
    }
    case SETTINGS_CHANGE.PENDING: {	// SETTINGS_CHANGE
      return {
        ...state,
        pending: { ...state.pending, ...action.payload },
      };
    }
    case SETTINGS_CHANGE.SUCCESS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case SETTINGS_CHANGE.ERROR: {
      return {
        ...state,
      };
    }
    case SETTINGS_CURRENTACCOUNT.PENDING: {	// SETTINGS_CURRENTACCOUNT
      return {
        ...state,
        pending: { ...state.pending, ...action.payload },
      };
    }
    case SETTINGS_CURRENTACCOUNT.SUCCESS: {
      return {
        ...state,
        pending: {
          ...state.pending,
          currentAccount: 'over',
        },
        ...action.payload,
      };
    }
    case SETTINGS_CURRENTACCOUNT.ERROR: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
};
