import { Body } from 'js/api';
import { RulesEnums } from 'js/const/RulesKeys';
import { scaleWidth, setFontSize } from 'js/helper/Adapter';
import {  errorHandle, errorHandleThen, IResponse } from 'js/helper/Respone';
import { IRule, testList } from 'js/helper/Rules';
import { UserStore } from 'js/store/UserStore';
import { showToast } from 'js/ui/components/Toast';
import { inject } from 'mobx-react/native';
import React from 'react';
import { AppState, Dimensions,  StyleSheet, Text, TouchableHighlight, View,TextInput, } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import FastImage from 'react-native-fast-image';


const ScreenWidth = Dimensions.get('window').width;

interface IProps {
  navigation: NavigationScreenProp<any, any>;
  userStore: UserStore;
}

interface IState {
  mobile: string;
  code: string;
  timerCount: number;
  timerTitle: string;
  isCounting: boolean;
  isEnable: boolean;
  currentTimer: number;
}

@inject('userStore')
export class SwapPhoneDetailScreen extends React.Component<IProps, IState> {

  public static navigationOptions = ({ navigation }: IProps) => ({
    headerLeft: (
      <TouchableHighlight
        onPress={navigation.getParam('goBack')}
        style={styles.backImage}
        underlayColor={'rgba(0,0,0,0)'}
      >
      <View>
        <FastImage source={require('img/navBack.png')} resizeMode={FastImage.resizeMode.stretch}/>
      </View>
      </TouchableHighlight>
    ),
    title:'换绑手机号',
    headerStyle: {
      backgroundColor: '#FBFBFB',
    },
  })

  public goBack() {
    this.props.navigation.goBack();
  }

  public flage: boolean = false;

  private interval: number = 0;

  constructor(props: IProps) {
    super(props);
    this.state = {
      mobile: '',
      code: '',
      timerCount: 0,
      timerTitle: '获取验证码',
      isCounting:false,
      isEnable: true,
      currentTimer:0,
    };
    this.props.navigation.setParams({ goBack: this.goBack.bind(this) });

  }

  public componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  public componentWillUnmount() {
    if (this.flage === false) {
      this.endCountDown();
      this.setState({ timerCount:0 });

    }
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  public _handleAppStateChange = (nextAppState: any) => {
    if (nextAppState != null && nextAppState === 'active') {

      if (this.flage) {
        const nowTime = new Date().getTime();

        const date3 = Math.floor((nowTime - this.state.currentTimer) / 1000);
        const num = this.state.timerCount - date3;
        if (num >= 0) {
          this.startCountDown(num);
        } else {
          this.setState({ timerCount:0 });
        }
      }
      this.flage = false ;
    } else if (nextAppState != null && nextAppState === 'background') {
      this.endCountDown();
      const now = new Date().getTime();
      this.setState({ currentTimer:now });

      this.flage = true;
    }

  }

  private endCountDown() {
    if (this.interval > 0) {
      clearInterval(this.interval);
      this.interval = 0;
    }
  }

  private startCountDown(time: number) {
    const COOL_DOWN = time ? time :60;
    this.setState({ timerCount: COOL_DOWN });
    this.interval = setInterval(() => {
      const timer = this.state.timerCount - 1;
      if (timer <= 0) {
        this.endCountDown();
        this.setState({
          timerCount: 0,
          timerTitle:'获取验证码',
          isEnable: true,
          isCounting:false,
        });
      } else {
        this.setState({
          timerCount:timer,
          timerTitle: `${timer}s`,
          isEnable:false,
          isCounting:true,
        });
      }
    },                          1000);
  }

  public clearCountDown() {
    this.endCountDown();
    this.setState({
      timerCount: 0,
      timerTitle:'获取验证码',
      isEnable: true,
      isCounting:false,
    });
  }

  public mobileChange = (text: string) => {
    this.setState({ mobile: text });
    const rulelist: IRule[] = [
      {
        rex: RulesEnums.TELPHONE,
        value: text,
      },
    ];
    const errmsg = testList(rulelist);

    if (errmsg === true) {
      this.clearCountDown();
    }
  }

  public codeChange = (text: string) => {
    this.setState({ code:text });
  }

  public getCode() {
    const { mobile } = this.state;
    const rulelist: IRule[] = [
      {
        rex: RulesEnums.TELPHONE,
        value: mobile,
      },
    ];
    const errmsg = testList(rulelist);

    if (errmsg !== true) {
      return showToast(errmsg);
    }

    if (!this.state.isEnable) {
      return;
    }

    const parms = {
      mobile:this.state.mobile,
      type:Body.TypeEnum.NUMBER_5,
    };

    this.props.userStore.requestSwapPhoneVerifyCode(parms).then((rs) => {
      showToast(`验证码已发送到您的手机，请注意查收`);
      this.setState({ isCounting: true, isEnable:false });
      this.startCountDown(60);

    }).catch(errorHandleThen((errRs: IResponse) => {
      showToast(errRs.data);

      this.clearCountDown();
    }));
  }

  public swapAction() {

    const { mobile, code } = this.state;

    const rulelist: IRule[] = [
      {
        rex: RulesEnums.TELPHONE,
        value: mobile,
      },
    ];
    const errmsg = testList(rulelist);

    if (errmsg !== true) {
      return showToast(errmsg);
    }
    if (code.length === 0) {
      showToast('请输入验证码');
      return;
    }
    const parms = {
      code,
      mobile,
    };
    this.props.userStore.requestBindNewPhone(parms).then(() => {
      showToast(`换绑成功`);
      this.props.userStore.logout().then(() => {
        this.props.navigation.popToTop();
      });
    }).catch(errorHandle);
  }

  public render() {
    const getCode =  this.getCode.bind(this);
    const swapAction = this.swapAction.bind(this);
    const isEnableStyle = this.state.isEnable ? null : styles.FF3D4F;
    const { timerCount } = this.state;

    const timerTitle = timerCount > 0 ? `${timerCount}s` : '获取验证码';

    return (
    <View style={{ backgroundColor:'#fff' }}>
      <TextInput
          style={styles.phonetf}
          placeholder='手机号码'
          maxLength={11}
          placeholderTextColor='#C6C6CC'
          onChangeText={this.mobileChange}
          keyboardType='phone-pad'
          underlineColorAndroid={'rgba(0,0,0,0)'}

      />
      <View style={styles.line}/>
       <View style={styles.content}>
        <TextInput
          style={styles.codetf}
          placeholder='请输入验证码'
          placeholderTextColor='#C6C6CC'
          keyboardType='phone-pad'
          onChangeText={this.codeChange}
          underlineColorAndroid={'rgba(0,0,0,0)'}
        />
        <View style={styles.codeBtn}>
            <Text style={[styles.code, isEnableStyle]} onPress={getCode}>{timerTitle}</Text>
        </View>
      </View>
      <View style={styles.line}/>
      <TouchableHighlight
        onPress={swapAction}
        style={styles.loginBtn}
      >
        <Text style={styles.loginText}>确定绑定</Text>
      </TouchableHighlight>
    </View>);
  }

}

const styles = StyleSheet.create({
  backImage:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
  },
  phonetf:{
    height:48,
    marginTop:5,
    marginLeft:26,
    width:ScreenWidth - 46,
  },
  line:{
    backgroundColor:'#E6E6E6',
    height:scaleWidth(2),
    marginLeft:20,
    width:ScreenWidth - 40,
  },
  content:{
    flexDirection:'row',
    alignItems:'center',
  },
  codetf:{
    height:48,
    marginLeft:26,
    flex:1,
  },
  codeBtn:{
    height:30,
    width:90,
    marginRight:26,
    borderWidth: scaleWidth(1),
    borderColor: '#000000',
    borderRadius: 2,
    justifyContent:'center',
    alignItems: 'center',
  },
  code:{
    fontSize:setFontSize(12),
    color:'#3c3b3b',
    fontWeight:'400',

  },
  loginBtn:{
    backgroundColor:'#1A1A1A',
    marginTop:23,
    marginLeft:20,
    marginRight:20,
    height:42,
    justifyContent:'center',
    alignItems: 'center',
    borderRadius:6,
  },
  loginText:{
    color:'#ffffff',
    fontSize:setFontSize(18),
    fontWeight:'400',

  },
  FF3D4F: {
    color: 'gray',
  },
});
