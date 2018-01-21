import {
  TabNavigator,
  StackNavigator, 
  DrawerNavigator,
} from 'react-navigation';

import { MainRoutes, TabRoutes, MenuRoutes } from "./TabRoutes";
import sharedTabBarOptions from './sharedTabBarOptions';

const AppTabNavigator = TabNavigator(TabRoutes, {
  initialRouteName: 'Home',
  tabBarPosition: 'bottom',
  swipeEnabled: false, //是否允许在标签之间进行滑动
  tabBarOptions: sharedTabBarOptions,
});

const AppDrawerDrawer = DrawerNavigator({
  ...MenuRoutes, 
  Main: {
    screen: AppTabNavigator
  },
},);

const AppNavigator = StackNavigator({
	...MainRoutes, 
	Main: {
		screen: AppTabNavigator
	},
  Draw: {
    screen: AppDrawerDrawer
  }
}, {
  headerMode: 'screen',
  URIPrefix: 'aftbomb://',
  cardStyle: {
    backgroundColor: 'transparent',
  },
});


export default AppNavigator;
