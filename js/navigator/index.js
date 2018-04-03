// import TabNavigator from './TabNavigator';
import { TabRoutes, MainRoutes, MenuRoutes } from './TabRoutes';
import sharedTabBarOptions from './sharedTabBarOptions';
import { TabNavigator, StackNavigator, DrawerNavigator } from 'react-navigation';
import TabBarComponent from './TabBarComponent';

const AppTabNavigator = TabNavigator(TabRoutes, {
  initialRouteName: 'Home',
  tabBarPosition: 'bottom',
  swipeEnabled: false, // 是否允许在标签之间进行滑动
  animationEnabled: false,
  tabBarOptions: sharedTabBarOptions,
  tabBarComponent: TabBarComponent,
});

const AppDrawerDrawer = DrawerNavigator({
  ...MenuRoutes,
  Main: {
    screen: AppTabNavigator,
  },

});

const AppNavigator = StackNavigator({
  ...MainRoutes,
  Main: {
    screen: AppTabNavigator,
  },
  Draw: {
    screen: AppDrawerDrawer,
  },
}, {
  headerMode: 'screen',
  URIPrefix: 'aftbomb://',
  cardStyle: {
    backgroundColor: 'transparent',
  },
});

export default AppNavigator;
