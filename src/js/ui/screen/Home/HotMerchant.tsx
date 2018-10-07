
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { F, W } from 'js/helper/UI';
import { MerchantModel } from 'js/store/HomeStore';
import { UserStore } from 'js/store/UserStore';
import { Colors } from 'js/style/colors';
import { PlaceholderItem } from 'js/ui/components/PlaceholderItem';
import { getStore } from 'js/helper/Store';
import { ScaleConpents } from 'js/ui/components/Common/ScaleConpents';
import FastImage from 'react-native-fast-image'


interface IProps {
  onPress: () => void;
  merchant: MerchantModel;
  isPlusType?:boolean;
}

export class HotMerchant extends React.Component<IProps, any> {
  private userStore: UserStore;
  constructor(props: IProps) {
    super(props);
    this.userStore = getStore().userStore;
  }

  public render () {
    const { self } = this.userStore;
    const isShowPlusIdent = this.props.isPlusType;
    const RenderStarView = Array.from({ length: this.props.merchant.commentLevel || 0 }).map((item, index) =>  {
      const starLeft = index === 0 ? null : { marginLeft:W(3) };
      return (
        <FastImage
          key={index}
          style={[styles.star, starLeft]}
          source={require('img/merchant/newStar.png')}
        />
      );
    });
    const discount = this.props.merchant.discountSetting! * 10;
    const introTextStyle = isShowPlusIdent ?  { color:'#DAB779' } : { color:Colors.TITLE_BLACK };
    const textStyle = isShowPlusIdent ?  { color:'#DAB779' } : { color:'#FC9153' };
    const newView = (
    <ScaleConpents onPress={this.props.onPress}>
      <View style={styles.listview_item}>
      <FastImage
             style={styles.bigImage}
             source={{
               uri: this.props.merchant.coverPath,
               priority: FastImage.priority.normal,
             }}
             resizeMode={FastImage.resizeMode.stretch}
            />
        <View style={styles.introView}>
          {isShowPlusIdent && <Image source={require('img/merchant/plusIdent.png')} style={styles.plusImage}/>}
          <Text style={[styles.intro, introTextStyle]}>
          {`${this.props.merchant.regionName}·`}</Text>
          <Text style={[styles.intro, introTextStyle]}>
            {this.props.merchant.distance}km·{this.props.merchant.averageConsume}/人
          </Text>
        </View>
        <Text  style={styles.name} numberOfLines={2}>{this.props.merchant.name}</Text>
        <View style={styles.averView}>
          <Text style={[styles.average, textStyle]}>优享买单{discount}折</Text>
        </View>
        </View>
      </ScaleConpents>);
    const contentView = this.props.merchant ? newView : <PlaceholderItem type={1}/>;
    return (
        contentView
    );
  }
}

const styles = StyleSheet.create({
  listview_item: {
    width:W(167),
    marginBottom: W(23),
    backgroundColor: '#FFFFFF',

  },

  introView:{
    height:W(16),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop:W(10),
  },
  plusImage:{
    width:W(35),
    height:W(15),
    marginRight:W(5),
    // marginTop:W(6),
  },
  intro:{
    fontSize: F(11),
    fontFamily: 'PingFangSC-Semibold',
  },
  name:{
    maxWidth:W(160),
    color:Colors.TITLE_BLACK,
    fontSize: F(14),
    fontFamily: 'PingFangSC-Semibold',
    fontWeight:'bold',
    marginTop: W(3),
  },
  average:{
    fontSize: F(12),
    fontFamily: 'PingFangSC-Regular',
  },
  averageWord:{
    color:Colors.TITLE_BLACK_8,
    fontSize: F(12),
    fontFamily: 'PingFangSC-Light',

  },
  averView:{
    height:W(17),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop:W(3),
  },
  starView:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: W(1),
  },
  star:{
    width:W(7),
    height:W(7),
  },
  bigImage:{
    width:W(167),
    height:W(106),
    borderRadius: W(3),
    backgroundColor:'#f4f4f4',
  },
});
