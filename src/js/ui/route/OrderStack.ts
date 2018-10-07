import React from 'react';

import {
  createStackNavigator,
} from 'react-navigation';

import { CouponUseShow } from '../screen/Coupon/CouponUseShow';
import { ProductOrder } from '../screen/Merchant/ProductOrder';
import { PurchaseVouchers } from '../screen/Merchant/PurchaseVouchers';
import { VoucherDetails } from '../screen/Merchant/VoucherDetails';
import { OrderCenter } from '../screen/Order/OrderCenter';
import { OrderDetailWithVoucher } from '../screen/Order/OrderDetailWithVoucher';
import { OrderRefund } from '../screen/Order/OrderRefund';
import { OrderRefundDetail } from '../screen/Order/OrderRefundDetail';
import { OrderRefundList } from '../screen/Order/OrderRefundList';
import { navigationConfig } from './navigationConfig';

export const OrderStack = createStackNavigator({
  OrderCenter: {
    screen: OrderCenter,
  },

  CouponUseShow: {
    screen: CouponUseShow,
  },

  OrderRefund: {
    screen: OrderRefund,
  },
  OrderRefundDetail: {
    screen: OrderRefundDetail,
  },
  OrderRefundList: {
    screen: OrderRefundList,
  },
  VoucherDetails:{
    screen:VoucherDetails,
  },
  PurchaseVouchers:{
    screen:PurchaseVouchers,
  },
  OrderDetailWithVoucher:{
    screen:OrderDetailWithVoucher,
  },

  ProductOrder: {
    screen: ProductOrder,
  },

},                                             navigationConfig);
