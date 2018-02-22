import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, Text, ImageBackground } from "react-native";
import { ViewContainer, StyleSheet } from "../../../components";
import { Colors } from "../../../libs/Colors";
import { translate, locale } from "../../../libs";
import { resetNavigationTo } from "../../../libs/help";

import { SwipeableView, SplashScreen as SplashScreenA } from "../../../components";

import { Button, Icon } from 'react-native-elements';


import {Apis} from "assetfunjs-ws";
import {ChainStore} from "assetfunjs/es";


const mapStateToProps = state => ({
  isAuthenticated: state.app.currentAccount,
});

const styles = StyleSheet.create({
});

class Splash extends Component {
  props: {
    isAuthenticated: boolean,
    navigation: Object,
  }

  componentDidMount() {
    const { isAuthenticated, navigation } = this.props;
    console.log("=====[Splash.js]::componentDidMount - isAuthenticated - ", isAuthenticated);

    if(isAuthenticated) { // 已经使用过直接跳转到主导航

      resetNavigationTo('Main', navigation);
    } else { // 否则显示splash页面，钱包介绍说明
      //resetNavigationTo('Login', navigation);
    }

  }

	render() {

    const { navigation, isAuthenticated } = this.props;

		return (
			<ViewContainer>
        <SplashScreenA navigation={navigation} />
			</ViewContainer>
		);
	}
}

export const SplashScreen = connect(mapStateToProps)(Splash);
