

import React, { Component } from 'react';

import { Dimensions, StyleSheet, View, Text, Image, ImageBackground } from 'react-native';

import { Tile, Button } from 'react-native-elements';

import { SCREEN_WIDTH, SCREEN_HEIGHT, translate, locale } from '../libs';
import { ViewContainer } from '../components';

import SplashTile from './SplashTile';
import { resetNavigationTo } from '../libs/help';

const TRACE = false;

export class SplashScreen extends Component {
  props: {
    navigation: Object,
  }

	onPressloginAndReg = (login) => {
	  if (this.props.navigation) {
	    this.props.navigation.navigate(login ? 'Login' : 'Register');
	  }
	  // resetNavigationTo(login ? 'Login' : 'Register', this.props.navigation);
	}

	render() {
	  return (
  <ViewContainer>
    <SplashTile
      containerStyle={styles.container}
      imageSrc={require('./images/background.jpeg')}
      imageContainerStyle={styles.image}
      overlayContainerStyle={{ justifyContent: 'space-around' }}
      featured
      height={SCREEN_HEIGHT}
      width={SCREEN_WIDTH}
      view={View}
      childrenContainerStyle={styles.children}
      icon={{ source: require('./images/tokenfunicon.png') }}
      iconStyle={styles.icon}
    >
      <View style={{
 flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',
}}
      >
        <Button
          text={translate('enter.splash.signInButton', locale)}
          buttonStyle={styles.button}
          textStyle={{ fontWeight: 'bold' }}
          containerStyle={{
 marginTop: 0, height: 50, flex: 1, justifyContent: 'flex-end',
}}
          onPress={() => this.onPressloginAndReg(true)}
        />
        <Button
          text={translate('enter.splash.registerInButton', locale)}
          buttonStyle={styles.button}
          textStyle={{ fontWeight: 'bold' }}
          containerStyle={{
 marginTop: 0, height: 50, flex: 1, justifyContent: 'flex-start',
}}
          onPress={() => this.onPressloginAndReg(false)}
        />
      </View>
    </SplashTile>
  </ViewContainer>
	  );
	}
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-around',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  icon: {
    width: 90,
    height: 106,
    marginTop: 30,
  },
  title: {
    color: 'white',
  },
  children: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  button: {
    marginBottom: 10,
    height: 50,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
};

