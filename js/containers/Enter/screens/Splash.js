import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, Text, Button, ImageBackground } from "react-native";
import { ViewContainer, Colors, Normalize, StyleSheet } from "../../../components";
import { translate, locale } from "../../../libs";

const mapStateToProps = state => ({
  isAuthenticated: state.enter.isAuthenticated,
});

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
    if(isAuthenticated) {
      navigation.navigate('Main');
    } else {
      navigation.navigate('Login');
    }
  }

  setModalVisible = (login) => {

    this.props.navigation.navigate(login ? 'Login' : 'Register');
  }

	render() {

    const { navigation } = this.props;

		return (
			<View style={styles.logoContainer} >
				<Image 
          style={styles.logo}
          source={require('../images/logo-black.png')}
        >
            
        </Image>
        <Text style={styles.title}>
          {translate('enter.splash.welcomeTitle', locale)}
        </Text>

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
        
			</View>
		);
	}
}

export const SplashScreen = Splash;
