import React from 'react';

import {  StyleSheet, Text, TouchableWithoutFeedback , View } from 'react-native';

import {  px2dp } from 'js/helper/Adapter';

import { F, W } from 'js/helper/UI';

import { NavigationScreenProp } from 'react-navigation';
import FastImage from 'react-native-fast-image';



interface IData {
  leftTitle: string;
  rightTitle: string;
  isIcon?: boolean;
  leftIco?: any;
  isActive?: boolean;
}

interface IProps {
  navigation: NavigationScreenProp<any>;
  data: IData[];
  bottomDesc: string[];
  callback?: (item: IData, index: number) => void;
}

export class TrialListItem extends React.Component<IProps, any> {
  public renderRight = (title: string) => {
    const isRights = !!(title.indexOf(',') > -1);
    const titles = isRights ? title.split(',') : title;
    const ele = isRights ?
    [
      <Text key={1} style={[styles.rightText, styles.c_C3A78F]} > {titles[0]}</Text>,
      <Text key={2} style={[styles.rightText, styles.c_c, styles.text_throung]} > {titles[1]}</Text>,
    ] : <Text style={[styles.leftText, styles.c_C3A78F]} > {titles}</Text>
    ;
    return ele;
  }
  public isRenderIcon = (item: IData) => {
    return (
        item.isIcon ?
        <Text style={[styles.leftText, styles.mr_10]}><FastImage source={item.leftIco} style={styles.payPic}/></Text>
        : null);

  }
  public onPress = (item: IData, index: number) => {
    if (this.props.callback && typeof this.props.callback === 'function') {
      this.props.callback(item, index);
    }
  }
  public renderItem = () => {
    const props = this.props;
    return props.data.map((item, index) => {
      const picPath = item.isActive ? require('img/plusMember/tick.png') : require('img/round.png');

      return (
        <TouchableWithoutFeedback onPress={this.onPress.bind(this, item, index)} key={item.leftTitle}>
          <View key={index} style={styles.container}>
            <View style={styles.topView}>
              {this.isRenderIcon(item)}
              <Text style={styles.leftText} > {item.leftTitle}</Text>
            </View>
            <View style={{ flex:1 , flexDirection:'row', justifyContent:'flex-end' }}>
              {this.renderRight(item.rightTitle)}
              {item.isIcon ? <FastImage source={picPath} style={styles.wayStatus}/> :null}
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    });
  }
  public renderBottomDesc = () => {
    const props = this.props;
    return props.bottomDesc.map((item, index) => {
      return <Text key={index} style={[styles.leftText, styles.desc_item]} > {`${index + 1}.`}{item}</Text>;
    });
  }
  public render() {
    return(
        <View>
          {this.renderItem()}
          <View style={styles.desc}>{this.renderBottomDesc()}</View>
        </View>
    );
  }

}

const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingTop: W(34),
    paddingBottom: W(44),
    marginHorizontal:W(25),
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: W(0.5),
  },
  topView:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  leftText:{
    height:px2dp(40),
    color:'#444',
    top:4,
    fontSize:F(15),
  },
  rightText:{
    height:px2dp(40),
  },
  c_C3A78F:{
    color:'#C3A78F',
  },
  c_c:{
    color:'#ccc',
  },
  text_throung:{
    textDecorationLine:'line-through',
  },
  desc:{
    marginTop:px2dp(30),
    marginLeft:W(25),
  },
  desc_item:{
    height:px2dp(60),
  },
  rightIcon:{
    height:px2dp(70),
    width:px2dp(70),
  },
  payPic:{
    height: W(22),
    width: W(22),
  },
  wayStatus:{
    height: W(22),
    width: W(22),
  },
  mr_10:{
    marginRight:W(10),
  },
});
