import { observer } from 'mobx-react/native';
import React from 'react';
import { Image, Linking , StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { OrderInfoMerchant } from 'js/api';
import { F, W } from 'js/helper/UI';
import { MerchantDetailModel } from 'js/store/MerchantStore';
import { Colors } from 'js/style/colors';
import ActionSheet from 'react-native-actionsheet';
import { showToast } from '../Toast';

interface IProps {
  merchant: OrderInfoMerchant | MerchantDetailModel;
  telephones: string[];
  distance: string;
}

@observer
export class MerchantIntro extends React.Component<IProps, any> {

  private actionSheet = React.createRef<any>();

  public showActionSheet = () => {
    if (!this.props.telephones || this.props.telephones.length === 0) {
      return showToast('联系方式为空');
    }
    if (this.actionSheet.current) {
      this.actionSheet.current.show();
    }
  }

  public selectPhone = (index: number) => {
    const telephones: string[] = this.props.telephones!;

    if (telephones.length === 0) return;
    if (index !== telephones.length - 1) {
      const url = 'tel: ' + telephones[index];
      Linking.canOpenURL(url).then((supported: boolean) => {
        if (!supported) {
          // console.log('Can\'t handle url: ' + url);
        } else {
          return Linking.openURL(url);
        }
      }).catch(err => console.error('An error occurred', err));
    }

  }
  public render() {
    const tleArray: string[] = this.props.telephones || [];
    return (
      <View >
      <View style={styles.intro}>
        <Image source={require('img/Order/shopStore.png')} />
        <Text style={[styles.text, { marginLeft:W(4) }]}>{this.props.merchant.name}</Text>
      </View>
      <View style={[styles.intro, { paddingTop:W(8) }]}>
        <Image source={require('img/Order/address_icon.png')}/>
        <Text style={[styles.text, { marginLeft:W(4) }]}>{this.props.distance}km</Text>
        <View style={styles.middle_line}/>
        <Text style={[{ marginLeft:W(4) }, styles.addressText]} numberOfLines={1}>
        {this.props.merchant.detailAddress}</Text>
      </View>
      <TouchableWithoutFeedback onPress={this.showActionSheet}>
        <View style={styles.phone}>
        <Image source={require('img/Order/phone.png')} style={{ resizeMode:'stretch' }}/>
        </View>
      </TouchableWithoutFeedback>
      <ActionSheet
          ref={this.actionSheet}
          options={tleArray}
          cancelButtonIndex={tleArray.length - 1}
          onPress={this.selectPhone}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  intro:{
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems:'center',
  },
  middle_line:{ width:W(1), height:W(12), backgroundColor:Colors.TITLE_BLACK_3, marginLeft:W(4) , alignSelf:'center' },
  phone:{
    position:'absolute',
    right:-10,
    bottom:-12,
    width:W(48),
    height:W(48),
    alignItems: 'center',
    justifyContent:'center',
  },
  text:{
    color:Colors.TITLE_BLACK_3,
    fontSize: F(13),
    fontWeight: '300',
  },
  addressText:{
    color:Colors.TITLE_BLACK_3,
    fontSize: F(13),
    fontWeight: '300',
    width:W(200),
  },
});
