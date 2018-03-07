import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, Text, Platform } from "react-native";
import LaunchScreen from "./components/LaunchScreen";

//import { SplashScreen as LaunchScreen } from "./components/SplashScreen";

import { ChainStore, FetchChain } from "assetfunjs/es";
import { ViewContainer, UnLockModal, TransactionConfirmModal } from "./components";


import {
  connect,
} from 'react-redux';

import './libs';

import AppNavigator from './navigator';
import URIWrapper from './URIWrapper';


import { initConnect, nodeConnect, updateRpcConnectionStatus } from "./actions";
import { willTransitionTo, switchLanguage } from "./libs";
import { Apis } from "assetfunjs-ws";

import { nodeList } from "./env";

import SplashScreen from 'react-native-splash-screen';

const TRACE = false;

console.disableYellowBox = true;
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];

const NavigationWrappedApp = URIWrapper(AppNavigator);

class App extends Component {

  props: {
    appReady: PropTypes.bool,
    nav: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super(props);
    console.log("=====[App.js]::constructor - init ", props);

    this.state = {
      synced: false,
      connected: false,
      force: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("=====[App.js]::componentWillReceiveProps - props > : ", nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("=====[App.js]::shouldComponentUpdate - props > : ", nextProps, nextState);
    return true;
  }

  componentWillMount() {
    console.log("=====[App.js]::componentWillMount - init");

    this.props.dispatch(initConnect([], null))

        // change locale
    //if(this.props.locale && switchLanguage)
    //  switchLanguage(this.props.locale); //this.locale
  }

  componentDidMount() {
    //if(appReady) {

      // 关闭启动屏
      if(Platform.OS !== 'web') {
        SplashScreen.hide();
      }

      console.log("=====[App.js]::componentDidMount - init appReady - ", this.props.appReady);
      let appReady = this.props.appReady;

      /*
       * APP启动时直接尝试连接节点
       * 状态说明：
       * init - 初始化节点信息
       * connected - 连接节点
       * synced - 获取节点数据OK
       * error - 获取节点数据错误
       * reset - url已经被切换掉
      */

      let nodeTransition = (res, nodeList, st) => {
        console.log("=====[App.js]::nodeTransition - call api...", res, st, appReady, this.state.connected, this.state.synced);
        const url = res;

        if(st === 'init') {
          this.props.dispatch(nodeConnect(nodeList, url));
        }

        //获取数据
        if(st === 'connect') {
          this.setState({connected: true})
          ChainStore.init().then(() => {
            console.log("=====[App.js]::componentDidMount - ChainStore.init synced ok - ", Apis.instance().chain_id);
            this.setState({synced: true, force: 'over'});

          }).catch(error => {
            let syncFail = ChainStore.subError && (ChainStore.subError.message === "ChainStore sync error, please check your system clock") ? true : false;
            console.error("=====[App.js]::componentDidMount - ChainStore.init synced error -", syncFail, error, ChainStore.subError);

            // 同步节点失败，更新状态
            const status = syncFail ? 'clock' : 'error';
            this.props.dispatch(updateRpcConnectionStatus(status, url));

            // 失败时，也加载导航
            this.setState({force: status});
          });
        } 

        // 增加一些异常处理
        if(st === 'init-error' || st === 'reset-error' || st === 'check') {
          this.props.dispatch(nodeConnect(nodeList, url));
        }
      };

      willTransitionTo(null, null, nodeTransition);

      // 更新节点状态信息, listen status callback
      Apis.setRpcConnectionStatusCallback(this.updateRpcConnectionStatusCallback.bind(this));
      //console.log("=====[App.js]::componentDidMount - init Apis instance - ", Apis.instance().chain_id);
    //}
  }

  updateRpcConnectionStatusCallback = (status, url) => {
    console.log("=====[App.js]::updateRpcConnectionStatusCallback - ", status, url);
    this.props.dispatch(updateRpcConnectionStatus(status, url));
  }


  nodeOK() {
    const { nodeStatus } = this.props;
    const { synced, connected, force } = this.state;

    // 暂时不判断这些状态，默认行为
    return force || (synced && connected && (nodeStatus.status === 'open'));
  }

  render() {
    const {
      appReady,
      dispatch,
      nav,
    } = this.props;

    console.log("=====[App.js]::App ready - ", appReady, this.state.synced, this.state.connected, " , nav - ", JSON.stringify(nav.routes.length));

    
    // launch screen
    if(!appReady || !this.nodeOK()) {
      console.log("=====[App.js]::App appReady - ", appReady);
      return <LaunchScreen />
    }

    // enter app
    return (
    <ViewContainer>
      <UnLockModal />
      <TransactionConfirmModal />
      <NavigationWrappedApp
        dispatch={dispatch}
        state={nav}
        appReady={appReady}
      />
    </ViewContainer>
    );
  };

}

function mapStateToProps(state) {
  return {
    appReady: state.app.appReady,
    nav: state.nav,
    nodeStatus: state.app.nodeStatus,
    locale: state.app.locale,
  };
}

export default connect(mapStateToProps)(App);
