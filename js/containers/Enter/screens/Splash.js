import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, Text, Button, ImageBackground } from "react-native";
import { ViewContainer, Normalize, StyleSheet } from "../../../components";
import { Colors } from "../../../libs/Colors";
import { translate, locale } from "../../../libs";
import { resetNavigationTo } from "../../../libs/help";

import { SwipeableView } from "../../../components";

const mapStateToProps = state => ({
  isAuthenticated: state.app.currentAccount,
});

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //position: 'absolute',
    //top: 0,
    //bottom: 0,
    //left: 0,
    //right: 0,
  },
  logo: {
    position: 'absolute',
    opacity: 0.3,
    resizeMode: 'stretch',
    height: 200,
    width: 200,
    flexWrap: 'wrap',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  slide1: {
    backgroundColor: Colors.lightBlue,
  },
  slide2: {
    backgroundColor: Colors.lightPurple,
  },
  slide3: {
    backgroundColor: Colors.orange,
  },
  slide4: {
    backgroundColor: Colors.darkGreen,
  },
  signInContainer: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
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
      ; //resetNavigationTo('Login', navigation);
    }
  }

  setModalVisible = (login) => {

    resetNavigationTo(login ? 'Login' : 'Register', this.props.navigation);
  }

	render() {

    const { navigation } = this.props;

    if(0)
      return (
        <ViewContainer>
          <SwipeableView />
        </ViewContainer>
      );

		return (
			<ViewContainer>
        <SwipeableView />
        <View style={styles.signInContainer}>
          <Button
            raised
            title={translate('enter.splash.signInButton', locale)}
            onPress={() => this.setModalVisible(true)}
          />
          <Button
            raised
            title={translate('enter.splash.registerInButton', locale)}
            onPress={() => this.setModalVisible(false)}
          />
        </View>
        
			</ViewContainer>
		);
	}
}

export const SplashScreen = Splash;
