
import React from 'react';
import { Image } from 'react-native';
import {
    createBottomTabNavigator,
} from 'react-navigation';

import { F, W } from '../../helper/UI';
import { HomeStack } from './HomeStack';
import { NearStack } from './NearStack';
import { ProfileStack } from './ProfileStack';

const createTabBarIcon = (normalIcon: any, activeIcon: any) => {
  return ({ focused, tintColor }: any) => {
    const img = focused ? activeIcon : normalIcon;
    return (
      <Image source={img} style={{width:W(22),height:W(22),resizeMode:'stretch'}}/>
    );
  };
};

export const Tabs = createBottomTabNavigator(
  {
    HomeStack : {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: '首页',
        tabBarIcon: createTabBarIcon(
          require('img/tabBarIcon/home_unSelected.png'),
          require('img/tabBarIcon/home_selected.png'),
        ),
      },
    },
    NearbyStack: {
      screen: NearStack,
      navigationOptions: {
        tabBarLabel: '附近',
        tabBarIcon: createTabBarIcon(
          require('img/tabBarIcon/location_unSelected.png'),
          require('img/tabBarIcon/location_selected.png'),
        ),
      },
    },
    ProfileStack: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarLabel: '我的',
        tabBarIcon: createTabBarIcon(
          require('img/tabBarIcon/mine_unSelected.png'),
          require('img/tabBarIcon/mine_selected.png'),
        ),
        
      },

    },
  },
  {
    initialRouteName: 'HomeStack',
    backBehavior: 'none',
    tabBarOptions: {
      activeTintColor: '#F83146',
      inactiveTintColor: '#333',
      indicatorStyle: { height: 0 },
      labelStyle: {
        fontSize: F(8),
        fontFamily:'PingFangSC-Semibold', 
        marginTop: W(-4),
        marginBottom: W(6),
      },
      
      tabStyle: {
        padding: 0,
        margin: 0,
        // backgroundColor: 'green',
      },
      style :{
        borderTopColor: '#BCBDBD',
        borderTopWidth: W(0.5),
        backgroundColor: '#F9F9F9',
        height: W(49),
        justifyContent:'center',
        alignItems:'center',
      },
    },
  },
);
