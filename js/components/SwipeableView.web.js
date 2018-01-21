
import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";
import { Colors as colors } from "../libs/Colors";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
} from 'react-native';

//import { Button } from 'react-native-elements';
import { Icon } from '../components/Icon';
import { normalize } from "../libs/help";

export const SwipeableView = () => (
	<SwipeableViews style={Object.assign({}, styles.slideContainer)} index={1} enableMouseEvents>
		<div style={Object.assign({}, styles.slide, styles.slide1)}>
      <Image
        style={styles.logo}
        source={require('../containers/Enter/images/logo-black.png')}
      />
      slide n°1
    </div>
    <div style={Object.assign({}, styles.slide, styles.slide2)}>
      <Icon
        style={styles.iconMargin}
        color={colors.white}
        size={85}
        name="home"
        type="octicon"
      />
      slide n°2
    </div>
    <div style={Object.assign({}, styles.slide, styles.slide3)}>
      slide n°3
    </div>
    <div style={Object.assign({}, styles.slide, styles.slide4)}>
      slide n°4
      <Button
        title={'cancel'}
        buttonStyle={styles.button}
        disabled={true}
        textStyle={styles.buttonText}
        onPress={() => this.props.onLogin(true)}
      />

    </div>
	</SwipeableViews>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.transparent,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 30,
    shadowColor: colors.transparent,
  },
  buttonText: {
   // ...fonts.fontPrimaryBold,
    fontSize: normalize(12),
  },
  slideContainer: {
    alignItems: 'center'
  },
  logo: {
    width: 90,
    height: 90,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  slide1: {
    backgroundColor: colors.lightBlue,
  },
  slide2: {
    backgroundColor: colors.lightPurple,
  },
  slide3: {
    backgroundColor: colors.orange,
  },
  slide4: {
    backgroundColor: colors.darkGreen,
  },
  iconMargin: {
    marginLeft: 20,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
