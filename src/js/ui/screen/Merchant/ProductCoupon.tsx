
import { F, isiPhone, W } from 'js/helper/UI';
import React from 'react';
import {  Image,  StyleSheet, Text,  TouchableWithoutFeedback, View } from 'react-native';

import { Coupon } from 'js/api';
import { observer } from 'mobx-react/native';
import { CouponsStore } from './ProductOrder';
import { ProductPopoverComponent } from './ProductPopoverComponent';
import FastImage from 'react-native-fast-image';


interface IProps {
  visible: boolean;
  equestClose: () => void;
  store: CouponsStore;
  onSelect: (cou: Coupon) => void;
}

@observer
export class ProductCoupon extends React.Component<IProps> {

  public headerRightView = (
    <View style={styles.header_right_view}>
      <Text style={styles.header_right_text}>兑换优惠券</Text>
      <FastImage style={styles.header_right_icon} source={require('img/more_right.png')} />
    </View>
  );

  public avaLen: number = 0;

  constructor(props: IProps) {
    super(props);
    this.avaLen = this.props.store.availableCouponList.length;
  }

  public headerRightRender = () => this.headerRightView;
  public onShow = () => {
    console.log('i am show');
  }

  public onDismiss = () => {
    const indexCoupon = this.props.store.indexCoupon;
    this.props.onSelect(indexCoupon);
    this.props.equestClose();
  }

  public contentRender = () => {

    const listView =  this.props.store.availableCouponList.slice().map((item, index) => {
      return (
        <CouponsItem
          index={index}
          store={this.props.store}
          item={item}
          key={item.id}
          isAvailable={true}
        />);
    });

    const listView2 =  this.props.store.unavailableCouponList.slice().map((item, index) => {
      return (
        <CouponsItem
          index={index}
          store={this.props.store}
          item={item}
          key={item.id}
          isAvailable={false}
        />);
    });

    return (
      <View style={{ flex: 1, paddingBottom: W(20) }}>
          <View style={styles.coupon_tips}>
            <Text style={styles.coupon_tips_text}><Text style={{ color: '#FD2E5E' }}>
            {this.props.store.availableCouponList.length}</Text> 张可用优惠券</Text>
          </View>
          {listView}
          <View style={styles.coupon_tips}>
            <Text style={styles.coupon_tips_text}><Text style={{ color: '#FD2E5E' }}>
            {this.props.store.unavailableCouponList.length}</Text> 张不可用优惠券</Text>
          </View>
          {listView2}
      </View>

    );

  }

  public buttonClick = () => {
    this.onDismiss();
  }

  public render() {

    const { visible } = this.props;

    const buttonText_ = '立即使用';

    return (
     <ProductPopoverComponent
      visible={visible}
      equestClose={this.onDismiss}
      contentRender={this.contentRender}
      headerRightRender={this.headerRightRender}
      contentStyle={styles.content}
      title={'使用优惠券'}
      buttonText={buttonText_}
      buttonStyle={{ opacity: this.avaLen > 0 ? 1 : 0.75 }}
      buttonClick={this.buttonClick}
      contentScroll={true}
     />
    );
  }
}

const styles = StyleSheet.create({

  header_right_view: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  header_right_text: {
    fontSize: F(14),
    color: '#888888',
  },
  header_right_icon: {
    width: W(7),
    height: W(13),
    marginLeft: W(5),
  },

  content: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: W(24),
    paddingVertical: W(20),
  },

  coupon_tips: {
    marginBottom: W(11),
  },
  coupon_tips_text: {
    color: '#9B9B9B',
    fontSize: F(13),
  },

  footer: {
    backgroundColor: '#F8F8F8',
    paddingTop: W(15),
    paddingBottom: W(15),
  },
  coupons:{
    position:'absolute',
    width:W(328),
    height:W(91),
    resizeMode:'stretch',
    marginLeft: W(24),
  },
  item:{
    width:W(328),
    height:W(91),
    flexDirection:'row',
    alignSelf:'center',
    position:'absolute',
    backgroundColor:'rgba(0,0,0,0)',

  },
  leftView:{
    width:W(93),
    height:W(91),
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
  },

  priceView:{
    height:W(26),
    flexDirection:'row',
  },
  symbol:{
    fontSize:F(14),
    fontWeight: '300',
    color:'#FD4D4F',
    marginTop:isiPhone() ? W(6) : W(3),
  },
  price:{
    fontSize:F(17),
    fontWeight: '500',
    color:'#FD4D4F',
    fontFamily:'DIN-Medium',
  },

  deduction:{
    fontSize:F(14),
    fontWeight:'400',
    color:'#313131',
    marginTop:W(5),
  },

  line:{
    marginTop:W(12),
    width:W(1),
    marginBottom:W(11),
  },
  middleView:{
    width:W(187),
    height:W(91),
    flexDirection:'column',
    justifyContent:'center',
  },
  title:{
    fontSize:F(14),
    fontWeight:'500',
    color:'#272727',
    textAlign:'left',
    marginLeft:W(15),
    marginTop: isiPhone() ? W(5) :0,
  },
  validity:{
    fontSize:F(11),
    fontWeight:'500',
    color:'#9B9B9B',
    paddingTop: W(8),
    marginLeft:W(15),
  },

  useful:{
    fontSize:F(11),
    fontWeight:'500',
    color:'#9B9B9B',
    paddingTop:W(2),
    marginLeft:W(15),

  },

  rightView:{
    width:W(46),
    height:W(91),
    justifyContent:'center',
    alignItems:'center',

  },
  rightItem:{
    marginLeft: W(4),
  },

  bgImage:{
    width:W(46),
    height:W(91),
  },

  text:{
    position:'absolute',
    width:W(25),
    flexWrap:'wrap',
    fontSize:F(12),
    fontWeight:'400',
    color:'#fff',
    alignSelf:'center',
  },

  bgView:{
    paddingHorizontal: W(24),
    marginBottom: W(17),
    width:W(328),
    height:W(91),
    justifyContent:'center',
    alignItems:'center',
  },
});

// class PageCouponStore {

//   @observable public selectedIndex?: number;

//   @computed get currentIndex(): number {
//     return this.selectedIndex || 0;
//   }
//   @action public setSelectedIndex(index: number) {
//     this.selectedIndex = index;
//   }

// }

interface ICouponsProps {
  index: number;
  item: Coupon;
  isAvailable: boolean;
  store: CouponsStore;
}

@observer
class CouponsItem extends React.Component<ICouponsProps> {

  public selectCoupons = () => {
    if (this.props.isAvailable) {
      const index = this.props.index === this.props.store.index ? -1 : this.props.index;
      this.props.store.setIndex(index);
    }
  }

  public render() {
    const selectImage = this.props.index === this.props.store.index && this.props.isAvailable ?
     require('img/Order/vouchers_select.png') :require('img/Order/vouchers_unSelected.png');
    const unUserful = !this.props.isAvailable ? { color:'#9b9b9b' } :null;
    const reasonText = this.props.isAvailable ? ''
    : (this.props.item.reason || `此订单不满${(this.props.item.useMinimumComsumption || 0).toFixed(2)}元`);
    return(
      <TouchableWithoutFeedback onPress={this.selectCoupons} disabled={!this.props.isAvailable}>
      <View style={styles.bgView}>

      <Image source={require('img/Order/coupons.png')} style={styles.coupons}/>
      <View style={styles.item}>
        <View style={styles.leftView}>
        <View style={styles.priceView}>
          <Text style={[styles.symbol, unUserful]}>￥
          <Text
           style={[styles.price, unUserful]}
          >
           {this.props.item.money}
          </Text></Text>

          </View>
          <Text style={[styles.deduction, unUserful]}>{`抵100`}</Text>
        </View>
        <Image source={require('img/merchant/line.png')} style={styles.line}/>
        <View style={styles.middleView}>
          <Text style={[styles.title, unUserful]}>{this.props.item.name}</Text>
          <Text style={styles.validity}>{`${this.props.item.useStartTime} ~ ${this.props.item.useEndTime}`}</Text>
          <Text style={styles.useful}>{reasonText}</Text>
        </View>
        <View style={styles.rightView}>
        <Image source={selectImage} style={styles.rightItem}/>
        </View>
      </View>
      </View>
    </TouchableWithoutFeedback>
    );
  }

}
