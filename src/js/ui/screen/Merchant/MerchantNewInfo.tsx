import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { F, W, isiPhone } from 'js/helper/UI';
import { MerchantStore } from 'js/store/MerchantStore';
import { NavigationScreenProp } from 'react-navigation';
import FastImage from 'react-native-fast-image'
import { Colors } from 'js/style/colors';

interface IProps {
  merchantStore: MerchantStore;
  navigation: NavigationScreenProp<any>;
}

class PlaceInfoItem extends React.Component {
  public render() {
    return(
      <View style={{flex:1}}>
        <View style={styles.placeIntroView}/>
        <View style={styles.placeName}/>
        <View style={styles.placeAvg}/>
      </View>
    );
  }

}

export class MerchantNewInfo extends React.Component<IProps, any> {

  private actionSheet = React.createRef<any>();

  public showActionSheet = () => {
    if (this.actionSheet.current) {
      this.actionSheet.current.show();
    }
  }

  public render() {
    const { merchantDetail } = this.props.merchantStore;
    const contentView = (
      <View style={styles.continer}>
        <Text  style={styles.name} numberOfLines={2}>{merchantDetail.name}</Text>
        <View style={styles.introView}>
          <Text style={styles.intro}>{merchantDetail.regionName}</Text>
          <View style={styles.line}/>
          <Text style={styles.rightText}>{merchantDetail.distance}km</Text>
          <View style={styles.line}/>
          <Text style={styles.rightText}>¥{merchantDetail.averageConsume}</Text>
        </View>
        <Text style={styles.businessTime}>{merchantDetail.businessTime}</Text>
        <View style={styles.addressView}>
          <FastImage
            source={require('img/merchant/dizhi.png')}
            resizeMode={FastImage.resizeMode.stretch}
          />
          <Text style={styles.addressText} >{merchantDetail.detailAddress}</Text>
        </View>
      </View >
    );
    const  renderView = merchantDetail.name ? contentView : <PlaceInfoItem/>;
    return(
      renderView
    );
  }
}

const styles = StyleSheet.create({

  continer:{
    flex:1,
  },
  introView:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop:W(9),
    marginLeft: W(15),
  },
  intro:{
    color:Colors.TITLE_BLACK,
    fontSize: F(14),
  },
  name:{
    maxWidth:W(285),
    color:Colors.TITLE_BLACK,
    fontSize: F(23),
    marginTop: W(13),
    marginLeft: W(15),
  },
  
  placeIntroView:{
    height:W(17),
    marginLeft: W(15),
    marginRight: W(15),
    marginTop:W(17),
    backgroundColor:'#f4f4f4',
  },
  placeName:{
    width:W(285),
    height:W(28),
    marginTop: W(4),
    marginLeft: W(15),
    backgroundColor:'#f4f4f4',
  },
  placeAvg:{
    height:W(22),
    marginLeft: W(15),
    width:W(80),
    marginTop: 1,
    backgroundColor:'#f4f4f4',
  },
  addressView:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:W(15),
    marginTop: W(8),

  },
  addressText:{
    color:Colors.TITLE_BLACK,
    fontSize: F(14),
    marginLeft:W(5),
    marginTop:W(8),
    maxWidth:W(200),
  },
  businessTime:{
    color:Colors.TITLE_BLACK,
    fontSize: F(14),
    marginLeft:W(15),
    marginTop:W(9),
  },
  rightText:{
    color:Colors.TITLE_BLACK,
    fontSize: F(14),
    marginLeft:W(3),
  },
  line:{
    width: isiPhone() ? 1 : 0.8,
    height:W(12),
    backgroundColor:'#D6D6D6',
    marginLeft:W(1),
    marginTop:1,
  },
});
