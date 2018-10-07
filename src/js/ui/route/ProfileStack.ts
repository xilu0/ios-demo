import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { navigationConfig } from './navigationConfig';

import { CouponUseShow } from '../screen/Coupon/CouponUseShow';
import { MoreSettings } from '../screen/Mine';
import { AddressManagement } from '../screen/Mine/AddressManagement';
import { BindPhoneScreen } from '../screen/Mine/BindPhoneScreen';
import { BonusPoints } from '../screen/Mine/BonusPoints';
import { IntegralRule } from '../screen/Mine/IntegralRule';
import { ModifyNameScreen } from '../screen/Mine/ModifyNameScreen';
import { ModifyPassWord } from '../screen/Mine/ModifyPassWord';
import { NewAddress } from '../screen/Mine/NewAddress';
import { PersonInfoScreen } from '../screen/Mine/PersonInfoScreen';
import { SwapPhoneDetailScreen } from '../screen/Mine/SwapPhoneDetailScreen';
import { SwapPhoneScreen } from '../screen/Mine/SwapPhoneScreen';
import { OrderDetailWithVoucher } from '../screen/Order/OrderDetailWithVoucher';
import { Profile } from '../screen/Profile';
export const ProfileStack = createStackNavigator({
  Profile :{
    screen: Profile,
    navigationOptions:{
      header: React.createElement(View),
    },
  },
  MoreSettings:{
    screen:MoreSettings,
  },
  PersonInfoScreen:{
    screen:PersonInfoScreen,
  },
  SwapPhoneScreen:{
    screen:SwapPhoneScreen,
  },
  SwapPhoneDetailScreen:{
    screen:SwapPhoneDetailScreen,
  },
  ModifyNameScreen:{
    screen:ModifyNameScreen,
  },
  ModifyPassWord:{
    screen:ModifyPassWord,
  },
  AddressManagement:{
    screen:AddressManagement,
  },
  NewAddress:{
    screen:NewAddress,
  },
  BindPhoneScreen: {
    screen: BindPhoneScreen,
  },
  BonusPoints:{
    screen:BonusPoints,
  },
  IntegralRule:{
    screen:IntegralRule,
  },
},                                               navigationConfig);

ProfileStack.navigationOptions = ({ navigation }: any) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};
