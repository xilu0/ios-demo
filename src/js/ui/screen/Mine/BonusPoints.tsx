
import { NavigationKeys } from 'js/const/NavigationKeys';
import { navigate } from 'js/helper/navigate';
import { F, W } from 'js/helper/UI';
import { UserStore } from 'js/store/UserStore';
import { appHeader } from 'js/ui/components/Navigation';
import { inject } from 'mobx-react';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, 
  TouchableHighlight, TouchableOpacity , View } from 'react-native';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { NavigationScreenProp } from 'react-navigation';
import { Page } from './BonusPointPage';
import FastImage from 'react-native-fast-image';


const ScreenHeight = Dimensions.get('window').height;

interface IProps {
  navigation: NavigationScreenProp<any>;
  userStore: UserStore;
  name: string;
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor:'#fff',
    height: ScreenHeight,
  },
  plusTitle:{
    paddingLeft: W(15),
    paddingTop: W(18),
  },
  p_d_18:{
    paddingBottom: W(18),
  },
  p_d_14:{
    paddingBottom: W(14),
  },
  title:{
    color: '#333',
    fontWeight: 'bold',
  },
  bannerView:{ 
    alignItems:'center', 
    justifyContent:'center', 
    marginVertical:W(10), 
  },
  c_fff:{
    color: '#fff',
  },
  f_12:{
    fontSize:F(12),
  },
  f_22:{
    fontSize:F(22),
  },
  f_20:{
    fontSize:F(20),
  },
  f_36:{
    fontSize:F(36),
  },
  bgImage:{
    position:'relative',
    height:W(158),
    width:W(358),
  },
  pointShop:{ 
    position:'absolute', 
    right: W(50), 
    top: W(75), 
    width:W(82), 
    height:W(28), 
    justifyContent:'center', 
    alignItems:'center', 
    borderColor:'#fff', 
    borderRadius:W(40), 
    borderWidth:StyleSheet.hairlineWidth,
  },
  toRules: {
    color:'#666',
    alignSelf:'center',
    fontSize:F(12),
    fontWeight:'400',
  },
  backImage:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
  },
  rightBtn:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:80,
    marginRight:W(5),
  },
  tabStyle: {
    paddingBottom: 0,
    borderBottomColor: '#d8d8d8',
    borderBottomWidth:StyleSheet.hairlineWidth,
  },
  pageBody: {
    backgroundColor: '#fff',
  },
  tabBarUnderlineStyle: {
    backgroundColor: '#f7735d',
    height: W(1),
    // width: W(30),
  },
  tabBarTextStyle: {
    fontSize: F(12),
    color:'#333',
    fontWeight: '400',
  },
});

const jumpToRules = () => {
  navigate(NavigationKeys.IntegralRule);
};

@inject('userStore')
@appHeader('', {
  headerStyle: {
    borderBottomWidth: 0,
    backgroundColor: '#FFF',
  },
  headerRight:(
    <TouchableHighlight
      onPress={jumpToRules}
      underlayColor={'rgba(0,0,0,0)'}
      style={styles.rightBtn}
    >
      <Text style={styles.toRules}>积分规则</Text>
    </TouchableHighlight>
  ),

})
export class BonusPoints extends React.Component<IProps, {}> {
  public userStore: UserStore;
  public renderTabBar = () => {
    return (
        <DefaultTabBar
          style={{ height: W(40) }}
          tabStyle={styles.tabStyle}
        />
    );
        // <ScrollableTabBar
        //   // linerColors={[homeLinerColors[2],homeLinerColors[3]]}
        //   tabUnderlineColor={'#FC9153'}
        //   {...props}
        // />
  }
  public constructor(props: any) {
    super(props);
    this.userStore = props.userStore;
  }
  
  public render() {
    return(
        <View style={styles.container}>
          <View style={[styles.plusTitle, styles.p_d_18]}>
            <Text style={[styles.title, styles.f_22]}>我的积分</Text>
          </View>
          <View style={styles.bannerView}>
            <FastImage 
              source={require('img/point/point.png')} 
              style={styles.bgImage} 
              resizeMode={FastImage.resizeMode.stretch}
            />
            <View style={{ position:'absolute', left: W(50), top: W(38) }}>
              <Text style={{ color:'#fff', fontSize:F(36) }}>{this.userStore.self.point || 0}</Text>
              <Text style={{ color:'#fff', fontSize:F(12) }}>爱享到当前积分值</Text>
            </View>
            <View style={styles.pointShop}>
              <TouchableOpacity activeOpacity={0.75}>
                <Text style={{ color:'#fff', fontSize: F(12) }}>积分商城</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.plusTitle, styles.p_d_14]}>
            <Text style={[styles.title, styles.f_22]}>积分明细</Text>
          </View>
          <View style={{ flex:1 }}>
            <ScrollableTabView
              style={styles.pageBody}
              tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
              tabBarBackgroundColor={'#FFFFFF'}
              tabBarActiveTextColor={'#FC9153'}
              tabBarInactiveTextColor={'#333'}
              tabBarTextStyle={styles.tabBarTextStyle}
              initialPage={0}
              renderTabBar={this.renderTabBar}
            >
              <Page tabLabel={'全部'} navigation={this.props.navigation}/>
              <Page tabLabel={'收入'} pointsType={1} navigation={this.props.navigation}/>
              <Page tabLabel={'兑换记录'} pointsType={2} navigation={this.props.navigation}/>
            </ScrollableTabView>
           </View>
         </View>
    );
  }
}
