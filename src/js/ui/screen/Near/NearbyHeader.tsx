
import { inject, observer } from 'mobx-react';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import {  NavigationScreenProp } from 'react-navigation';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { F, ifiPhoneX, StatusBarHeight, W } from 'js/helper/UI';
import { AddressSearchStore } from 'js/store/AddressSearchStore';
import { Colors } from 'js/style/colors';
import FastImage from 'react-native-fast-image';


interface IProps {
  navigation: NavigationScreenProp<any>;
  showCityText: boolean;
  // nearStore: NearStore;
  addressSearchStore: AddressSearchStore;
  content?: string;
}

@inject('addressSearchStore')
@observer
export class NearbyHeader extends React.Component<IProps, any> {
  public render () {
    const onCityClick = () => {
      this.props.navigation.navigate(NavigationKeys.SearchAddress, { transition: 'forVertical' });
    };
    const onInputClick = () => {
      this.props.navigation.navigate(NavigationKeys.Search, { transition: 'forVertical' });
    };
    const onBackClick = () => {
      this.props.navigation.pop();
    };

    let showCityText = this.props.showCityText;
    if (showCityText === undefined) {
      showCityText = true;
    }

    const { selectPOI } = this.props.addressSearchStore;
    const cityTextView = showCityText ? (
      <TouchableOpacity onPress={onCityClick}>
        <View style={styles.header_address}>
        <Text style={styles.header_address_text} numberOfLines={1}>{selectPOI.name}</Text>
          <FastImage style={styles.header_address_img} source={require('img/homeIcon/arrow_black.png')} />
        </View>
      </TouchableOpacity>)
      : (
      <TouchableOpacity onPress={onBackClick}>
        <View style={{ justifyContent: 'center', alignItems:'center', flex: 1 , width: W(57) }}>
          <FastImage style={{ width:W(9), height:W(16) }} source={require('img/navBack.png')} />
        </View>
      </TouchableOpacity>);

    const inputText = this.props.content || '菜品 店名 分类';

    return (
      <View style={[styles.header, showCityText ? null : { paddingLeft: 0, paddingRight: W(57) }]}>
          {cityTextView}
          <TouchableWithoutFeedback onPress={onInputClick}>
            <View style={styles.header_search}>
              <FastImage source={require('img/homeIcon/search_white.png')} style={styles.header_search_img}/>
              <Text style={styles.header_search_text}>{inputText}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
    );
  }
}

const SBH = ifiPhoneX(40, 20, StatusBarHeight);

const styles = StyleSheet.create({
  header:{
    backgroundColor: '#FFFFFF',
    height: W(44) + SBH,
    paddingTop: SBH,

    borderBottomColor: '#E6E6E6',
    borderBottomWidth: StyleSheet.hairlineWidth,

    flexDirection: 'row',
    alignItems: 'center',

    paddingLeft: W(23),
    paddingRight: W(24),
  },
  header_address: {
    // width: W(68),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginRight: W(12),
  },
  header_address_text: {
    color: Colors.TITLE_BLACK,
    fontSize: F(14),
    minWidth: W(42),
    maxWidth: W(96),
  },
  header_address_img: {
    width: W(10),
    height: W(6),
    marginLeft: W(5),
    top: W(1),
  },
  header_search: {
    flex: 1,
    height:W(32),
    borderRadius:W(16),
    backgroundColor:'#F0F0F0',
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
  },
  header_search_img: {
    width:W(16),
    height:W(16),
    marginLeft:W(17),
  },
  header_search_text: {
    fontSize:F(14),
    fontWeight:'400',
    color:'#ccc',
    paddingLeft:W(8),
  },

});
