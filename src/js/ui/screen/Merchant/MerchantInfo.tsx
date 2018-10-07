import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { F, W } from 'js/helper/UI';
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

export class MerchantInfo extends React.Component<IProps, any> {

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
      <View>
        <View style={styles.introView}>
          <Text style={styles.intro}>
          {`${merchantDetail.categoryName}·${merchantDetail.regionName}·`}</Text>
          <Text style={styles.intro}>{merchantDetail.distance}km</Text>
        </View>
        <Text  style={styles.name} numberOfLines={2}>{merchantDetail.name}</Text>
        <View style={styles.averView}>
          <Text style={styles.average}>¥{merchantDetail.averageConsume}</Text>
          <Text style={styles.average}>每人</Text>
        </View>
      </View>
         <FastImage
            style={styles.shopLogo}
            source={{
              uri: merchantDetail.coverPath,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.stretch}
              />
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
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  introView:{
    height:W(17),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop:W(17),
    marginLeft: W(15),
  },
  intro:{
    color:Colors.TITLE_BLACK,
    fontSize: F(12),
    fontFamily: 'PingFangSC-Semibold',
  },
  name:{
    maxWidth:W(285),
    color:Colors.TITLE_BLACK,
    fontSize: F(23),
    fontWeight: '600',
    lineHeight:W(28),
    marginTop: W(4),
    marginLeft: W(15),
  },
  average:{
    color:Colors.TITLE_BLACK_8,
    fontSize: F(16),
    fontFamily: 'PingFangSC-Light',
  },
  averView:{
    height:W(20),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 1,
    marginLeft: W(15),
  },
  shopLogo:{
    width:W(50),
    height:W(50),
    borderRadius:W(25),
    marginRight:W(15),
    marginTop:W(17),
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
});
