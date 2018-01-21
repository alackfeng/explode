import { Colors } from "./Colors";
import { Animated, PixelRatio, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';

//
// Method to normalize size of fonts across devices
//
// Some code taken from https://jsfiddle.net/97ty7yjk/ &
// https://stackoverflow.com/questions/34837342/font-size-on-iphone-6s-plus
//
// author: @xiaoneng
// date: 14/10/2016
// version: 03
//

//const React = require('react-native'); // eslint-disable-line no-undef

//const { PixelRatio, Dimensions } = React;

const pixelRatio = PixelRatio.get();
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

// -- Testing Only --
// const fontScale = PixelRatio.getFontScale();
// const layoutSize = PixelRatio.getPixelSizeForLayoutSize(14);
// console.log('normalizeText getPR ->', pixelRatio);
// console.log('normalizeText getFS ->', fontScale);
// console.log('normalizeText getDH ->', deviceHeight);
// console.log('normalizeText getDW ->', deviceWidth);
// console.log('normalizeText getPSFLS ->', layoutSize);

export const normalize = size => {
  if (pixelRatio === 2) {
    // iphone 5s and older Androids
    if (deviceWidth < 360) {
      return size * 0.95;
    }

    // iphone 5
    if (deviceHeight < 667) {
      return size;
      // iphone 6-6s
    } else if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.15;
    }

    // older phablets
    return size * 1.25;
  }

  if (pixelRatio === 3) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (deviceWidth <= 360) {
      return size;
    }

    // Catch other weird android width sizings
    if (deviceHeight < 667) {
      return size * 1.15;
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }

    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.2;
    }

    // catch larger devices
    // ie iphone 6s plus / 7 plus / mi note 等等
    return size * 1.27;
  }

  if (pixelRatio === 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (deviceWidth <= 360) {
      return size; // Catch other smaller android height sizings
    }

    if (deviceHeight < 667) {
      return size * 1.2; // catch in-between size Androids and scale font up // a tad but not too much
    }

    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.25;
    } // catch larger phablet devices

    return size * 1.4;
  }

  // if older device ie pixelRatio !== 2 || 3 || 3.5
  return size;
};


export const getFontColorByBackground = bgColor => {
  const r = parseInt(bgColor.substr(0, 2), 16);
  const g = parseInt(bgColor.substr(2, 2), 16);
  const b = parseInt(bgColor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? Colors.black : Colors.white;
};

export const createActionSet = actionName => ({
  PENDING: `${actionName}_PENDING`,
  SUCCESS: `${actionName}_SUCCESS`,
  ERROR: `${actionName}_ERROR`,
});

export const loadingAnimation = state => {
  const duration = 500;
  const iterations = 10;
  let opacity1 = 0.3;
  let opacity2 = 0.7;
  const animatedTimings = [];

  for (let i = 0; i < iterations; i += 1) {
    animatedTimings.push(
      Animated.timing(state, { toValue: opacity1, duration })
    );
    const tempFrom = opacity2;

    opacity2 = opacity1;
    opacity1 = tempFrom;
  }

  return Animated.sequence(animatedTimings);
};

export const resetNavigationTo = (routeName: string, navigation: {}) => {
  const resetAction = NavigationActions.reset({
    index: 0,
    key: null,
    actions: [NavigationActions.navigate({ routeName })],
  });

  navigation.dispatch(resetAction);
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const delay = (delayed, ms) =>
  Promise.all([delayed, sleep(ms)]).then(([data]) => data);

