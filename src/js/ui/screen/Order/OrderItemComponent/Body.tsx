
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { F, W } from 'js/helper/UI';
import { PAGE_PADDING, Styles } from 'js/style/common';
import { FontWeight } from 'js/style/fonts';
import { LineView } from 'js/ui/components/Common/LineView';

import { OrderInfo, OrderInfoMerchant, OrderInfoProduct } from 'js/api';
import FastImage from 'react-native-fast-image';


interface IProps {
  order: OrderInfo;
  status?: number;
}

// enum EStatus {
//   TO_BE_PAY = 0,
//   TO_BE_USE = 1,
//   TO_BE_COMMIT = 2,
//   TO_BE_REFUND_ING = 3,
//   TO_BE_REFUND_END = 4,
// }

// enum EStatusText {
//   TO_BE_PAY = '待支付',
//   TO_BE_USE = '待使用',
//   TO_BE_COMMIT = '待评论',
//   TO_BE_REFUND = '退款售后',
//   TO_BE_REFUND_ING = '退款中',
//   TO_BE_REFUND_END = '123',
// }

// const getStatusTextByTab =  (status?: number) => {
//   if (status === undefined) {
//     return;
//   }
//   if (status === EStatus.TO_BE_PAY) {
//     return EStatusText.TO_BE_PAY;
//   }
//   if (status === EStatus.TO_BE_USE || status === EStatus.TO_BE_COMMIT) {
//     return EStatusText.TO_BE_USE;
//   }
//   if (status === EStatus.TO_BE_REFUND_ING || status === EStatus.TO_BE_REFUND_END) {
//     return EStatusText.TO_BE_REFUND;
//   }
//   return;
// };

// const getStatusTextByOrder = (order: OrderInfo) => {
//   const status =  order.status;
//   if (status === EStatus.TO_BE_PAY) {
//     return EStatusText.TO_BE_PAY;
//   }
//   if (status === EStatus.TO_BE_USE || status === EStatus.TO_BE_COMMIT) {
//     return EStatusText.TO_BE_USE;
//   }
//   if (status === EStatus.TO_BE_REFUND_ING || status === EStatus.TO_BE_REFUND_END) {
//     return EStatusText.TO_BE_REFUND;
//   }
// };

// 订单类型（1.优惠买单，2.商品购买）
const typeNameTextArray = ['', '优惠买单', '商铺购买'];
const getTypeNameText = (order: OrderInfo) => {
  const orderType = order.orderType;
  return typeNameTextArray[orderType!] || '';
};
// 状态(0.待支付1.待使用2.待评价3.退款中4.退款成功5.已取消)
const statusTextArray = ['待支付', '待使用', '待评价', '退款中', '退款成功', '已取消', '已完成'];
const getStatusText = (order: OrderInfo, _status?: number) => {
  const status =  _status === undefined ? order.status : _status;
  return statusTextArray[status!] || '';
};

interface IBody {
  uri: string;
  title: string;
  status: string;
  orderTypeName: string;
  orderTips?: string;
  orderCount?: number;
  orderMoney: string;
  orderTime: string;
}

const gennerateItem = (order: OrderInfo, _status?: number): IBody => {
  const merchant: OrderInfoMerchant = (order.merchant as OrderInfoMerchant) || {};
  const product: OrderInfoProduct = (order.product as OrderInfoProduct);

  const isMerchantPay = order.orderType === 1;

  const uri = '';
  const title = merchant.name || '';
  const status = getStatusText(order, _status);
  const orderTypeName = getTypeNameText(order);

  const orderMoney = (order.actualMoney || 0);
  // .toFixed(2);
  const orderTime = '下单时间：' + order.createTime;

  const o: IBody = {
    uri,
    title,
    status,
    orderTypeName,
    // orderTips,
    // orderCount,
    orderMoney,
    orderTime,
  };

  if (!isMerchantPay) {
    o.orderTips = product.name;
    o.orderCount = product.quantity;
    o.orderTime = '有效期至：' + product.effectEndTime; // formatString(new Date(product.effectEndTime || ''));
  }

  return o;

};

export class OrderItemBody extends React.Component<IProps, any> {

  public render() {

    const item = gennerateItem(this.props.order, this.props.status);

    const tipsView = item.orderTips ?
    [
      (
      <LineView
        key={'lineview'}
        width={StyleSheet.hairlineWidth}
        height={W(12)}
        color={'#9B9B9B'}
        style={style.line2_line}
      />),
      (
      <Text
        key={'linetext'}
        style={[FontWeight.Regular, Styles.text_no_padding, style.line_2_left_text]}
      >{item.orderTips}
      </Text>),
    ] : null;

    const countView = item.orderCount ?
    [
      (
        <View key={'countview'} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <FastImage style={{ width: W(9), height: W(9), marginRight: W(5) }} source={require('img/Order/close.png')} />
          <Text style={[style.line_3_count, Styles.text_no_padding]}>
            {item.orderCount}
          </Text>
        </View>),
    ] : null;

    // const moneyArr = item.orderMoney.split('.');
    const merchant = this.props.order.merchant || {};
    const uri = (merchant as any)!.logoPath;
    const date = item.orderTime.split(' ')[0];
    return (
      <View style={style.body}>
        <FastImage style={[style.body_left, style.image]} source={{ uri }} />
        <View style={style.body_right}>
          <View style={style.line_1}>
            <Text
              style={[style.line_1_text, FontWeight.Regular,  Styles.text_no_padding, { maxWidth: W(160) }]}
              numberOfLines={1}
            >{item.title}
            </Text>
            <Text style={[style.line_1_status, FontWeight.Light, Styles.text_no_padding]}>{item.status}</Text>
          </View>
          <View style={style.line_2}>
            <View style={style.line_2_left}>
              <Text
                style={[FontWeight.Light, Styles.text_no_padding, style.line_2_left_text]}
              >{item.orderTypeName}
              </Text>
              {tipsView}
              <LineView width={StyleSheet.hairlineWidth} height={W(12)} color={'#9B9B9B'} style={style.line2_line}/>
              <Text style={[FontWeight.Regular, Styles.text_no_padding, style.line_2_left_text]}>
              {item.orderMoney}</Text>
              <Text
                style={[FontWeight.Light, Styles.text_no_padding, style.line_2_left_text, style.mend]}
              >{}
              </Text>
            </View>
            {countView}
          </View>
          <View style={style.line_3}>
            <Text  style={[FontWeight.Light, Styles.text_no_padding, style.line_3_text]}>{date}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({

  body: {
    flexDirection: 'row',
    paddingTop: W(15),
    paddingBottom: W(12),
  },

  body_left: {
    marginLeft: W(PAGE_PADDING),
    marginRight: W(15),
  },
  image: {
    width: W(90),
    height: W(75),
    borderRadius: W(2),
    backgroundColor:'#f2f2f2',
  },
  body_right: {
    flex: 1,
    justifyContent: 'space-between',
    marginRight: W(PAGE_PADDING),
    paddingTop: W(4),
    paddingBottom: W(5),
  },

  line_1: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  line_1_text: {
    fontSize: F(15),
    color: '#272727',
  },
  line_1_status: {
    fontSize: F(15),
    color: '#FC0204',
  },
  line_2: {
    // backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-between',

    flex: 1,
    alignItems: 'center',
  },
  line_2_left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line2_line: {
    // marginTop: W(2),
    marginHorizontal: W(6),

  },
  line_2_left_text: {
    color: '#9B9B9B',
    fontSize: W(14),
    fontFamily: 'PingFangSC-Light',
  },
  line_2_count: {
    color: '#9B9B9B',
    fontSize: W(14),
  },
  line_3_count: {
    color: '#999',
    fontSize: W(15),
    fontWeight: '200',
    fontFamily: 'PingFangSC-Ultralight',
  },
  line_3: {
    // backgroundColor: 'blue',

  },
  line_3_text: {
    fontSize: F(12),
    color: '#9B9B9B',
    fontFamily: 'PingFangSC-Light',

  },

  mend: {
    fontSize: F(12),
    alignSelf: 'flex-end',
  },

});
