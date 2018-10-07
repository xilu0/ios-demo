
import React from 'react';
import { Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import { NavigationScreenProps, NavigationState } from 'react-navigation';

import { px2dp, px2dpFont } from 'js/helper/Adapter';
// tslint:disable-next-line
import StackViewStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator';
import { W } from '../../helper/UI';

export const navigationConfig = {
  navigationOptions: ({ navigation, screenProps = { statusBarHeight: 0 } }: NavigationScreenProps) => {
    const _statusBarHeight = screenProps.statusBarHeight;
    // navigation
    // if (screenProps.androidAPILevel < 19) {
    //   _statusBarHeight = 0;
    // }
    // console.log(_statusBarHeight);
    const leftButton = (
      <TouchableHighlight
        style={styles.arrow_left}
        underlayColor={'rgba(0,0,0,0)'}
      >
        <Image source={require('img/merchant/back_black.png')} style={styles.image}/>
      </TouchableHighlight>
    );
    return {
      headerLeft:{ leftButton },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'normal',
        flex: 1,
        textAlign: 'center',
        fontSize: px2dpFont(36),
      },
      headerStyle: {
        paddingTop: _statusBarHeight,
        height: px2dp(107) + _statusBarHeight,

        elevation: 0,
        backgroundColor: '#FFFFFF',
        borderBottomColor: '#E6E6E6',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      headerRight: React.createElement(View),
      gesturesEnabled: false,
    };
  },
  transitionConfig:() => ({
    screenInterpolator: StackViewStyleInterpolator.forHorizontal,
  }),
};

// create custom transitioner without the opacity animation, ie. for iOS
export const forVertical = (props: any) => {
  const { layout, position, scene } = props;

  const index = scene.index;
  const height = layout.initHeight;

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange: ([index - 1, index, index + 1]),
    outputRange: ([height, 0, 0]),
  });

  return {
    transform: [{ translateX }, { translateY }],
  };
};

const styles = StyleSheet.create({
  arrow_left:{
    width: W(60),
    height: W(44),
    alignItems:'center',
    justifyContent:'center',
  },
  image:{ resizeMode:'stretch' },
});

export const getCurrentRouteName = (navigationState: NavigationState): string => {
  if (!navigationState) {
    return '';
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
};

export const TransitionConfiguration = () => ({
  screenInterpolator: (sceneProps: any) => {
    const { scene } = sceneProps;
    const { route } = scene;
    const params = route.params || {};
    const transition = params.transition || 'forHorizontal';
    return StackViewStyleInterpolator[transition](sceneProps);
  },
});
