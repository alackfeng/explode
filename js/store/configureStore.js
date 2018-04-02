/* eslint-disable */
import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import {
  persistStore,
  persistCombineReducers,
} from 'redux-persist';

import thunkMiddleware from 'redux-thunk';
// import loggerMiddleware from './middlewares/logger';

// add logger promise array to middleware
import { createLogger } from 'redux-logger';
import promise from './promise';
import array from './array';
// import analytics from './analytics';
import { isDebuggingInChrome } from '../env';

import storageEngine from './storageEngine';
import reducers from '../reducers';
import { SET_APP_READY, initConnect } from '../actions';

// add support redux saga
import 'regenerator-runtime/runtime';
import createSagaMiddleware, { END } from 'redux-saga';



const sagaMiddleware = createSagaMiddleware();


// const isDebuggingInChrome = true;
const logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

const persistConfig = {
  key: 'app:',
  // don't restore data from these reducers
  blacklist: [
    // 'app',
    'nav',
    'comm',
    'users',
  ],
  storage: storageEngine,
};

const reducer = persistCombineReducers(persistConfig, reducers);

/* eslint-enable */

let store;

/**
 * exportable function for creating the store
 * (exported for use with server-side rendering)
 */
export function generateStore(initialState /* hydrate = true */) {
  // conditionally add args to store
  const args = [
    // hydrate ? autoRehydrate() : null,
    applyMiddleware(
      sagaMiddleware, thunkMiddleware, promise,
      array, /* analytics, loggerMiddleware, */ logger
    ),
  ].filter(arg => arg !== null);


  // create the store
  return createStore(
    reducer,
    initialState,
    compose(...args)
  );
}

/**
 *  start out the app with the stored state
 */
function init() {
  let preloadedState;
  if (
    typeof window !== 'undefined'
    && window.__PRELOADED_STATE__
  ) {
    preloadedState = window.__PRELOADED_STATE__;
    delete window.__PRELOADED_STATE__;
  }
  store = generateStore(preloadedState);
  persistStore(store, null, () => {
    // called when rehydration complete

    store.dispatch(initConnect([], null)); // 清理节点数据
    store.dispatch({
      type: SET_APP_READY,
      appReady: true,
    });
  });

  // add support redux saga
  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);

  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}

/**
 * Clear contents of store
 */
export function clearStore() {
  if (store) {
    persistStore(store, persistConfig).purge();
  }
}

/**
 * Get a reference to the store
 */
export function getStore() {
  if (!store) {
    store = init();
  }
  return store;
}
