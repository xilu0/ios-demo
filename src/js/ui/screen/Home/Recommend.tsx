import React from 'react';

import { inject } from 'mobx-react';
import { observer } from 'mobx-react/native';
import {
   Image,
   StyleSheet,
   Text,
   TouchableWithoutFeedback,
   View,
   } from 'react-native';

import { BannerModel, HomeStore } from 'js/store/HomeStore';

import { F, W } from 'js/helper/UI';
import { Colors } from 'js/style/colors';
import { action, observable } from 'mobx';
import Carousel from 'react-native-snap-carousel';
import { navigate } from 'js/helper/navigate';
import { NavigationKeys } from 'js/const/NavigationKeys';
import FastImage from 'react-native-fast-image'


interface IProps {
  homeStore: HomeStore;
  banner: BannerModel;
}
@inject('homeStore')
@observer
export class Recommend extends React.Component<IProps> {

  @observable public currentIndex: number = 1;

  @action public setCurrentIndex(index: number) {
    this.currentIndex = index;
  }
  private tapBanner = (model: BannerModel) => {
    navigate(NavigationKeys.WebViewScreen, model);
  }

  public onAnimationEnd = (index:number) => {

    this.setCurrentIndex(index + 1);

  }
  public renderItem =(data:{item :BannerModel}) =>{

  return( 
   <TouchableWithoutFeedback onPress={this.tapBanner.bind(this, data.item)} key={data.item.id}>
      <FastImage
          style={styles.bannerImg}
          source={{
            uri: data.item.coverPath,
            headers:{ Authorization: 'someAuthToken' },
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.stretch}
        />
   </TouchableWithoutFeedback> 
  );
  }


  public render() {
    const { bannerArray: _arr } = this.props.homeStore;
    const bannerArray = _arr.slice();

    const  index = this.currentIndex > bannerArray.length - 1 ? bannerArray.length : this.currentIndex;

    return(
      <View style={styles.contentView}>
          <Text style={styles.title}>今日推荐</Text>
            <View style={styles.introView}>
              <Text style={styles.intro}>每天都有新乐趣</Text>
              <Text style={styles.selectText}>{index}
              <Text style={styles.nomalText}>/{bannerArray.length}</Text></Text>
            </View>
 
           <Carousel
              data={bannerArray.slice()}
              renderItem={this.renderItem}
              sliderWidth={W(375)}
              itemWidth={W(352)}
              firstItem={0}
              containerCustomStyle={styles.wrapper}
              activeSlideAlignment={'center'}
              ParallaxImage={true}
              layoutCardOffset={0}
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
              swipeThreshold={15}
              onSnapToItem={this.onAnimationEnd }
            />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  contentView:{
    backgroundColor:'#fff',
    flex:1,
  },
  wrapper: {
    marginTop: W(24),
    width:W(375),
    height:W(202),
    paddingLeft:W(4),
  },
  bannerImg: {
    width:W(345),
    height: W(200),
    backgroundColor:'#f4f4f4',
    borderRadius: W(3),
  },

  placeImg: {
    width:W(375),
    height: W(200),
    resizeMode:'center',
  },
  title:{
    color:Colors.TITLE_BLACK,
    fontSize: F(22),
    fontWeight: '900',
    fontFamily: 'PingFangSC-Semibold',
    height:W(32),
    marginTop: W(16), // isiPhone() ? W(53) : W(94),
    marginLeft: W(16),

  },
  intro:{
    color:'#606060',
    fontSize: F(15),
    fontFamily: 'PingFangSC-Light',
  },
  introView:{
    marginTop: W(5),
    height:W(21),
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginLeft: W(16),
    marginRight: W(16),
  },
  selectText:{
    lineHeight:W(24),
    color:Colors.TITLE_BLACK,
    fontSize: F(20),
    fontFamily: 'DIN-Medium',
    paddingTop: W(6),
  },
  nomalText:{
    color:Colors.TITLE_BLACK_5,
    fontSize: F(13),
    fontFamily: 'DIN-Medium',
  },
});
