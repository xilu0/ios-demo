import { NavigationKeys } from 'js/const/NavigationKeys';
import { F, isiPhone, W } from 'js/helper/UI';
import { MerchantStore, ProductModel } from 'js/store/MerchantStore';
import { observer } from 'mobx-react/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

interface IProps {
  item: ProductModel;
  navigation: NavigationScreenProp<any>;
  merchantStore: MerchantStore;
}

@observer
export class MerchantVocher extends React.Component<IProps, any> {

  public jumpBuyCoupons = () => {
    this.props.navigation.navigate(NavigationKeys.PurchaseVouchers, {
      productId:this.props.item.id,
      merchantId:this.props.merchantStore.merchantDetail.id,
    });
  }
  public getVocherName = () => {
    let name = '';
    const type = this.props.item.type;
    if (type === 1) {
      name = '代金券'  ;
    } else if (type === 2) {
      name = '套餐';
    } else {
      name = '会员卡';
    }
    return name;
  }
  public render() {
    const start = this.props.item.effectStartTime === null ? '' :this.props.item.effectStartTime.split(' ')[0];
    const end = this.props.item.effectEndTime === null ? '' :this.props.item.effectEndTime.split(' ')[0];

    return (
            <TouchableWithoutFeedback style={styles.bgView}>
            <View style={styles.bgView}>
            <Image source={require('img/merchant/coupons.png')} style={styles.coupons}/>
            <View style={styles.item}>
              <View style={styles.leftView}>
              <View style={styles.priceView}>
                <Text style={styles.symbol}>￥
                <Text style={styles.price} >{`${this.props.item.favorablePrice}`}</Text></Text>
                </View>
                <Text style={styles.deduction}>{`抵${this.props.item.marketPrice || 100}`}</Text>
              </View>
              <Image source={require('img/merchant/line.png')} style={styles.line}/>
              <View style={styles.middleView}>
                <Text style={styles.title}>{this.getVocherName()}</Text>
                <Text style={styles.validity}>
                {`${start}-${end}`}
                </Text>
                <Text style={styles.useful}>{this.props.item.availableTimeDesc || '10:00-12:00'}</Text>
              </View>
              <TouchableWithoutFeedback onPress={this.jumpBuyCoupons}>
              <View style={styles.rightView}>
               <Text numberOfLines={2} style={styles.rightText}>点击抢购</Text>
              </View>
              </TouchableWithoutFeedback>
            </View>
            </View>
          </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  bgView:{
    marginBottom: W(17),
    width:W(328),
    height:W(91),
    justifyContent:'center',
    alignItems:'center',
  },
  coupon_tips: {
    marginBottom: W(11),
  },
  coupon_tips_text: {
    color: '#9B9B9B',
    fontSize: F(13),
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
    flexDirection:'row',
  },
  symbol:{
    fontSize:F(18),
    fontWeight: '400',
    color:'#FF6001',
    fontFamily:'DIN-Medium',

  },
  price:{
    fontSize:F(24),
    fontWeight: '500',
    color:'#FF6001',
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
  rightText:{
    position:'absolute',
    width:W(25),
    flexWrap:'wrap',
    fontSize:F(12),
    fontWeight:'400',
    color:'#fff',
    alignSelf:'center',
  },
  rightItem:{
    marginLeft: W(4),
  },

  bgImage:{
    width:W(46),
    height:W(91),
  },
});
