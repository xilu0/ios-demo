import React from 'react';
import {  StyleSheet, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { SwapPhoneView } from './SwapPhoneView';
import { UserStore } from 'js/store/UserStore';
import { appHeader } from 'js/ui/components/Navigation';

interface IProps {
  navigation: NavigationScreenProp<any>;
  userStore: UserStore;
}

@appHeader('换绑手机号')
export class SwapPhoneScreen extends React.Component<IProps> {

  public constructor(props: any) {
    super(props);
  }

  public render() {
    return(
    <View style={{flex:1, backgroundColor:'#fff' }}>
    <SwapPhoneView {...this.props}/>
    </View>
    );
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
});
