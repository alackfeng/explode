import React from 'react';
import {
  Provider,
} from 'react-redux';
import {
  getStore,
} from './store/store';
import App from './App';
// import Playground from "./Playground"; // 用于测试UI View, 直接修改Playground中的Module，并在Provider子组件加载
console.log("==================== store", getStore());
const ClientApp = () => {
  return (
    <Provider store={getStore()}>
      <App />
    </Provider>
  );
};

export default ClientApp;
