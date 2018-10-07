import React, { ComponentType } from 'react';
import { Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { px2dp } from 'js/helper/Adapter';

import { W } from 'js/helper/UI';
import { merge } from 'lodash';

import { isFunction } from 'lodash';

import StackViewStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator';

interface IProps {
  navigation: NavigationScreenProp<any, any>;
  screenProps?: any;
}

export const appHeader = (title: string, config?: any): any => {
  let overrideBack: (navigation: NavigationScreenProp<any, any>) => void;
  if (config && 'back' in config) {
    overrideBack = config.back;
  }
  return <P extends IProps>(WrappedComponent: React.ComponentClass<P>|React.SFC<P>): React.ComponentClass<P> => {
    return class extends React.Component<P & IProps > {
      public static navigationOptions = ({ screenProps = { statusBarHeight: 0 }, navigation }: IProps) => {
        const _statusBarHeight = screenProps.statusBarHeight;

        const defaultConfig = {
          title,
          // header: React.createElement(View),
          headerLeft: (
              <TouchableHighlight
                onPress={navigation.getParam('goBack')}
                style={styles.arrow_left}
                underlayColor={'rgba(0,0,0,0)'}
              >
              <Image source={require('img/merchant/back_black.png')} />
              </TouchableHighlight>
          ),
          headerStyle: {
            paddingTop: _statusBarHeight,
            height: px2dp(107) + _statusBarHeight,
            elevation: 0,
            borderBottomColor: '#E6E6E6',
            borderBottomWidth: StyleSheet.hairlineWidth,
            backgroundColor: '#FBFBFB',
          },
          tabBarVisible:false,
          gesturesEnabled: false,
        };
        return merge(defaultConfig, config);

      }

      constructor(props: any) {
        super(props);
        this.props.navigation.setParams({
          title: props.title,
          goBack: this.goBack.bind(this),
        });
      }

      public goBack() {
        if (isFunction(overrideBack)) {
          overrideBack(this.props.navigation);
        } else {
          this.props.navigation.goBack();
        }

      }

      public render() {
        return  <WrappedComponent {...this.props} />;
      }
    };
  };
};

const styles = StyleSheet.create({
  arrow_left:{
    width: W(60),
    height: W(44),
    alignItems:'center',
    justifyContent:'center',
  },
});
