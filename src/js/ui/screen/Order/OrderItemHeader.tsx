
import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { F, isiPhone, W } from 'js/helper/UI';
import { Colors } from 'js/style/colors';
import { NavigationScreenProp } from 'react-navigation';
import { OrderInfo, OrderInfoMerchant, OrderInfoProduct } from 'js/api';
import { NavigationKeys } from 'js/const/NavigationKeys';
import FastImage from 'react-native-fast-image';


interface IProps {
  product: OrderInfoProduct;
  info: OrderInfo;
  merchant: OrderInfoMerchant;
  navigation: NavigationScreenProp<any>;
}

export class OrderItemHeader extends React.Component<IProps, any> {

  public onClick = () => {
    this.props.navigation.navigate(NavigationKeys.VoucherDetails, {
      productId:this.props.product.id,
      merchantId:this.props.info.merchant!.id,
      from:1,
      name:this.props.product.name,
    });
  }

  public render() {

    const VoucherImage = (
      <FastImage source={{ uri:this.props.merchant.logoPath }} style={styles.voucherImage}/>
      );
    const name = ['代金券', '套餐', '会员卡'][this.props.product.type! - 1];
    const more = this.props.info.orderType !== 2 || 3 || 4 ? (<Text style={styles.topView_price}>更多</Text>) : null;
    return (
      <TouchableWithoutFeedback onPress={this.onClick}>
      <View style={styles.continer}>
        {VoucherImage}
        <View style={styles.rightView}>
        <View style={styles.topView}>
          <Text style={styles.topView_title}>{name}</Text>
          <View>
            {more}
          </View>
        </View>
        <View style={styles.middle}>
            <Text style={styles.middle_text}>
            {this.props.product.name}</Text>
        </View>
        <View style={styles.bottom}>
            <Text style={styles.bottom_text}>{this.props.info.canRefund ? '随时可退' :'不可退'}</Text>
            <View  style={styles.middle_line}/>
            <Text style={[styles.bottom_text, { marginLeft:W(6) }]}>可叠加使用</Text>
        </View>
        </View>
      </View>
      </TouchableWithoutFeedback>

    );
  }
}

const styles = StyleSheet.create({

  continer: {
    width:W(375),
    height:W(106),
    flexDirection: 'row',
    justifyContent:'space-between',
    backgroundColor:'#fff',
  },
  voucherImage:{
    width:W(90),
    height:W(75),
    borderRadius: W(2),
    marginLeft: W(24),
    marginTop: W(16),
    marginBottom: W(16),

  },
  rightView:{
    width:W(262),
    height:W(106),
    marginTop: W(16),
  },
  topView:{ flexDirection:'row', justifyContent:'space-between', marginLeft:W(15), marginRight:W(24) },
  middle:{ flexDirection:'row' , marginLeft:W(15), marginTop:isiPhone() ? W(11) :W(6) },
  bottom:{ flexDirection:'row', marginLeft:W(15), marginTop:isiPhone() ? W(11) :W(6), marginRight:W(24)  },
  topView_title:{ color:Colors.TITLE_BLACK_3, fontSize:F(15), fontWeight:'400' },
  topView_price:{ color:Colors.TITLE_BLACK_5, fontSize:F(13), fontWeight:'400' },
  middle_text:{ color:Colors.TITLE_RED_2, fontSize:F(18), fontWeight:'300' },
  middle_line:{ width:W(1), height:W(12), backgroundColor:Colors.TITLE_BLACK_3, marginLeft:W(4) , alignSelf:'center' },
  bottom_text:{ color:Colors.TITLE_BLACK_3, fontSize:F(14), fontWeight:'300' },
});
