import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { commonStyle, IItemProps, OrderLineItem } from './OrderItemComponent/OrderLineItem';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { F, W } from 'js/helper/UI';
import { FontWeight } from 'js/style/fonts';
import { LinerGradientButton } from 'js/ui/components/Common/LinerGradientButton';
import { appHeader } from 'js/ui/components/Navigation';

import { API, OrderDetailInfo, OrderInfo } from 'js/api';
import { action, computed, observable, toJS } from 'mobx';
import { observer, Observer } from 'mobx-react';
import { ObservableArray } from 'mobx/lib/types/observablearray';
import { errorHandle } from 'js/helper/Respone';
import { testList } from 'js/helper/Rules';
import { showToast } from 'js/ui/components/Toast';
import FastImage from 'react-native-fast-image';


interface IProps {
  navigation: NavigationScreenProp<any, {
    order: OrderInfo;
  }>;

}

class COrderInfo implements OrderInfo {
  @observable public orderDetails: OrderDetailInfo[];
  constructor() {
    this.orderDetails = [];
  }
}

// refundStatus	integer
// 退款状态(0:待退款 1:退款成功 2.审批通过退款中 3:第三方退款中 4:退款失败)

class PageStore {
  @observable public order: OrderInfo = new COrderInfo();

  @observable public couponSelectList: boolean[] = [];

  @action public updateOrder(_order: OrderInfo) {
    this.order = _order;
    this.couponSelectList = Array.from({ length: _order.orderDetails!.length }).map(() => false);
  }

  @action public toggleCouponSelect(index: number) {
    const isSelect = this.couponSelectList[index];
    this.couponSelectList[index] = !isSelect;
  }

  @computed public get couponList() {
    let arr: OrderDetailInfo[] = this.order.orderDetails || [];
    arr = arr.sort((a, b) => {
      return +!!a.canRefund - +!!b.canRefund;
    });
    return arr;
  }

  @computed public get activeCouponList() {
    return this.couponList.filter((item, index) => {
      return this.couponSelectList[index] === true;
    });
  }

  @computed public get ids() {
    return this.activeCouponList.map((item) => {
      return item.id;
    }) || [];
  }

  // ids	消费券id数组

  @computed public get backMoney(): number {
    return (this.order.actualMoney || 0);
  }

  // public reason: //退款原因
  public reasonList: string[] = [
    '预约不上',
    '手误点错',
  ];
  @observable public reasonSelectList: boolean[] = [];

  // @observable public reasonIndex: number = 0;
  // @action public updateReasonIndex = (index: number) => {
  //   this.reasonIndex = index;
  // }

  @action public toggleReasonSelect(index: number) {
    const isSelect = this.reasonSelectList[index];
    this.reasonSelectList[index] = !isSelect;
  }

  @computed public get activeReasonList() {
    return this.reasonList.filter((item, index) => {
      return this.reasonSelectList[index] === true;
    });
  }

  constructor() {
    this.reasonSelectList = Array.from({ length: this.reasonList.length }).map(() => false);
  }

  public requestOrderRefund() {
    return API.order.refund({
      orderId: this.order.orderId,
      ids: this.ids,
      reason: this.reasonSelectList.join(','),
    });
  }
}

@observer
@appHeader('申请退款')
export class OrderRefund extends React.Component<IProps, any, any> {

  private pageStore: PageStore;

  constructor(props: IProps) {
    super(props);
    this.pageStore = new PageStore();
  }

  public componentDidMount() {
    const order = this.props.navigation.getParam('order');
    this.pageStore.updateOrder(order);
  }

  public selectImg = require('img/Order/vouchers_select.png');
  public unSelectImg = require('img/Order/hollow.png');

  public onClick = () => {
    this.props.navigation.navigate(NavigationKeys.CouponUseShow);
  }

  private gennerateMenuItem1: (arr: OrderDetailInfo[]) => IItemProps[] = (arr: OrderDetailInfo[]) => {
    const lastIndex = arr.length - 1;
    return arr.map((item, index): IItemProps => {
      return {
        renderLeftText: () => {
          return (
            <Text style={[commonStyle.text_15_27, FontWeight.Light]}>消费码: {item.productSn}</Text>
          );
        },
        renderRightCom: () => {
          const isSelect = this.pageStore.couponSelectList[index];
          const src = isSelect ? this.selectImg : this.unSelectImg;
          return item.canRefund ?
          (
            <FastImage style={commonStyle.active_icon} source={src} />
          ) :  <Text style={[commonStyle.text_14_ff5000, FontWeight.Light]}>不可退款</Text>;
        },
        onPress: () => {
          this.pageStore.toggleCouponSelect(index);
        },
        lineLeft: lastIndex === index ? undefined : 24,
      };
    });
  }

  private gennerateMenuItem3: (arr: string[]) => IItemProps[] = (arr: string[]) => {
    const lastIndex = arr.length - 1;
    return arr.map((item, index) => {
      return {
        renderLeftText: () => {
          return (
            <Text style={[commonStyle.text_15_27, FontWeight.Light]}>{item}</Text>
          );
        },
        renderRightCom: () => {
          const isSelect =  this.pageStore.reasonSelectList[index];
          const src = isSelect ? this.selectImg : this.unSelectImg;
          return <FastImage style={commonStyle.active_icon} source={src} />;
        },
        onPress: () => {
          this.pageStore.toggleReasonSelect(index);
        },
        lineLeft: lastIndex === index ? undefined : 24,
      };
    });
  }

  private generateMenuItem1Arr: IItemProps[] = [
    {
      renderLeftText: () => {
        return (
          <Text style={[commonStyle.text_15_27, FontWeight.Regular]}>订单消费码（可多选）</Text>
        );
      },
      lineLeft: 24,
    },
  ];

  private generateMenuItem2Arr: IItemProps[] = [
    {
      renderLeftText: () => {
        return (
          <Text style={[commonStyle.text_15_27, FontWeight.Regular]}>
            退还金额：
            <Text style={[commonStyle.text_14_ff5000, FontWeight.Regular]}>{this.pageStore.backMoney}元</Text>
          </Text>
        );
      },
      lineLeft: 24,
    },

    {
      renderLeftText: () => {
        return (
          <Text style={[commonStyle.text_15_27, FontWeight.Regular]}>
            退还方式：
            <Text style={[commonStyle.text_14_ff5000, FontWeight.Light]}>
              原路退回（1-7个工作日退款到原支付方）
            </Text>
          </Text>
        );
      },
    },

  ];

  private generateMenuItem3Arr: IItemProps[] = [
    {
      renderLeftText: () => {
        return (
          <Text style={[commonStyle.text_15_27, FontWeight.Regular]}>
            退还理由：
            <Text style={[commonStyle.text_14_ff5000, FontWeight.Regular]}>（至少选择1项）</Text>
          </Text>
        );
      },
      lineLeft: 24,
    },
  ];

  public onSubmit = () => {
    const errRs = testList([
      {
        rex: () => {
          return this.pageStore.activeCouponList.length  !== 0;
        },
        message: '请至少选择一个消费码',
      },
      {
        rex: () => {
          return this.pageStore.activeReasonList.length !== 0;
        },
        message: '请至少选择一个理由',
      },
    ]);
    if (errRs !== true) {
      return showToast(errRs);
    }

    this.pageStore.requestOrderRefund().then(() => {
      showToast('提交成功');
      this.props.navigation.pop();
    }).catch(errorHandle);

    // this.props.navigation.navigate(NavigationKeys.OrderRefundDetail);
  }

  public render() {
    // alert(JSON.stringify(this.pageStore.order));

    const menuArr1Line = this.gennerateMenuItem1(this.pageStore.couponList);
    const menuView1 = this.generateMenuItem1Arr.concat(menuArr1Line).map((item: IItemProps, index: number) => {
      return <OrderLineItem key={index} {...item} />;
    });

    const menuView2 = this.generateMenuItem2Arr.map((item: IItemProps, index: number) => {
      return <OrderLineItem key={index} {...item} />;
    });

    const menuArr3Line = this.gennerateMenuItem3(this.pageStore.reasonList);
    const menuView3 = this.generateMenuItem3Arr.concat(menuArr3Line).map((item: IItemProps, index: number) => {
      return <OrderLineItem key={index} {...item} />;
    });

    return (
      <View style={{ flex: 1 }}>
      <View style={style.wrap}>
        <View style={style.tips}>
          <FastImage style={style.tips_icon} source={require('img/Order/refund/tips.png')} />
          <Text style={[style.tips_text, FontWeight.Ultralight]}>注: 退款成功后，购买获得的积分将被扣除</Text>
        </View>
        <View style={{ marginBottom: W(6) }}>
          {menuView1}
        </View>
        <View style={{ marginBottom: W(6) }}>
          {menuView2}
        </View>
        <View style={{ marginBottom: W(6) }}>
          {menuView3}
        </View>
      </View>
      <View style={style.footer}>
        <LinerGradientButton
          onPress={this.onSubmit}
          buttonStyles={{ width: W(375), borderRadius: 0 }}
          colors={['#FF4A00', '#FF7301']}
          text={'申请退款'}
          textStyle={{ fontSize: F(15) }}
        />
      </View>
      </View>

    );
  }
}

const style = StyleSheet.create({
  wrap: {
    backgroundColor: '#F8F8F8',
    flex: 1,
  },
  tips: {
    backgroundColor: 'rgba(255, 242, 230, 1)',
    paddingLeft: W(24),
    height: W(24),
    flexDirection: 'row',
    alignItems: 'center',
  },
  tips_icon: {
    width: W(12),
    height: W(12),
    marginRight: W(6),
  },
  tips_text: {
    color: '#FF5000',
    fontSize: F(12),
  },

  footer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },

});
