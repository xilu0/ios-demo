
import { NavigationScreenProp } from 'react-navigation';

import { getUserToken } from '../api/manager';
import { NavigationKeys } from '../const/NavigationKeys';

export const AuthLogin = (
  navigation: NavigationScreenProp<any, any>,
  routerName: string = 'Tabs',
  params: object = {},
  // callback?: () => void,
) => {
  const userToken = getUserToken();
  const to = userToken ? routerName : 'Login';
  const toParams = userToken ? params : { want: routerName };
  navigation.navigate(to, toParams);
};

const needLoginAuthRouteNames: string[] = [
  NavigationKeys.ProductOrder,
  NavigationKeys.PurchaseVouchers,
  NavigationKeys.OrderCenter,
  NavigationKeys.AddressManagement,
  NavigationKeys.MemberOpen,
  NavigationKeys.MemberTrial,
  NavigationKeys.MoreSettings,
  NavigationKeys.PersonInfo,
];

export const isNeedLogin = (routeName: string) => {
  const index = needLoginAuthRouteNames.indexOf(routeName);
  return index >= 0;
};
