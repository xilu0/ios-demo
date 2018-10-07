import React from 'react';
import { StyleSheet,View,ScrollView } from 'react-native';
import {  NavigationScreenProp } from 'react-navigation';

import { UserStore } from 'js/store/UserStore';
import { ifiPhoneX, StatusBarHeight, W } from 'js/helper/UI';
import { ProfileListItem } from './Mine/ProfileListItem';
import {  ProfileTopView } from './Mine/ProfileTopView';

interface IProps {
  navigation: NavigationScreenProp<any, any>;
  userStore: UserStore;
}

export class Profile extends React.Component<IProps, any> {

  public state = {
    sectionOne:[
      {
        title:'会员中心',
        image:require('img/person/vip.png'),
        key:'vip',
      },
      {
        title:'我的订单',
        image:require('img/person/order.png'),
        key:'allOrder',

      },
      {
        title:'待支付',
        image:require('img/person/wallet.png'),
        key:'paidOrder',

      },
      {
        title:'待使用',
        image:require('img/person/use.png'),
        key:'useOrder',

      },
      {
        title:'待点评',
        image:require('img/person/review.png'),
        key:'commentOrder',

      },
      {
        title:'退款/售后',
        image:require('img/person/returned.png'),
        key:'refundOrder',
      },
    ],
    sectionTwo:[
      {
        title:'我的兑换',
        image:require('img/person/change.png'),
        key:'redemption',
      },
      {
        title:'地址',
        image:require('img/person/address.png'),
        key:'address',
      },
      {
        title:'客服与帮助',
        image:require('img/person/service.png'),
        key:'service',
      },
    ],
    sectionThree:[
      {
        title:'意见反馈',
        image:require('img/person/advice.png'),
        key:'feedback',
      },
      {
        title:'关于我们',
        image:require('img/person/aboutour.png'),
        key:'refundOrder',
      },
    ],
  };

  public renderSection = (data:any[]) => {
    return data.map((item) => {
      return(
        <ProfileListItem 
          leftTitle={item.title} 
          image={item.image} 
          keys={item.key} 
          navigation={this.props.navigation} 
          key={item.key}
        />
      );
    });
  }

  public render() {
    const sectionOne = this.renderSection(this.state.sectionOne);
    const sectionTwo = this.renderSection(this.state.sectionTwo);
    const sectionThree = this.renderSection(this.state.sectionThree);
    return (
      <View style={{flex:1}}>
      <View style={styles.statusBar}/>
        <ScrollView style={{ flex:1, backgroundColor:'#fff' }}>
            <ProfileTopView {...this.props}/>
            <View style={{ flex:1 }}>
              <View style={styles.line}/>
              <View style={styles.sectionOne}>
                {sectionOne}
              </View>
            </View>
            <View style={{ flex:1, marginTop:W(15) }}>
              <View style={styles.lineUnfull}/>
              <View style={styles.sectionOne}>
                {sectionTwo}
              </View>
            </View>
            <View style={{ flex:1, marginTop:W(15), marginBottom:W(15) }}>
              <View style={styles.lineUnfull}/>
              <View style={styles.sectionOne}>
                {sectionThree}
              </View>
            </View>
         </ScrollView>
         </View>
    );
  }
}

const styles = StyleSheet.create({
  line:{
    backgroundColor:'#D8D8D8',
    width:W(375),
    height:StyleSheet.hairlineWidth,
  },
  lineUnfull:{
    backgroundColor:'#D8D8D8',
    marginLeft:W(15),
    marginRight:W(15),
    height:StyleSheet.hairlineWidth,
  },
  sectionOne:{
    flex:1,
    marginTop:W(15),
  },
  statusBar:{
    height:ifiPhoneX(44, 20, StatusBarHeight),
    width:W(375),
    backgroundColor:'#fff',
    top:0,
    position:'absolute',
    zIndex:888,
  },
});
