
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { F,  isiPhone, W } from 'js/helper/UI';
import { MerchantStore, ProductModel } from 'js/store/MerchantStore';
import { NavigationScreenProp } from 'react-navigation';
import FastImage from 'react-native-fast-image'


interface IProps {
  item: ProductModel;
  navigation: NavigationScreenProp<any>;
  merchantStore: MerchantStore;
  index: number;
}

export class MerchantCoupons extends React.Component<IProps, any> {

  public jumpCouponDetail = () => {
    if (this.props.merchantStore.products.length === 1) {
      this.props.navigation.navigate(NavigationKeys.VoucherDetails, {
        productId:this.props.item.id,
        merchantId:this.props.merchantStore.merchantDetail!.id,
        from:1,
        name:this.props.item.name,
      });
    } else {
      this.props.navigation.navigate(NavigationKeys.VoucherDetailPage, {
        item:this.props.item,
        store:this.props.merchantStore,
        index:this.props.index,
      });
    }
  }
  public jumpBuyCoupons = () => {
    this.props.navigation.navigate(NavigationKeys.PurchaseVouchers, {
      productId:this.props.item.id,
      merchantId:this.props.merchantStore.merchantDetail.id,
    });
  }
  public throttle = (handle: any, wait: any): () => void => {
    let lastTime = 0;
    return () => {
      const nowTime = new Date().getTime();
      if (nowTime - lastTime > wait) {
        handle();
        lastTime = nowTime;
      }
    };
  }

  public render() {
    const start = this.props.item.effectStartTime === null ? '' :this.props.item.effectStartTime.split(' ')[0];
    const end = this.props.item.effectEndTime === null ? '' :this.props.item.effectEndTime.split(' ')[0];
    const click = this.throttle(this.jumpCouponDetail, 2000);
    const onclick = this.throttle(this.jumpBuyCoupons, 2000);

    return(
      <TouchableWithoutFeedback style={styles.bgView} onPress={click}>
        <View style={styles.bgView}>
        <FastImage  
          style={[styles.shadow]} 
          source={ require('img/merchant/shadow.png')} 
          resizeMode={FastImage.resizeMode.stretch}
        />
          <FastImage  
          style={[styles.coupons]} 
          source={ require('img/merchant/coupons.png')} 
          resizeMode={FastImage.resizeMode.stretch}
        />
        <View style={styles.item}>
          <View style={styles.leftView}>
          <View style={styles.priceView}>
            <Text style={styles.symbol}>￥
            <Text style={styles.price} >{this.props.item.favorablePrice}</Text></Text>
            </View>
            <Text style={styles.deduction}>{`抵${this.props.item.marketPrice || 100}`}</Text>
          </View>
          <Image source={require('img/merchant/line.png')} style={styles.line}/>
          <View style={styles.middleView}>
            <Text style={styles.title}>{this.props.item.name || '代金券'}</Text>
            <Text style={styles.validity}>
            {`${start}-${end}` || '2012-01-10'}</Text>
            <Text style={styles.useful}>{this.props.item.availableTimeDesc || '10:00-12:00'}</Text>
          </View>
          <TouchableWithoutFeedback onPress={onclick}>
          <View style={styles.rightView}>
           <Text numberOfLines={2} style={styles.text}>点击抢购</Text>
          </View>
          </TouchableWithoutFeedback>
        </View>
        </View>
      </TouchableWithoutFeedback>

    );
  }
}

const styles = StyleSheet.create({
  shadow:{
    width:W(351),
    height:W(118),
    opacity:0.4,
  },

  coupons:{
    position:'absolute',
    width:W(328),
    height:W(91),
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

  },
  symbol:{
    fontSize:F(18),
    fontWeight: '300',
    color:'#FD4D4F',
    fontFamily:'DIN-Medium',

  },
  price:{
    fontSize:F(17),
    fontWeight: '900',
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
    marginLeft: W(12),
    width:W(351),
    height:W(113),
    justifyContent:'center',
    alignItems:'center',
  },

});
