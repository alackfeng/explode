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
  URIPrefix: 'aftrade://',
  cardStyle: {
    backgroundColor: 'transparent',
  },
});



export default AppNavigator;
