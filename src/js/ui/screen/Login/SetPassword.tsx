
import { inject } from 'mobx-react/native';
import React from 'react';

import {
  AppState,
   Dimensions,
   StyleSheet,
   Text,
   TouchableHighlight,
   View,
   TextInput, } from 'react-native';

import { RulesEnums } from 'js/const/RulesKeys';
import { px2dp } from 'js/helper/Adapter';
import { errorHandle, errorHandleThen } from 'js/helper/Respone';
import { IRule, testList } from 'js/helper/Rules';
import { UserStore } from 'js/store/UserStore';
import {  showToast } from 'js/ui/components/Toast';
import { NavigationScreenProp } from 'react-navigation';
import { appHeader } from 'js/ui/components/Navigation';


const ScreenWidth = Dimensions.get('window').width;

interface IProps {
  navigation: NavigationScreenProp<IProps, any>;
  userStore: UserStore;

}

@inject('userStore')
@appHeader('设置新密码')
export class SetPassword extends React.Component<IProps, any> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      mobile: '',
      code: '',
      new_pwd: '',
      timerCount: 0,
      timerTitle: '获取验证码',
      counting: false,
      selfEnable: false,
      isEdit:false,
      currentTimer:0,
    };

  }

  public goBack() {
    this.props.navigation.goBack();
  }

  private interval: number = 0;

  public flage: boolean = false;

  public componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  public componentWillUnmount() {

    AppState.removeEventListener('change', this._handleAppStateChange);
  }

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

  private startCountDown(time: number) {
    const COOL_DOWN = time ? time :60;
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

  private endCountDown() {
    if (this.interval > 0) {
      clearInterval(this.interval);
      this.interval = 0;
    }
  }

  private onChange = () => {
    const { mobile } = this.state;
    if (mobile.length === 1 && this.state.isEdit) {
      this.endCountDown();
      this.setState({
        isEdit:false,
        timerCount:0,
        isEnable:false,
      });
    }

  }

  private onMobileChange = (text: string) => {
    this.setState({ mobile: text });
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
      this.setState({ isEnable:true,  isEdit:true });
    }

  }
  private onCodeChange = (text: string) => {
    this.setState({ code: text });
  }
  private onNewPwdChange = (text: string) => {
    this.setState({ new_pwd: text });
  }
  public submitAction() {

    const { code, new_pwd , mobile } = this.state;

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

    rulelist.push({
      rex: (v: string) => {
        return v.length > 0;
      },
      value: new_pwd,
      message: '请输入密码!',
    });
    rulelist.push({
      rex: RulesEnums.PASSWORD,
      value: new_pwd,
    });

    const errmsg = testList(rulelist);

    if (errmsg !== true) {
      return showToast(errmsg);
    }
    const parms = {
      code,
      mobile,
      password:new_pwd,
    };
    this.props.userStore.requestRestPassWord(parms).then((rs) => {
      showToast('修改成功！请登录');
      this.props.navigation.goBack();
    }).catch(errorHandle);
  }

  public restGetCode() {
    if (this.state.mobile !== this.state.tmpMobile) {
      clearInterval(this.interval);
      this.setState({
        timerCount: 0,
        selfEnable:true,
      });
    }
  }

  public getCode() {
    if (this.state.timerTitle === '获取验证码') {
      this.props.userStore.requestResetPasswordVerifyCode(this.state.mobile).then((data: any) => {
        const { verifyCode } = data;
        showToast(`验证码已发送到您的手机，请注意查收`);
        this.setState({ counting: true, selfEnable:false, tmpMobile:this.state.mobile });
        this.startCountDown(60);
        console.log(verifyCode);
      }).catch(errorHandleThen(() => {
        this.endCountDown();
        this.setState({
          timerCount: 0,
        });
      }));
    }

  }
  public render() {

    const submit = this.submitAction.bind(this);
    const onMobileChange = this.onMobileChange.bind(this);
    const onCodeChange = this.onCodeChange.bind(this);
    const onNewPwdChange = this.onNewPwdChange.bind(this);
    const getCode = this.getCode.bind(this);
    const isEnableStyle = this.state.selfEnable ? null : styles.FF3D4F;
    const borderStyle = this.state.selfEnable ? styles.blackBorder :styles.grayBorder;
    const { timerCount } = this.state;
    const timerTitle = timerCount > 0 ? `${timerCount}s` : '获取验证码';
    return (
    // <View style={styles.continer}>

      <View style={{ flex:1, backgroundColor:'#fff' }}>
        <TextInput
          style={styles.phonetf}
          placeholder='手机号码'
          placeholderTextColor='#C6C6CC'
          onChangeText={onMobileChange}
          keyboardType='phone-pad'
          maxLength={11}
          onChange={this.onChange}
          underlineColorAndroid={'rgba(0,0,0,0)'}
        />
        <View style={styles.line}/>
        <View style={styles.content}>
        <TextInput
          style={styles.codetf}
          placeholder='请输入验证码'
          placeholderTextColor='#C6C6CC'
          onChangeText={onCodeChange}
          keyboardType='phone-pad'
          maxLength={6}
          underlineColorAndroid={'rgba(0,0,0,0)'}

        />
          <TouchableHighlight style={[styles.codeBtn, borderStyle]} onPress={getCode} underlayColor={'rgba(0,0,0,0)'}>
              <Text style={[styles.code, isEnableStyle]}  >{timerTitle}</Text>
          </TouchableHighlight>
          </View>
        <View style={styles.line}/>
        <TextInput
          style={styles.pwtf}
          placeholder='请输入新密码'
          placeholderTextColor='#C6C6CC'
          onChangeText={onNewPwdChange}
          secureTextEntry={true}
          underlineColorAndroid={'rgba(0,0,0,0)'}

        />
        <View style={styles.line}/>
        <TouchableHighlight
            onPress={submit}
            style={styles.submitBtn}
        ><Text style={styles.submitText}>提交密码</Text>
        </TouchableHighlight>
        </View>
   );
  }

}

const styles = StyleSheet.create({
  continer:{
    backgroundColor:'#fff'
  },
  backImage:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
  },
  pageTitle:{
    marginTop:24,
    textAlign:'center',
    textAlignVertical:'center',
    flex:1,
    left:-20},
  phonetf:{
    height:px2dp(98),
    marginLeft:px2dp(45),
    width:ScreenWidth - 46,
    fontSize:px2dp(32),
    fontWeight:'400',
  },
  line:{
    backgroundColor:'#E6E6E6',
    height:px2dp(2),
    marginLeft:px2dp(40),
    width:px2dp(670),
  },
  content:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  codetf:{
    height:px2dp(98),
    marginLeft:px2dp(40),
    fontSize:px2dp(32),
    fontWeight:'400',
    flex:3,
  },
  pwtf:{
    height:px2dp(98),
    marginLeft:px2dp(40),
    fontSize:px2dp(32),
    fontWeight:'400',
  },
  codeBtn:{
    height:px2dp(56),
    width:px2dp(168),
    marginRight:26,
    borderWidth: px2dp(1),
    borderColor: '#000000',
    borderRadius: px2dp(4),
    justifyContent:'center',
    alignItems: 'center',
    flex:1,
  },
  code:{
    fontSize:12,
    color:'#3c3b3b',
  },
  submitBtn:{
    backgroundColor:'#1A1A1A',
    marginTop:px2dp(46),
    marginLeft:px2dp(40),
    marginRight:px2dp(40),
    height:px2dp(84),
    justifyContent:'center',
    alignItems: 'center',
  },

  submitText:{
    color:'#ffffff',
    fontSize:px2dp(32),
    fontWeight:'400',
  },
  FF3D4F: {
    color: 'gray',
  },
  blackBorder:{
    borderColor:'black',
  },
  grayBorder:{
    borderColor:'gray',
  },
});
