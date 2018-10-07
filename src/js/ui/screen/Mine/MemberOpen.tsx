import { NavigationKeys } from 'js/const/NavigationKeys';
import { px2dp,  } from 'js/helper/Adapter';
import { navigate } from 'js/helper/navigate';
import { F, W } from 'js/helper/UI';
import { UserStore } from 'js/store/UserStore';
import { Colors } from 'js/style/colors';
import { showToast } from 'js/ui/components/Toast';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { PlusMemberType } from 'js/api/api';
import { appHeader } from 'js/ui/components/Navigation';
import { TrialButton } from './TrialButton';
import { TrialWays } from './TrialWays';

interface IProps {
  navigation: NavigationScreenProp<any>;
  userStore: UserStore;
  name?: string;
}
interface IPlusTyes {
  type: number;
  description: string;
  originalPrice: number;
  currentPrice: number;
  days: number;
}
interface IExtPlusMemberType extends PlusMemberType {
  isActive: boolean;
}
const ITEM_HEIGHT = W(184);

@appHeader('', {
  headerStyle: {
    borderBottomWidth: 0,
    backgroundColor: '#FFF',
  },
})
@inject('userStore')
@observer
export class MemberOpen extends React.Component<IProps> {
  public title: string = '开通';

  constructor(props: IProps) {
    super(props);
    this.title = props.navigation.getParam('title');
  }

  public toPay = () => {
    const { plusTypes } = this.props.userStore;
    const filterActive = plusTypes.filter((item: IExtPlusMemberType) => item.isActive);
    const [{ currentPrice, type }] = filterActive.length > 0 ?
      plusTypes.filter((item: IExtPlusMemberType) => item.isActive) :
      [{ currentPrice:undefined, type:undefined }];
    if (type && currentPrice) {
      navigate(NavigationKeys.MemberPay, { currentPrice, type });
    } else {
      showToast('请任意选择一种会员套餐');
      return false;
    }
  }

  public getItemLayout(data: any[] | null, index: number) {
    return { index, length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index };
  }

  private bottomDesc = [
    '续费后会员有效期顺延至',
  ];
  
  public render() {
    const props = this.props;
    const { plusTypes } = props.userStore;
    return (
      <View style={{ backgroundColor:'#fff', flex:1 }}>
        <View style={styles.plusTitle}>
          <Text style={styles.title}>{this.title}{'PLUS会员'}</Text>
        </View>
        <View style={styles.bgF}>
          <TrialWays
            userStore={this.props.userStore}
            navigation={this.props.navigation}
            bottomDesc={this.bottomDesc}
          />
          <TrialButton
            userStore={this.props.userStore}
            navigation={this.props.navigation}
            name={'立即' + this.title}
            otherStyle={{ marginTop: W(30) }}
            callback={this.toPay}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  plusTitle:{
    paddingLeft: W(15),
    paddingTop: W(18),
    paddingBottom: W(18),
    backgroundColor:'#FFF',
  },
  bgF:{
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems: 'center',
  },
  // container: {
  //   flex: 1,
  //   paddingLeft: W(15),
  //   paddingRight: W(23),
  //   backgroundColor: '#FFF',
  //   borderColor: '#ccc',
  // },
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
});
