
import {  F, W } from 'js/helper/UI';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';


const ScreenWidth = Dimensions.get('window').width;

interface IRights {
  name: string;
  coverPath: any;
}
@inject('userStore')
@observer
export class MemberRights extends React.Component  {
  public renderTopicItem = (item: IRights  , index: number, len: number) => {
    return (
        <TouchableWithoutFeedback key={item.coverPath}>
            <View style={styles.btn} >
              <FastImage 
                source={item.coverPath} 
                style={styles.img} 
                resizeMode={FastImage.resizeMode.stretch}
              />
              <Text style={styles.text}>{item.name}</Text>
            </View> 
        </TouchableWithoutFeedback>
    );
  }

  public renderAllItem() {
    const  topicArray: IRights[] = [
      {
        name:'会员折上折',
        coverPath:require('img/plusMember/mutidiscount.png'),
      },
      {
        name:'商品特惠',
        coverPath:require('img/plusMember/offprice.png'),
      },
      {
        name:'生日特权',
        coverPath: require('img/plusMember/brithRight.png'),
      },
      {
        name:'双倍积分',
        coverPath:require('img/plusMember/doublePoint.png'),
      },
      {
        name:'新品试吃会',
        coverPath:require('img/plusMember/testNew.png'),
      },
      {
        name:'每月霸王餐',
        coverPath:require('img/plusMember/free.png'),
      }];
    const itemArr = [];

    for (let i = 0; i < topicArray.length; i += 1) {
      const item  = this.renderTopicItem(topicArray[i], i, topicArray.length);
      itemArr.push(item);
    }
    return itemArr;
  }

  public render() {
    return(
      <View style={styles.continer}>
        <ScrollView
          style={styles.fastlist}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
        {this.renderAllItem()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  continer:{
    flex:1,
    backgroundColor:'#fcfaf6',
  },
  fastlist:{
    width: ScreenWidth,  
  },
  btn:{
    width: ScreenWidth / 4.5,
    height:W(90),
    flexDirection:'column',
    marginLeft:W(15),
  },
  img:{
    width: W(50),
    height: W(50),
  },
  text:{
    color:'#333',
    fontSize: F(12),
    fontWeight:'400',
    marginTop: W(4),
  },
});
