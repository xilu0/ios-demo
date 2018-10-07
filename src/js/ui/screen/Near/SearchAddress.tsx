
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { NavigationKeys } from 'js/const/NavigationKeys';

import { F,  ifiPhoneX, StatusBarHeight, W } from 'js/helper/UI';
import { Colors } from 'js/style/colors';

import { strings } from 'js/helper/I18n';
import { hideLoading, showLoading } from 'js/helper/Loading';
import { errorHandleThen } from 'js/helper/Respone';
import { AddressSearchStore , POIModel } from 'js/store/AddressSearchStore';
import { City, GeolocationStore } from 'js/store/GeolocationStore';
import { inject, observer } from 'mobx-react';

import { Touchable } from 'js/ui/components/Touchable';
import FastImage from 'react-native-fast-image';


interface IProps {
  navigation: NavigationScreenProp<IProps>;
  addressSearchStore: AddressSearchStore;
  geolocationStore: GeolocationStore;
}

@inject('addressSearchStore')
@observer
class SearchPanel extends React.Component<IProps, any> {

  public selectPoint = (item: POIModel) => {
    const location = item.location || '';
    const arr = location.split(',').map((s: string) => parseFloat(s));

    this.props.addressSearchStore.setCurrentLocation(arr[0], arr[1]);
    this.props.addressSearchStore.addAddressHistory(item);
    this.props.addressSearchStore.setCurrentPOI(item);
    this.props.navigation.navigate(NavigationKeys.Tabs);
  }

  private getHistory() {
    const { addressHistoryList } = this.props.addressSearchStore; // this.props.addressSearchStore.historyList;
    return addressHistoryList.map((item: POIModel, index: number) => {
      return (
        <Touchable underlayColor={'rgba(0,0,0,0)'} key={item.id} onPress={this.selectPoint.bind(this, item)}>
          <View style={styles.panel_wrap_line_view} >
            <FastImage style={styles.panel_item__line_icon} source={require('img/homeIcon/clock.png')} />
            <Text style={styles.panel_item__line_text}>{item.name}</Text>
          </View>
        </Touchable>
      );
    });
  }

  public render() {
    const historyList = this.getHistory();
    const clearHistory = () => this.props.addressSearchStore.clearAddressHistory();

    const historyView = historyList.length > 0 ? (
      <View style={styles.panel}>
          <View style={styles.panel_wrap_line}>
            {historyList}
          </View>
        </View>
    ) : null;

    return (
      <ScrollView>
        {historyView}
      </ScrollView>

    );
  }
}

@inject('addressSearchStore', 'geolocationStore')
@observer
export class SearchAddress extends React.Component<IProps, any> {
  private searchInput?: TextInput;

  public componentDidMount() {
    this.props.addressSearchStore.clearKeyword();
  }

  public render() {

    const setInputRef = (c: TextInput) => {
      this.searchInput = c;
    };

    const onBackClick = () => {
      this.props.navigation.pop();
    };

    const search_img =  this.props.addressSearchStore.valid ?
      require('img/search/search1.png') : require('img/search/search.png');
    const search_cancel = require('img/search/search_cancel.png');

    const onChangeText = (text: string) => {
      this.props.addressSearchStore.keyword = text;
      if (this.props.addressSearchStore.valid) {
        const { location, city } = this.props.geolocationStore;
        this.props.addressSearchStore.searchPOI(text, `${location.longitude},${location.latitude}`, city.name || '深圳市');
      }
    };

    // const onSubmitEditing = () => {
    //   const keyword = this.props.addressSearchStore.keyword;
    //   this.props.addressSearchStore.addHistory(keyword);
    // };

    const PanelView = this.props.addressSearchStore.valid ? SearchLenovoPanel : SearchPanel;

    const onCurrentAddressClick = () => {
      showLoading('正在获取位置...', 5000);
      this.props.geolocationStore.getGeolocationCity().then((city: any | City) => {
        return this.props.addressSearchStore.searchCurrentPOI();
      }).then(() => {
        hideLoading();
        this.props.navigation.navigate(NavigationKeys.Tabs);
      }).catch(errorHandleThen(() => {
        hideLoading();
      }));

    };

    return (
      <View style={{ flex: 1, backgroundColor:'#FFFFFF' }}>
        <View style={styles.title}>
          <TouchableOpacity onPress={onBackClick}>
            <View style={styles.title_img_view}>
              <FastImage 
                style={styles.title_img} 
                source={require('img/homeIcon/delete.png')} 
                resizeMode={FastImage.resizeMode.stretch} 
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.title_text}>切换地址</Text>
          <View style={styles.title_img_view}/>
        </View>
        <View style={styles.header}>
          <FastImage source={search_img} style={styles.input_icon_search}/>
          <TextInput
            ref={setInputRef}
            style={styles.input}
            placeholder='搜索地址名称'
            placeholderTextColor='#92969C'
            underlineColorAndroid='transparent'

            onChangeText={onChangeText}
            returnKeyType='search'
            returnKeyLabel={strings('search')}
            keyboardType='web-search'
            enablesReturnKeyAutomatically={true}
  
            autoFocus={true}

          />

        </View>
        <View style={{ backgroundColor: '#F0F0F0' }}>
          <Touchable underlayColor={'rgba(0,0,0,0)'} onPress={onCurrentAddressClick}>
            <View  style={styles.location}>
              <FastImage 
                style={styles.location_img} 
                source={require('img/homeIcon/location.png')} 
                resizeMode={FastImage.resizeMode.stretch}
              />
              <Text style={styles.location_text}>点击定位到当前地址</Text>
            </View>
          </Touchable>

        </View>

        <PanelView {...this.props} />

      </View>
    );
  }

}

const SBH = ifiPhoneX(40, 20, StatusBarHeight);

const styles = StyleSheet.create({
  title: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SBH,
  },
  title_text: {
    color: Colors.TITLE_BLACK,
    fontSize: F(18),
  },
  title_img_view: {
    width: W(50),
    height: W(50),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',

  },
  title_img: {
    width: W(15),
    height: W(15),
  },

  header:{
    backgroundColor: '#fff',
    height: W(57),
    paddingLeft: W(41),
    paddingRight: W(41),

    flexDirection: 'row',
    alignItems: 'center',

  },

  input: {
    flex: 1,
    // width: W(280),
    height: W(33),
    backgroundColor: '#F0F0F0',
    borderRadius: W(17),
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: W(35 + 17),

    color: '#333333',
    fontSize: F(13),

  },

  input_icon_search: {
    position: 'absolute',
    width: W(14),
    height: W(14),
    left: W(41 + 27),
    // top: W(10 + 6),
    // bottom: W(10),
    zIndex: 5,

  },
  location: {
    height: W(43),
    marginTop: W(10),
    marginBottom: W(10),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E6E6',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6E6E6',
  },
  location_img: {
    width: W(18),
    height: W(18),
  },
  location_text: {
    color: Colors.TITLE_BLACK,
    fontSize: F(15),
    marginLeft: W(7),
  },

  panel: {
    // paddingLeft: W(24),
    backgroundColor: '#FFFFFF',
  },

  panel_wrap_line: {

  },

  panel_wrap_line_view: {
    height: W(44),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E6E6',
    flexDirection: 'row',
    alignItems: 'center',
  },

  panel_item__line_icon: {
    width: W(17),
    height: W(17),
    marginRight: W(6),
    marginLeft: (24),
  },

  panel_item__line_text: {
    color: Colors.TITLE_BLACK,
    fontSize: F(15),

  },

  lenovo: {
    flex: 1,
    // flexDirection: '',
    // paddingLeft: W(24),
    // paddingRight: W(24),
  },
  lenovo_item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D7D7D7',
  },

  lenovo_item_address: {
    height: W(44),
    flexDirection: 'row',
    alignItems: 'center',
  },
  lenovo_text_address: {
    color: Colors.TITLE_BLACK,
    fontSize: F(15),
    maxWidth: W(300),
  },
  lenovo_icon_address: {
    width: W(11),
    height: W(15),
    marginRight: W(12),
    marginTop: W(1),
    marginLeft: W(24),
  },

  heightColor: {
    color: '#FF6633',
  },

});

@observer
class SearchLenovoPanel extends React.Component<IProps, any> {

  public selectPoint = (item: POIModel) => {
    const location = item.location || '';
    const arr = location.split(',').map((s: string) => parseFloat(s));

    this.props.addressSearchStore.setCurrentLocation(arr[0], arr[1]);
    this.props.addressSearchStore.addAddressHistory(item);
    this.props.addressSearchStore.setCurrentPOI(item);
    this.props.navigation.navigate('Tabs');

  }

  public render() {
    // styles.heightColor
    const { poiResultList } = this.props.addressSearchStore;
    const contentView = poiResultList.slice().filter((item) => {
      return typeof (item.location) === 'string';
    }).map((item: POIModel) => {
      return(
          <Touchable underlayColor={'rgba(0,0,0,0)'} key={item.id} onPress={this.selectPoint.bind(this, item)}>
            <View style={[styles.lenovo_item, styles.lenovo_item_address]}>
              <FastImage style={styles.lenovo_icon_address} source={require('img/search/Scoordinates.png')} />
              <Text style={[styles.lenovo_text_address, null]} numberOfLines={1}>{item.name}</Text>
            </View>
        </Touchable>
      );
    });
    return (
      <ScrollView>
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <View style={styles.lenovo}>
          {contentView}
          </View>
        </View>
      </ScrollView>
    );
  }
}
