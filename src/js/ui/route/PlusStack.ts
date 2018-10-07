import { Search } from './../screen/Merchant/Search';
/* tslint:disable */
import { createStackNavigator } from 'react-navigation';
import { MemberIntrod } from '../screen/Mine/MemberIntrod';
import { MemberOpen } from '../screen/Mine/MemberOpen';
import { MemberPay } from '../screen/Mine/MemberPay';
import { MemberTrial } from '../screen/Mine/MemberTrial';
import { PaySuccess } from '../screen/Mine/PaySuccess';
import { TransitionConfiguration } from './navigationConfig';

export const PlusStack = createStackNavigator({
  MemberIntrod:{
    screen:MemberIntrod,
  },
  MemberTrial:{
    screen: MemberTrial,
  },
  MemberOpen:{
    screen:MemberOpen,
  },
  MemberPay:{
    screen:MemberPay,
  },
  PaySuccess:{
    screen:PaySuccess,
  },
 
}, {
  transitionConfig: TransitionConfiguration,
});
PlusStack.navigationOptions = ({ navigation }: any) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

