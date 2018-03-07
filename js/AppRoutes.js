import React from 'react';
import { View, Text, Image } from "react-native";
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
      headerTitleStyle: { color: 'rgba(102,102,102,1)', alignSelf: 'center', justifyContent: 'space-between', },
      headerRight: <View />,
    }),
  },
  Nodes: {
    screen: NodeScreen,
    navigationOptions: ({ navigation }) => ({
      title: translate(navigation.state.params.title, locale),
      headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
      headerTitleStyle: { color: 'rgba(102,102,102,1)', alignSelf: 'center', justifyContent: 'space-between', },
      headerRight: <View />,
    }),
  },
  Transfer: {
    screen: TransferScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Transfer',
      headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
      headerTitleStyle: { color: 'rgba(102,102,102,1)', alignSelf: 'center', justifyContent: 'space-between', },
      headerRight: <View />,
    }),
  },
  History: {
    screen: HistoryScreen,
    navigationOptions: ({ navigation }) => ({
      title: translate('center.trans', locale),
      headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
      headerTitleStyle: { color: 'rgba(102,102,102,1)', alignSelf: 'center', justifyContent: 'space-between', },
      headerRight: <View />,
    }),
  }
};

const AssetsStackNavigator = StackNavigator(
  {
    Manage: {
      screen: AssetsManageScreen,
      navigationOptions: {
        title: 'Assets Manage',
        headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
        headerTitleStyle: { color: 'rgba(102,102,102,1)', alignSelf: 'center', justifyContent: 'space-between', },
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
      headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
      headerTitleStyle: { color: 'rgba(102,102,102,1)', alignSelf: 'center', justifyContent: 'space-between', },
      tabBarLabel: translate('menu.tab.home', locale),
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
      headerStyle: { backgroundColor: 'white', justifyContent: 'center'},
      headerTitleStyle: { color: 'rgba(102,102,102,1)', alignSelf: 'center', justifyContent: 'space-between', },
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
    navigationOptions: ({navigation,screenProps}) => ({
      headerTitle: 'AFT', //<ImageTitle />,
      headerStyle: { backgroundColor: !screenProps ? screenProps.themeColor : 'white', justifyContent: 'center'},
      headerTitleStyle: { color: 'rgba(102,102,102,1)', alignSelf: 'center', justifyContent: 'space-between', },
      headerRight: <View />,
    }),
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: ({navigation,screenProps}) => ({
      headerTitle: 'AFT', //<ImageTitle />,
      headerStyle: { backgroundColor: !screenProps ? screenProps.themeColor : 'white', justifyContent: 'center'},
      headerTitleStyle: { color: 'rgba(102,102,102,1)', alignSelf: 'center', justifyContent: 'space-between', },
      headerRight: <View />,
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
