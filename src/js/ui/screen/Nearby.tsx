
import React from 'react';
import {
    Animated, Easing, ListView, RefreshControl, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationEventSubscription, NavigationScreenProp } from 'react-navigation';

import { ifiPhoneX, StatusBarHeight, W } from 'js/helper/UI';
import { GeolocationStore } from 'js/store/GeolocationStore';
import { HomeStore } from 'js/store/HomeStore';
import { NearStore } from 'js/store/NearStore';
import { inject, observer } from 'mobx-react';

import { AddressSearchStore } from 'js/store/AddressSearchStore';
import { NearbyListItem } from './Near/NearbyListItem';

import { NavigationKeys } from 'js/const/NavigationKeys';
import ImageCapInset from 'react-native-image-capinsets';
import { HeaderMode, HomeHeader } from './Home/HomeHeader';
import { NearByRecommend } from './Near/NearByRecommend';
import { NearbyTopMenu } from './Near/NearbyTopMenu';
import { NearbyFoodView } from './Near/NearFoodView';
import { Bubbles} from 'react-native-loader';


interface IProps {
  navigation: NavigationScreenProp<any>;
  nearStore: NearStore;
  geolocationStore: GeolocationStore;

  homeStore: HomeStore;
  addressSearchStore: AddressSearchStore;
}

@inject('nearStore', 'geolocationStore', 'addressSearchStore', 'homeStore')
@observer
export class Nearby extends React.Component<IProps, any> {

  public static navigationOptions = () => ({
    header: null,
  })

  private _navListener?: NavigationEventSubscription;

  constructor(props: IProps) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.getReshControlView = this.getReshControlView.bind(this);
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

  public componentDidMount() {
    this._navListener = this.props.navigation.addListener('willFocus', () => {
      StatusBar.setBarStyle('dark-content');
      const isNeedChangeCity = this.props.addressSearchStore.isNeedAlertChangeCity();
      if (isNeedChangeCity) {
        this.props.addressSearchStore.searchCurrentPOI();
      }
    });
    const city = this.props.geolocationStore.city;
    this.props.nearStore.requestGetRegions(city.id || 0);
    this.props.nearStore.merchant.updateQueryParamsAndRequest({
      longitude: this.props.geolocationStore.location.longitude,
      latitude: this.props.geolocationStore.location.latitude,
      cityId: city.id,
    });
    this.props.addressSearchStore.searchCurrentPOI();
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

  public getReshControlView() {
    return (
      <RefreshControl
        refreshing={this.props.nearStore.merchant.upLoading}
        onRefresh={this.onRefresh}
      />);
  }


  public renderRow(rowData: any) {
    return <NearbyListItem data={rowData} {...this.props} />;
  }

  public onEndReached() {
    if (!this.props.nearStore.merchant.isEmpty) {
      this.props.nearStore.merchant.nextPageRequestGetAppMerchants();
    }
  }

  public onRefresh() {
    this.props.nearStore.merchant.updateQueryParamsAndClearListAndRequest({
      pageIndex: 0,
    });
  }
  public onSearch = () => {
    this.props.navigation.navigate(NavigationKeys.Search, { transition: 'forVertical' });

  }
  public onScrollEndDrag = () => {
    let value = this.state.translateY._value;
    if (value >= 22) {
      value = -40;
    } else {
      value = 0;
    }
    setTimeout(() => {
      this.state.timingTranslateY.setValue(value);
    });
    
  }

  public renderHeader() {
    return (<View style={{ paddingTop: W(40) }}>
      <NearByRecommend store={this.props.nearStore} />
    </View>);
    
  }

  public renderFooter() {
    return  ( <View style={{flex:1, justifyContent:'center',alignItems:'center',height:W(40)}}>
    <Bubbles size={W(6)} color='rgba(248,49,70,0.75)' />
    </View>);
  }

  public render() {

    const list = this.props.nearStore.merchant.list.slice();

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    const data = ds.cloneWithRows(list);

    const refreshControl = this.getReshControlView();
    const translateY = this.state.timingTranslateY;
    const scrollY = this.state.scrollY;
    return (
      <SafeAreaView style={{ flex: 1 , backgroundColor:'white' }}>
        <HomeHeader type={HeaderMode.Near} navigation={this.props.navigation} onPress={this.onSearch}/>
        <Animated.View
            style={[styles.actionBarContainer, { transform: [{ translateY }] }]}
          >
            <NearbyTopMenu navigation={this.props.navigation} store={this.props.nearStore} />
            <ImageCapInset
              style={styles.headerBottomShadowImage}
              source={require('img/headerShaddow.png')}
              capInsets={{ top: 0, right: 5, bottom: 2, left: 5 }}
            />
        </Animated.View>
        <View style={{ flex: 1}}>
     
          <ListView
            renderHeader={this.renderHeader}
            renderFooter={this.renderFooter}
            initialListSize={10}
            style={styles.listview}
            dataSource={data}
            renderRow={this.renderRow}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.5}
            enableEmptySections={true}
            refreshControl={refreshControl}
            removeClippedSubviews={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            )}
            // onScrollEndDrag={this.onScrollEndDrag}

          />
          <NearbyFoodView
            navigation={this.props.navigation}
            store={this.props.nearStore}
            homeStore={this.props.homeStore}
          />

     </View>
        
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

  listview: {
    flex:1,
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
    top:  W(52)+ ifiPhoneX(40,20, StatusBarHeight) ,
    zIndex: 87,
    backgroundColor:'rgba(0,0,0,0)',
    // backgroundColor:'pink',

  },
});
