
import { appHeader } from 'js/ui/components/Navigation';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { F, W } from 'js/helper/UI';
import { action, observable } from 'mobx';
import { Observer, observer } from 'mobx-react/native';
import { View } from 'react-native';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { NavigationKeys } from 'js/const/NavigationKeys';
import { PopoverPayFail } from '../Merchant/PopupPayFail';
import { ProductPay } from '../Merchant/ProductPay';
import { Page } from './OrderPage';

interface IProps {
  navigation: NavigationScreenProp<any, any>;
}

class PayStore {
  @observable public showPay: boolean = false;
  @observable public orderId: number = 0;
  @observable public amount: number = 0;

  @action public show = () => {
    this.showPay = true;
  }

  @action public hide = () => {
    this.showPay = false;
  }

  @action public setOrderId = (_orderId: number) => {
    this.orderId = _orderId;
    return this;
  }

  @action public setMount = (_amount: number) => {
    this.amount = _amount;
    return this;
  }

}

export const orderCenterPayStore = new PayStore();

@observer
@appHeader('订单列表', {
  back: (navigation: NavigationScreenProp<any, any>) => {
    navigation.navigate(NavigationKeys.Tabs);
  },
})
export class OrderCenter extends React.Component<IProps, any, any> {

  public renderTabBar = () => (
    <DefaultTabBar
      style={{ height: W(40) }}
      tabStyle={style.tabStyle}
    />
  )

  public payRender = () => {
    return (
    <ProductPay
      visible={orderCenterPayStore.showPay}
      equestClose={orderCenterPayStore.hide}
      show={orderCenterPayStore.show}
      orderId={orderCenterPayStore.orderId}
      amount={orderCenterPayStore.amount}
      navigation={this.props.navigation}
    />);
  }

  public render() {
    const selectIndex = this.props.navigation.getParam('index', 0);

    return (
      <View style={{ flex: 1, position: 'relative' }}>
      <ScrollableTabView
        style={style.pageBody}
        tabBarUnderlineStyle={style.tabBarUnderlineStyle}
        tabBarBackgroundColor={'#FFFFFF'}
        tabBarActiveTextColor={'#FF6001'}
        tabBarInactiveTextColor={'#272727'}
        tabBarTextStyle={style.tabBarTextStyle}
        initialPage={selectIndex}
        renderTabBar={this.renderTabBar}
      >
        <Page tabLabel={'全部 '} navigation={this.props.navigation}/>
        <Page tabLabel={'待支付'} status={0} navigation={this.props.navigation}/>
        <Page tabLabel={'待使用'} status={1} navigation={this.props.navigation}/>
        <Page tabLabel={'待评价'} status={2} navigation={this.props.navigation}/>
        <Page tabLabel={'退款售后'} status={3} navigation={this.props.navigation}/>
      </ScrollableTabView>
      <Observer render={this.payRender} />
      <PopoverPayFail />
      </View>
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
    backgroundColor: '#FF6001',
    height: W(1),
  },
  tabBarTextStyle: {
    fontSize: F(14),
    fontWeight: '400',
    fontFamily: 'PingFangSC-Regular',
    // borderWidth: W(1),
    // borderColor: 'red',
  },
});
