import { UserStore } from 'js/store/UserStore';
import React from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { inject } from 'mobx-react/native';

const ScreenWidth = Dimensions.get('window').width;

interface IProps {
  navigation: NavigationScreenProp<IProps>;
  userStore: UserStore;
}

@inject('userStore')

export class BottomButton extends React.Component<IProps, any> {

  public render() {
    const logout = this.btnAction.bind(this);
    return(
      <TouchableHighlight
        onPress={logout}
        style={styles.btn}
      >
        <Text style={styles.text}>退出登录</Text>
      </TouchableHighlight>
    );
  }
  public btnAction() {
    Alert.alert(
      '温馨提示',
      '确认退出登录',
      [
      { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: '确定', onPress: () =>
        this.props.userStore.logout().then((rs: any) => {
          this.props.navigation.goBack();
        }).catch(console.log)},
      ]);

  }

}

const styles = StyleSheet.create({
  btn:{
    width:ScreenWidth - 40,
    left:20,
    height:42,
    backgroundColor:'#000',
    borderRadius:6,
    marginTop:34,
    justifyContent:'center',
    alignItems: 'center',
  },

  text:{
    fontSize:16,
    color:'#fff',
  },

});
