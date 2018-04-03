

import React, { Component } from 'react';

import { Dimensions, StyleSheet, View, Text, Image, ImageBackground, ActivityIndicator, StatusBar } from 'react-native';

import { Tile, Button } from 'react-native-elements';

import { SCREEN_WIDTH, SCREEN_HEIGHT, translate, locale } from '../libs';
import { ViewContainer } from '../components';
import { loadingAnimation } from '../libs/help';
import { Colors as colors } from '../libs/Colors';


import SplashTile from './SplashTile';


const TRACE = false;

class LaunchScreen extends Component {
  constructor() {
    super();
    this.state = {
      animating: true,
    };
  }

  componentDidMount() {
    // loadingAnimation(this.state.fadeAnimValue).start();
  }

  render() {
    return (
      <ViewContainer>
        <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />
        <SplashTile
          containerStyle={styles.container}
          imageSrc={require('./images/background.jpeg')}
          imageContainerStyle={styles.image}
          overlayContainerStyle={{ justifyContent: 'flex-start' }}
          featured
          height={SCREEN_HEIGHT}
          width={SCREEN_WIDTH}
          view={View}
          childrenContainerStyle={styles.children}
          icon={{ source: require('./images/tokenpiiicon.png') }}
          iconStyle={styles.icon}
        >
          <Text style={styles.centering}>{ translate('enter.splash.connectnode', locale) }</Text>
          <ActivityIndicator
            style={[styles.centering, { height: 80 }]}
            animating={this.state.animating}
            size="large"
            color={colors.salmon}
          />
        </SplashTile>
      </ViewContainer>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    backgroundColor: 'transparent',
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    color: 'white',
  },
};

LaunchScreen.__cards__ = (define) => {
  define('Default', _ => <LaunchScreen />);
};
export default LaunchScreen;
