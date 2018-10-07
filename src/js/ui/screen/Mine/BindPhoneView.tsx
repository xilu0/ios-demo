import { scaleWidth, setFontSize } from 'js/helper/Adapter';
import React from 'react';
import { AppState,  Dimensions, StyleSheet, Text,  TouchableHighlight, View,TextInput } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { Body } from 'js/api';
import { RulesEnums } from 'js/const/RulesKeys';
import { errorHandle, errorHandleThen } from 'js/helper/Respone';
import { IRule, testList } from 'js/helper/Rules';
import { UserStore } from 'js/store/UserStore';
import { showToast } from 'js/ui/components/Toast';
import { inject } from 'mobx-react/native';


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

const ScreenWidth = Dimensions.get('window').width;

@inject('userStore')

export class BindPhoneView extends React.Component<IProps, IState> {

  private interval: number = 0;
  constructor(props: IProps) {
    super(props);
    this.state = {
      mobile: this.props.userStore.self.mobile || '',
      code: '',
      timerCount: 0,
      timerTitle: '获取验证码',
      isCounting:false,
      isEnable: true,
      currentTimer:0,
    };
  }

  public componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  public componentWillUnmount() {
    this.endCountDown();
    this.setState({ timerCount:0 });

    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  public flage: boolean = false;
  public _handleAppStateChange = (nextAppState: any) => {
    if (nextAppState != null && nextAppState === 'active') {

      if (this.flage) {
        const nowTime = new Date().getTime();

        const date3 = Math.floor((nowTime - this.state.currentTimer) / 1000);
        const num = this.state.timerCount - date3;
        if (num > 0) {
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

  private getCode() {

    if (this.state.isEnable === false) {
      return;
    }

    const mobile = this.state.mobile;

    const rulelist: IRule[] = [
      {
        rex: (v: string) => {
          return v.length > 0;
        },
        value: mobile,
        message: '请输入手机号!',
      },
      {
        rex: RulesEnums.TELPHONE,
        value: mobile,
      },
    ];

    const errmsg = testList(rulelist);

    if (errmsg !== true) {
      return showToast(errmsg);
    }

    const params = {
      mobile:this.state.mobile,
      type:Body.TypeEnum.NUMBER_5,
    };

    this.props.userStore.requestBindPhoneVerifyCode(params).then((data: any) => {
      const { verifyCode } = data;
      this.setState({ isEnable:false, isCounting:true });
      showToast(`验证码已发送到您的手机，请注意查收`);
      this.startCountDown(60);
    }).catch(errorHandleThen((rs) => {
      this.endCountDown();
      this.setState({
        timerCount: 0,
        timerTitle:'获取验证码',
        isEnable: true,
        isCounting:false,
      });
    }));

  }

  private onCodeChange = (text: string) => {
    this.setState({
      code:text ,
    });
  }

  private onTelChange = (text: string) => {
    this.setState({
      mobile: text ,
    });
  }

  public swapAction() {
    const code = this.state.code;
    const mobile = this.state.mobile;
    const rulelist: IRule[] = [
      {
        rex: (v: string) => {
          return v.length > 0;
        },
        value: mobile,
        message: '请输入手机号!',
      },
      {
        rex: RulesEnums.TELPHONE,
        value: mobile,
      },
      {
        rex: (v: string) => {
          return v.length > 0;
        },
        value: code,
        message: '请输入验证码!',
      },
      {
        rex: RulesEnums.VERIFYCODE,
        value: code,
      },
    ];

    const errmsg = testList(rulelist);

    if (errmsg !== true) {
      return showToast(errmsg);
    }

    const params = {
      mobile,
      verifyCode: code,
      type: 1, // 微信
      openId: this.props.userStore.wxUser.openid,
    };

    this.props.userStore.requestBindMobile(params)
    .then(() => {
      clearInterval(this.interval);
      return this.props.userStore.loginByWx(this.props.userStore.wxUser);
    })
    .then(() => {
      showToast('绑定手机号成功');
      this.props.navigation.navigate('Login_success'); 
    })
    .catch(errorHandle);

  }

  public render() {
    const getCode =  this.getCode.bind(this);
    const swapAction = this.swapAction.bind(this);
    const onCodeChange = this.onCodeChange.bind(this);

    const isEnableStyle = this.state.isEnable ? null : styles.FF3D4F;
    const borderStyle = this.state.isEnable ? styles.boderBlack : styles.borderGray;
    const { timerCount } = this.state;
    const timerTitle = timerCount > 0 ? `${timerCount}s` : '获取验证码';
    return(
        <View>
            <View style={styles.content}>
                <TextInput
                    style={styles.codetf}
                    placeholder='输入手机号'
                    placeholderTextColor='#C6C6CC'
                    onChangeText={this.onTelChange}
                    keyboardType='phone-pad'
                    maxLength={11}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                />
                <TouchableHighlight
                  style={[styles.codeBtn, borderStyle]}
                  onPress={getCode}
                  underlayColor={'rgba(0,0,0,0)'}
                >
                      <Text style={[styles.code, isEnableStyle]} >{timerTitle}</Text>
                </TouchableHighlight>
            </View>
            <Text style={styles.line}/>
            <View style={styles.content}>
                <TextInput
                    style={styles.codetf}
                    placeholder='输入验证码'
                    placeholderTextColor='#C6C6CC'
                    onChangeText={onCodeChange}
                    keyboardType='phone-pad'
                    maxLength={6}
                    underlineColorAndroid={'rgba(0,0,0,0)'}

                />
            </View>
            <Text style={styles.line}/>
            <TouchableHighlight
                onPress={swapAction}
                style={styles.submitBtn}
            >
                <Text style={styles.submitText}>下一步</Text>
            </TouchableHighlight>
        </View>);
  }

}

const styles = StyleSheet.create({
  top:{
    flexDirection:'row',
    alignItems:'baseline',
    justifyContent:'space-between',
    marginTop:19,
    height:40,
  },

  leftText:{
    marginLeft:26 ,
    color:'#1a1a1a',
    fontSize:setFontSize(16),
    fontWeight:'400',
  },
  middleText:{
    textAlign:'center',
    color:'#C6C6CC',
    fontSize:setFontSize(16),
    fontWeight:'400',
  },

  line:{
    backgroundColor:'#E6E6E6',
    height:scaleWidth(2),
    marginLeft:20,
    width:ScreenWidth - 40,
  },

  codetf:{
    height:48,
    marginLeft:20,
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
  borderGray:{
    borderColor: 'gray',
  },
  boderBlack:{
    borderColor: '#000000',
  },
  code:{
    fontSize:setFontSize(12),
    color:'#3c3b3b',
    fontWeight:'400',
  },

  submitBtn:{
    backgroundColor:'#1A1A1A',
    marginTop:23,
    marginLeft:20,
    marginRight:20,
    height:42,
    justifyContent:'center',
    alignItems: 'center',
    borderRadius:6,
  },
  submitText:{
    color:'#ffffff',
    fontSize:setFontSize(18),
    fontWeight:'400',
  },
  content:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  FF3D4F: {
    color: 'gray',
  },
});
