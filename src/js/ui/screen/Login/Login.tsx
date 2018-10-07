import { inject } from 'mobx-react/native';
import React from 'react';
import { AppState, Dimensions , Image, StyleSheet , Text, TouchableHighlight, View,TextInput,TouchableWithoutFeedback} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';


import { isIphone, isPhoneX, px2dp, scaleWidth, setFontSize } from 'js/helper/Adapter';

import { UserStore } from 'js/store/UserStore';

import { RulesEnums } from 'js/const/RulesKeys';

import { IRule, testList } from 'js/helper/Rules';
import {  showToast } from 'js/ui/components/Toast';
import { NavigationKeys } from 'js/const/NavigationKeys';
import { WxAuth } from 'js/helper/Auth2Login';
import { hideLoading, showLoading } from 'js/helper/Loading';
import { errorHandle } from 'js/helper/Respone';
import { appHeader } from 'js/ui/components/Navigation';
import FastImage from 'react-native-fast-image';


const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

enum LoginMode {
  Phone = 2, Password = 1, Wechat = 3,
}

interface IProps {
  navigation: NavigationScreenProp<any, any>;
  userStore: UserStore;
}

interface IState {
  mode: LoginMode;
  timerCount: number;
  timerTitle: string;
  isEnable: boolean;
  mobile: string;
  code: string;
  pwd: string;
  isClear: boolean;
  tmpMobile: string;
  isEdit: boolean;
  currentTimer: number;

}
const navHeight = isPhoneX ? 84 : 64 ;

@inject('userStore')
@appHeader('账号登录', {
  back: (navigation: any) => {
    navigation.navigate('Login_back');
  },
})
export class Login extends React.Component<IProps, IState> {

  private interval: number = 0;

  constructor(props: IProps) {
    super(props);
    this.state = {
      mode: LoginMode.Phone,
      timerCount: 0,
      timerTitle: '获取验证码',
      isEnable: false,
      mobile: '',
      code: '',
      pwd: '',
      isClear:false,
      tmpMobile:'',
      isEdit:false,
      currentTimer:0,

    };

    this.setCodeRef = this.setCodeRef.bind(this);
    this.setCodeRef = this.setCodeRef.bind(this);
    this.onTelInputSubmitEditing = this.onTelInputSubmitEditing.bind(this);
    this.onCodeInputSubmitEditing = this.onCodeInputSubmitEditing.bind(this);

  }

  public componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  public componentWillUnmount() {

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

    const COOL_DOWN =  time ? time :60;
    this.setState({ timerCount: COOL_DOWN });
    this.interval = setInterval(() => {
      const timer = this.state.timerCount - 1;
      if (timer <= 0) {
        this.endCountDown();
        this.setState({
          timerCount: 0,
          isEnable: true,
        });
      } else {
        this.setState({
          timerCount:timer,
          timerTitle: `${timer}s`,
          isEnable:false,
        });
      }
    },                          1000);
  }

  public _input ? = React.createRef<TextInput>();
  public clearText = () => {
    this.setState({ mobile:'', isClear:false ,  isEnable:false });
  }

  private codeInput?: any;
  private telInput?: any;

  public setCodeRef = (ref: any) => this.codeInput = ref;
  public setTelRef = (ref: any) => this.telInput = ref;

  public onTelInputSubmitEditing() {
    this.codeInput.focus();
  }

  public onCodeInputSubmitEditing() {
    this.loginAction();
  }

  public onWxLogin = () => {
    showLoading('登录中...', 3000);
    const wxAuth = new WxAuth();
    wxAuth.isAppInstalled()
    .then((isInstalled: boolean) => {
      if (isInstalled) {
        // 发送授权请求
        return wxAuth.sendAuthRequest()
        .then((user) => {
          this.props.userStore.updateWxUser(user);
          return this.props.userStore.loginByWx(user);
        });
      }
      showToast('您当前未安装微信');
    })
    .then(() => {
      // login success
      hideLoading();
      const want = this.props.navigation.getParam('want');
      if (want) {
        this.props.navigation.navigate(want);
      } else {
        this.props.navigation.navigate('Login_success');
        // this.props.navigation.navigate('Tabs');
      }
    })
    .catch((err: any) => {
      new Promise<any>((resolve, reject) => {
        if (!err || !err.json) {
          return reject(err);
        }
        
        err.json().then((errData: any) => {
          if (errData.errorCode !== 'EntityNotExist.Mobile') {
            return reject(err);
          }
          
          return resolve();
        });
      }).then(() => { 
        showToast('您当前未绑定手机号');
        this.props.navigation.navigate(NavigationKeys.BindPhoneScreen);
      }).catch(() => {
        errorHandle(err);
        console.log(err);
      });
    });
    
  }

  public render() {

    const changeBtnTitle  = this.state.mode === LoginMode.Phone ? '切换密码登录' : '切换验证码登录';
    const btnStyle = this.state.mode === LoginMode.Phone ? styles.codeBtn :styles.forgetBtn;
    const btnTextStyle = this.state.mode === LoginMode.Phone ? styles.code : styles.forgetText;
    const getCode = this.getCode.bind(this);
    const login = this.loginAction.bind(this);
    const { timerCount } = this.state;
    const timerTitle = timerCount > 0 ? `${timerCount}s` : '获取验证码';
    const codeTitle = this.state.mode === LoginMode.Phone ? timerTitle : '忘记密码';

    let isEnableStyle ;

    let borderStyle ;
    if (this.state.mode === LoginMode.Phone) {
      if (this.state.isEnable) {
        isEnableStyle =  styles.FF3D4F;
        borderStyle =  styles.redBorder ;
      } else {
        isEnableStyle = styles.defaultStyle;
        borderStyle =  styles.grayBoder ;

      }
    }

    const codeInputEl = (
        <TextInput
            ref={this.setCodeRef}
            style={styles.codetf}
            placeholder='请输入验证码'
            placeholderTextColor='#C6C6CC'
            onChangeText={this.onCodeChange}
            keyboardType='number-pad'
            secureTextEntry={false}
            maxLength={6}
            onSubmitEditing={this.onCodeInputSubmitEditing}
            underlineColorAndroid={'rgba(0,0,0,0)'}
        />
    );
    const pwdInputEl = (
        <TextInput
            ref={this.setCodeRef}
            style={styles.codetf}
            placeholder='请输入密码'
            placeholderTextColor='#C6C6CC'
            onChangeText={this.onPwdChange}
            secureTextEntry={true}
            maxLength={18}
            value={this.state.pwd}
            onSubmitEditing={this.onCodeInputSubmitEditing}
            underlineColorAndroid={'rgba(0,0,0,0)'}

        />
    );
    const clearBtn =  (
    <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={this.clearText} style={styles.clearBtn} >
    <Image source={require('img/delete.png')} style={styles.clear} />
    </TouchableHighlight>);
    const switchInputEl = this.state.mode === LoginMode.Phone ? codeInputEl : pwdInputEl;
    const switchClear = this.state.isClear ? clearBtn : null;
    const lineHieght = isIphone() && ScreenHeight > 667 ? styles.lineHeight :null;

    return (
          <View  style={{flexDirection:'column', justifyContent:'space-between',backgroundColor:'#fff',flex:1}}>
          <View style={{height:360,width:375}}>
            <FastImage source={require('img/logo.png')} style={styles.logo}/>
                 <View  style={styles.phoneView}>
                  <TextInput
                    ref={this.setTelRef}
                    style={styles.phonetf}
                    placeholder='手机号码'
                    placeholderTextColor='#C6C6CC'
                    onChangeText={this.onMobileChange}
                    keyboardType='number-pad'
                    maxLength={11}
                    value={this.state.mobile}
                    autoFocus={true}
                    onChange={this.onChange}
                    onSubmitEditing={this.onTelInputSubmitEditing}
                    underlineColorAndroid={'rgba(0,0,0,0)'}

                  />
                  {switchClear}
                </View>
                <View style={[styles.line, lineHieght]}/>
                <View style={styles.content}>
                  {switchInputEl}
                  <TouchableHighlight style={[btnStyle, borderStyle]} onPress={getCode} underlayColor={'rgba(0,0,0,0)'}>
                      <Text style={[btnTextStyle, isEnableStyle]} >{codeTitle}</Text>
                  </TouchableHighlight>
                </View>
                <View style={styles.line}/>
                <TouchableHighlight
                  onPress={login}
                  style={styles.loginBtn}
                >
                <Text style={styles.loginText}>登录</Text>
                </TouchableHighlight>
                <TouchableWithoutFeedback  onPress={this.changLogin} >
                  <View style={styles.changLoginView}>
                    <Text style={styles.changeLoginText}>{changeBtnTitle}</Text>
                    <FastImage source={require('img/triangle.png')} style={styles.changeLoginImage}/>
                  </View>
                </TouchableWithoutFeedback>
          </View>
          <View style={styles.bigScreenBottom}>
            < Image source={require('img/show.png')} style={styles.show}/>
            <TouchableHighlight  underlayColor={'rgba(0,0,0,0)'} onPress={this.onWxLogin}>
              <View>
                <FastImage source={require('img/WeChat.png')}style={styles.imageSize} />
              </View>
            </TouchableHighlight>
          </View>
        </View>
       
     );
  }

  public loginAction() {
    const { mobile, code, mode, pwd } = this.state;
    let info;
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
    if (mode === LoginMode.Password) {
      info = {
        mobile,
        type: mode,
        password: pwd,
      };
      rulelist.push({
        rex: (v: string) => {
          return v.length > 0;
        },
        value: pwd,
        message: '请输入密码!',
      });
      rulelist.push({
        rex: RulesEnums.PASSWORD,
        value: pwd,
      });
    } else {
      info = {
        mobile,
        type: mode,
        verifyCode: code,
      };
      rulelist.push({
        rex: (v: string) => {
          return v.length > 0;
        },
        value: code,
        message: '请输入验证码!',
      });
      rulelist.push({
        rex: RulesEnums.VERIFYCODE,
        value: code,
      });

    }

    const errmsg = testList(rulelist);

    if (errmsg !== true) {
      return showToast(errmsg);
    }

    showLoading('登录中...', 5000);

    this.props.userStore.login(info).then(() => {
      hideLoading();
      const want = this.props.navigation.getParam('want');
      if (want) {
        this.props.navigation.navigate(want);
      } else {
        this.props.navigation.navigate('Login_success');
        // this.props.navigation.navigate('Tabs');
      }
    }).catch((rs: Response) => {
      hideLoading();
      rs.json().then((err: any) => {
        const c = err.data && err.data.limit;
        if (c) {
          showToast(`登录失败，您今天还有${c}次机会`);
        } else {
          showToast(err.errorCode);
        }
      });
    });
  }

  private changLogin = () => {
    const targetMode = this.state.mode === LoginMode.Phone ? LoginMode.Password : LoginMode.Phone;

    if (targetMode === LoginMode.Password) {
      this.setState({
        mode: targetMode,
        isEnable:true,
      });
      return;
    }
    let isNO: boolean = false;
    if (this.state.mobile.length > 0 && this.state.isEnable === true) {
      isNO = true;
    }
    this.setState({
      mode: targetMode,
      isEnable:isNO,
    });
  }
  private onChange = () => {
    const { mobile } = this.state;
    if (mobile.length === 1 && this.state.isEdit) {
      this.endCountDown();
      this.setState({
        isEdit:false,
        timerCount:0,
        isClear:false,
        isEnable:false,
      });
    }

  }

  private onMobileChange = (text: string) => {
    this.setState({ mobile: text });
    if (this.state.mode === LoginMode.Phone) {

      if (text.length === 11) {
        const rulelist: IRule[] = [
          {
            rex: RulesEnums.TELPHONE,
            value: text,
          },
        ];
        const errmsg = testList(rulelist);

        if (errmsg !== true) {
          return showToast(errmsg);
        }
        this.restGetCode();
        this.setState({ isEnable:true,  isClear:true, isEdit:true });
      }
    }
  }
  private onCodeChange = (text: string) => {
    this.setState({ code: text });
  }
  private onPwdChange = (text: string) => {
    this.setState({ pwd: text });
  }

  private getCode() {

    if (this.state.mode === LoginMode.Phone) {
      if (this.state.isEnable === false) {
        return;
      }
      this.codeInput.focus();
      this.props.userStore.requestLoginVerifyCode(this.state.mobile)
      .then((data: any) => {
        const { verifyCode } = data;
        showToast(`验证码已发送到您的手机，请注意查收`);
        this.setState({ isEnable:false , tmpMobile:this.state.mobile });
        this.startCountDown(60);
      },    (rs: any) => {
        showToast(`验证码发送失败`);
        this.endCountDown();
        this.setState({
          timerCount: 0,
          isEnable: true,
        });
      }).catch((err: Error) => {
        console.log(err.message);
      });
    } else {
      this.props.navigation.navigate('SetPassword');
    }
  }

  public restGetCode() {
    if (this.state.mobile !== this.state.tmpMobile) {
      clearInterval(this.interval);
      this.setState({
        timerCount: 0,
        isEnable:true,
      });
    }
  }

}

const styles = StyleSheet.create({
  backImage:{
    height:64,
    width:44,
    alignItems:'center',
    justifyContent:'center',
  },
  pageTitle:{
    marginTop:24,
    textAlign:'center',
    textAlignVertical:'center',
    flex:1,
    left:-20},

  continer:{
    backgroundColor: '#fff',
    flex:1,
  },
  logo:{
    alignSelf: 'center',
    marginTop:px2dp(61),
    width:px2dp(201),
    height:px2dp(97),
  },
  phoneView:{
    height:px2dp(90),
    width:ScreenWidth - 46,
    flexDirection:'row',
    alignItems:'center',
    marginTop:px2dp(110),
    marginLeft:px2dp(45),

  },
  clear:{
    width:16,
    height:16,
    resizeMode:'stretch',
  },

  clearBtn:{
    width:25,
    height:25,
    alignItems: 'center',
    justifyContent:'center',
  },

  phonetf:{
    height:px2dp(99),
    width:ScreenWidth - 46 - 40,
    fontSize:setFontSize(15),
    fontWeight:'400',
    marginBottom:-6,
  },
  line:{
    backgroundColor:'#333333',
    height:px2dp(1),
    marginLeft:px2dp(40),
    width:px2dp(670),
  },
  content:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    width:px2dp(670),

    marginLeft:22,
  },
  codetf:{
    height:px2dp(99),
    flex:3,
    fontSize:setFontSize(15),
    fontWeight:'400',

  },
  codeBtn:{
    height:px2dp(56),
    width:px2dp(168),
    marginRight:28,
    borderWidth: scaleWidth(1),
    borderColor: '#000000',
    borderRadius: 2,
    justifyContent:'center',
    alignItems: 'center',
    flex:1

  },

  forgetBtn:{
    height:30,
    width:86,
    marginRight:28,
    borderWidth: 0,
    borderColor: '#000000',
    borderRadius: 2,
    justifyContent:'center',
    alignItems: 'center',
    flex:1,
  },
  forgetText:{
    fontSize:setFontSize(14),
    color:'#999',
    fontWeight:'400',
  },
  code:{
    fontSize:setFontSize(12),
    color:'#3c3b3b',
    fontWeight:'400',
    alignSelf:'center',
  },
  signText:{
    top:6,
    fontSize:setFontSize(12),
    color:'#888',
    textAlign:'center',
    fontWeight:'400',
  },
  loginBtn:{
    backgroundColor:'#1A1A1A',
    marginTop:50,
    marginLeft:px2dp(40),
    width:px2dp(670),
    height:px2dp(84),
    justifyContent:'center',
    alignItems: 'center',
  },
  loginText:{
    color:'#ffffff',
    fontSize:setFontSize(16),
    fontWeight:'400',
  },
  changLoginView:{
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop:10,
    height:40,
    width:px2dp(670),
    marginLeft:20,
  },
  changeLoginText:{
    color:'#333',
    fontSize:setFontSize(14),
    fontWeight:'400',
    alignSelf:'center',

  },

  changeLoginImage:{
    left:8,
    width:7,
    height:8,
    alignSelf:'center',

  },
  show:{
    height:px2dp(27),
    width:ScreenWidth - 40,
    marginLeft:px2dp(40),
    marginRight:20,
  },
  imageSize:{
    marginTop:px2dp(31),
    width:px2dp(96),
    height:px2dp(96),
    alignSelf:'center',
  },

  FF3D4F: {
    color: '#FF3D4F',
  },
  defaultStyle:{
    color:'gray',
  },
  redBorder:{
    borderColor:'#FF3D4F',
  },
  grayBoder:{
    borderColor:'gray',
  },

  bigScreenBottom:{

    marginBottom:10,
    height:80,

  },
  lineHeight:{
    height:px2dp(0.5),
  },

});
