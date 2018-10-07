import React from 'react';
import { VoucherDetailPage } from './../screen/Merchant/VoucherDetailPage';
import { VoucherDetails } from './../screen/Merchant/VoucherDetails';

import {
  createStackNavigator,
} from 'react-navigation';

import { View } from 'react-native';
import { ProductOrder } from '../screen/Merchant/ProductOrder';
import { PurchaseVouchers } from '../screen/Merchant/PurchaseVouchers';

import { navigationConfig } from './navigationConfig';

export const VoucherStack = createStackNavigator({
  VoucherDetailPage: {
    screen: VoucherDetailPage,
  },
  VoucherDetails:{
    screen: VoucherDetails,
  },
  ProductOrder: {
    screen: ProductOrder,
  },

  PurchaseVouchers:{
    screen:PurchaseVouchers,
  },

},                                               navigationConfig);
