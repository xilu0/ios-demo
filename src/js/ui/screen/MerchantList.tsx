
import { inject, observer } from 'mobx-react';
import React from 'react';
import {
  ListView,
  RefreshControl,
  Easing, StyleSheet, StatusBar, View ,Animated,SafeAreaView} from 'react-native';
import { NavigationEventSubscription, NavigationScreenProp } from 'react-navigation';

import { ifiPhoneX, StatusBarHeight,W } from 'js/helper/UI';
import { AddressSearchStore } from 'js/store/AddressSearchStore';
import { GeolocationStore } from 'js/store/GeolocationStore';
import { HomeStore } from 'js/store/HomeStore';
import { MerchantListStore } from 'js/store/MerchantListStore';

import { HeaderMode, HomeHeader } from './Home/HomeHeader';
import { NearbyListItem } from './Near/NearbyListItem';
import { NearByRecommend } from './Near/NearByRecommend';
import { NearbyTopMenu } from './Near/NearbyTopMenu';
import { NearbyFoodView } from './Near/NearFoodView';
import ImageCapInset from 'react-native-image-capinsets';
import { NavigationKeys } from 'js/const/NavigationKeys';



interface IProps {
  navigation: NavigationScreenProp<any>;
  merchantListStore: MerchantListStore;
  geolocationStore: GeolocationStore;
  homeStore: HomeStore;
  addressSearchStore: AddressSearchStore;
}

@inject('merchantListStore', 'geolocationStore', 'homeStore')
@observer
export class MerchantList extends React.Component<IProps, any> {


  constructor(props: IProps) {
    super(props);
    const scrollY = new Animated.Value(0);
    this.state = {
      scrollY,
      fadeAnim: new Animated.Value(1),
      translateY: Animated.diffClamp(
        scrollY.interpolate({
          inputRange: [0, 40],
          outputRange: [0, 40],
          extrapolateLeft: 'clamp',
        }),
        0,
        40,
      ),
      timingTranslateY: new Animated.Value(0),
    };
  }

  private _navListener?: NavigationEventSubscription;
  private SearchKeyWords = this.props.navigation.getParam('name');

  public componentDidMount() {
    this._navListener = this.props.navigation.addListener('willFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });

    this.props.merchantListStore.requestGetRegions();
    const toValue = this.state.translateY.interpolate({
      inputRange: [0, 40],
      outputRange: [0, -40],
      extrapolate: 'clamp',
    });
    Animated.timing(this.state.timingTranslateY, {
      toValue,
      duration: 15,
      easing: Easing.linear,
    }).start();

  }

  public componentWillUnmount() {
    if (this._navListener) {
      this._navListener.remove();
    }

  }
  public goBack = () => {
    this.props.navigation.goBack();
  }

  public onScrollEndDrag = () => {
    let value = this.state.translateY._value;
    if (value >= 22) {
      value = -44;
    } else {
      value = 0;
    }
    setTimeout(() => {
      this.state.timingTranslateY.setValue(value);
    });
    
  }

  public onSearch = () => {
    this.props.navigation.navigate(NavigationKeys.Search, { transition: 'forVertical' });

  }

  public renderHeader =()=>{
    return (
      <View style={{ paddingTop: W(40) }}>
      <NearByRecommend store={this.props.merchantListStore} />
      </View>
    );
  }


  public  keyExtractor = (rowData: any) => {
    return `key_${rowData.id}`;
  };


  public renderRow = (rowData: any) => <NearbyListItem data={rowData} {...this.props} />;
  public onEndReached = () => {
    if (!this.props.merchantListStore.merchant.isEmpty) {
      this.props.merchantListStore.merchant.nextPageRequestGetAppMerchants();
    }
  };
  public onRefresh = () => {
    this.props.merchantListStore.merchant.updateQueryParamsAndClearListAndRequest({
      pageIndex: 0,
    });
  };

  public refreshControl =()=>{
    return  (
      <RefreshControl
        refreshing={this.props.merchantListStore.merchant.upLoading}
        onRefresh={this.onRefresh}
    />
    );
  }

  public render() {

    const list = this.props.merchantListStore.merchant.list.slice();

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    const data = ds.cloneWithRows(list);

    const translateY = this.state.timingTranslateY;
    const scrollY = this.state.scrollY;
    return (
      <SafeAreaView style={{ flex: 1 , backgroundColor:'white' }}>
         <HomeHeader
          type={HeaderMode.Result}
          navigation={this.props.navigation}
          backPress={this.goBack}
          content={this.SearchKeyWords}
          onPress={this.onSearch}
        /> 

        <Animated.View
          style={[styles.actionBarContainer,{ transform: [{ translateY }] }]}
        >
         <NearbyTopMenu navigation={this.props.navigation} store={this.props.merchantListStore} />

          <ImageCapInset
            style={styles.headerBottomShadowImage}
            source={require('img/headerShaddow.png')}
            capInsets={{ top: 0, right: 5, bottom: 2, left: 5 }}
          />
        </Animated.View> 
        <View style={{ flex: 1,position:'relative'}}>

        <ListView
          renderHeader={this.renderHeader}
          initialListSize={5}
          style={styles.listview}
          dataSource={data}
          renderRow={this.renderRow}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          enableEmptySections={true}
          refreshControl={this.refreshControl()}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          )}
        />

       <NearbyFoodView
        navigation={this.props.navigation}
        store={this.props.merchantListStore}
        homeStore={this.props.homeStore}
       />
       </View>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({

  listview: {
    backgroundColor: '#FFFFFF',

  },
  headerBottomShadowImage: {
    height: W(10),
    zIndex: 100,
    opacity: 0.5,
  },
  actionBarContainer: {
    height: 44,
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'absolute',
    left: 0,
    right: 0,
    top: W(52) + ifiPhoneX(40,20,StatusBarHeight),
    zIndex: 3,
    backgroundColor:'#fff',

  },

});
