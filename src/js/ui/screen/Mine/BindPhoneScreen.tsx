import React from 'react';
import {View} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { BindPhoneView } from './BindPhoneView';

import { UserStore } from 'js/store/UserStore';
import { appHeader } from 'js/ui/components/Navigation';

interface IProps {
  navigation: NavigationScreenProp<any>;
  userStore: UserStore;
}

@appHeader('绑定手机号')
export class BindPhoneScreen extends React.Component<IProps> {

  public constructor(props: any) {
    super(props);
  }

  public render() {
    return(
    <View style={{ backgroundColor:'#fff' }}>
    <BindPhoneView {...this.props}/>
    </View>
    );
  }

}
