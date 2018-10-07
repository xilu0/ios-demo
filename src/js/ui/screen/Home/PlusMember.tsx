import React from 'react';

import { inject } from 'mobx-react';
import { observer } from 'mobx-react/native';
import {
   StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { BannerModel, HomeStore } from 'js/store/HomeStore';
import { NavigationScreenProp } from 'react-navigation';

import { F, W } from 'js/helper/UI';
import { Colors } from 'js/style/colors';
import FastImage from 'react-native-fast-image';

interface IProps {
  homeStore: HomeStore;
  banner: BannerModel;
  navigation: NavigationScreenProp<any>;
  title?:string;
  picPath?:any;
}
@inject('homeStore')
@observer
export class PlusMember extends React.Component<IProps> {

  public goToPlus = () => {
    const props = this.props;
    if (!props.title) {
      props.navigation.navigate(NavigationKeys.MemberIntrod, { type:'home' });
    }
  }

  public render() {
    const props = this.props;
    const { bannerArray } = props.homeStore;
    const picHeight = props.title ? styles.h_200 : styles.h_157;
    return(
      <TouchableOpacity onPress={this.goToPlus} activeOpacity={0.8}>
        <View style={styles.contentView}>
            <Text style={styles.title}>{props.title || '精选爱享到PLUS会员'}</Text>
            {props.title ? null : <Text style={styles.intro}>每天都有新乐趣</Text>}
            <FastImage  
              style={[styles.plusImage, picHeight]} 
              source={props.picPath || require('img/homeIcon/plusbanner.png')} 
              resizeMode={FastImage.resizeMode.stretch}
            />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  contentView:{
    backgroundColor:'#fff',
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
    lineHeight:W(30),
    marginTop:  W(48),
    marginLeft: W(16),
  },
  intro:{
    color:'#606060',
    fontSize: F(15),
    lineHeight:W(21),
    marginTop: W(5),
    marginLeft: W(16),
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
  plusImage:{
    width:W(345),
    marginLeft: W(16),
    marginTop: W(24),
  },
  h_200:{
    height:W(200),
  },
  h_157:{
    height:W(157),
  },
});
