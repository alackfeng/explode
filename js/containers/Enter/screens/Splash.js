import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, Text, ImageBackground } from "react-native";
import { ViewContainer, Normalize, StyleSheet } from "../../../components";
import { Colors } from "../../../libs/Colors";
import { translate, locale } from "../../../libs";
import { resetNavigationTo } from "../../../libs/help";

import { SwipeableView } from "../../../components";

import { Button } from 'react-native-elements';

const mapStateToProps = state => ({
  isAuthenticated: state.app.currentAccount,
});

const styles = StyleSheet.create({
  swipeable: {
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: '100%',
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
    left: 0,
    bottom: 80,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
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
            disabled={false}
            loading={false}
            outline
            //activityIndicatorStyle={{backgroundColor: 'yellow'}}
            large={false}
            iconRight={{name: 'lock',  size: 26}}
            buttonStyle={{backgroundColor: 'blue', borderRadius: 10}}
            textStyle={{textAlign: 'center'}}
            title={translate('enter.splash.signInButton', locale)}
            onPress={() => this.setModalVisible(true)}
          />
          <Button
            raised 
            disabled={false}
            loading={true}
            loadingRight
            outline
            //activityIndicatorStyle={{backgroundColor: 'yellow'}}
            large={false}
            icon={{name: 'home',  size: 26}}
            buttonStyle={{backgroundColor: 'red', borderRadius: 10}}
            textStyle={{textAlign: 'center'}}
            title={translate('enter.splash.registerInButton', locale)}
            onPress={() => this.setModalVisible(false)}
          />
        </View>
        
			</ViewContainer>
		);
	}
}

export const SplashScreen = Splash;
