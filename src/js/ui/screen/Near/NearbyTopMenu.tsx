
import React from 'react';
import { 
   StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {  NavigationScreenProp } from 'react-navigation';

import { F, ifiPhoneX, StatusBarHeight, W } from 'js/helper/UI';

import { strings } from 'js/helper/I18n';
import { MerchantListStore } from 'js/store/MerchantListStore';
import { NearStore } from 'js/store/NearStore';
import { observer } from 'mobx-react';
import { Colors } from 'js/style/colors';
import FastImage from 'react-native-fast-image';


interface IProps {
  navigation: NavigationScreenProp<{}>;
  store: NearStore | MerchantListStore;
}
@observer
export class NearbyTopMenu extends React.Component<IProps, any> {

  constructor(props: IProps) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.getMenuItemsView = this.getMenuItemsView.bind(this);
  }

  public getMenuItemsView(arr: any[]) {
    return arr.map((item, index) => {
      const _onClick = this.onClick.bind(this, item, index);
      const scaleStyle =  this.props.store.menuIndex === index ? { transform:  [{ rotateX: '180deg' }] } : null;
      return (
        <TouchableOpacity key={index} onPress={_onClick} style={styles.topmenu_item}>
          <Text style={styles.topmenu_item_text} numberOfLines={1}>{item.name}</Text>
          <FastImage
            style={[styles.topmenu_item_icon, scaleStyle]}
            source={item.icon}
          />
        </TouchableOpacity>
      );
    });
  }

  public onClick = (item: any, index: number) => {
    this.props.store.setMenuIndex(index);
    this.props.store.setVisible(true);
  }

  public render () {
    const store = this.props.store;

    const menuItems = [
      {
        name: store.menuLeftText || strings('nearbyStore'),
        icon: require('img/homeIcon/arrow_black.png'),
      },
      {
        name: store.menuCenterText || strings('allCategories'),
        icon: require('img/homeIcon/arrow_black.png'),
      },
      {
        name: store.menuRightText || strings('smartSort'),
        icon: require('img/homeIcon/arrow_black.png'),
      },
    ];

    const topmenuStyle = store.modalVisible ? {
      borderBottomColor: 'rgba(0,0,0,0)',
      // borderBottomWidth: StyleSheet.hairlineWidth,
    } : null;

    const menuItemsView = this.getMenuItemsView(menuItems);

    return (
      <View style={styles.item}>
        <View style={[styles.topmenu, topmenuStyle]}>
          {menuItemsView[0]}
          {menuItemsView[1]}
          {menuItemsView[2]}
        </View>
      </View>
    );
  }
}

const SBH = ifiPhoneX(40, 20, StatusBarHeight);

const styles = StyleSheet.create({
  item:{
    backgroundColor: '#fff',
  },
  topmenu: {
    backgroundColor: '#FFFFFF',
    height: W(40),
    width: W(375),
    flexDirection: 'row',
    justifyContent:'space-around',
    alignItems: 'center',

  },
  topmenu_item: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',

  },
  topmenu_line: {
    height: W(16),
    width: W(1),
    backgroundColor: '#BDC0C5',
    alignSelf: 'center',
  },
  topmenu_item_text: {
    color: Colors.TITLE_BLACK,
    fontSize: F(12),
    maxWidth: W(60),
  },
  topmenu_item_icon: {
    width: W(10),
    height: W(6),
    marginLeft: W(8),
    top: W(1),
  },

});
