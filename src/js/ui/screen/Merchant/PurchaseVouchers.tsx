import React from 'react';
import { NavigationScreenProp } from 'react-navigation';

import { API, Body27, OrderInfo, SubmitProductOrder } from 'js/api';
import { hideLoading, showLoading } from 'js/helper/Loading';
import { errorHandle, errorHandleThen, IResponse } from 'js/helper/Respone';
import { F, isiPhone, W } from 'js/helper/UI';
import { MerchantStore, ProductModel } from 'js/store/MerchantStore';
import { UserStore } from 'js/store/UserStore';
import { Colors } from 'js/style/colors';
import { LinerGradientButton } from 'js/ui/components/Common/LinerGradientButton';
import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { appHeader } from 'js/ui/components/Navigation';
import { PopoverPayFail } from './PopupPayFail';
import { ProductPay } from './ProductPay';
import FastImage from 'react-native-fast-image';


interface IProps {
  navigation: NavigationScreenProp<IProps>;
  userStore: UserStore;
}

class ModalStore {
  @observable public visible: boolean = false;
  @action public setVisable(b: boolean) {
    this.visible = b;
  }
}

@observer
class Sticker extends React.Component<{
  title?: string;
  rightTitle?: string;
  rightStyle?: StyleProp<ViewStyle>;
  isShowLine?: boolean;
  rightView?: any;
  lineStyle?: StyleProp<ViewStyle>;

}, any> {

  public render() {

    const Title = this.props.title ? (
      <Text style={styles.left_title}>{this.props.title}</Text>
    ) : null;

    const rightTitle = this.props.rightTitle ? (
      <Text style={[styles.defaultStyle, this.props.rightStyle]}>{this.props.rightTitle}</Text>
    ) :  this.props.rightView ;
    const line = this.props.isShowLine ? (<View style={[styles.sticker_line, this.props.lineStyle]} />) :null;
    return (
      <View style={{ backgroundColor:'#fff' }}>
        <View style={styles.textContent}>
          {Title}
          {rightTitle}
        </View>
        {line}
     </View>
    );
  }
}

class Voucher extends React.Component<{
  item: ProductModel,
  store: MerchantStore,
}, any> {

  public render() {

    const VoucherImage = (
    <Image
      source={{ uri:this.props.store.merchantDetail.coverPath }}
      style={styles.voucherImage}
    />
    );
    return (
      <View style={styles.voucher}>
          {VoucherImage}
        <View style={styles.rightView}>
        <View style={styles.topView}>
          <Text style={styles.topView_title}>{this.props.item.name}</Text>
          <Text style={styles.topView_price}>{`￥${this.props.item.favorablePrice}`}</Text>
        </View>
        <View style={styles.middle}>
            <Text style={[styles.middle_text, styles.middle_date]} numberOfLines={1}>
            {this.props.item.availableTimeDesc}</Text>
            <View style={styles.middle_line}/>
            <Text style={[styles.middle_text, styles.middle_textleft]}>可叠加</Text>
        </View>
        <View style={styles.bottom}>
            <FastImage source={require('img/Order/address_icon.png')} style={{ width: W(10), height:W(13) }}/>
            <Text style={styles.bottom_text} numberOfLines={1}>
            {this.props.store.merchantDetail.detailAddress}</Text>
        </View>
       </View>
     </View>
    );
  }
}

class VouchersStore {

  @observable public priductDetail: ProductModel =   new ProductModel();
  @action public getDetail(params: Body27) {
    return API.product.getProductDetail(params).then(action((rs: IResponse) => {
      this.priductDetail = rs.data;

    })).catch(errorHandle);
  }
}

@inject('userStore')
@appHeader('确认订单')

@observer
export class PurchaseVouchers extends React.Component<IProps> {

  private modalStore = new ModalStore();
  protected purchaseStore = new PurchaseStore();
  private voucherStore = new VouchersStore();
  protected merchantStore = new MerchantStore();

  private productId =  this.props.navigation.getParam('productId') ;
  private merchantId =  this.props.navigation.getParam('merchantId') ;
  private order: OrderInfo =  this.props.navigation.getParam('order') ;

  public constructor(props: any) {
    super(props);
    this.props.navigation.setParams({ goBack: this.goBack.bind(this) });

  }
  public componentDidMount() {
    this.voucherStore.getDetail({ productId:this.productId });
    this.merchantStore.requsetGetMerchantDetail({ merchantId:this.merchantId });
    if (this.order) {
      this.aginSubmitOrder();
    }

  }
  public aginSubmitOrder() {
    this.setOrderNumber(this.order.product!.quantity || 1);
    this.calculate();
    const params = new SubmitParams();
    params.merchantId = this.merchantStore.merchantDetail.id;
    params.productId = this.voucherStore.priductDetail.id;
    params.merchantVersionId = this.merchantStore.merchantDetail.auditVersionId;
    params.productVersionId = this.voucherStore.priductDetail.auditVersionId;
    params.actualMoney = this.order.actualMoney;
    params.productQuantity = this.order.product!.quantity;
    this.onPayBtnClick(params);
  }

  public goBack() {
    this.props.navigation.goBack();
  }

  // public product: ProductModel  = this.props.navigation.getParam('item');
  // public merchatStore: MerchantStore = this.props.navigation.getParam('store');

  @observable public orderNumber?: number;
  @observable public isMinus: boolean = false ;
  @observable public isEdgar: boolean = true;
  @observable public totalAmount?: number;

  @computed get currentNumber(): number {
    return this.orderNumber || 1;
  }
  @computed get currentMinusable(): boolean {
    return this.isMinus ;
  }
  @computed get currentEdgarable(): boolean {
    return this.isEdgar ;
  }

  @computed get currentTotalAmout() {
    return this.totalAmount || this.voucherStore.priductDetail.favorablePrice;
  }

  @action public setTotalAmout(sum: number) {
    this.totalAmount = sum;
  }
  @action public setOrderNumber(num: number) {
    this.orderNumber = num;
  }
  @action public setMinus(enable: boolean) {
    this.isMinus = enable ;
  }
  @action public setEdgar(enable: boolean) {
    this.isEdgar = enable ;
  }
  public minusAction = () => {
    const num = this.currentNumber ;
    this.setEdgar(true);
    this.setOrderNumber(num - 1) ;
    this.setMinus(this.currentNumber > 1 ? true :false);
    this.calculate();
  }
  public edgarAction = () => {
    const num = this.currentNumber ;
    this.setOrderNumber(num + 1) ;
    this.setMinus(this.currentNumber > 1 ? true :false);
    this.calculate();
    if (num >= 29) {
      this.setEdgar(false);
      // return;
    }

  }

  public calculate() {
    const num = this.currentNumber;

    const price = this.voucherStore.priductDetail.favorablePrice || 0;
    const sum = num * price;
    this.setTotalAmout(sum);
  }

  public onPayBtnClick = (params: SubmitParams) => {

    showLoading('正在生成订单...', 5000);
    this.purchaseStore.submitOrder(params).then(() => {
      this.modalStore.setVisable(true);
    });

  }

  public closePay = () => {
    this.modalStore.setVisable(false);
  }

  public showPay = () => {
    this.modalStore.setVisable(true);
  }

  public render() {
    const minusImage = this.currentMinusable ? require('img/Order/minus_red.png') :require('img/Order/minus_gray.png');
    const edgarImage = this.currentEdgarable ? require('img/Order/edgar_red.png') :require('img/Order/edgar_gray.png');
    const  rightContent = (
          <View style={styles.buttonView}>
              <TouchableWithoutFeedback
                disabled={!this.currentMinusable}
                onPress={this.minusAction}
              >
              <FastImage source={minusImage}/>
              </TouchableWithoutFeedback>
              <View style={styles.numView}>
              <FastImage source={require('img/Order/gray_border.png')} />
              <Text style={styles.numText}>{this.currentNumber}</Text>
              </View>
              <TouchableWithoutFeedback
                disabled={!this.currentEdgarable}
                onPress={this.edgarAction}
              >
              <FastImage source={edgarImage} style={{ marginLeft:W(11) }}/>
              </TouchableWithoutFeedback>
            </View >
    );

    const  quantity = (
      <Sticker  title='数量:'  rightView={rightContent}  isShowLine={true}/>
    );
    const singlePrice = (
       <Sticker
          title='单价'
          rightTitle={`￥${this.voucherStore.priductDetail.favorablePrice}`}
          // rightStyle={styles.rightPricer}
          isShowLine={true}
       />
      );
    const realPayment = (
      <Sticker  title='实付金额' rightTitle={`￥${this.currentTotalAmout}`} rightStyle={styles.rightSum} />
    );
    const purchaseAccount = (
      <Sticker
        title='购买账户'
        rightTitle={this.props.userStore.self.mobile}
        isShowLine={true}
        lineStyle={styles.fullLine}
      />
    );

    const params = new SubmitParams();
    params.merchantId = this.merchantStore.merchantDetail.id;
    params.productId = this.voucherStore.priductDetail.id;
    params.merchantVersionId = this.merchantStore.merchantDetail.auditVersionId;
    params.productVersionId = this.voucherStore.priductDetail.auditVersionId;
    params.actualMoney = this.currentTotalAmout;
    params.productQuantity = this.currentNumber;

    return(
      <View style={styles.continer}>
          <Voucher item={this.voucherStore.priductDetail} store={this.merchantStore}/>
          <View style={styles.dividingline}/>
          {quantity}
          {singlePrice}
          {realPayment}
          <View style={styles.dividingline}/>
          {purchaseAccount}
          <View style={styles.footer}>
            <LinerGradientButton
              onPress={this.onPayBtnClick.bind(this, params)}
              text='立即购买'
            />
          </View>
          <ProductPay
            visible={this.modalStore.visible}
            equestClose={this.closePay}
            show={this.showPay}
            orderId={this.purchaseStore.orderData.orderId}
            amount={this.currentTotalAmout || 0}
            navigation={this.props.navigation}
          />
          <PopoverPayFail />
      </View>
    );
  }

}

class SubmitParams implements SubmitProductOrder {

  @persist @observable public merchantId?: number;
  @persist @observable public merchantVersionId?: number;
  @persist @observable public actualMoney?: number;
  @persist @observable public productId?: number;
  @persist @observable public productVersionId?: number;
  @persist @observable public productQuantity?: number;

}

export class PurchaseStore {

  @observable public orderData: any = {};
  @action public submitOrder(params: SubmitProductOrder) {
    return API.order.submitProductOrder(params).then((rs: IResponse) => {
      console.log(JSON.stringify(rs.data));
      hideLoading();
      this.orderData = rs.data;
    }).catch(errorHandleThen((rs) => {
      hideLoading();
    }));
  }
}

const styles = StyleSheet.create({
  continer:{
    // flex: 1,
    backgroundColor:'#f8f8f8',
    flex: 1,
    // position: 'relative',

  },
  backImage:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
  },

  textContent:{
    height:W(52),
    width:W(375),
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  rightPricer:{
    color:Colors.TITLE_RED,
  },
  rightSum:{
    fontSize: F(18),
    color:Colors.TITLE_RED,

  },
  sticker_line: {
    marginLeft: W(24),
    width: W(352),
    height:isiPhone() ? StyleSheet.hairlineWidth :W(0.8),
    backgroundColor:'#E6E6E6' },
  fullLine:{ marginLeft: 0, width: W(375), height: W(1), backgroundColor:'#E6E6E6' },
  voucher:{  flexDirection: 'row', justifyContent:'space-between', backgroundColor:'#fff' },

  voucherImage:{
    width:W(90),
    height:W(75),
    borderRadius: W(2),
    marginLeft: W(24),
    marginTop: W(15),
    marginBottom: W(15),
    backgroundColor:'#f2f2f2',
  },
  rightView:{
    width:W(248),
    height:W(75),
    marginRight: W(24),
    marginTop: W(18),

  },
  topView:{ flexDirection:'row', justifyContent:'space-between', marginLeft:W(15), marginRight:W(20) },
  middle:{ flexDirection:'row' , marginLeft:W(15), marginTop:isiPhone() ? W(10) :W(8) , marginRight:W(20) },
  bottom:{ flexDirection:'row', marginLeft:W(15), marginTop:isiPhone() ? W(10) :W(8), marginRight:W(20)  },
  topView_title:{ color:Colors.TITLE_BLACK_3, fontSize:F(15), fontWeight:'400' },
  topView_price:{ color:Colors.TITLE_BLACK_6, fontSize:F(15), fontWeight:'400' },
  middle_text:{ color:Colors.TITLE_BLACK_6, fontSize:F(14), fontWeight:'400' },
  middle_date:{ maxWidth:W(165) },

  middle_line:{ width:W(1), height:W(12), backgroundColor:Colors.TITLE_BLACK_6, marginLeft:W(4) , alignSelf:'center' },
  bottom_text:{ color:Colors.TITLE_BLACK_6, fontSize:F(13), fontWeight:'400', marginLeft:W(6), maxWidth:W(200) },
  middle_textleft:{
    marginLeft:W(4),
  },
  left_title:{
    color: Colors.TITLE_BLACK_3,
    fontWeight: '400',
    fontSize: F(15),
    alignSelf:'center' ,
    marginLeft: W(24) },
  defaultStyle:{
    color: Colors.TITLE_BLACK_3,
    fontWeight: '400',
    fontSize: F(15),
    alignSelf: 'center' ,
    marginRight: W(24),
  },
  dividingline:{
    backgroundColor:Colors.LINE_GRAY,
    height:W(6),
    width:W(375),
  },
  buttonView:{ flexDirection:'row', justifyContent:'flex-start', height:W(30), alignItems:'center', marginRight:W(24) },
  numView:{ height:30, justifyContent:'center' , width:W(42), alignItems:'center', marginLeft:W(11) },
  numText:{
    position:'absolute',
    marginLeft:0 ,
    color:'#333334',
    fontSize: F(16),
    textAlign:'center',
  },

  footer:{
    paddingTop: W(20),
    paddingBottom: W(20),
  },
  container:{
    // position:'absolute',
    width:W(145),
    height:W(130),
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'rgba(0,0,0,0.8)',
    borderRadius: W(8),
  },
  text:{
    fontSize: F(18),
    color:'#fff',
    fontWeight: '400',
  },
});
