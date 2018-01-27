import React from 'react';
import { View, Text } from "react-native";
import PropTypes from 'prop-types';

import { StackNavigator } from "react-navigation";
import { translate, locale } from "./libs";

import { Icon } from './components/Icon';
import Home from './containers/Home';
import IconsGrid from './containers/IconsGrid';
import NotFound from './containers/NotFound';
import Translation from './containers/Translation';
import { WelcomeScreen, SplashScreen, LoginScreen, RegisterScreen, NodeScreen } from "./containers/Enter";

import { CenterScreen, SettingsScreen, TransferScreen } from "./containers/Users";
import { AssetsManageScreen } from "./containers/Assets";

import Ionicons from "react-native-vector-icons/MaterialIcons";


export const notFoundKey = 'NotFound';

/**
 * Gets an Icon component.
 */
const getIcon = (name) => {
  const comp = ({ tintColor, focused }) => (
    <Icon
      name={!focused ? name : name }
      size={26}
      style={{
        color: tintColor,
      }}
    />
  );
  comp.propTypes = {
    tintColor: PropTypes.string,
    focused: PropTypes.boolean,
  };
  return comp;
};

const sharedRoutes = {
  Settings: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.title,
    }),
  },
  Nodes: {
    screen: NodeScreen,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.title,
    }),
  },
  Transfer: {
    screen: TransferScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Transfer',
    }),
  },
};

const AssetsStackNavigator = StackNavigator(
  {
    Manage: {
      screen: AssetsManageScreen,
      navigationOptions: {
        title: 'Assets Manage',
      },
    },
    ...sharedRoutes,
  },
  {
    headerMode: 'none',
  }
);
const UsersStackNavigator = StackNavigator(
  {
    Center: {
      screen: CenterScreen,
      navigationOptions: {
        title: 'User Center',
      },
    },
    ...sharedRoutes,
  },
  {
    headerMode: 'none',
  }
);

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
    screen: AssetsStackNavigator, //Translation,
    path: 'assets',
    navigationOptions: {
      title: 'Assets',
      tabBarLabel: translate('menu.tab.news', locale),
      tabBarIcon: getIcon('explore'),
    },
  },
  Users: {
    screen: UsersStackNavigator, //RegisterScreen, //WelcomeScreen, //NodeScreen,
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
