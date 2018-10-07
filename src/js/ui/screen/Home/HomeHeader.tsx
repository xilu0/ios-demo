import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { AnimatedValue, NavigationScreenProp } from 'react-navigation';

import { F, W ,ifiPhoneX,StatusBarHeight,isiPhone} from 'js/helper/UI';
import ImageCapInset from 'react-native-image-capinsets';
import { action,  observable } from 'mobx';
import { observer } from 'mobx-react';
import FastImage from 'react-native-fast-image';


export enum HeaderMode {
  Home= 1, Near= 2, Result= 3,
}

interface IProps {
  type: HeaderMode;
  navigation: NavigationScreenProp<any>;
  onPress?: () => void;
  backPress?: () => void;
  content?: string;
}

interface IState {
  fadeAnim: AnimatedValue;
  inputAnim: AnimatedValue;
}
@observer
export class HomeHeader extends React.Component<IProps, IState> {

  @observable public isShow:boolean = false;
  @action public setIsPressIn(isNo:boolean){
    this.isShow = isNo;
  }


  public onPressIn = () => {
    this.setIsPressIn(true);
  }

  public onPressOut = () => {
    this.setIsPressIn(false);
  }
  public jumpScan = () => {
  }
  public render() {
    const scanView = this.props.type === HeaderMode.Home ? (
    <TouchableWithoutFeedback onPress={this.jumpScan} hitSlop={{ top:W(10), left:W(10), right:W(10), bottom:W(10) }}>
      <FastImage
        style={styles.scanIcon}
        source={require('img/scan_gray.png')}
        resizeMode={FastImage.resizeMode.stretch}
        />
      </TouchableWithoutFeedback>) :null;
    const top: any = {
      667:{ marginTop:W(20) },
      736:{ marginTop:W(18) },
      812:{ marginTop:W(44) },
    };
    const image = this.props.type === HeaderMode.Result ? require('img/navBack.png') :
     require('img/homeIcon/search_white.png');
    const size =  this.props.type === HeaderMode.Result ? { width:W(9), height:W(15) } : null;
    const color =  this.props.type === HeaderMode.Result ? { color:'black' } : null;

    const topMargin =  this.props.type === HeaderMode.Result ? { marginTop: isiPhone() ? 0 :StatusBarHeight } : null;
    const  img = this.isShow ? require('img/headerInputBg_touch.png') : require('img/header/Group.png');
    return(
      <TouchableWithoutFeedback
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
        onPress={this.props.onPress}
      >
      <View style={[styles.header,topMargin]}>
        <View style={styles.shadowView}>
      
          <ImageCapInset
            style={styles.headerInputBg}
            source={img}
            capInsets={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
          
            <TouchableWithoutFeedback
              onPress={this.props.backPress}
            >
            <View style={styles.btnView}>
              <FastImage
                style={[styles.searchIcon, size]}
                source={image}
                resizeMode={FastImage.resizeMode.stretch}
              />
              </View>
            </TouchableWithoutFeedback>
            <Text style={[styles.searchText, color]}>{this.props.content || '菜品 店名 分类'}</Text>
          </ImageCapInset>
    
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    width:W(375),
    height: W(52),
    marginTop:ifiPhoneX(40,20,StatusBarHeight),
    zIndex:88,
  },
  shadowView:{
    flex:1,
    marginLeft: W(1),
    marginRight: W(1),
    marginVertical: -W(5),
  },

  headerInputBg:{
    flexDirection:'row',
    alignItems:'center',
    flex: 1,
    opacity:1,
  },
  touchImage:{
    position:'absolute',
    // flex:1,
    width:W(375),
    marginLeft: W(1),
    marginRight: W(1),
 

  },
  opacity: {
    opacity: 0,
  },

  searchIcon:{
    width:W(15),
    height:W(15),
    // marginLeft: W(25),

  },
  searchText:{
    color:'#919191',
    fontSize: F(14),
    marginLeft: W(10),
  },
  scanIcon:{
    width:W(15),
    height: W(15),
    marginRight: W(30),

  },
  btnView:{
    width:W(30),
    height:W(36),
    marginLeft:W(26),
    justifyContent:'center',
    alignItems: 'center',

  },

});
