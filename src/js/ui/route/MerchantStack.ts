import React from 'react';

import {
  createStackNavigator,
} from 'react-navigation';

import { View } from 'react-native';
import { MerchantDetail } from '../screen/Merchant/MerchantDetail';
import { MerchantGraphic } from '../screen/Merchant/MerchantGraphic';
import { PackageDetailPage } from '../screen/Merchant/PackageDetailPage';
import { ProductOrder } from '../screen/Merchant/ProductOrder';
import { PurchaseVouchers } from '../screen/Merchant/PurchaseVouchers';
import { VoucherDetailPage } from '../screen/Merchant/VoucherDetailPage';
import { VoucherDetails } from '../screen/Merchant/VoucherDetails';

import { navigationConfig } from './navigationConfig';

export const MerchantStack = createStackNavigator({
  MerchantDetail: {
    screen: MerchantDetail,
    navigationOptions:{
      header: React.createElement(View),
    },
  },
  MerchantGraphic:{
    screen: MerchantGraphic,
  },
  ProductOrder: {
    screen: ProductOrder,
  },
  VoucherDetailPage:{
    screen:VoucherDetailPage,
  },
  VoucherDetails:{
    screen:VoucherDetails,
  },

  PackageDetailPage:{
    screen:PackageDetailPage,
  },
  PurchaseVouchers:{
    screen:PurchaseVouchers,
  },

},                                                navigationConfig);
