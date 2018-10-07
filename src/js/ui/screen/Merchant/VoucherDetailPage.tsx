
import React from 'react';

import { F, isiPhone, W } from 'js/helper/UI';

import {

  StyleSheet, Text, View, SafeAreaView,

} from 'react-native';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { MerchantStore, ProductModel } from 'js/store/MerchantStore';
import { LinerGradientButton } from 'js/ui/components/Common/LinerGradientButton';
import { appHeader } from 'js/ui/components/Navigation';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import ScrollableTabView, {  ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { NavigationScreenProp } from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator';
import { PackageDetail } from './PackageDetail';
import { VoucherDetails } from './VoucherDetails';

interface IProps {
  navigation: NavigationScreenProp<any>;

}


@appHeader('代金券', {
  transitionConfig:() => ({
    screenInterpolator: StackViewStyleInterpolator.forHorizontal,
  }),
})
@observer
export class VoucherDetailPage extends React.Component<IProps> {


  private merchantStore: MerchantStore = this.props.navigation.getParam('store');
  private products = this.merchantStore.products;
  private index = this.props.navigation.getParam('index') || 0;
  @observable public currentIndex: number = this.index;

  @observable public price = this.products[this.index].favorablePrice;
  @computed public get  currentPrice() {
    return this.price;
  }
  @action public setPrice(num: number) {
    this.price = num;
  }
  public renderTabbar = () => {
    return(<ScrollableTabBar/>);
    // return(<ScrollViewTabBar  data={this.products}/>);

  }
  public onChangeTab = (item: {i: number}) => {
    this.currentIndex = item.i;
    const product: ProductModel = this.products[this.currentIndex];
    const price = product.favorablePrice;
    this.setPrice(price) ;
  }
  public buy = () => {
    const productId = this.products[this.currentIndex].id;
    this.props.navigation.navigate(NavigationKeys.PurchaseVouchers, {
      productId,
      merchantId:this.merchantStore.merchantDetail.id,
    });
  }
  public renderItem = (item: ProductModel) => {
    if (item.type === 1) {
      return(
        <VoucherDetails
           tabLabel={item.name}
           key={item.id}
           navigation={this.props.navigation}
           productId={item.id}
           merchantId={this.merchantStore.merchantDetail.id}
        />

      );
    }
    return(
      <PackageDetail
         tabLabel={item.name}
         key={item.id}
         navigation={this.props.navigation}
         productId={item.id}
         merchantId={this.merchantStore.merchantDetail.id}
      />
    );

  }

  public render() {

    const contentView = this.products.map((item: ProductModel) => {
      return this.renderItem(item);
    });
    const priceArray = this.price.toFixed(2).split('.');
    const  text = (
        <Text style={{ fontSize:F(15), color:'#fff' }}>立即抢购
          <Text style={{ fontSize:F(18), color:'#fff' , fontFamily:'DIN-Medium' }}>￥
            <Text style={styles.footerText}>{priceArray[0]}.</Text>{priceArray[1]}
          </Text>
        </Text>
   );
    return(
      <View style={{ flex:1 }}>
      <ScrollableTabView
        style={styles.pageBody}
        tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
        tabBarBackgroundColor={'#FFFFFF'}
        tabBarActiveTextColor={'#FF6001'}
        tabBarInactiveTextColor={'#272727'}
        tabBarTextStyle={styles.tabBarTextStyle}
        renderTabBar={this.renderTabbar}
        onChangeTab={this.onChangeTab}
        page={this.currentIndex}
        tabsContainerStyle={{ borderColor:'#E6E6E6', borderWidth:isiPhone() ? StyleSheet.hairlineWidth :0.8 }}
      >
        {contentView}
      </ScrollableTabView>
      <SafeAreaView style={styles.footer}>
            <LinerGradientButton
              onPress={this.buy}
              text={text}
              buttonStyles={{ width: W(375), borderRadius: 0 , height:W(49) }}
            />
      </SafeAreaView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  tabStyle: {
    paddingBottom: 0,
  },
  pageBody: {
    backgroundColor: '#F8F8F8',
    flex: 1,
  },
  tabBarUnderlineStyle: {
    backgroundColor: '#FF6001',
    height: W(2),
  },
  tabBarTextStyle: {
    fontSize: F(14),
    fontWeight: '400',
  },
  footer:{
  },
  footerText:{
    fontFamily: 'DIN-Medium',
    fontSize: F(27),
    color:'#fff',
  },
  scrollView:{
    height:W(40),
    backgroundColor:'#fff',
  },
});
