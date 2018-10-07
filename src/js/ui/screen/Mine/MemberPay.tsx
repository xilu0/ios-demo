import React from 'react';

import { API, Body38, PayWay } from 'js/api';
import {px2dp } from 'js/helper/Adapter';
import { aliPay, IPay, wxPay } from 'js/helper/Pay';
import {  errorHandle, IResponse } from 'js/helper/Respone';
import { getStore } from 'js/helper/Store';
import { F, W } from 'js/helper/UI';
import { PayStore } from 'js/store/PayStore';
import { UserStore } from 'js/store/UserStore';
import { showToast } from 'js/ui/components/Toast';
import { action, computed, observable } from 'mobx';
import { inject, observer, Observer } from 'mobx-react';
import {  StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { NavigationKeys } from 'js/const/NavigationKeys';
import { hideLoading, showLoading } from 'js/helper/Loading';
import { navigate } from 'js/helper/navigate';
import { appHeader } from 'js/ui/components/Navigation';
import { TrialButton } from './TrialButton';
import FastImage from 'react-native-fast-image';



interface IData {
  leftTitle: string;
  rightTitle: string;
  desc?: string;
}
interface IProps {
  navigation: NavigationScreenProp<any>;
  data: IData[];
  bottomDesc: string[];
  userStore: UserStore;
}
interface IPayData {
  leftTitle: string;
  rightTitle: string;
  isIcon?: boolean;
  leftIco?: string;
  isActive?: boolean;
  payWayId: number;
}
interface IRdata {
  payStatus: number;
  point: number;
  actualMoney: number;
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

  // @action public setPlusData(data: IExtPlusMemberType, index: number) {
  //   this.plusTypes.forEach((o: IExtPlusMemberType) => o.isActive = false);
  //   this.plusTypes[index].isActive = true;
  // }
}

@appHeader('', {
  headerStyle: {
    borderBottomWidth: 0,
    backgroundColor: '#FFF',
  },
})
@inject('userStore')
@observer
export class MemberPay extends React.Component<IProps, any> {
  public userStore: UserStore;
  private payStore = new PagePayStore();
  public currentPrice: number = 0;
  constructor(props: IProps) {
    super(props);
    this.userStore = props.userStore;
    this.currentPrice = props.navigation.getParam('currentPrice');
    this.state = {
      subData:[{
        isActive:false,
      }],
    };
  }
  private payChannelDir: {[key: string]: IPay} = {
    wxpay: wxPay,
    alipay:aliPay,
  };
  public onPress = (item: IPayData, index: number) => {
    const subData = this.state.subData;
    subData.forEach((element: IPayData) => element.isActive = false);
    subData[index].isActive = true;
    this.setState(subData);
  }
  public buttonClick = () => {
    const subData = this.state.subData;
    const currentPrice = this.props.navigation.getParam('currentPrice');
    const plusType = this.props.navigation.getParam('type');
    const filterActive = subData.filter((item: IPayData) => item.isActive);
    const [{ id }] = filterActive.length > 0 ?
    subData.filter((item: IPayData) => item.isActive) :
      [{ id:undefined }];
    if (!id) {
      showToast('请任意选择一种支付方式');
      return false;
    }

    const payChannel = this.payChannelDir[(id === 1 ? 'wxpay' : 'alipay') || ''];
    const pararm = {
      plusType,
      payWayId:id,
    };

    showLoading('支付订单中...', 5000);
    this.userStore.requestSubmitPlusOrder(pararm)
      .then((rs: IResponse) => {
        let sign = rs.data.aliPay;
        let newSign: any = sign;
        if (id === 1) {
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
          // this.props.equestClose();
          showToast('支付成功');
          this.userStore.requestGetPlusOrderPayStatus({ orderId: rs.data.orderId }).then((data: IRdata) => {
            if (data.payStatus === 1) {
              navigate(NavigationKeys.PaySuccess, { currentPrice });
            }
          });
        }).catch((r) => {
          hideLoading();
        });
      }).catch(errorHandle);

  }

  public isRenderIcon = (item: PayWay) => {
    const payPic = {
      wxpay:require('img/Order/wx_icon.png'),
      alipay: require('img/Order/zfb_icon.png'),
      default:  require('img/Order/zfb_icon.png'),
    };
    return (<FastImage 
      source={payPic[item.iconUrl]} 
      style={styles.payPic} 
      resizeMode={FastImage.resizeMode.stretch}/>);

  }
  public onChoseWay = (item: PayWay, index: number) => {
    const subData = this.payStore.payList;
    subData.forEach((o: PayWay) => o.isActive = false);
    subData[index].isActive = true;
    this.setState({ subData });
  }
  public contentRender = () => {
    const payList = this.payStore.payList;
    const subData = this.state.subData;
    return payList.map((item, index) => {
      const picPath = (subData[index] && subData[index].isActive) ? 
            require('img/plusMember/tick.png') : require('img/round.png');
      const activeFW = subData[index] && subData[index].isActive ? styles.fw_b : styles.fw_n;
      return (
        <TouchableWithoutFeedback onPress={this.onChoseWay.bind(this, item, index)} key={item.name}>
          <View key={index} style={styles.container}>
            <View style={styles.topView}>
              {this.isRenderIcon(item)}
              <Text style={[styles.leftText, activeFW]} > {item.name}</Text>
            </View>
            <View style={{ flex:1 , flexDirection:'row', justifyContent:'flex-end', alignItems:'center' }}>
               <FastImage 
                source={picPath} 
                style={styles.wayStatus}
                resizeMode={FastImage.resizeMode.stretch}
                />
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    });

  }
  public render() {   
    return(
        <View style={styles.bgF}>
          <View style={styles.plusTitle}>
          <Text style={styles.title}>付款方式</Text>
          <Text style={styles.subTitle}>请选择支付方式</Text>
        </View>
          <View>
            {this.contentRender()}
          </View>
          <View style={styles.center}>
            <TrialButton
              userStore={this.props.userStore}
              navigation={this.props.navigation}
              name={`立即支付`}
              callback={this.buttonClick}
              otherStyle={{ marginTop: W(40) }}
            />
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  bgF:{
    backgroundColor:'#fff',
    flex: 1,
  },
  title:{
    fontSize: F(25),
    fontWeight: 'bold',
  },
  plusTitle:{
    paddingLeft: W(23),
    paddingTop: W(18),
    paddingBottom: W(18),
    backgroundColor:'#FFF',
  },
  subTitle:{
    marginTop: W(10),
    color:'#666',
    fontSize: F(14),
  },
  fw_n:{
    fontWeight: 'normal',
  },
  fw_b:{
    fontWeight: 'bold',
  },
  container: {
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingTop:W(35),
    paddingBottom: W(30),
    marginHorizontal:W(25),
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  center: {
    justifyContent:'center',
    alignItems: 'center',
  },
  topView:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems:'center',
  },
  leftText:{
    color:'#444',
    fontSize:F(15),
    width:W(60),
    height:W(21),
  },
  rightText:{
    height:px2dp(40),
  },
  c_C3A78F:{
    color:'#C3A78F',
  },
  c_c:{
    color:'#ccc',
  },
  text_throung:{
    textDecorationLine:'line-through',
  },
  desc:{
    marginTop:px2dp(30),
    marginLeft:W(25),
  },
  desc_item:{
    height:px2dp(60),
  },
  rightIcon:{
    height:px2dp(70),
    width:px2dp(70),
  },
  payPic:{
    width: W(25),
    height: W(25),
    marginRight:W(6),
  },
  wayStatus:{
    height: W(20),
    width: W(20),
  },
});
