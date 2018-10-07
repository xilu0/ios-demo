
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { F, W } from 'js/helper/UI';

export class Voucher extends React.Component<any, any> {
  public render() {
    return (
        <View style={style.continer}>
          <View style={style.leftView}>
           <Text style={style.price}><Text style={style.symobl}>￥</Text>80</Text>
           <Text style={style.name}>消费券01号</Text>
           <Text style={style.intro}>有效期2018.08.23-2018.09.23</Text>
          </View>
          <View style={style.rightView}>
            <Text style={style.rightText}>查看更多</Text>
          </View>
        </View>
    );
  }
}

const aviablecolor = '#FFF2E6';
const inaviablecolor = '#F8F8F8';

const style = StyleSheet.create({

  continer: {
    width:W(328),
    height:W(100),
    backgroundColor:aviablecolor,
  },
  leftView:{
    width:W(239),
    height:W(100),
    paddingLeft: W(15),
  },
  price:{
    fontSize: F(29),
    fontWeight: '400',
    fontFamily: 'DIN-Medium',
    color:'#FF5000',
    paddingTop: W(19),
  },
  symobl:{
    fontSize: F(14),
    fontWeight: '400',
    color:'#FF5000',
  },
  name:{
    fontSize: F(11),
    fontWeight: '400',
    color:'#FF5000',
    paddingTop:W(18) ,
  },
  intro:{
    fontSize: F(10),
    fontWeight: '400',
    color:'#FF5000',
    paddingTop:W(3) ,
  },
  rightView:{
    width:W(88),
    height:W(100),
    justifyContent:'center',
    alignItems: 'center',
  },
  rightText:{
    fontSize: F(14),
    fontWeight: '300',
    color:'#FF5000',
  },
});
