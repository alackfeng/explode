import TabNavigator from './TabNavigator';
import { TabRoutes, MainRoutes, MenuRoutes } from './TabRoutes';
import sharedTabBarOptions from './sharedTabBarOptions';
import { /*TabNavigator, */StackNavigator, DrawerNavigator } from "react-navigation";

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
  headerMode: 'none',
  URIPrefix: 'aftbomb://',
  cardStyle: {
    backgroundColor: 'transparent',
  },
});

export default AppNavigator;
