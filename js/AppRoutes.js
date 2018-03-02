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

import { CenterScreen, SettingsScreen, TransferScreen, HistoryScreen } from "./containers/Users";
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
      size={24}
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
  History: {
    screen: HistoryScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Operation History',
    }),
  }
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
    headerMode: 'screen',
  }
);
const UsersStackNavigator = StackNavigator(
  {
    Center: {
      screen: CenterScreen,
      navigationOptions: {
        header: null,
      },
    },
    ...sharedRoutes,
  },
  {
    headerMode: 'screen',
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
      tabBarLabel: 'ssss', //translate('menu.tab.home', locale),
      tabBarIcon: getIcon('home'),
    },
  },
  Assets: {
    screen: AssetsStackNavigator, //Translation,
    path: 'assets',
    navigationOptions: {
      header: null, //title: 'Assets',
      tabBarLabel: translate('menu.tab.news', locale),
      tabBarIcon: getIcon('view-list'),
    },
  },
  Hist: {
    screen: HistoryScreen,
    path: 'hist',
    navigationOptions: {
      title: 'history',
      headerStyle: { backgroundColor: 'white'},
      headerTitleStyle: { color: 'rgba(40,65,89,1)', textAlign: 'center'},
      tabBarLabel: translate('menu.tab.hist', locale),
      tabBarIcon: getIcon('receipt'),
    },
  },
  Users: {
    screen: UsersStackNavigator, //RegisterScreen, //WelcomeScreen, //NodeScreen,
    path: 'users',
    navigationOptions: {
      header: null, //title: 'user center',
      tabBarLabel: translate('menu.tab.wallet', locale),
      tabBarIcon: getIcon('account-circle'),
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
      title: 'AFT',
      headerStyle: { backgroundColor: 'antiquewhite'},
      headerTitleStyle: { color: 'white' },
    },
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: ({navigation,screenProps}) => ({
      title: 'AFT',
      headerStyle: { backgroundColor: !screenProps ? screenProps.themeColor : 'antiquewhite'},
      headerTitleStyle: { color: 'white' },
    }),
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
