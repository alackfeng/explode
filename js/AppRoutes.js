import React from 'react';
import PropTypes from 'prop-types';

import { translate, locale } from "./libs";

import { Icon } from './components/Icon';
import Home from './containers/Home';
import IconsGrid from './containers/IconsGrid';
import NotFound from './containers/NotFound';
import Translation from './containers/Translation';
import { WelcomeScreen, SplashScreen, LoginScreen, RegisterScreen } from "./containers/Enter";

import Ionicons from "react-native-vector-icons/MaterialIcons";


export const notFoundKey = 'NotFound';

/**
 * Gets an Icon component.
 */
const getIcon = (name) => {
  const comp = ({ tintColor }) => (
    <Icon
      name={name}
      style={{
        color: tintColor,
      }}
    />
  );
  comp.propTypes = {
    tintColor: PropTypes.string,
  };
  return comp;
};

/**
 * The routes for the App
 */
export const AppRoutes = {
  Home: {
    screen: Home,
    path: 'home',
    navigationOptions: {
      title: 'home news',
      tabBarLabel: translate('menu.tab.home', locale),
      tabBarIcon: getIcon('home'),
    },
  },
  Ico: {
    screen: IconsGrid,
    path: 'ico',
    navigationOptions: {
      title: 'ico issue',
      tabBarLabel: translate('menu.tab.relation', locale),
      tabBarIcon: getIcon('supervisor-account'),
    },
  },
  Assets: {
    screen: Translation,
    path: 'assets',
    navigationOptions: {
      title: 'news',
      tabBarLabel: translate('menu.tab.news', locale),
      tabBarIcon: getIcon('explore'),
    },
  },
  Users: {
    screen: RegisterScreen, //WelcomeScreen, //NodeScreen,
    path: 'users',
    navigationOptions: {
      title: 'user center',
      tabBarLabel: translate('menu.tab.wallet', locale),
      tabBarIcon: getIcon('fingerprint'),
    },
  },
  NotFound: {
    screen: NotFound,
    path: '404',
    navigationOptions: {
      title: 'Nothing Found',
    },
  },
};
/*
 * stack导航，用于主导航，包括欢迎，登录，主页面等 
*/
export const StackRoutes = {
  Splash: {
    screen: SplashScreen,
    navigationOptions: {
      header: null,
    },
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      header: null,
    },
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
    },
  },
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: {
      header: null,
    },
    path: 'welcome',
  },
};

export const DrawRoutes = {
  Auth: {
    screen: WelcomeScreen,
    navigationOptions: {
      drawerLabel: 'Auth',
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'home': 'face'}
          size={20}
          style={{ color: tintColor }}
        />
      ),
    },
  },
  IconsGrid: {
    screen: IconsGrid,
    navigationOptions: {
      drawerLabel: 'IconsGrid',
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'explore': 'fingerprint'}
          size={20}
          style={{ color: tintColor }}
        />
      ),
    },
  }
};
