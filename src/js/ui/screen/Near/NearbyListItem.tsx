import { NavigationKeys } from 'js/const/NavigationKeys';
import { F, ifiPhoneX, StatusBarHeight, W } from 'js/helper/UI';
import { MerchantModel } from 'js/store/HomeStore';
import { Colors } from 'js/style/colors';
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import {  NavigationScreenProp } from 'react-navigation';

import FastImage from 'react-native-fast-image'


interface IProps {
  navigation: NavigationScreenProp<{}>;
  data: MerchantModel;
}

class PlaceholderListItem extends React.Component {
  public render() {
    return(
      <View style={styles.listview_item}>
        <View style={styles.placeImage}/>
        <View style={styles.placeIntro}/>
        <View style={styles.placeName}/>
        <View style={styles.placeAvge}/>
        <View style={styles.placeStar}/>
      </View>
    );
  }
}

export class NearbyListItem extends React.Component<IProps, any> {

  public render () {
    const onClick = () => this.props.navigation.navigate(NavigationKeys.MerchantDetail, {
      merchantId: this.props.data.id,
    });
    const RenderStarView = Array.from({ length: this.props.data.commentLevel || 0 }).map((item, index) =>  {
      const starLeft = index === 0 ? null : { marginLeft:W(3) };
      return (
        <FastImage
          key={index}
          style={[styles.star, starLeft]}
          source={require('img/merchant/newStar.png')}
          resizeMode={FastImage.resizeMode.stretch}
        />
      );
    });
    const renderImages = Array.from({ length:3 }).map((index) => {
      return(
        <TouchableOpacity key={`${index}`} onPress={onClick} activeOpacity={0.8}>
          <FastImage  
          style={[styles.bigImage]} 
          source={ require('img/merchant/Derek-Main.png')} 
          resizeMode={FastImage.resizeMode.stretch}
        />
        </TouchableOpacity>
      );
    });
    const discount = this.props.data.discountSetting! *10;

    const newView = (
    // <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.listview_item}>
        <Swiper
          key={renderImages.length}
          style={styles.wrapper}
          // containerStyle={{borderRadius:W(3)}}
          height={W(218)}
          horizontal={true}
          showsButtons={false}
          autoplay={false}
          loop={false}
          pagingEnabled={true}
          showsPagination={true}
          removeClippedSubviews={false}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          paginationStyle={styles.paginationStyle}
          bounces={true}
        >
          {renderImages}
        </Swiper>
        <View style={{flex:1,flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <View >
            <View style={styles.introView}>
            <Text style={styles.intro}>
            {`${this.props.data.regionName}·`}</Text>
            <Text style={styles.intro}>{this.props.data.distance}km·{this.props.data.averageConsume}/人</Text>
          </View>
            <Text  style={styles.name} numberOfLines={2}>{this.props.data.name}</Text>
          <View style={styles.averView}>
          <Text style={styles.average}>优享买单{discount}折</Text>
          </View>
          </View>
          <FastImage
             style={styles.shopLogo}
             source={{
               uri: this.props.data.logoPath,
               headers:{ Authorization: 'someAuthToken' },
               priority: FastImage.priority.normal,
             }}
             resizeMode={FastImage.resizeMode.stretch}
            />
        </View>
        </View>);
    const contentView = this.props.data.coverPath ? newView : <PlaceholderListItem/>;
    return (
        contentView
    );
  }
}

const SBH = ifiPhoneX(40, 20, StatusBarHeight);

const styles = StyleSheet.create({
  listview_item: {
    marginLeft: W(15),
    marginTop: W(30),
    marginRight: W(15),
  },
  wrapper:{
    borderRadius:W(3),
   
  },
  dotStyle: {
    width: W(6),
    height: W(6),
    backgroundColor: '#fff',
    opacity: 0.5,
    borderRadius: W(3),
    marginLeft:W(6),
  },
  activeDotStyle: {
    width: W(8),
    height: W(8),
    backgroundColor: '#fff',
    borderRadius: W(4),
    marginLeft:W(6),

  },
  paginationStyle: {
    bottom: W(10),
  },
  introView:{
    height:W(17),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop:W(15),
  },
  intro:{
    color:Colors.TITLE_BLACK,
    fontSize: F(12),
    fontWeight: 'bold',
  },
  name:{
    maxWidth:W(260),
    color:Colors.TITLE_BLACK,
    fontSize: F(18),
    fontWeight: '600',
    lineHeight:W(28),
    marginTop: W(4),
  },
  average:{
    color:Colors.TITLE_BLACK_8,
    fontSize: F(13),
    fontWeight: '400',
  },
  averView:{
    height:W(22),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 1,

  },
  starView:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: W(3),
  },
  star:{
    width:W(10),
    height:W(10),
  },

  rightView:{
    position:'absolute',
    backgroundColor:'pink',
    flex:1,
    bottom:0,
    top:W(200),
    right:0,
    justifyContent:'center',
    alignItems:'center',
    },
  shopLogo:{
    width:W(50),
    height:W(50),
    borderRadius:W(25),
    marginRight:W(6),
    marginTop:W(15),
  },
  bigImage:{
    width:W(345),
    height:W(218),
    backgroundColor:'#f4f4f4',
  },
  placeImage:{
    width:W(345),
    height:W(218),
    borderRadius: W(3),
    backgroundColor:'#f4f4f4',
  },
  placeIntro:{
    width:W(120),
    height:W(17),
    marginTop:W(15),
    backgroundColor:'#f4f4f4',
  },
  placeName:{
    width:W(285),
    height:W(28),
    marginTop: W(4),
    backgroundColor:'#f4f4f4',
  },
  placeAvge:{
    height:W(22),
    width:W(80),
    marginTop: 1,
  },
  placeStar:{
    width:W(80),
    height:W(10),
    marginTop: W(3),
  },
});
