import React from 'react';
import { Dimensions, Image, StyleSheet , Text , TouchableHighlight, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { isIphone, px2dp, setFontSize } from 'js/helper/Adapter';

import { W } from 'js/helper/UI';
import { AddressModel } from 'js/store/UserStore';
import FastImage from 'react-native-fast-image';


const ScreenWidth = Dimensions.get('window').width;

interface IProps {
  navigation: NavigationScreenProp<IProps>;
  addressModel: AddressModel;
  index?: number;
}

export class AddressListItem extends React.Component<IProps, any> {

  public editAddress (model: AddressModel) {
    this.props.navigation.navigate('NewAddress', { model, type:'edit', index:this.props.index });
  }

  public render() {
    const edit = () => this.editAddress(this.props.addressModel);

    const defaultView = (
      <View style={styles.border}>
        <Text style={styles.default}>默认</Text>
      </View>
    );

    const isShowDefaultView = this.props.addressModel.isDefault === 1 ? defaultView : null;

    return(
      <View style={styles.continer}>
      < View style={styles.content}>
         <View style={styles.leftView} >
            <Text style={styles.name} numberOfLines={1}>{this.props.addressModel.contactName}</Text>
            {isShowDefaultView}
         </View>
         <View style={styles.middle}>
            <Text style={styles.mobile}>{this.props.addressModel.contactMobile}</Text>
            <Text style={styles.address}>
            {this.props.addressModel.provinceName}
            {this.props.addressModel.cityName}
            {this.props.addressModel.areaName}
            {this.props.addressModel.address}</Text>
         </View>
         <View style={styles.right} >
         <TouchableHighlight onPress={edit} underlayColor={'rgba(0,0,0,0)'} >
           <FastImage source={require('img/edit.png')} style={styles.edit}/>
         </TouchableHighlight>
         </View>
       </View>
       <View style={styles.line}/>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  continer:{
    backgroundColor:'#fff',
    height:px2dp(164),
    width:ScreenWidth,
  },
  content:{
    height:px2dp(162),
    backgroundColor:'#fff',
    flexDirection:'row',

  },
  leftView:{
    flexDirection:'column',
    alignItems:'center',
    width:px2dp(159),
  },
  name:{
    fontSize:setFontSize(15),
    fontWeight:'400',
    color:'#333',
    top:px2dp(40),
    textAlign:'center',
    width:px2dp(100),
  },

  border:{
    marginTop:26,
    borderWidth:px2dp(1),
    borderColor:'#B4292E',
    borderRadius:px2dp(4),
    height:px2dp(32),
    width:px2dp(66),
    alignItems:'center',
    justifyContent:'center',
  },
  default:{
    color:'#B4292E',
    fontSize:setFontSize(13),
    fontWeight:'400',

  },
  middle:{
    flexDirection:'column',
    width:px2dp(469),
    alignItems:'flex-start',
  },
  mobile:{
    fontSize:setFontSize(15),
    fontWeight:'400',
    color:'#333',
    top:px2dp(36),
  },
  address:{
    fontSize: setFontSize(13),
    fontWeight:'400',
    color:'#acacac',
    top:px2dp(45),
  },
  right:{
    width:60,
    height:px2dp(176),
    alignItems:'center',
    justifyContent:'center',
  },
  edit:{
    width:px2dp(32),
    height:px2dp(33),
  },
  line:{
    left:px2dp(30),
    width:px2dp(690),
    height:isIphone() ? StyleSheet.hairlineWidth :W(0.8),
    backgroundColor:'#D9D9D9',
  },
});
