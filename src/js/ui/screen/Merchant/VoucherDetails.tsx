import React from 'react';
import { NavigationScreenProp } from 'react-navigation';

import { API, Body27 } from 'js/api';
import { NavigationKeys } from 'js/const/NavigationKeys';
import { errorHandle, IResponse } from 'js/helper/Respone';
import { getStore } from 'js/helper/Store';
import { F, isiPhone, isiPhoneX, W } from 'js/helper/UI';
import { MerchantStore, ProductModel } from 'js/store/MerchantStore';
import { Colors } from 'js/style/colors';
import { LinerGradientButton } from 'js/ui/components/Common/LinerGradientButton';
import { MerchantIntro } from 'js/ui/components/Merchant/MerchantIntro';
import { MerchantVocher } from 'js/ui/components/Merchant/MerchantVocher';
import { action, observable } from 'mobx';
import {  observer } from 'mobx-react/native';
import {
  Image,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ViewStyle,
  SafeAreaView,
} from 'react-native';
import FastImage from 'react-native-fast-image';


interface IProps {
  navigation: NavigationScreenProp<IProps>;
  productId: number;
  merchantId: number;
  tabLabel?: string;
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
       {line}
       {header}
       <View style={[{ paddingRight: W(24) }, this.props.style]} >
          {this.props.children}
       </View>
     </View>
    );
  }

}

class VouchersStore {

  @observable public productDetail: ProductModel =   new ProductModel();
  @action public getDetail(params: Body27) {
    return API.product.getProductDetail(params).then(action((rs: IResponse) => {
      this.productDetail = rs.data;

    })).catch(errorHandle);
  }
}
@observer
export class VoucherDetails extends React.Component<IProps> {

  // public telephones: string[]  = this.merchatStore.telephones ;

  private voucherStore = new VouchersStore();
  protected merchantStore = new MerchantStore();
  private  latitude =  getStore().geolocationStore.location.latitude;
  private longitude = getStore().geolocationStore.location.longitude;
  private productId = this.props.productId || this.props.navigation.getParam('productId') ;
  private merchantId = this.props.merchantId || this.props.navigation.getParam('merchantId') ;
  private from = this.props.navigation.getParam('from') ;
  private name = this.props.navigation.getParam('name') ;

  public static navigationOptions = ({ navigation }: IProps) => ({
    headerLeft: (
        <TouchableHighlight
          onPress={navigation.getParam('goBack')}
          style={styles.backImage}
          underlayColor={'rgba(0,0,0,0)'}
        >
        <View>
          <FastImage source={require('img/navBack.png')} resizeMode={FastImage.resizeMode.stretch}/>
        </View>
        </TouchableHighlight>
    ),
    title:navigation.getParam('title'),
    tabBarVisible:false,
  })

  public constructor(props: any) {
    super(props);
    this.props.navigation.setParams({ goBack: this.goBack.bind(this) });
    this.props.navigation.setParams({ title:this.name });

  }
  public componentWillMount() {
    this.voucherStore.getDetail({ productId:this.productId });
    this.merchantStore.requsetGetMerchantDetail({
      merchantId:this.merchantId ,
      latitude:this.latitude,
      longitude:this.longitude,
    });

  }

  public goBack() {
    this.props.navigation.goBack();
  }

  public buy = () => {
    this.props.navigation.navigate(NavigationKeys.PurchaseVouchers, {
      productId:this.voucherStore.productDetail.id,
      merchantId:this.merchantStore.merchantDetail.id,
    });
  }

  public renderRules = () => {

    const rulelist = this.voucherStore.productDetail.useRules!.map((item, index) => {
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
    const product: ProductModel  = this.voucherStore.productDetail;

    const vouchers = (
      <Sticker style={{ marginLeft: W(24), paddingTop:W(10) }}>
        <MerchantVocher
          item={this.voucherStore.productDetail}
          merchantStore={this.merchantStore}
          navigation={this.props.navigation}
        />
       </Sticker>
     );
    const vidate = (
       <Sticker  title='有效期:' style={{ paddingTop:W(8), paddingLeft:24 , paddingBottom:W(10) }}>
         <Text style={styles.text}>{`· `}
         {`${product.effectStartTime!.split(' ')[0]}至${product.effectEndTime!.split(' ')[0]}`}</Text>
        </Sticker>
      );
    const userful = (
        <Sticker  title='使用时期:' style={{ paddingTop:W(8), paddingLeft:24 , paddingBottom:W(10) }}>
          <Text style={styles.text}>{`· `}{product.availableTimeDesc}</Text>
         </Sticker>
       );
    const unuserful = (
        <Sticker  title='不可使用日期:' style={{ paddingTop:W(8), paddingLeft:24 , paddingBottom:W(10) }}>
          <Text style={styles.text}>{`· `}{product.unavailableTimeDesc}</Text>
         </Sticker>
       );

    const rule = (
        <Sticker  title='使用规则:' style={{ paddingTop:W(10), paddingLeft:24 , paddingBottom:W(11) }}>
          {this.renderRules()}
         </Sticker>
       );
    const shopIntro = (
        <Sticker  title='商家介绍:' style={{ paddingTop:W(10), paddingLeft:24 , paddingBottom:W(11) }}>
           <MerchantIntro
            merchant={this.merchantStore.merchantDetail}
            distance={`${this.merchantStore.merchantDetail.distance}`}
            telephones={this.merchantStore.telephones}
           />
         </Sticker>
       );
    const priceArray = product.favorablePrice.toFixed(2).split('.');
    const  priceText = (
      <Text style={{ fontSize:F(15), color:'#fff' }}>立即抢购
        <Text style={{ fontSize:F(18), color:'#fff' , fontFamily:'DIN-Medium' }}>￥
        <Text style={styles.footerText}>{priceArray[0]}.</Text>{priceArray[1]}
       </Text>
    </Text>
  );
    const footerButton = this.from! ? (
    <SafeAreaView style={styles.footer}>
        <LinerGradientButton
          onPress={this.buy}
          text={priceText}
          buttonStyles={{ width: W(375), borderRadius: 0 , height:W(49) }}
        />
      </SafeAreaView>) :null;
    return(
      <View style={styles.continer}>
        <ScrollView>
          {vouchers}
          {vidate}
          {userful}
          {unuserful}
          {rule}
          {shopIntro}
        </ScrollView>
        {footerButton}
      </View>
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
  footer:{
  },
  footerText:{
    fontFamily: 'DIN-Medium',
    fontSize: F(27),
    color:'#fff',
  },
});
