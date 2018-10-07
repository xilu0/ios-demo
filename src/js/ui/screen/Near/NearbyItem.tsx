
import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import {  NavigationScreenProp } from 'react-navigation';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { F, ifiPhoneX, StatusBarHeight, W } from 'js/helper/UI';
import { MerchantModel } from 'js/store/HomeStore';
import { Colors } from 'js/style/colors';
import { PlaceholderItem } from 'js/ui/components/PlaceholderItem';
import FastImage from 'react-native-fast-image';


interface IProps {
  navigation: NavigationScreenProp<{}>;
  data: MerchantModel;
}

export class NearbyItem extends React.Component<IProps, any> {

  public render () {
    const onClick = () => this.props.navigation.navigate(NavigationKeys.MerchantDetail, {
      merchantId: this.props.data.id,
    });
    const logoImageSrc = { uri: this.props.data.coverPath, cache:'force-cache' };
    const RenderStarView = Array.from({ length: this.props.data.commentLevel || 0 }).map((item, index) =>  {
      return (
        <FastImage
          key={index}
          style={styles.listview_item_title2_star}
          source={require('img/merchant/star.png')}
          resizeMode={FastImage.resizeMode.stretch}
        />
      );
    });
    const view = (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.listview_item}>
            <View style={styles.listview_item_left}>
                <FastImage
                  style={styles.listview_item_image}
                  source={logoImageSrc}
                />
              </View>
              <View style={styles.listview_item_right}>
                <View style={styles.listview_item_title}>
                  <Text
                    style={styles.listview_item_title_text}
                    numberOfLines={1}
                  >{this.props.data.name}
                  </Text>
                </View>
                <View style={styles.listview_item_title2}>
                  <Text style={styles.listview_item_title2_text}>¥{this.props.data.averageConsume}/人</Text>
                  <View style={styles.listview_item_title2_star_box}>
                   {RenderStarView}
                  </View>
                </View>
                <View style={styles.listview_item_title3}>
                  <Text style={styles.listview_item_title3_text}>{this.props.data.categoryName}</Text>
                  <View style={styles.listview_item_title3_line} />
                  <Text
                    style={[styles.listview_item_title3_text, styles.listview_item_title3_text_max]}
                    numberOfLines={1}
                  >
                    {this.props.data.regionName}
                  </Text>
                  <View style={styles.listview_item_title3_line} />
                  <Text style={styles.listview_item_title3_text}>{this.props.data.distance}km</Text>
                </View>
                <View style={styles.listview_item_title4}>
                  <View style={styles.listview_item_title4_box}>
                    <Text style={styles.listview_item_title4_text}>{this.props.data.coupon}</Text>
                  </View>
                </View>
              </View>
          </View>
          </TouchableWithoutFeedback>
          );
    const contentView = this.props.data ? view : <PlaceholderItem type={1}/>;
    return (
        contentView
    );
  }
}

const SBH = ifiPhoneX(40, 20, StatusBarHeight);

const styles = StyleSheet.create({
  listview_item: {
    flexDirection: 'row',
    marginLeft: W(24),
    marginTop: W(15),
    marginRight: W(24),
    paddingBottom: W(15),
    borderBottomColor: '#EBEBEB',
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  listview_item_left: {},
  listview_item_right: {
    flex: 1,
    marginLeft: W(16),
  },
  listview_item_image: {
    width: W(140),
    height: W(93),
    borderRadius: W(3),
  },
  placeImg:{
    width: W(140),
    height: W(93),
    borderRadius: W(3),
    resizeMode:'center',
  },
  listview_item_title: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    paddingTop: W(2),
    // backgroundColor: 'green',
  },

  listview_item_title_text: {
    color: Colors.TITLE_BLACK,
    fontSize: F(18),
    maxWidth: '100%',
    includeFontPadding: false,
  },

  listview_item_title2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'yellow',

  },
  listview_item_title2_text: {
    color: Colors.TITLE_BLACK,
    fontSize: F(12),
  },

  listview_item_title2_star_box: {
    marginLeft: W(12),
    flexDirection: 'row',
    alignItems: 'center',
  },

  listview_item_title2_star: {
    width: W(12),
    height: W(11),
    marginRight: W(5),
    paddingBottom: W(1),
  },

  listview_item_title3: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // backgroundColor: 'red',
  // height: W(11),
  },

  listview_item_title3_text: {
    color: Colors.TITLE_BLACK,
    fontSize: F(12),
    alignItems: 'center',
  },

  listview_item_title3_line: {
    width: W(1),
    height: W(10),
    backgroundColor: '#B3B3B3',
    marginLeft: W(5),
    marginRight: W(5),
  },

  listview_item_title3_text_max:  { maxWidth: W(72) },

  listview_item_title4: {
    flex: 1,
    // backgroundColor: 'black',
  },

  listview_item_title4_box: {
    position: 'relative',
    height: W(14),
  },

  listview_item_title4_text: {
    color: '#FA4141',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FA4141',
    borderRadius: W(2),
    position: 'absolute',
    transform: [{ translateY: W(2) }],
  // width: W(31),
  // height: W(14),
    fontSize: F(8),
    paddingLeft: W(3),
    paddingRight: W(3),
    paddingTop: W(2),
    paddingBottom: W(2),
    textAlign: 'center',
  // lineHeight: F(14),

  },

});
