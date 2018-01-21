import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import SwipeableViews from 'react-swipeable-views-native';
// There is another version using the scroll component instead of animated.
// I'm unsure which one give the best UX. Please give us some feedback.
// import SwipeableViews from 'react-swipeable-views-native/lib/SwipeableViews.scroll';
import { Colors as colors } from "../libs/Colors";
import { Button, Icon } from 'react-native-elements';
import { normalize } from "../libs/help";



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
    height: 100,
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

export const SwipeableView = () => (
  <SwipeableViews style={styles.slideContainer} index={1}>
    <View style={[styles.slide, styles.slide1]}>
      <Image
        style={styles.logo}
        source={require('../containers/Enter/images/logo-black.png')}
      />
      <Text style={styles.text}>
        slide n°1
      </Text>
    </View>
    <View style={[styles.slide, styles.slide2]}>
      <Icon
        style={styles.iconMargin}
        color={colors.white}
        size={85}
        name="bell"
        type="octicon"
      />
      <Text style={styles.text}>
        slide n°2
      </Text>
    </View>
    <View style={[styles.slide, styles.slide3]}>
      <Text style={styles.text}>
        slide n°3
      </Text>
    </View>
    <View style={[styles.slide, styles.slide4]}>
      <Text style={styles.text}>
        slide n°4
      </Text>
      <Button
        title={'cancel'}
        buttonStyle={styles.button}
        disabled={true}
        textStyle={styles.buttonText}
        onPress={() => this.props.onLogin(true)}
      />
    </View>
  </SwipeableViews>
);
