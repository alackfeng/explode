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
import { willTransitionTo } from "./libs";
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
  }

  componentDidMount() {
    //if(appReady) {

      if(Platform.OS !== 'web') {
        SplashScreen.hide();
      }

      console.log("=====[App.js]::componentDidMount - init appReady - ", this.props.appReady);
      let appReady = this.props.appReady;

      // app启动时直接尝试连接节点
      let nodeTransition = (res, nodeList, st) => {
        console.log("=====[App.js]::nodeConnect - call api...", res, st, appReady, this.state.connected, this.state.synced);
        const url = res;

        if(st === 'init') {
          this.props.dispatch(nodeConnect(nodeList, url));
        }

        //获取数据
        if(st === 'connect') {
          this.setState({connected: true})
          ChainStore.init().then(() => {
            console.log("=====[App.js]::componentDidMount - ChainStore.init synced ok - ", Apis.instance().chain_id);
            this.setState({synced: true});

          }).catch(error => {
            let syncFail = ChainStore.subError && (ChainStore.subError.message === "ChainStore sync error, please check your system clock") ? true : false;
            console.error("=====[App.js]::componentDidMount - ChainStore.init synced error -", syncFail, error, ChainStore.subError);

            // 同步节点失败，更新状态
            this.props.dispatch(updateRpcConnectionStatus(syncFail ? 'clock' : 'error', url));
          });
        } 
      };

      willTransitionTo(null, null, nodeTransition);

      // listen status callback
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
    const { synced, connected } = this.state;

    // 暂时不判断这些状态，默认行为
    return 1 || synced && connected && (nodeStatus.status === 'open');
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
  };
}

export default connect(mapStateToProps)(App);
