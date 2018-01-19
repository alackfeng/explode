import React from 'react';
import PropTypes from 'prop-types';

import { View, Text } from "react-native";
import LaunchScreen from "./components/LaunchScreen";

import {
  connect,
} from 'react-redux';

import './libs';

import AppNavigator from './navigator';
import URIWrapper from './URIWrapper';

const NavigationWrappedApp = URIWrapper(AppNavigator);

const App = (props) => {
  const {
    appReady,
    dispatch,
    nav,
  } = props;

  console.log("=====[App.js]::App ready - ", appReady, " , nav - ", JSON.stringify(nav.routes.length));

  // launch screen
  if(!props.appReady) {
    console.log("=====[App.js]::App appReady - ", props.appReady);
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

App.propTypes = {
  appReady: PropTypes.bool,
  nav: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    appReady: state.app.appReady,
    nav: state.nav,
  };
}

export default connect(mapStateToProps)(App);
