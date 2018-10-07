
import { API,
 Body34, Body32, Body37, OrderDetailInfo, OrderInfo, OrderInfoMerchant, OrderInfoProduct } from 'js/api';
import { NavigationKeys } from 'js/const/NavigationKeys';
import { isPhoneX, px2dp } from 'js/helper/Adapter';
import { amap } from 'js/helper/Amap';
import {  errorHandle, IResponse } from 'js/helper/Respone';
import { getStore } from 'js/helper/Store';
import { F, isiPhone, screenWidth, W } from 'js/helper/UI';
import { Colors } from 'js/style/colors';
import { LinerGradientButton } from 'js/ui/components/Common/LinerGradientButton';
import { MerchantIntro } from 'js/ui/components/Merchant/MerchantIntro';
import { action,  computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  SafeAreaView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationScreenProp } from 'react-navigation';
import { EventKey } from 'js/const/EventKey';
import { appBroadCast } from 'js/helper/Events';
import { PopoverPayFail } from '../Merchant/PopupPayFail';
import { ProductPay } from '../Merchant/ProductPay';
import { OrderItemHeader } from './OrderItemHeader';
import FastImage from 'react-native-fast-image';


interface IProps {
  navigation: NavigationScreenProp<IProps>;
  screenProps: any;
}

class OrderDetailStore {

  @observable public order: OrderInfo = {};
  @observable public products: OrderInfoProduct = {} ;
  @observable public orderDetails: OrderDetailInfo[] =  [];
  @observable public merchant: OrderInfoMerchant = {};
  @observable public telephones: string[] = [];

  @observable private merchantDistance: number = 0;
  @computed public get distance(): string {
    if (this.merchantDistance > 1000) {
      return (this.merchantDistance / 1000).toFixed(2);
    }
    return this.merchantDistance.toString();
  }

  @action public  getOrderDetail(params: Body32) {
    return API.order.getOrderDetail(params).then(action((rs: IResponse) => {
      this.order = rs.data;
      this.merchant = this.order.merchant || {};
      this.products = this.order.product || {};
      this.orderDetails = this.order.orderDetails || [];
      this.telephones = this.merchant.contactTels!;
      this.telephones.push('取消');
      console.log(JSON.stringify(rs.data));
      this.gennerateMerchantDistance();
    }));
  }

  @action private gennerateMerchantDistance() {
    const originLocations = `${this.merchant.longitude},${this.merchant.latitude}`;
    const location = getStore().geolocationStore.location;
    const indexLocations = `${location.longitude},${location.latitude}`;
    return amap.distance(originLocations, indexLocations).then((dis: number) => {
      this.merchantDistance = dis;
      return dis;
    });
  }

  @action public deleteOrder(params: Body32) {
    return API.order.deleteOrder(params);
  }
  @action public canleOrder(params: Body37) {
    return API.order.cancelOrder(params);
  }

  @action public aplyRefund(params: Body34) {
    return API.order.refund(params);
  }
}
class ModalStore {
  @observable public visible: boolean = false;
  @action public setVisable(b: boolean) {
    this.visible = b;
  }
}

@observer
export class OrderDetailWithVoucher extends React.Component<IProps, any> {

  public static navigationOptions = ({ screenProps = { statusBarHeight: 0 }, navigation }: IProps) => {
    const _statusBarHeight = screenProps.statusBarHeight;

    const defaultConfig = {
      title: '订单详情',
      headerLeft: (
          <TouchableHighlight
            onPress={navigation.getParam('goBack')}
            style={styles.arrow_left}
            underlayColor={'rgba(0,0,0,0)'}
          ><View>
            <FastImage source={require('img/merchant/back_black.png')} />           
          </View>
          </TouchableHighlight>
      ),
      headerRight: (
        navigation.getParam('rightBtnView') || <View/>
      ),
      headerStyle: {
        paddingTop: _statusBarHeight,
        height: px2dp(107) + _statusBarHeight,
        elevation: 0,
        borderBottomColor: '#E6E6E6',
        borderBottomWidth: StyleSheet.hairlineWidth,
        backgroundColor: '#FBFBFB',
      },
      tabBarVisible:false,
      gesturesEnabled: false,
    };
    return defaultConfig;

  }

  private orderStore = new OrderDetailStore();
  private modalStore = new ModalStore();

  public orderId = this.props.navigation.getParam('orderId');
  public state = {
    isShow: false,
  };

  public constructor(props: any) {
    super(props);
    this.props.navigation.setParams({ goBack: this.goBack.bind(this) });
    this.setHeaderRightButton();

  }
  public setHeaderRightButton() {
    const status =  this.props.navigation.getParam('status');
    let view = null;

    if (status === 0) {

      view = (<FastImage source={require('img/Order/more_black.png')} style={{ marginLeft:W(12) }}/>);

    }
    if (status === 1) {
      view = (<Text style={{ color:'#272727', fontSize:F(16) }}>申请退款</Text>);

    }
    if (status === 5 || status === 6) {
      view = (<Text style={{ color:'#272727', fontSize:F(16) }}>删除订单</Text>);

    }

    const right = this.rightClick.bind(this);
    const rightBtn = (
        <TouchableHighlight
          onPress={right}
          style={styles.rightBtn}
          underlayColor={'rgba(0,0,0,0)'}
        >
          <View>
          {view}
          </View>
        </TouchableHighlight>
    );
    this.props.navigation.setParams({ rightBtnView:rightBtn });
  }

  public componentDidMount() {
    this.orderStore.getOrderDetail({ orderId:this.orderId });
  }

  public goBack() {
    this.props.navigation.goBack();
  }
  public rightClick() {
    const status =  this.props.navigation.getParam('status');
    if (status === 0) {
      this.onShowMenu();
    }
    if (status === 1) {
      this.props.navigation.navigate(NavigationKeys.OrderRefund, {
        order:this.orderStore.order,
      });
    }
    if (status === 5 || status === 6) {
      this.deleteOrder();
    }
  }
  public deleteOrder = () => {
    Alert.alert(
      '温馨提示',
      '确定删除该订单',
      [
        { text: '取消' },
        { text: '确定', onPress: this.delete },
      ],
    );
  }

  public delete = () => {
    this.onClose();

    this.orderStore.deleteOrder({ orderId: this.orderStore.order.orderId }).then((rs: IResponse) => {
      appBroadCast.emit(EventKey.DeleteOrderById, this.orderStore.order.orderId);
      this.props.navigation.goBack();
    }).catch(errorHandle);
  }
  public canleOrder = () => {

    Alert.alert(
      '温馨提示',
      '确定取消该订单',
      [
        { text: '取消' },
        { text: '确定', onPress: this.canle },
      ],
    );

  }
  public canle = () => {
    this.onClose();
    this.orderStore.canleOrder({ orderId: this.orderStore.order.orderId }).then((rs: IResponse) => {
      this.props.navigation.goBack();
    }).catch(errorHandle);
  }

  public onShowMenu = () => {
    this.setState({ isShow:true });
  }
  public onClose = () => {
    this.setState({ isShow:false });
  }

  public getBottomBtnText = (): string => {
    // 0.待支付1.待使用2.待评价3.退款中4.退款成功5.已取消
    const status = this.props.navigation.getParam('status');
    const dict = [
      '立即支付',
      this.orderStore.order.orderType === 2 ?  '查看券码' : '',
      '评价',
      '退款进度',
      '',
      '重新下单',
      '再次购买',
    ];



    return dict[status];

  }
  public closePay = () => {
    this.modalStore.setVisable(false);
  }
  public showPay = () => {
    this.modalStore.setVisable(true);
  }
  public botomBtnClick = (): () => void => {
    const status = +this.props.navigation.getParam('status');
    const funArray = [
      this.pay.bind(this),
      this.orderStore.order.orderType === 2 ?  this.lookCode.bind(this) : () => null,
      () => null,
      this.lookRefund.bind(this),
      () => null,
      this.aginBuy.bind(this),
      this.aginBuy.bind(this),

    ];
    return funArray[status];
  }
  public pay() {
    this.modalStore.setVisable(true);
  }
  public lookCode = () => {
    const status = +this.props.navigation.getParam('status', 1);
    if (status !== 1) {
      // 如果不是代使用 则不响应
      return;
    }
    this.props.navigation.navigate(NavigationKeys.CouponUseShow, {
      order:this.orderStore.order,
    });
  }

  public aginBuy() {
    const type = this.orderStore.order.orderType;
    if (type === 1) {
      this.props.navigation.navigate(NavigationKeys.ProductOrder, {
        merchantId:this.orderStore.merchant.id,
        title: this.orderStore.merchant.name,
      });
    } else {
      this.props.navigation.navigate(NavigationKeys.PurchaseVouchers, {
        productId:this.orderStore.products.id,
        merchantId:this.orderStore.merchant.id,
        order:this.orderStore.order,
      });
    }
  }
  public lookRefund() {
    this.props.navigation.navigate(NavigationKeys.OrderRefundList, {
      order:this.orderStore.order,
    });
  }

  @observable public needSlice = true;
  @action public onRightContent = () => {
    this.needSlice = !this.needSlice;
  }

  public render() {
    const orderType = this.orderStore.order.orderType;
    const orderInfos = [
      {
        title:'手机号',
        content: this.orderStore.order.userMobile,
      },
      {
        title:'订单号',
        content:this.orderStore.order.orderSn,
      },
      {
        title:'下单时间',
        content:this.orderStore.order.createTime,
      },
      {
        title:orderType === 2 ? '商品数量' :'优惠折扣',
        content: orderType === 2 ? this.orderStore.products.quantity : this.orderStore.order.discountMoney,
      },
      {
        title:'实付金额',
        content:this.orderStore.order.actualMoney,
      },
    ];

    const shopIntro = (
    <Sticker  title='商家介绍:' style={{ paddingTop:W(10), paddingLeft:24 , paddingBottom:W(11) }}>
      <MerchantIntro
        merchant={this.orderStore.merchant}
        distance={this.orderStore.distance}
        telephones={this.orderStore.telephones}
      />
     </Sticker>
   );
    const dividLine = (<View style={styles.segmentation}/>);
    let orderDetails = this.orderStore.orderDetails;

    if (this.needSlice) {
      orderDetails = orderDetails.slice(0, 5);
    }

    const voucherList = orderDetails.map((item: OrderDetailInfo, index) => {
      const isShow = index === this.orderStore.orderDetails.length - 1 ? false :true;
      return(
          <OrderMessageItem
            isAble={false}
            key={index}
            isShowLine={isShow}
            name={item.productSn}
            onItemClick={this.lookCode}
          />
      );
    });

    const orderList = orderInfos.map((item, index) => {
      const isShow = index === orderInfos.length - 1  ? false :true;
      return(
          <OrderMessageItem isAble={true} key={index} isShowLine={isShow} name={item.title} content={item.content}/>
      );
    });
    const rightContent = this.orderStore.orderDetails.length > 5 ? '查看更多' :'';
    const voucher = (
        <TouchableOpacity onPress={this.onRightContent}>
          <OrderItem title='代金券' rightTitle={rightContent} image='111'>
            {voucherList}
          </OrderItem>
        </TouchableOpacity>
    );
    const ordermsg = (
      <OrderItem title='订单信息'>
        {orderList}
      </OrderItem>
  );
    const colors =  ['#FF4A00', '#FF7301'];
    const locations = [0.1, 1];
    const finishView = (
    <View style={{ flex:1 }}>
    <LinearGradient
            colors={colors}
            locations={locations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.finishView}
    >
          <FastImage 
            source={require('img/Order/success.png')} 
            style={styles.finishImage} 
            resizeMode={FastImage.resizeMode.stretch}
          />
          <Text style={styles.finishText}>已完成</Text>
    </LinearGradient>
    </View>
  );

    const isShowVocher = this.orderStore.order.orderType === 2 ? (
    < View style={{ flex:1 }}>
        {voucher}
        {dividLine}
      </View>) :null;
    const isBuyVocher = this.orderStore.order.orderType === 2  ? (
      <View style={{ flex:1 }}>
         <OrderItemHeader
          info={this.orderStore.order}
          merchant={this.orderStore.merchant!}
          product={this.orderStore.products}
          navigation={this.props.navigation}
         />
        {dividLine}
         </View>) : null;
    const isfinishView = this.orderStore.order.orderType ===  2 && this.orderStore.order.status === 6
    ? finishView : null;

    const footerView = this.getBottomBtnText() === '' ? null : (  
    <SafeAreaView style={styles.footer}>
      <LinerGradientButton
        buttonStyles={{ width: W(375), borderRadius: 0, height:W(49) }}
        colors={['#FF4A00', '#FF7301']}
        text={this.getBottomBtnText()}
        textStyle={{ fontSize: F(15) }}
        onPress={this.botomBtnClick()}
      />
    </SafeAreaView>);
    return (
      <View style={{ flex:1 }}>
      <ScrollView style={styles.continer}>
        {isfinishView}
       {isBuyVocher}
       {shopIntro}
       {dividLine}
       {isShowVocher}
       {ordermsg}
      </ScrollView>
    {footerView}
         <Modal
          transparent={true}
          visible={this.state.isShow}
          onRequestClose={this.onClose}
         >
         <TouchableWithoutFeedback onPress={this.onClose}>
         <View style={{ flex:1 }}>
           <PopupMenu onCanleClick={this.canleOrder} onDeleteClick={this.deleteOrder}/>
           </View>
           </TouchableWithoutFeedback>
         </Modal>
         <ProductPay
            visible={this.modalStore.visible}
            equestClose={this.closePay}
            show={this.showPay}
            orderId={this.orderStore.order.orderId || 0}
            amount={this.orderStore.order.actualMoney || 0}
            navigation={this.props.navigation}
         />
         <PopoverPayFail />
      </View>

    );
  }
}

class Sticker extends React.Component<{
  title?: string;
  style?: StyleProp<ViewStyle>;
}, any> {

  public render() {
    const Title = this.props.title ? (
      <Text style={{ color: Colors.TITLE_BLACK_3, fontWeight: '400', fontSize: F(15) }}>{this.props.title}</Text>
    ) : null;

    const header = this.props.title ? (
      <View style={styles.sticker_header}>
         {Title}
       </View>
    ) : <View style={styles.sticker_header_null}/>;
    return (
     <View style={{ backgroundColor: '#FFFFFF' }}>
       {header}
       <View style={[{ paddingRight: W(24), paddingBottom:W(16) }, this.props.style]} >
          {this.props.children}
       </View>
     </View>
    );
  }

}

class OrderItem extends React.Component<{
  title?: string,
  image?: string,
  rightTitle?: string,
}> {
  public render() {
    const image = this.props.image ? (
    <FastImage
      source={require('img/Order/Voucher.png')}
      style={{ marginLeft:W(24) }}
    />) :null;

    const left = this.props.image ? { marginLeft:W(4) } :{ marginLeft: W(24) };
    const Title = (
      <View style={{ flex:1, flexDirection:'row', alignItems:'center' }}>
          {image}
        <Text style={[styles.orderItem_left, left]}>{this.props.title}</Text>
      </View>
    );
    const rightButton = this.props.rightTitle ? (
      <Text style={styles.OrderItem_right}>
        {this.props.rightTitle}
      </Text>
    ) :null;
    const line =   (<View style={styles.line}/>);

    const header = (
      <View style={{ height:W(47) }}>
      < View style={styles.orderItem_header}>
         {Title}
         {rightButton}
       </View>
       {line}
       </View>
    ) ;
    return(
        <View style={{ backgroundColor: '#FFFFFF' }}>
          {header}
          <View>
             {this.props.children}
          </View>
        </View>
    );
  }
}

class OrderMessageItem extends React.Component<{
  onItemClick?: () => void,
  name?: string,
  content?: any,
  isAble: boolean,
  isShowLine?: boolean,
}> {
  public render() {

    const right = this.props.isAble ? (<Text style={styles.messageItem_right}>{this.props.content}</Text>) :
    (<FastImage source={require('img/Order/qrcode.png')} style={styles.qrcode}/>);
    const line =  this.props.isShowLine ? (<View style={styles.line}/>) :null;

    return (
    <TouchableWithoutFeedback onPress={this.props.onItemClick} disabled={this.props.isAble}>
      <View>
        <View style={styles.voucherItem}>
        <Text style={styles.voucher_name}>{this.props.name}</Text>
          {right}
        </View>
        {line}
      </View>

    </TouchableWithoutFeedback>
    );
  }
}

class PopupMenu extends React.Component<{
  onCanleClick: () => void,
  onDeleteClick: () => void,
}> {

  public render() {
    const canleItem = (
      <TouchableWithoutFeedback onPress={this.props.onCanleClick}>
       <View style={styles.menuItem}>
         <FastImage source={require('img/Order/canle_gray.png')} style={styles.menuItem_image}/>
         <Text style={styles.menuItem_text}>取消订单</Text>
        </View>
        </TouchableWithoutFeedback>
     );
    const deleteItem = (
      <TouchableWithoutFeedback onPress={this.props.onDeleteClick}>
       <View style={[styles.menuItem, { marginTop:W(9) }]}>
         <FastImage source={require('img/Order/delete_gray.png')} style={styles.menuItem_image}/>
         <Text style={styles.menuItem_text}>删除订单</Text>
        </View>
        </TouchableWithoutFeedback>
     );

    return (
       <View style={styles.menu}>
        <FastImage source={require('img/Order/popup_more.png')} style={styles.popup_moreBg}/>
         {deleteItem}
         <View style={styles.menuLine}/>
         {canleItem}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  arrow_left:{
    width: W(60),
    height: W(44),
    alignItems:'center',
    justifyContent:'center',
  },
  continer:{
    flex: 1,
    backgroundColor:'#f8f8f8',
  },
  sticker_header:{
    paddingLeft: W(24),
    paddingTop: W(16),
  },
  sticker_header_null: {
    paddingTop: W(8),
  },
  sticker_line: {
    marginLeft: W(24),
    marginRight: W(24),
    width: W(328),
    height: isiPhone() ? StyleSheet.hairlineWidth :W(0.8),
    backgroundColor:'#EBEBEB' },
  text:{
    color:Colors.TITLE_BLACK_3,
    fontSize: F(13),
    fontWeight: '300',
  },
  addressText:{
    color:Colors.TITLE_BLACK_3,
    fontSize: F(13),
    fontWeight: '300',
    width:W(200),
  },
  rule:{
    flex: 1,
    flexDirection: 'column',
    justifyContent:'flex-start',
  },
  segmentation:{
    backgroundColor:'#f8f8f8',
    height:W(6),
    width:W(375),
  },
  orderItem_header:{
    height:W(46),
    width:W(375),
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  orderItem_left:{ color: Colors.TITLE_BLACK_3, fontWeight: '300', fontSize: F(15) },
  OrderItem_right:{
    color: Colors.TITLE_BLACK_7,
    fontWeight: '300',
    fontSize: F(14),
    marginRight:W(24),
  },
  line:{
    height:isiPhone() ? StyleSheet.hairlineWidth :W(0.5),
    marginLeft: W(24),
    width:W(352),
    backgroundColor:'#E6E6E6',
  },
  voucherItem:{
    flex:1,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    height:W(48),
  },
  voucher_name:{
    color:Colors.TITLE_BLACK_3,
    fontSize: F(15),
    fontWeight: '300',
    marginLeft: W(24),
  },
  messageItem_right:{
    color:Colors.TITLE_BLACK_3,
    fontSize: F(15),
    fontWeight: '300',
    marginRight:W(24),
  },
  qrcode:{
    width:W(22),
    height:W(22),
    marginRight:W(24),
  },
  footer: {
  },

  menu:{
    width:W(150),
    height:W(99),
    position:'absolute',
    top:isPhoneX ? W(74) :W(64),
    right: isiPhone() ? screenWidth <= 375 ? W(18) :W(12) :W(18),
    alignItems: 'center',
  },
  popup_moreBg:{
    position:'absolute',
    resizeMode:'stretch',
    height:W(99),
  },
  menuItem:{
    flexDirection: 'row',
    alignItems: 'center',
    height:W(45),
    width:W(150),

  },
  menuItem_image:{
    marginLeft: W(17),
    width:W(20),
    height:W(20),
  },
  menuItem_text:{
    marginLeft: W(15),
    color:'#C5C8C9',
    fontSize: F(15),
    fontWeight:'300',
  },
  menuLine:{
    height:isiPhone() ? StyleSheet.hairlineWidth : W(0.8),
    marginLeft: W(16),
    width:W(118),
    backgroundColor:'#565859',
  },
  backImage:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
  },
  rightBtn:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:W(80),
  },
  finishView:{
    width:W(375),
    height:W(70),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'flex-start',
  },
  finishImage:{ width:W(24), height:W(24), marginLeft:W(24) },
  finishText:{ fontSize:F(15), color:'#fff', marginLeft:W(10) },
});
