import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { OrderInfo } from 'js/api';
import { W } from 'js/helper/UI';
import { LineView } from 'js/ui/components/Common/LineView';
import { observer } from 'mobx-react/native';

import { OrderItemBody } from './Body';
import { OrderItemFooter } from './Footer';
import { OrderItemFooterButton } from './FooterButton';

import { NavigationScreenProp } from 'react-navigation';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { orderCenterPayStore } from '../OrderCenter';

interface IProps {
  order: OrderInfo;
  status?: number;
  navigation: NavigationScreenProp<any, any>;
}

const gennerateFooterButton = (text: string) => (onPress: () => void) => {
  return <OrderItemFooterButton  onPress={onPress} text={text} />;
};

const footerButtonArr = [
  gennerateFooterButton('立即付款'),
  gennerateFooterButton('查看券码'),
  gennerateFooterButton('评价'),
  gennerateFooterButton('退款进度'),
  gennerateFooterButton('退款详情'),
  gennerateFooterButton('重新下单'),
  gennerateFooterButton('再次购买'),
];

@observer
export class OrderItemComponent extends React.Component<IProps, any> {

  public footerButtonPressArr = [
    (order: OrderInfo) => {
      orderCenterPayStore
        .setOrderId(order.orderId || 0)
        .setMount(order.actualMoney || 0)
        .show();
      return;
    },
    (order: OrderInfo) => {
      this.props.navigation.navigate(NavigationKeys.CouponUseShow, { order });
      return;
    },
    (order: OrderInfo) => {
      // this.props.navigation.navigate(NavigationKeys.OrderRefund, {
      //   order,
      // });
      return;
    },
    (order: OrderInfo) => {
      this.props.navigation.navigate(NavigationKeys.OrderRefundList, {
        order,
      });
      return;
    },
    (order: OrderInfo) => {
      this.props.navigation.navigate(NavigationKeys.OrderRefundList, {
        order,
      });
      return;
    },
    (order: OrderInfo) => {
      const type = order.orderType;
      if (type === 1) {
        this.props.navigation.navigate(NavigationKeys.ProductOrder, {
          merchantId: order.merchant!.id,
          title: order.merchant!.name,
        });
      } else {
        this.props.navigation.navigate(NavigationKeys.PurchaseVouchers, {
          order,
          productId: order.product!.id,
          merchantId: order.merchant!.id,
        });
      }
      return;
    },
    (order: OrderInfo) => {
      const type = order.orderType;
      if (type === 1) {
        this.props.navigation.navigate(NavigationKeys.ProductOrder, {
          merchantId: order.merchant!.id,
          title: order.merchant!.name,
        });
      } else {
        this.props.navigation.navigate(NavigationKeys.PurchaseVouchers, {
          order,
          productId: order.product!.id,
          merchantId: order.merchant!.id,
        });
      }
      return;
    },
  ];

  public onItemPress = () => {
    this.props.navigation.navigate(NavigationKeys.OrderDetailWithVoucher, {
      orderId:this.props.order.orderId,
      status:this.props.order.status,
    });
  }

  public renderFooter = () => {
    const index = this.props.order.status!;
    const readyGennerateButtonFn = footerButtonArr[index];
    const connectButtonOnPress = this.footerButtonPressArr[index];
    return readyGennerateButtonFn(connectButtonOnPress.bind(this, this.props.order));
  }

  public render() {
    return (
      <TouchableWithoutFeedback onPress={this.onItemPress}>
        <View style={style.wrap}>
          <OrderItemBody order={this.props.order} status={this.props.status} />
          <LineView
            width={W(375 - PAGE_PADDING)}
            height={StyleSheet.hairlineWidth}
            color={'#E6E6E6'}
            style={{ marginLeft: W(PAGE_PADDING) }}
          />
          <OrderItemFooter render={this.renderFooter} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const PAGE_PADDING = 24;

const style = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF',
  },
});
