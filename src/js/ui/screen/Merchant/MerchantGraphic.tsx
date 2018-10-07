import { W } from 'js/helper/UI';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { hideLoading, showLoading } from 'js/helper/Loading';
import { MerchantStore } from 'js/store/MerchantStore';

interface IProps {
  navigation: NavigationScreenProp<any, any>;
  merchantStore: MerchantStore;

}
export class MerchantGraphic extends React.Component <IProps> {

  private static share = ({ navigation }: any) => {
    console.log('share');
  }
  public static navigationOptions = ({ navigation }: IProps) => ({
    headerLeft: (
        <TouchableHighlight
          onPress={navigation.getParam('goBack')}
          style={styles.backImage}
          underlayColor={'rgba(0,0,0,0)'}
        >
        <Image source={require('img/merchant/back_black.png')} style={{ resizeMode:'stretch' }}/>
        </TouchableHighlight>
    ),
    title:'图文详情',
    headerRight:(
      <TouchableHighlight
          onPress={MerchantGraphic.share.bind(null, navigation)}
          underlayColor={'rgba(0,0,0,0)'}
          style={styles.rightBtn}
      >
       <Image source={require('img/merchant/share_black.png')} style={styles.share}/>
      </TouchableHighlight>
    ),
  })

  public constructor(props: any) {
    super(props);
    this.props.navigation.setParams({ goBack: this.goBack.bind(this) });
  }

  public goBack() {
    this.props.navigation.goBack();
  }

  public onLoadStart() {
    showLoading('', 5000);
  }

  public onLoadEnd() {
    hideLoading();
  }

  public render() {

    // const { graphic } = this.props.merchantStore;
    // console.log(graphic);
    const url = 'https://axd-dev-upload.oss-cn-shenzhen.aliyuncs.com/MTAzMDc1MjQ2NTU0MjE5MzE1Mg==.jpg';
    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          <style>
            img{width: 100%}
          </style>
        </head>
        <body>
          <h2>123123</h2>
          <img src="${url}" width="100%" />
        <body>
      </html>
    `;

    return(

      <ScrollView style={{ flex: 1, backgroundColor:'#FFF' }} horizontal={true}>
        <ScrollView style={{ flex: 1 }}>

          <Image
            style={{ width: W(375), height: 1000, flex: 1 }}
            onLoadStart={this.onLoadStart}
            onLoadEnd={this.onLoadEnd}
            source={{ uri: url }}
            resizeMode={'contain'}
          />
        </ScrollView>
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  web:{
    flex:1,
    backgroundColor:'#fff',
  },
  share:{
    width:W(16),
    height:W(18),
    resizeMode:'stretch',
  },
  rightBtn:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
    marginRight:6,
  },
  backImage:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
  },
});
