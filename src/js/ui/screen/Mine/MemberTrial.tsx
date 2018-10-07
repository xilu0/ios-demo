import {  px2dp } from 'js/helper/Adapter';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Dimensions, StyleProp, StyleSheet, Text,  View, ViewStyle } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { navigate } from 'js/helper/navigate';
import { F, W } from 'js/helper/UI';
import { UserStore } from 'js/store/UserStore';
import { Colors } from 'js/style/colors';
import { showToast } from 'js/ui/components/Toast';
import { appHeader } from 'js/ui/components/Navigation';
import { TrialButton } from './TrialButton';
import { TrialListItem } from './TrialListItem';

interface IProps {
  navigation: NavigationScreenProp<any>;
  userStore: UserStore;
  name?: string;
  picPath?: string;
  style?: StyleProp<ViewStyle>;
}

// const ITEM_HEIGHT = W(184);
const ScreenWidth = Dimensions.get('window').width;

@appHeader('', {
  headerStyle: {
    borderBottomWidth: 0,
    backgroundColor: '#FFF',
  },
})

@inject('userStore')
@observer
export class MemberTrial extends React.Component<IProps> {
  
  constructor(props: IProps) {
    super(props);
  }

  public goIntrod = () => {
    navigate(NavigationKeys.MemberIntrod);
  }

  private trialContent = [
    {
      leftTitle:'购买套餐',
      rightTitle:'PLUS会员',
    },
    {
      leftTitle:'实付金额',
      rightTitle:'￥0,￥15',
    },
  ];
  private bottomDesc = [
    '开通之后立即生效',
    '一个账号仅可以领取一次试用会员试用资格',
  ];
  public confirmTrial = () => {
    this.props.userStore.requestSubmitFreePlusOrder().then((val: boolean) => {
      if (val) {
        showToast('领取成功');
        navigate('Profile');
      }
    });
  }
  public render = () => {
    return (
        <View style={styles.bgF}>
          <View style={styles.plusTitle}>
            <Text style={styles.title}>试用PLUS会员</Text>
          </View>
          <View>
            <TrialListItem
              navigation={this.props.navigation}
              data={this.trialContent}
              bottomDesc={this.bottomDesc}
            />
            <View style={styles.center}>
              <TrialButton
                userStore={this.props.userStore}
                navigation={this.props.navigation}
                name={'立即试用'}
                otherStyle={{ marginTop: W(40), width: W(320) }}
                callback={this.confirmTrial}
              />
            </View>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  bgF:{
    backgroundColor:'#fff',
    flex:1,
  },
  plusTitle:{
    paddingLeft: W(23),
    paddingTop: W(18),
    paddingBottom: W(18),
    backgroundColor:'#FFF',
  },
  container: {
    flex: 1,
    paddingLeft: W(15),
    paddingRight: W(23),
    backgroundColor: '#FFF',
    borderColor: '#ccc',

  },
  title:{
    fontSize: F(24),
    color: Colors.TITLE_BLACK,
    fontWeight: 'bold',
  },
  memberContent:{
    paddingTop: W(10),
    paddingBottom: W(10),
    width: px2dp(145),
  },
  plusPic:{
    height: px2dp(365),
    width: px2dp(690),
  },
  center: {
    justifyContent:'center',
    alignItems: 'center',
  },
});
