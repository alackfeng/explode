import React from 'react';
import { View, Text, Image } from "react-native";
import PropTypes from 'prop-types';

import { StackNavigator } from "react-navigation";
import { translate, locale, Colors } from "./libs";

import { Icon } from './components/Icon';
import Home from './containers/Home';
import IconsGrid from './containers/IconsGrid';
import NotFound from './containers/NotFound';
import Translation from './containers/Translation';
import { WelcomeScreen, SplashScreen, LoginScreen, RegisterScreen, NodeScreen } from "./containers/Enter";

import { CenterScreen, SettingsScreen, TransferScreen, HistoryScreen, LanguageScreen, CardScreen, ScanScreen, VersionScreen } from "./containers/Users";
import { AssetsManageScreen } from "./containers/Assets";

import Ionicons from "react-native-vector-icons/MaterialIcons";


export const notFoundKey = 'NotFound';

const ImageTitle = (props) => (
  <Image 
    style={{width: 50, height: 36, resizeMode: 'contain', alignSelf: 'center'}}
    source={require('./components/images/aftlogo.png')}
  />
);

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
      headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
      headerTitleStyle: { color: Colors.headerGray, alignSelf: 'center', justifyContent: 'space-between', },
      headerRight: <View />,
    }),
  },
  Nodes: {
    screen: NodeScreen,
    navigationOptions: ({ navigation }) => ({
      title: translate(navigation.state.params.title, locale),
      headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
      headerTitleStyle: { color: Colors.headerGray, alignSelf: 'center', justifyContent: 'space-between', },
      headerRight: <View />,
      tabBarVisible: false,
    }),
  },
  Transfer: {
    screen: TransferScreen,
    navigationOptions: ({ navigation }) => ({
      
    }),
  },
  History: {
    screen: HistoryScreen,
    navigationOptions: ({ navigation }) => ({
      title: translate('center.trans', locale),
      headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
      headerTitleStyle: { color: Colors.headerGray, alignSelf: 'center', justifyContent: 'space-between', },
      headerRight: <View />,
    }),
  },
  Language: {
    screen: LanguageScreen,
    navigationOptions: ({ navigation }) => ({
      title: translate('center.langs', locale),
      headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
      headerTitleStyle: { color: Colors.headerGray, alignSelf: 'center', justifyContent: 'space-between', },
      headerRight: <View />,
    }),
  },
  Card: {
    screen: CardScreen,
    navigationOptions: ({ navigation }) => ({
      title: translate('center.cards', locale),
      headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
      headerTitleStyle: { color: Colors.headerGray, alignSelf: 'center', justifyContent: 'space-between', },
      headerRight: <View />,
      tabBarVisible: false,
    }),
  },
  Version: {
    screen: VersionScreen,
    navigationOptions: ({ navigation }) => ({
      title: translate('center.versn', locale),
      headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
      headerTitleStyle: { color: Colors.headerGray, alignSelf: 'center', justifyContent: 'space-between', },
      headerRight: <View />,
      tabBarVisible: false,
    }),
  },
};

const AssetsStackNavigator = StackNavigator(
  {
    Manage: {
      screen: AssetsManageScreen,
      navigationOptions: {
        title: translate('menu.title.asset', locale),
        headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
        headerTitleStyle: { color: Colors.headerGray, alignSelf: 'center', justifyContent: 'space-between', },
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
      title: translate('menu.title.home', locale),
      headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
      headerTitleStyle: { color: Colors.headerGray, alignSelf: 'center', justifyContent: 'space-between', },
      tabBarLabel: translate('menu.tab.home', locale),
      tabBarIcon: getIcon('home'),
    },
  },
  Assets: {
    screen: AssetsStackNavigator, //Translation,
    path: 'assets',
    navigationOptions: {
      header: null, //title: 'Assets',
      tabBarLabel: translate('menu.tab.asset', locale),
      tabBarIcon: getIcon('view-list'),
    },
  },
  Hist: {
    screen: HistoryScreen,
    path: 'hist',
    navigationOptions: {
      title: translate('menu.tab.hist', locale),
      headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
      headerTitleStyle: { color: Colors.headerGray, alignSelf: 'center', justifyContent: 'space-between', },
      tabBarLabel: translate('menu.tab.hist', locale),
      tabBarIcon: getIcon('receipt'),
    },
  },
  Users: {
    screen: UsersStackNavigator,
    path: 'users',
    navigationOptions: {
      header: null,
      tabBarLabel: translate('menu.tab.center', locale),
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
    navigationOptions: ({navigation,screenProps}) => ({
      header: null,
    }),
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: ({navigation,screenProps}) => ({
      header: null,
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
