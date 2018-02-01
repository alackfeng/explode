import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, Text } from "react-native";
import LaunchScreen from "./components/LaunchScreen";


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

const TRACE = false;

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
  }

  componentWillMount() {
    console.log("=====[App.js]::componentWillMount - init");

    this.props.dispatch(initConnect([], null))
  }

  componentDidMount() {
    //if(appReady) {

      console.log("=====[App.js]::componentDidMount - init appReady - ", this.props.appReady);

      // app启动时直接尝试连接节点
      let nodeTransition = (res, nodeList) => {
        console.log("=====[App.js]::nodeConnect - call api...", res);
        const url = res;
        this.props.dispatch(nodeConnect(nodeList, url));
      };

      willTransitionTo(null, null, nodeTransition);

      // listen status callback
      Apis.setRpcConnectionStatusCallback(this.updateRpcConnectionStatusCallback.bind(this));
    //}
  }

  updateRpcConnectionStatusCallback = (status, url) => {
    console.log("=====[App.js]::updateRpcConnectionStatusCallback - ", status, url);
    this.props.dispatch(updateRpcConnectionStatus(status, url));
  }



  render() {
    const {
      appReady,
      dispatch,
      nav,
    } = this.props;

    console.log("=====[App.js]::App ready - ", appReady, " , nav - ", JSON.stringify(nav.routes.length));

    
    // launch screen
    if(!appReady) {
      console.log("=====[App.js]::App appReady - ", appReady);
      return <LaunchScreen />
    }

    // enter app
    return (
      <NavigationWrappedApp
        dispatch={dispatch}
        state={nav}
        appReady={appReady}
      />
    );
  };

}

function mapStateToProps(state) {
  return {
    appReady: state.app.appReady,
    nav: state.nav,
  };
}

export default connect(mapStateToProps)(App);
