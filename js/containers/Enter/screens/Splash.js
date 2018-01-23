import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, Text, ImageBackground } from "react-native";
import { ViewContainer, Normalize, StyleSheet } from "../../../components";
import { Colors } from "../../../libs/Colors";
import { translate, locale } from "../../../libs";
import { resetNavigationTo } from "../../../libs/help";

import { SwipeableView } from "../../../components";

import { Button, Icon } from 'react-native-elements';

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

    if(1 || isAuthenticated) { // 已经使用过直接跳转到主导航
      resetNavigationTo('Main', navigation);
    } else { // 否则显示splash页面，钱包介绍说明
      resetNavigationTo('Login', navigation);
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
            text="登录"
            icon={
              <Icon
                name='3d-rotation'
                size={15}
                color='white'
              />
            }
            iconContainerStyle={{marginRight: 10}}
            textStyle={{fontWeight: '700'}}
            buttonStyle={{backgroundColor: 'rgba(90, 154, 230, 1)', width: 130, borderColor: 'transparent', borderWidth: 0, borderRadius: 30}}
            containerStyle={{marginTop: 20}}
            onPress={() => this.setModalVisible(true)}
          />
          <Button
            text="注册"
            icon={
              <Icon
                name='3d-rotation'
                size={15}
                color='white'
              />
            }
            iconRight
            iconContainerStyle={{marginLeft: 10}}
            textStyle={{fontWeight: '700'}}
            buttonStyle={{backgroundColor: 'rgba(199, 43, 98, 1)', width: 150, borderColor: 'transparent', borderWidth: 0, borderRadius: 30}}
            containerStyle={{marginTop: 20}}
            onPress={() => this.setModalVisible(false)}
          />
        </View>
        
			</ViewContainer>
		);
	}
}

export const SplashScreen = Splash;
