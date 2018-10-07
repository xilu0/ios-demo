import { HomeStack } from './HomeStack';

import {
    createStackNavigator,
} from 'react-navigation';

import { MerchantList } from '../screen/MerchantList';
import { SearchAddress } from '../screen/Near/SearchAddress';

import { LoginStack } from './LoginStack';
import { MerchantStack } from './MerchantStack';
import { Tabs } from './Tabs';
import { VoucherStack } from './VocherStack';

import StackViewStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator';
import { OrderStack } from './OrderStack';
import { PlusStack } from './PlusStack';
import { ReviewStack } from './ReviewStack';

export const RootNavigator = createStackNavigator({
  Tabs: {
    screen: Tabs,
  },
  LoginStack: {
    screen: LoginStack,
  },
  HomeStack:{
    screen: HomeStack,
  },
  MerchantStack: {
    screen: MerchantStack,
  },

  SearchAddress: {
    screen: SearchAddress,
  },
  MerchantList: {
    screen: MerchantList,
  },
  VoucherStack:{
    screen:VoucherStack,
  },
  OrderStack: {
    screen: OrderStack,
  },
  ReviewStack: {
    screen: ReviewStack,
  },
  PlusStack:{
    screen:PlusStack,
  },

},                                                {
  mode: 'modal',
  headerMode: 'none',
  navigationOptions: {
    gesturesEnabled: false,
  },
  transitionConfig:() => ({
    screenInterpolator: StackViewStyleInterpolator.forHorizontal,
  }),
});
