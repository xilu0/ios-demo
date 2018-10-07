import React from 'react';
import {  StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { F, W } from 'js/helper/UI';
import { FontWeight } from 'js/style/fonts';
import { appHeader } from 'js/ui/components/Navigation';

import { API, IResponse, OrderInfo, RefundList } from 'js/api';
import { errorHandle } from 'js/helper/Respone';
import { Styles } from 'js/style/common';
import { LineView } from 'js/ui/components/Common/LineView';
import { action,  observable } from 'mobx';
import { observer } from 'mobx-react';

interface IProps {
  navigation: NavigationScreenProp<any, {
    order: OrderInfo;
  }>;

}

class PageStore {
  @observable public order: OrderInfo = {};

  @observable public refundList: RefundList[] = [];

  @action public updateOrder(_order: OrderInfo) {
    this.order = _order;
  }

  @action public requestGetRefundList = () => {
    return API.order
      .getRefundList({ orderId: this.order.orderId })
      .then(action((rs: IResponse) => {
        this.refundList = rs.data || [];
      }))
      .catch(errorHandle);
  }

}

// (0:待退款 1:退款成功 2.审批通过退款中 3:第三方退款中 4:退款失败)
const refundStatusArr = [
  '待退款', '已退款', '审批通过退款中', '第三方退款中', '退款失败',
];

@observer
@appHeader('退款列表')
export class OrderRefundList extends React.Component<IProps, any, any> {

  private pageStore: PageStore;

  constructor(props: IProps) {
    super(props);
    this.pageStore = new PageStore();
  }

  public componentDidMount() {
    const order = this.props.navigation.getParam('order');
    this.pageStore.updateOrder(order);
    this.pageStore.requestGetRefundList();
  }

  public getRefundStatusText = (index: number) => {
    return refundStatusArr[index];
  }

  public renderCodeListView = (arr: string[]) => {
    return arr.map((str, index) => {
      return (
        <Text
          key={str}
          style={[style.item_line2_text, Styles.text_no_padding, FontWeight.Light, style.marginBottom]}
        >
        <Text style={{ opacity: index === 0 ? 1 : 0 }}>消费码：</Text>
        {str}
        </Text>
      );
    });
  }

  public onDetailClick = (refund: RefundList) => {
    this.props.navigation.navigate(NavigationKeys.OrderRefundDetail, {
      refund,
    });
  }

  public renderItem = (item: RefundList) => {

    const statusText = this.getRefundStatusText(item.status!);
    let line1_text = statusText;
    if (item.status === 1) {
      line1_text += '¥' + (+item.money!).toFixed(2);
    }

    const line2_text = this.renderCodeListView(item.productSn || []);

    const line3_text = item.receiveTime;

    return (
    <View key={item.refundId}>
      <View style={style.item}>
        <View style={style.item_line1}>
          <Text style={[style.item_line1_text, Styles.text_no_padding, FontWeight.Regular]}>{line1_text}</Text>
          <TouchableOpacity onPress={this.onDetailClick.bind(this, item)}>
            <View style={style.item_line1_button}>
              <Text style={[style.item_line1_button_text, Styles.text_no_padding, FontWeight.Regular]}>查看详情</Text>
            </View>
          </TouchableOpacity>
        </View>
        {line2_text}
        <Text style={[style.item_line2_text, Styles.text_no_padding, FontWeight.Light]}>预计到账时间：{line3_text}</Text>
      </View>
      <LineView width={W(375)} height={W(6)} color={'#F8F8F8'} />
    </View>);
  }

  public render() {
    const list = this.pageStore.refundList;
    const view = list.map(this.renderItem);
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {view}
      </View>

    );
  }
}

const style = StyleSheet.create({
  item: {
    paddingHorizontal:  W(24),
    paddingVertical: W(14),
    justifyContent: 'space-between',
  },
  item_line1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  item_line1_text: {
    color: '#272727',
    fontSize: F(15),
  },
  item_line1_button: {
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DDDDDD',
    borderRadius: W(12),
    paddingHorizontal: W(12),
    paddingVertical: W(6),
  },
  item_line1_button_text: {
    color: '#272727',
    fontSize: F(12),
  },
  item_line2_text: {
    color: '#272727',
    fontSize: F(13),
  },
  marginBottom: {
    marginBottom: W(6),
  },
});
