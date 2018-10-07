
import React from 'react';
import { Image,
  ImageSourcePropType,
  StyleSheet, Text, View } from 'react-native';

import { API, Body38,Body39, PayWay } from 'js/api';
import { aliPay, IPay, wxPay } from 'js/helper/Pay';
import {  IResponse } from 'js/helper/Respone';
import { getStore } from 'js/helper/Store';
import { F, W } from 'js/helper/UI';
import { PayStore } from 'js/store/PayStore';
import { LineView } from 'js/ui/components/Common/LineView';
import { showToast } from 'js/ui/components/Toast';
import { Touchable } from 'js/ui/components/Touchable';

import { action, computed, observable } from 'mobx';
import { observer, Observer } from 'mobx-react';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { hideLoading, showLoading } from 'js/helper/Loading';
import { NavigationScreenProp } from 'react-navigation';
import { payRsShow } from './PopupPayFail';
import { ProductPopoverComponent } from './ProductPopoverComponent';
import FastImage, { FastImageSource } from 'react-native-fast-image';


interface IProps {
  visible: boolean;
  equestClose: () => void;
  show: () => void;
  orderId: number;
  amount: number;
  navigation: NavigationScreenProp<any>;
}

class PagePayStore {

  @observable public active: number = 0;

  @observable public paySign: any = {};

  @action public setActive(index: number) {
    this.active = index;
  }

  private payStore: PayStore;

  @computed get payList(): PayWay[] {
    return this.payStore.enablePayWayList;
  }

  @computed get activePayWay(): PayWay {
    return this.payStore.enablePayWayList[this.active];
  }

  constructor() {
    this.payStore = getStore().payStore;
    this.payStore.syncPayWayList();
  }

  @action public requestPrePay(pararm: Body38) {
    return API.order.prePay(pararm);
  }
  @action public requestOrderStatus(pararm: Body39) {
    return API.order.getOrderPayStatus(pararm);
  }
}

@observer
export class ProductPay extends React.Component<IProps> {

  private payStore = new PagePayStore();

  private activeImageSource: FastImageSource = require('img/Order/vouchers_select.png');
  private unActiveImageSource: FastImageSource = require('img/Order/vouchers_unSelected.png');
  private payIconSourceDir: {[key: string]: FastImageSource} = {
    wxpay:require('img/Order/wx_icon.png'),
    alipay: require('img/Order/zfb_icon.png'),
    default:  require('img/Order/zfb_icon.png'),
  };

  private payChannelDir: {[key: string]: IPay} = {
    wxpay: wxPay,
    alipay:aliPay,
  };

  private getPayIconSource = (key: string = '') => {
    if (key === '' || !(key in this.payIconSourceDir)) {
      return this.payIconSourceDir.default;
    }
    return this.payIconSourceDir[key];
  }

  constructor(props: IProps) {
    super(props);
  }

  public headerRightRender = () => null;

  public onPayItemClick = (index: number) => {
    this.payStore.setActive(index);
  }

  public generateLineView = (item: PayWay, index: number) => {
    const paySource = this.getPayIconSource(item.iconUrl);
    const payName = item.name;
    const activeSource = this.payStore.active === index ? this.activeImageSource : this.unActiveImageSource;
    const imageStyle = payName === '微信支付' ? styles.wx_icon : styles.pay_icon;
    return (
        <Touchable key={index} onPress={this.onPayItemClick.bind(this, index)}>
          <View style={{ backgroundColor: '#FFFFFF' }}>
          <View style={styles.pay_view}>
            <View style={styles.pay_left_view}>
              <FastImage style={imageStyle} source={paySource} resizeMode={FastImage.resizeMode.stretch} />
              <Text style={styles.pay_name}>{payName}</Text>
            </View>
            <View style={styles.pay_right_view}>
              <FastImage style={styles.pay_active_icon} source={activeSource} resizeMode={FastImage.resizeMode.stretch}/>
            </View>
          </View>
          <LineView
            width={W(328)}
            height={StyleSheet.hairlineWidth}
            color={'#CDCDCD'}
            style={{ marginLeft: W(24) }}
          /></View>
        </Touchable>
    );
  }

  public getPayListView = (list: PayWay[]) => {
    return list.map((item, index) => {
      return <Observer key={index} render={this.generateLineView.bind(this, item, index)} />;
    });
  }
  public contentRender = () => {
    const payList = this.payStore.payList;
    const listView = this.getPayListView(payList);

    const render = () => {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.pay_title_view}>
            <Text style={{ fontSize:F(36) , color: '#050505' }}>¥
            <Text style={[styles.pay_title]}> {`${this.props.amount.toFixed(2)}`}</Text></Text>
          </View>
          <View style={{ flex: 1 }}>
            {listView}
          </View>
        </View>
      );
    };
    return <Observer render={render} />;

  }

  public buttonClick = () => {
    const payChannel = this.payChannelDir[this.payStore.activePayWay.iconUrl || ''];
    const pararm = {
      orderId:this.props.orderId,
      payWayId:this.payStore.activePayWay.id,
    };
    this.props.equestClose();
    showLoading('支付订单中...', 5000);
    this.payStore.requestPrePay(pararm)
      .then((rs: IResponse) => {

        let sign = rs.data.aliPay;
        let newSign: any = sign;
        if (this.payStore.activePayWay.id === 1) {
          sign = rs.data.wechatPay;
          newSign = {
            partnerId: sign.partnerid,
            prepayId: sign.prepayid,
            nonceStr: sign.noncestr,
            timeStamp: sign.timestamp,
            package: sign.package,
            sign: sign.sign,
          };
        }
        payChannel.pay(newSign).then((r) => {
          hideLoading();
          this.payStore.requestOrderStatus({ orderId:this.props.orderId }).then((success: IResponse) => {
            showToast('支付成功');
            console.log(success);
            this.props.navigation.navigate(NavigationKeys.OrderDetailWithVoucher, {
              orderId: this.props.orderId,
              status:success.data.payStatus,
            });
          });
          // TODO 跳转订单详情
        }).catch((r) => {
          hideLoading();
          payRsShow(() => {
            this.props.show();
          });
        });

      });

  }

  public render() {
    const { visible, equestClose } = this.props;

    return (
      <View style={{ position: 'relative' }}>

        <ProductPopoverComponent
          visible={visible}
          equestClose={equestClose}
          contentRender={this.contentRender}
          headerRightRender={this.headerRightRender}
          contentStyle={styles.content}
          title={'选择支付方式'}
          buttonText={'立即购买'}
          buttonClick={this.buttonClick}
          contentScroll={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  pay_title_view: {
    height: W(80),
    justifyContent: 'center',
    alignItems: 'center',
  },

  pay_title: {
    color: '#050505',
    fontSize: F(36),
    fontFamily:'DIN-Medium',
  },

  pay_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: W(49),
  },

  pay_left_view: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: W(24),
  },

  wx_icon: {
    width: W(26),
    height: W(20),
  },
  pay_icon: {
    width: W(25),
    height: W(25),
  },
  pay_name: {
    color: '#787778',
    fontSize: F(15),
    marginLeft: W(10),
  },

  pay_right_view: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: W(24),
  },

  pay_active_icon: {
    width: W(20),
    height: W(20),
    marginTop: W(2),
    resizeMode:'stretch',

  },

  line: {
    height: W(0.8),
    width: W(375),
    backgroundColor:'#E6E6E6',
  },

  payrs: {
    width: W(145),
    height: W(130),
    borderRadius: W(9),
    backgroundColor:
    'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payrs_img: {
    width: W(46),
    height: W(46),
    marginBottom: W(10),
  },
  payrs_text: {
    color: '#FFFFFF',
    fontSize: F(18),
  },

});
