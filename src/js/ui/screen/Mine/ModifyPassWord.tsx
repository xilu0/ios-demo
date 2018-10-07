import { setFontSize } from 'js/helper/Adapter';
import React from 'react';
import { Dimensions,StyleSheet, Text, TouchableHighlight, View,TextInput } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { getStore } from 'js/helper/Store';

import { RulesEnums } from 'js/const/RulesKeys';
import { errorHandle } from 'js/helper/Respone';
import { test } from 'js/helper/Rules';
import { showToast } from 'js/ui/components/Toast';
import { appHeader } from 'js/ui/components/Navigation';

const ScreenWidth = Dimensions.get('window').width;

interface IProps {
  navigation: NavigationScreenProp<any, any>;
}

@appHeader('修改登录密码')
export class ModifyPassWord extends React.Component<IProps, any> {
 
  public state = {
    newPwd: '',
    newPwd2: '',
    oldPwd: '',
  };

  public constructor(props: any) {
    super(props);
  }

  public onOldPwdChange(oldPwd: string) {
    this.setState({ oldPwd });
  }
  public onNewPwdChange(newPwd: string) {
    this.setState({ newPwd });
  }
  public onNewPwd2Change(newPwd2: string) {
    this.setState({ newPwd2 });
  }
  public onSubmit() {
    const { newPwd, newPwd2, oldPwd } = this.state;
    if (newPwd2 !== newPwd) {
      return showToast('两次输入的密码不一致');
    }

    const errmsg = test({
      rex: RulesEnums.PASSWORD,
      value: newPwd,
    });

    if (errmsg !== true) {
      return showToast(errmsg);
    }

    const { userStore } =  getStore();
    userStore.requestUpdateLoginPassword(oldPwd, newPwd).then((rs) => {
      showToast('修改密码成功');
      this.props.navigation.goBack();
    }).catch(errorHandle);
  }
  public render() {
    const onOldPwdChange = this.onOldPwdChange.bind(this);
    const onNewPwdChange = this.onNewPwdChange.bind(this);
    const onNewPwd2Change = this.onNewPwd2Change.bind(this);
    const onSubmit = this.onSubmit.bind(this);
    return (
      <View style={{ backgroundColor:'#fff' }}>
        <TextInput
            style={styles.codetf}
            placeholder='输入旧密码'
            placeholderTextColor='#C6C6CC'
            onChangeText={onOldPwdChange}
            secureTextEntry={true}
            maxLength={16}
            value={this.state.oldPwd}
            underlineColorAndroid={'rgba(0,0,0,0)'}
        />
        <Text style={styles.line}/>
        <TextInput
            style={styles.codetf}
            placeholder='输入新密码'
            placeholderTextColor='#C6C6CC'
            onChangeText={onNewPwdChange}
            secureTextEntry={true}
            maxLength={16}
            value={this.state.newPwd}
            underlineColorAndroid={'rgba(0,0,0,0)'}

        />
        <Text style={styles.line}/>
        <View style={styles.content}>
          <TextInput
            style={styles.tf}
            placeholder='确认新密码'
            placeholderTextColor='#C6C6CC'
            onChangeText={onNewPwd2Change}
            secureTextEntry={true}
            maxLength={16}
            value={this.state.newPwd2}
            underlineColorAndroid={'rgba(0,0,0,0)'}

          />
          <Text style={styles.code}>至少8位数字和字母组合</Text>
        </View>
        <Text style={styles.line}/>
        <TouchableHighlight
            onPress={onSubmit}
            style={styles.submitBtn}
        >
            <Text style={styles.submitText}>确认修改</Text>
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
    top:10,
    marginLeft:20,
    width:ScreenWidth - 46,
  },
  line:{
    backgroundColor:'#E6E6E6',
    height:1,
    marginLeft:20,
    width:ScreenWidth - 40,
  },
  content:{
  
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  codetf:{
    height:48,
    marginLeft:20,
  },

  tf:{
    height:48,
    marginLeft:20,
   flex:1,
  },
  code:{
    fontSize:setFontSize(12),
    color:'#3c3b3b',
    marginRight:20,
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
});
