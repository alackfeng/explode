import React from 'react';
import {
  Provider,
} from 'react-redux';
import {
  getStore,
} from './store/configureStore';
import App from './App';
// import Playground from "./Playground"; // 用于测试UI View, 直接修改Playground中的Module，并在Provider子组件加载

// add support redux saga
import rootSaga from './sagas';
const store = getStore(); 
store.runSaga(rootSaga).done.then(() => {
	console.log('sagas complete');
}).catch( (e) => {
	console.error('sagas error : ', e.message);
});

console.log("==================== store", "store", "**************\n", "rootSaga");

const ClientApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default ClientApp;
