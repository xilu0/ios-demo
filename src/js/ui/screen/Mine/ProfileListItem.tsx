import React from 'react';

import {  StyleSheet, Text , View } from 'react-native';

import { AuthLogin } from 'js/helper/Auth';
import { F, W } from 'js/helper/UI';
import { Touchable } from 'js/ui/components/Touchable';
import { NavigationScreenProp } from 'react-navigation';

import { Colors } from 'js/style/colors';
import FastImage from 'react-native-fast-image';


interface IProps {
  navigation: NavigationScreenProp<IProps>;
  leftTitle: string;
  image:any;
  keys:string;
}

export class ProfileListItem extends React.Component<IProps> {

  public onClick = (keys: string) => {
    const dict:{[key: string]: string} = {
      vip:'MemberIntrod',
      address:'AddressManagement',
      allOrder:'OrderCenter',
      paidOrder:'OrderCenter',
      useOrder:'OrderCenter',
      commentOrder:'OrderCenter',
      refundOrder:'OrderCenter',
    };

    const dicts: {[key: string]: number} = {
      allOrder:0,
      paidOrder:1,
      useOrder:2,
      commentOrder:3,
      refundOrder:4,
    };
    AuthLogin(this.props.navigation, dict[keys], { index:dicts[keys] });
  
  }

  public render() {

    const onPress = () => this.onClick(this.props.keys);
    return(
      <Touchable underlayColor={'#f2f2f2'} onPress={onPress} >
        <View  style={styles.contentView}>
          <View style={styles.item}>
            <FastImage 
              source={this.props.image} 
              style={styles.leftImage} 
              resizeMode={FastImage.resizeMode.stretch}
            />
            <Text style={styles.leftText} > {this.props.leftTitle}</Text>           
          </View>
          <FastImage 
            source={require('img/person/more_gray.png')} 
            style={styles.rightImage}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </View>
      </Touchable>
    );
  }

}

const styles = StyleSheet.create({

  leftText:{
    fontSize:F(15),
    color:Colors.TITLE_BLACK_9,
    marginLeft:W(10),
    fontFamily: 'PingFangSC-Regular',
  },

  rightImage:{
    width:W(8),
    height:W(14),
    marginRight:W(15),
  },
  item: {
    flex:2,
    marginLeft:W(15),
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
  },
  leftImage:{
    width:W(25),
    height:W(25),
  },
  contentView:{
    width:W(375),
    height:W(60),
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
});
