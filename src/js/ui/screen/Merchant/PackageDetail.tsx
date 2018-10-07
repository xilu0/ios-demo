import React from 'react';
import { NavigationScreenProp } from 'react-navigation';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { F, isiPhone, W } from 'js/helper/UI';
import { MerchantStore, ProductModel } from 'js/store/MerchantStore';
import { Colors } from 'js/style/colors';
import { action, observable } from 'mobx';
import {
  Image,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { API, Body26 } from 'js/api';
import { errorHandle, IResponse } from 'js/helper/Respone';
import { getStore } from 'js/helper/Store';
import { MerchantIntro } from 'js/ui/components/Merchant/MerchantIntro';
import { MerchantVocher } from 'js/ui/components/Merchant/MerchantVocher';

interface IProps {
  navigation: NavigationScreenProp<any>;
  productId: number;
  merchantId: number;
  tabLabel?: string;
  key?: number;
  productModel?: any;
}

class PackageStore {

  @observable public productDetail: ProductModel = new ProductModel();
  @action public getPackageDatail(params: Body26) {
    return API.product.getProductDetail(params).then(action((rs: IResponse) => {
      console.log(JSON.stringify(rs.data));
      this.productDetail = rs.data;
    })).catch(errorHandle);
  }
}
class StickerItem extends React.Component<{
  title?: string;
  style?: StyleProp<ViewStyle>;
}, any> {
  public render() {
    const Title = this.props.title ? (
      <Text style={{ color: Colors.TITLE_BLACK_3, fontWeight: '400', fontSize: F(18) }}>{this.props.title}</Text>
    ) : null;

    const header = this.props.title ? (
      <View style={{ paddingLeft: W(24), paddingTop: W(20) }}>
         {Title}
       </View>
    ) : <View style={styles.sticker_header_null}/>;
    return (
     <View style={{ backgroundColor: '#FFFFFF' }}>
       {header}
       <View style={[{ paddingTop:W(20), paddingBottom:W(20) }, this.props.style]} >
          {this.props.children}
       </View>

     </View>
    );
  }
}

class PackageIntro extends React.Component<{
  datas: string[],
}> {

  public render() {
    const list = this.props.datas.map((img: string, index: number) => {
      const left = index > 0 ? styles.introImageLeft :null;
      const right = index === this.props.datas.length - 1 ? styles.introImageRight :null;
      return(
        <TouchableWithoutFeedback key={index}>
        <Image source={require('img/2b.jpeg')} style={[styles.introImage, left, right]}/>
          </TouchableWithoutFeedback>
      );
    });
    return(
      <ScrollView
        style={styles.scrollViewStyle}
        horizontal={true} // 横向
        showsHorizontalScrollIndicator={false}
      >
        {list}
      </ScrollView>
    );
  }

}

class Dishes extends React.Component<{
  datas: any[],
}> {
  public render() {

    const list = this.props.datas.map((index: number) => {
      return(
        <View style={styles.disheItem} key={index}>
          <Text style={styles.disesLeft}>佛跳墙</Text>
          <Text style={styles.disesRight}>100</Text>
        </View>
      );
    });

    return(
      <View style={{ flex:1 }}>
        {list}
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
    const line = this.props.title ? (<View style={styles.sticker_line} />) :null;
    return (
     <View style={{ backgroundColor: '#FFFFFF' }}>
       {header}
       <View style={[{ paddingRight: W(24) }, this.props.style]} >
          {this.props.children}
       </View>
       {line}
     </View>
    );
  }

}

export class PackageDetail extends React.Component<IProps> {

  private vocherStore = new PackageStore();
  private merchantStore = new MerchantStore();
  private  latitude =  getStore().geolocationStore.location.latitude;
  private longitude = getStore().geolocationStore.location.longitude;
  private productId = this.props.productId || this.props.navigation.getParam('productId') ;
  private merchantId = this.props.merchantId || this.props.navigation.getParam('merchantId') ;

  public componentWillMount() {
    this.vocherStore.getPackageDatail({ productId:this.productId });
    this.merchantStore.requsetGetMerchantDetail({
      merchantId:this.merchantId ,
      latitude:this.latitude,
      longitude:this.longitude,
    });
  }
  public buy = () => {
    this.props.navigation.navigate(NavigationKeys.PurchaseVouchers, {
      item:this.vocherStore.productDetail,
      store:this.merchantStore,
    });
  }
  public renderRules = () => {

    const rulelist = this.vocherStore.productDetail.useRules!.map((item, index) => {
      return(
      <Text style={[styles.text, { paddingTop:index > 0 ? W(9) : 0 }]} key={item}>{`· `}{item}</Text>
      );
    });
    return(
        <View style={styles.rule}>
          {rulelist}
      </View>
    );
  }

  public render() {
    const discountPrice = this.vocherStore.productDetail.favorablePrice;
    const vouchers = (
      <Sticker style={{ marginLeft: W(24), paddingTop:W(10) }}>
       <MerchantVocher
          item={this.vocherStore.productDetail}
          merchantStore={this.merchantStore}
          navigation={this.props.navigation}
       />
       </Sticker>
     );
    const vidate = (
       <Sticker  title='有效期:' style={{ paddingTop:W(8), paddingLeft:24 , paddingBottom:W(10) }}>
         <Text style={styles.text}>{this.vocherStore.productDetail.effectStartTime}</Text>
        </Sticker>
      );
    const userful = (
        <Sticker  title='使用时期:' style={{ paddingTop:W(8), paddingLeft:24 , paddingBottom:W(10) }}>
          <Text style={styles.text}>{this.vocherStore.productDetail.availableTimeDesc}</Text>
         </Sticker>
       );
    const unuserful = (
        <Sticker  title='不可使用日期:' style={{ paddingTop:W(8), paddingLeft:24 , paddingBottom:W(10) }}>
          <Text style={styles.text}>{this.vocherStore.productDetail.unavailableTimeDesc}</Text>
         </Sticker>
       );
    const rule = (
        <Sticker  title='使用规则:' style={{ paddingTop:W(10), paddingLeft:24 , paddingBottom:W(11) }}>
          {this.renderRules()}
         </Sticker>
       );

    const shopIntro = (
        <Sticker  title='商家介绍:' style={{ paddingTop:W(10), paddingLeft:24 , paddingBottom:W(20) }}>
          <MerchantIntro
            merchant={this.merchantStore.merchantDetail}
            distance={`${this.merchantStore.merchantDetail.distance}`}
            telephones={this.merchantStore.telephones}
          />
         </Sticker>
       );
    const packageIntro = (
         <StickerItem title='套餐介绍' style={{ paddingBottom:0 }}>
            <PackageIntro datas={['1',  '2', '3']}/>
        </StickerItem>
       );

    const dishes = (
      <StickerItem title='菜品' style={{ paddingTop:W(10) }}>
      <Dishes datas={['1',  '2', '3']}/>
        </StickerItem>
    );

    const userNoti = (
         <StickerItem title='使用须知' style={{ paddingTop:W(0) , paddingBottom:0 }}>
            {vidate}
            {userful}
            {unuserful}
            {rule}
            {shopIntro}
          </StickerItem>
       );
    return(
      <View style={styles.continer}>
        <ScrollView>
          {vouchers}
          {packageIntro}
          {dishes}
          <View style={styles.segmentation}/>
          {userNoti}
        </ScrollView>
      </View >
    );
  }

}

const styles = StyleSheet.create({
  continer:{
    flex: 1,
    backgroundColor:'#f8f8f8',
  },
  backImage:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
  },
  sticker_header:{
    paddingLeft: W(24),
    paddingTop: W(11),
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
  rule:{
    flex: 1,
    flexDirection: 'column',
    justifyContent:'flex-start',
  },
  intro:{
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems:'center',
  },
  middle_line:{ width:W(1), height:W(12), backgroundColor:Colors.TITLE_BLACK_3, marginLeft:W(4) , alignSelf:'center' },
  phone:{
    position:'absolute',
    marginLeft: W(326),
    marginTop: W(25),
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
    height:W(24),
    flexDirection:'row',
    // marginTop: W(23),
  },
  symbol:{
    fontSize:F(14),
    fontWeight: '300',
    color:'#FD4D4F',
    marginTop:isiPhone() ? W(6) : W(3),
  },
  price:{
    fontSize:F(20),
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

  bgView:{
    marginBottom: W(17),
    width:W(328),
    height:W(91),
    justifyContent:'center',
    alignItems:'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
  scrollViewStyle:{
    width:W(375),
    height:W(89),
  },
  introImage:{
    width:W(138),
    height:W(89),
    marginLeft:W(24),
    borderRadius: W(3),
  },
  introImageLeft:{
    marginLeft:W(15),
  },
  introImageRight:{
    marginRight:W(24),
  },
  disheItem:{
    flexDirection:'row',
    justifyContent:'space-between',
    height:W(18),
    alignItems: 'center',
  },
  disesLeft:{
    marginLeft: W(24),
  },
  disesRight:{
    marginRight: W(24),
  },
  segmentation:{
    backgroundColor:'#f8f8f8',
    height:W(10),
    width:W(375),
  },
  footer:{
  },
});
