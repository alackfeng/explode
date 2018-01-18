import {
  notFoundKey,
  AppRoutes,
  StackRoutes,
  DrawRoutes,
} from '../AppRoutes';

const constructRoutes = (routes) => {
	const Routes = {};
	for (const key in routes) {
	  if (key !== notFoundKey) {
	    Routes[key] = routes[key];
	  }
	}
	return Routes;
};

// 增加不同导航处理，主导航，TAB导航，侧华导航
export const TabRoutes = constructRoutes(AppRoutes);
export const MainRoutes = constructRoutes(StackRoutes);
export const MenuRoutes = constructRoutes(DrawRoutes);
export default MainRoutes;
