import { createStackNavigator } from 'react-navigation';

import { Login, SetPassword } from '../screen/Login';
import { MoreSettings } from '../screen/Mine';
import { ModifyNameScreen } from '../screen/Mine/ModifyNameScreen';

import { navigationConfig } from './navigationConfig';

export const LoginStack = createStackNavigator({
  Login :{
    screen :Login,
  },
  SetPassword:{
    screen: SetPassword,
  },
  MoreSettings:{
    screen:MoreSettings,
  },
  ModifyNameScreen:{
    screen: ModifyNameScreen,
  },

},                                             navigationConfig);
