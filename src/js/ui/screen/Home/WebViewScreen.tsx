
import { px2dpFont } from 'js/helper/Adapter';
import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  View,
  WebView,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { ifiPhoneX, isiPhone, StatusBarHeight, W } from 'js/helper/UI';
import { appHeader } from '../../components/Navigation';

interface IProps {
  navigation: NavigationScreenProp<any, any>;
}
@appHeader('图文详情')
export class WebViewScreen extends React.Component <IProps> {

  public constructor(props: any) {
    super(props);
    this.props.navigation.setParams({ goBack: this.goBack.bind(this) });
  }

  public goBack() {
    this.props.navigation.goBack();
  }

  public render() {
    const url = this.props.navigation.state.params.linkUrl;
    return(
      <View style={{ flex:1 }}>
        <StatusBar
          hidden={false}
          animated={true}
          barStyle={'dark-content'}
        />
        <WebView
          style={{ flex:1 }}
          source={{ uri: url }}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  web:{
    flex:1,
    backgroundColor:'#fff',
  },
  rightBtn:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
    marginRight:6,
    marginTop: ifiPhoneX(40, 20, StatusBarHeight),

  },
  backImage:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
    marginTop:isiPhone() ? 0 :W(20) ,

  },
});
