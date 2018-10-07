
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import {
  Animated,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
  VirtualizedList,
} from 'react-native';
import ImageCapInset from 'react-native-image-capinsets';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { SafeAreaView } from 'react-navigation';
import {  NavigationScreenProp } from 'react-navigation';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { F, ifiPhoneX, isiPhone,  StatusBarHeight, W } from 'js/helper/UI';
import { GeolocationStore } from 'js/store/GeolocationStore';
import { HomeStore } from 'js/store/HomeStore';
import { ComponentColors } from 'js/style/colors';
import { FeaturedTopics } from './FeaturedTopics';
import { HeaderMode,} from './HomeHeader';
import { HomeHeader2 } from './HomeHeader2';
import { HotShop } from './HotShop';
import { PlusMember } from './PlusMember';
import { Recommend } from './Recommend';
import Instabug from 'instabug-reactnative';


enum ItemType {
  Fixed, Shop,
  Banner, HotShop, Categories, FeaturedTopics,
}
interface IFixItem {
  type: ItemType;
  component: React.ComponentClass;
}

interface IProps {
  navigation: NavigationScreenProp<IProps, any>;
  homeStore: HomeStore;
  geolocationStore: GeolocationStore;
}
interface IState {
  offsetOfActionBar: number;
  isRefreshing: boolean;
  page: number;
}

const SBH = ifiPhoneX(40, 20, StatusBarHeight);

@inject('homeStore', 'geolocationStore')
@observer
export class Home extends React.Component<IProps, any> {

  constructor(props: IProps) {
    super(props);
    Instabug.startWithToken('37f12efc3d8ca11101c97eff5ee0ae22', [Instabug.invocationEvent.shake]);

    const scrollY = new Animated.Value(0);
    this.state = {
      scrollY,
      offsetOfActionBar: 0,
      isRefreshing: false,
      page: 0,
    };
  }


  private fixItems = [
    {
      type: ItemType.Fixed,
      component: Recommend,
    },
    {
      type: ItemType.Fixed,
      component: FeaturedTopics,
    },
    {
      type: ItemType.Fixed,
      component: PlusMember,
    },
    {
      type: ItemType.Fixed,
      component: HotShop,
    },

  ];

  public keyExtractor = (item: IFixItem | any, index: number) => {
    return `fix_${index}`;
  }

  public renderItem = (info: { index: number, item: IFixItem | any }) => {
    const { index, item } = info;
    const fixedItems = this.fixItems;
    const shopIndex = index - fixedItems.length;
    const Comp: React.ComponentClass | any = fixedItems[index].component;
    return <Comp {...this.props} />;
  }
  public getItemCount = () => this.fixItems.length;
  public getItem = (_: any, index: number) => {
    const data = this.fixItems;
    if (index < data.length) {
      return data[index];
    }

  }

  public hotShop: number = 0;
  private pageY: number = 0;

  public onRefresh() {
    this.props.homeStore.pullDown();
  }
  public toEnd = () => {
    this.props.homeStore.pullUp();
  }

  public renderFooter() {
    return (
      <View style={styles.footerRefresh}>
        <Text>正在加载更多...</Text>
      </View>
    );
  }

  private itemHeightS = [
    W(200),
    W(159),
    W(124),
    W(400),
  ];
  public renderItemLayout = (item: IFixItem, index: number) => {

    return { index, length: this.itemHeightS[index], offset: this.itemHeightS[index] * index };
  }

  public onLocation = () => {
    this.props.navigation.navigate(NavigationKeys.SelectCity);
  }

  public onSearch = () => {
    this.props.navigation.navigate(NavigationKeys.Search, { transition: 'forVertical' });

  }

  public onScan = () => {
    this.props.navigation.navigate('SelectCity1');
  }

  public onScrollEndDrag = () => {

    /* let value = this.state.translateY._value;
    if (value >= 23) {
      value = -46;
    } else {
      value = 0;
    }
    setTimeout(() => {
      this.state.timingTranslateY.setValue(value);
    });*/
    
  }

  private actionBarContainer?: View = undefined;
  private onActionBarContainerRef = (ref: View) => {
    this.actionBarContainer = ref;
  }

  private actionBar?: View = undefined;

  private onBarRef = (ref: View) => {
    this.actionBar = ref;
  }

  public render() {
    this.toEnd = this.toEnd.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    const onrefresh = () => this.onRefresh();
    const refreshControl = (
      <RefreshControl
        refreshing={this.props.homeStore.upLoading}
        onRefresh={onrefresh}
      />
    );
    const city = this.props.geolocationStore.currentCity.name!;
    const translateY = this.state.timingTranslateY;
    const scrollY = this.state.scrollY;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
        <StatusBar
          hidden={false}
          animated={true}
          barStyle={'dark-content'}
        />
        <HomeHeader2
          scrollY={scrollY}
          type={HeaderMode.Home}
          navigation={this.props.navigation}
          onPress={this.onSearch}
        />
        <View style={{ flex: 1, position:'relative' }}>
           <Animated.View
            ref={this.onActionBarContainerRef}
            style={[styles.actionBarContainer]}
          > 
            <ImageCapInset
              style={styles.headerBottomShadowImage}
              source={require('img/headerShaddow.png')}
              capInsets={{ top: 0, right: 5, bottom: 2, left: 5 }}
            />
          </Animated.View> 
          <VirtualizedList
            style={styles.content}
            data={this.fixItems}
            getItemCount={this.getItemCount}
            getItem={this.getItem}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            )}
            refreshControl={refreshControl}
            onScrollEndDrag={this.onScrollEndDrag}
          />
        </View>
        
      </SafeAreaView>
    );
  }
}

const headerHeight = isiPhone() ?  W(70) + ifiPhoneX(40, 20, StatusBarHeight) : W(60) + getStatusBarHeight();
const actionBarHeight = 46;
const styles = StyleSheet.create({
  actionBarContainer: {
    height: 10,
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 3,
    backgroundColor: 'rgba(0,0,0,0)',

  },
  actionBar: {
    height: actionBarHeight,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: ComponentColors.NAVIGATION_BAR_BG,
  },
  actionButtonContainer: {
    marginLeft:  10,
    height: 32,
    flex:1,
  },

  content: {
    flex: 1,
  },
  headerBottomShadowImage: {
    height: W(8),
    zIndex: 100,
    opacity: 0.5,

  },
  footerRefresh: {
    width: W(375),
    height: W(30),
    justifyContent: 'center',
    alignItems: 'center',
  },

  scan: {
    width: W(22),
    height: W(22),
    marginLeft: W(14),
    marginRight: W(14),
  },
  opacity: {
    opacity: 1,

  },
  actionButton: {
    color: '#484848',
    fontSize: F(12),
    paddingLeft:W(10),
    paddingRight: W(10),
    paddingTop: W(6),
    paddingBottom: W(6),
    borderRadius: W(3),
    borderColor: '#BDBDBD',
    borderWidth: isiPhone() ? StyleSheet.hairlineWidth : 0.5,
    fontFamily: 'PingFang-SC-Regular',
  },
  actionBtnBg:{
    position:'absolute',
    left:0,
    right:0,
    top:0,
    bottom:0,
  },
  actionView:{
    justifyContent:'center',
    alignItems: 'center',
    marginLeft:  W(16),
  },

});
