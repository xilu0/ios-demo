import React from 'react';
import { Dimensions, StyleSheet , Text, TouchableWithoutFeedback, View } from 'react-native';
import { NavigationEventSubscription, NavigationScreenProp } from 'react-navigation';

import { getStatusBarHeight, isPhoneX , px2dp } from 'js/helper/Adapter';
import { UserStore } from 'js/store/UserStore';
import { inject, observer } from 'mobx-react/native';

import { getUserToken } from 'js/api';
import { NavigationKeys } from 'js/const/NavigationKeys';
import { AuthLogin } from 'js/helper/Auth';
import { F, isiPhone, W } from 'js/helper/UI';
import { Colors } from 'js/style/colors';
import FastImage from 'react-native-fast-image';


const ScreenWidth = Dimensions.get('window').width;

interface IProps {
  navigation: NavigationScreenProp<IProps>;
  userStore: UserStore;
}

interface IState {
  isShow: boolean;
}

@inject('userStore')
@observer
export class ProfileTopView extends React.Component<IProps, IState> {
  private _navListener?: NavigationEventSubscription;

  public componentWillMount() {
    this._navListener = this.props.navigation.addListener('willFocus', () => {

      const token = getUserToken();
      if (token) {
        this.props.userStore.requestGetUserInfo();
      }
    });

  }
  public componentWillUnmount() {
    if (this._navListener) {
      this._navListener.remove();
    }
  }
  public state = {
    isShow:false,
  };

  public tapHeaderImage = () => {
    AuthLogin(this.props.navigation, NavigationKeys.PersonInfo);
  }
  public hidden = () => {
    this.setState({
      isShow:false,
    });
  }

  public render() {

    const { self } = this.props.userStore;

    const headPictureSource = self.headPicture ? { uri: self.headPicture } : require('img/2b.jpeg') ;
    const nickNameText = self.name ? self.name : '未登录';

    const onMoreSettingsPress = () => AuthLogin(this.props.navigation, 'MoreSettings');
    const onRequestClose = () => {
      this.setState({
        isShow: false,
      });
    };
    const btnClick = () => setTimeout(() => {
      AuthLogin(this.props.navigation, NavigationKeys.BonusPoints, { index:1 });
    });

    const tmpStyle = isiPhone()  ? styles.setting : styles.settingAndroid;
    const images = [{ url: this.props.userStore.self.headPicture || '' }];
    const plusIdentPic = (self.plusStatus === 1 && self.plusType === 0) ?
          require('img/person/trialPlus.png') : require('img/person/plus.png');
    const plusIdentStyle = (self.plusStatus === 1 && self.plusType === 0) ? styles.trialPlusImage : styles.plusImage;
    return(
      <View style={styles.continer}>
        <TouchableWithoutFeedback onPress={onMoreSettingsPress}>
        <View style={tmpStyle}>
          <FastImage 
            source={require('img/person/setting_icon.png')}
            style={styles.settingImage} 
            resizeMode={FastImage.resizeMode.stretch}
           />
          </View>
          </TouchableWithoutFeedback>
        <View style={styles.infoView}>
          <TouchableWithoutFeedback
            onPress={this.tapHeaderImage}
          >
            <FastImage source={headPictureSource} style={styles.avatar}/>
          </TouchableWithoutFeedback>
          <View style={styles.rightView}>
          <View style={styles.nameView}>
            <Text style={styles.name} numberOfLines={1}>{nickNameText}</Text>
            {self.plusStatus === 1 && <FastImage source={plusIdentPic} style={plusIdentStyle}/>}
          </View>
          <Text style={styles.intro}>查看并编辑个人资料</Text>
          </View>
        </View>
        <View style={styles.bottom}>
          <TouchableWithoutFeedback  onPress={btnClick}>
            <View style={[styles.currency, { left:W(-25) }]}> 
              <Text style={styles.currencyNumber}>{this.props.userStore.self.point || 0}</Text>
              <Text style={styles.currencyText}>积分</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback >
            <View style={styles.currency}>
              <Text style={styles.currencyNumber}>2张</Text>
              <Text style={styles.currencyText}>优惠券</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback >
           <View style={[styles.currency, { right:W(-25) }]}>
              <Text style={styles.currencyNumber}>3</Text>
              <Text style={styles.currencyText}>收藏</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  continer:{
    height:W(252),
    backgroundColor:'#fff',
  },
  setting:{
    position: 'absolute',
    right:W(15),
    top:isPhoneX() ? W(54) : W(34),
    width:W(25),
    height:W(25),
  },
  settingAndroid:{
    position: 'absolute',
    marginLeft: ScreenWidth - 40,
    top: px2dp(42 + getStatusBarHeight()),
  },
  settingImage:{
    width:W(22),
    height:W(22),

  },
  infoView:{
    flexDirection:'row',
    marginTop:W(80),
    width:W(375),
  },
  avatar:{
    width: W(65),
    height: W(65),
    marginLeft:W(15),
    borderRadius: W(65 / 2),
  },
  rightView:{

  },
  nameView:{
    flexDirection:'row',
    marginLeft:W(10),
    alignItems:'flex-start',
  },
  name:{
    fontSize:F(25),
    color:Colors.TITLE_BLACK_9,
    height:W(35),
    maxWidth:W(150),
    fontFamily: 'PingFangSC-Semibold',
  },
  plusImage:{
    width:W(60),
    height:W(16),
    marginLeft:W(10),
    marginTop:W(6),
  },
  trialPlusImage:{
    width:W(82),
    height:W(16),
    marginLeft:W(10),
    marginTop:W(6),
  },
  intro:{
    fontSize:F(14),
    color:Colors.TITLE_BLACK_9,
    fontFamily: 'PingFangSC-light',
    marginTop:W(5),
    marginLeft:W(10),
  },
  bottom:{
    flexDirection:'row',
    width:W(375),
    height:W(58),
    marginTop:W(35),
  },
  currency:{
    width:W(375 / 3),
    height:W(48),
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',

  },
  currencyNumber:{
    fontSize:F(14),
    color:Colors.TITLE_BLACK_9,
    fontFamily: 'PingFangSC-Medium',

  },
  currencyText:{
    marginTop:W(2),
    fontSize:F(12),
    color:Colors.TITLE_BLACK_5,
    fontFamily: 'PingFangSC-Regular',
  },

  line:{
    backgroundColor:'#D8D8D8',
    width:W(375),
    height:StyleSheet.hairlineWidth,
    marginTop:W(10),
  },
});
