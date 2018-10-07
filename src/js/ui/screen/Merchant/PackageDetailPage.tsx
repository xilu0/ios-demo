
import React from 'react';

import { F, W } from 'js/helper/UI';

import { StyleSheet} from 'react-native';

import { MerchantStore, ProductModel } from 'js/store/MerchantStore';
import { appHeader } from 'js/ui/components/Navigation';
import ScrollableTabView, {  ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { NavigationScreenProp } from 'react-navigation';
import { PackageDetail } from './PackageDetail';

interface IProps {
  navigation: NavigationScreenProp<any>;

}
@appHeader('套餐详情')
export class PackageDetailPage extends React.Component<IProps> {

  public renderTabBar = () => (
    <ScrollableTabBar/>
  )

  public render() {
    const merachantStore: MerchantStore = this.props.navigation.getParam('store');
    const products = merachantStore.products;
    const index = this.props.navigation.getParam('index');
    const contentView = products.map((item: ProductModel) => {
      return(
        <PackageDetail
          tabLabel={item.name}
          key={item.id}
          navigation={this.props.navigation}
          productModel={item}
          productId={item.id}
          merchantId={merachantStore.merchantDetail.id}
          // merchant={merachantStore}
        />

      );
    });
    return(
      <ScrollableTabView
        style={style.pageBody}
        tabBarUnderlineStyle={style.tabBarUnderlineStyle}
        tabBarBackgroundColor={'#FFFFFF'}
        tabBarActiveTextColor={'#FC0204'}
        tabBarInactiveTextColor={'#272727'}
        tabBarTextStyle={style.tabBarTextStyle}
        initialPage={index}
        renderTabBar={this.renderTabBar}
      >
        {contentView}
      </ScrollableTabView>
    );
  }
}
const style = StyleSheet.create({
  tabStyle: {
    paddingBottom: 0,
  },
  pageBody: {
    backgroundColor: '#F8F8F8',
  },
  tabBarUnderlineStyle: {
    backgroundColor: '#FC0204',
    height: W(2),
  },
  tabBarTextStyle: {
    fontSize: F(14),
    // Regular: '400',
    fontWeight: '400',
  },
});
