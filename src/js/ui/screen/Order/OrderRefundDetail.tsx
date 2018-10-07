import React from 'react';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { commonStyle, IItemProps, OrderLineItem  } from './OrderItemComponent/OrderLineItem';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { errorHandle } from 'js/helper/Respone';
import { F, W } from 'js/helper/UI';
import { FontWeight } from 'js/style/fonts';
import { LinerGradientButton } from 'js/ui/components/Common/LinerGradientButton';
import { appHeader } from 'js/ui/components/Navigation';

import { API, IResponse, RefundInfo, RefundList } from 'js/api';
import { action, computed, observable } from 'mobx';
import FastImage from 'react-native-fast-image';


interface IProps {
  navigation: NavigationScreenProp<any, {
    refund: RefundList,
  }>;
}

// 退款状态（0:无退款 1:退款成功  2.申请中3.审批通过退款中 4:第三方退款中 5:退款失败）
const refundStatusArr = [
  '无退款', '退款成功', '退款申请', '商家审核', '第三方审核', '退款失败',
];

class PageStore {
  @observable public refund: RefundList = {};

  @observable public refundInfo: RefundInfo = {};

  @action public setRefund(_refund: RefundList) {
    this.refund = _refund;
  }

  @action public requestGetRefundDetail() {
    return API.order
      .getRefundDetail({ refundId: this.refund.refundId })
      .then(action((rs: IResponse) => {
        this.refundInfo = rs.data;
      }))
      .catch(errorHandle);
  }

  @computed public get status() {
    return this.refundInfo.refundStatus || 0;
  }

  @computed public get refundStatusText() {
    return refundStatusArr[this.status];
  }

  @computed public get refundTimeText() {
    const index = this.status;
    let timeText: any = '';
    if (index === 1) {
      timeText = this.refundInfo.payTime || '';
    } else {
      timeText = this.refundInfo.createTime || '';
    }

    return timeText;
  }

  @computed public get money() {
    return (this.refundInfo.money || 0).toFixed(2);
  }

}

@appHeader('退款详情')
export class OrderRefundDetail extends React.Component<IProps, any, any> {

  private pageStore: PageStore;

  constructor(props: IProps) {
    super(props);
    this.pageStore = new PageStore();
  }

  public componentDidMount() {
    const refund = this.props.navigation.getParam('refund');
    this.pageStore.setRefund(refund);
    this.pageStore.requestGetRefundDetail();
  }

  public onClick = () => {
    this.props.navigation.navigate(NavigationKeys.CouponUseShow);
  }

  private generateMenuItem1Arr: IItemProps[] = [
    {
      renderLeftText: () => {
        return (
          <Text style={[commonStyle.text_15_27, FontWeight.Regular]}>退还金额</Text>
        );
      },
      renderRightCom: () => {
        return (
        <View>
          <Text style={[style.text_15_ff8867, FontWeight.Regular]}>
            ¥{this.pageStore.money.split('.')[0]}.
            <Text style={[style.text_12_ff8867, FontWeight.Regular]}>
            {this.pageStore.money.split('.')[1]}
            </Text>
          </Text>
        </View>);
      },
      lineLeft: 24,
    },
    {
      renderLeftText: () => {
        return (
          <Text style={[commonStyle.text_15_27, FontWeight.Regular]}>退回方式({this.pageStore.refundInfo.account})</Text>
        );
      },
      renderRightCom: () => {
        return (
          <View>
            <Text style={[style.text_14_27, FontWeight.Light]}>
              ¥{this.pageStore.money.split('.')[0]}.
              <Text style={[style.text_11_27, FontWeight.Light]}>
                {this.pageStore.money.split('.')[1]}
              </Text>
            </Text>
          </View>);
      },
    },

  ];

  private generateMenuItem2Arr: IItemProps[] = [
    {
      renderLeftText: () => {
        return (
          <Text style={[commonStyle.text_15_27, FontWeight.Regular]}>
            退款流程
            {/* <Text style={[commonStyle.text_14_ff5000, FontWeight.Regular]}>100元</Text> */}
          </Text>
        );
      },
    },
  ];

  public renderStatusView = () => {
    const statusText = this.pageStore.refundStatusText;
    const timeText = this.pageStore.refundTimeText;
    return (
      <View style={style.status}>
        <Text style={[style.status_text_1, FontWeight.Light]}>{statusText}</Text>
        <Text style={[style.status_text_2, FontWeight.Light]}>{timeText}</Text>
      </View>
    );
  }

  public dotSrcImageDir: {[key: string]: ImageSourcePropType} = {
    gray: require('img/Order/refund/null_0.png'),
    green: require('img/Order/refund/null_1.png'),
    success: require('img/Order/refund/success_1.png'),
    faild: require('img/Order/refund/faild_1.png'),
  };

  public getDotStepView = (dot: any, index: number) => {
    const hiddenStyle = dot.hidden ? { color: '#999999' } : null;
    return (
      <View style={[styleTimeLine.item]} key={index}>
        <View style={styleTimeLine.item_top}>
          <View style={styleTimeLine.item_top_line}>
            <View style={[styleTimeLine.item_top_line__left, dot.leftLineStyle]} />
            <View style={[styleTimeLine.item_top_line__right, dot.rightLineStyle]} />
          </View>
          <View style={styleTimeLine.item_top_icon}>
            <FastImage  style={styleTimeLine.item_top_icon__img} source={dot.src} />
          </View>
        </View>
        <View style={styleTimeLine.item_bottom}>
          <Text style={[styleTimeLine.item_bottom_text_1, hiddenStyle]}>{dot.text}</Text>
          <Text style={styleTimeLine.item_bottom_text_2}>{dot.time}</Text>
        </View>
      </View>
    );
  }

  public render() {
    const menuView1 = this.generateMenuItem1Arr.map((item: IItemProps, index: number) => {
      return <OrderLineItem key={index} {...item} />;
    });

    const menuView2 = this.generateMenuItem2Arr.map((item: IItemProps, index: number) => {
      return <OrderLineItem key={index} {...item} />;
    });

    const arr = [
      {
        hidden: true,
        leftLineStyle: styleTimeLine.line_null,
        src: this.dotSrcImageDir.gray,
        rightLineStyle: styleTimeLine.line_gray,
        text: '退款申请',
        time: '',
      }, {
        hidden: true,
        leftLineStyle: styleTimeLine.line_gray,
        src: this.dotSrcImageDir.gray,
        rightLineStyle: styleTimeLine.line_gray,
        text: '退款审批',
        time: '',
      }, {
        hidden: true,
        leftLineStyle: styleTimeLine.line_gray,
        src: this.dotSrcImageDir.gray,
        rightLineStyle: styleTimeLine.line_null,
        text: '退款结果',
        time: '',
      },
    ];

    const status = this.pageStore.status;

    if (status !== 0) {
      arr[0].hidden = false;
      arr[0].src = this.dotSrcImageDir.green;
      arr[0].rightLineStyle = styleTimeLine.line_green;
      arr[0].time = this.pageStore.refundInfo.createTime;
      if (status !== 2) {
        arr[1].hidden = false;
        arr[1].leftLineStyle = styleTimeLine.line_green;
        arr[1].src = this.dotSrcImageDir.green;
        arr[1].rightLineStyle = styleTimeLine.line_green;
        arr[1].time = this.pageStore.refundInfo.auditTime || this.pageStore.refundInfo.createTime;
        if (status === 1) {
          arr[2].hidden = false;
          arr[2].leftLineStyle = styleTimeLine.line_green;
          arr[2].src = this.dotSrcImageDir.success;
          arr[2].text = refundStatusArr[1];
          arr[2].time = this.pageStore.refundInfo.payTime;
        } else if (status === 5) {
          arr[2].hidden = false;
          arr[2].leftLineStyle = styleTimeLine.line_green;
          arr[2].src = this.dotSrcImageDir.faild;
          arr[2].text = refundStatusArr[5];
          // arr[2].time = this.pageStore.refundInfo.payTime;
        }
      }
    }

    const stepView = arr.map(this.getDotStepView);

    return (
      <View style={{ flex: 1 }}>
        <View style={style.wrap}>

          <View>
            <LinerGradientButton
              buttonStyles={style.statusWrap}
              colors={['#FF4A00', '#FF7301']}
              // locations={[0.65, 1]}
              text={this.renderStatusView()}
              activeOpacity={1}
            />
          </View>

          <View style={{ marginBottom: W(6) }}>
            {menuView1}
          </View>
          <View style={{ marginBottom: W(6) }}>
            {menuView2}
          </View>
          <View style={styleTimeLine.wrap}>
           {stepView}
          </View>
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
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

  statusWrap: {
    width: W(375),
    borderRadius: 0,
    height: W(100),
    alignItems: 'flex-start',
    paddingLeft: W(23),
  },

  status: {

  },
  status_text_1: {
    color: '#FFFFFF',
    fontSize: F(18),
    marginBottom: W(8),
  },
  status_text_2: {
    color: '#FFFFFF',
    fontSize: F(12),
  },

  text_15_ff8867: {
    fontSize: F(15),
    color: '#FF8867',
  },
  text_12_ff8867: {
    fontSize: F(12),
    color: '#FF8867',
  },

  text_14_27: {
    fontSize: F(14),
    color: '#272727',
  },
  text_11_27: {
    fontSize: F(11),
    color: '#272727',
  },

});

const styleTimeLine = StyleSheet.create({
  wrap: {
    backgroundColor: '#F4F4F4',
    flexDirection: 'row',
  },

  item: {
    flex: 1,
  },

  item_top: {
    justifyContent: 'center',
    height: W(40),
  },
  item_top_icon: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    height: W(19),
    width: W(19),
    transform: [{ translateY: -9.5 }, { translateX: -9.5 }],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: W(10),
    overflow: 'hidden',
  },
  item_top_icon__img: {
  },
  item_top_icon__img___rs: {
    backgroundColor: '#FFFFFF',
  },
  item_top_line: {
    flexDirection: 'row',
  },

  item_top_line__left: {
    flex: 1,
    height: W(2),
    backgroundColor: '#4BC278',
  },

  item_top_line__right: {
    flex: 1,
    height: W(2),
    backgroundColor: '#4BC278',
  },

  item_bottom: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: W(40),
  },

  item_bottom_text_1: {
    color: '#272727',
    fontSize: F(12),
    marginBottom: W(3),
  },
  item_bottom_text_2: {
    color: '#999999',
    fontSize: F(10),
  },

  line_null: {
    backgroundColor: 'transparent',
  },

  line_gray: {
    backgroundColor: '#CCC',
  },

  line_green: {
    backgroundColor: '#4BC278',
  },

});
