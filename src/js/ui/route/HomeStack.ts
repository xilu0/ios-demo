import { Search } from './../screen/Merchant/Search';
/* tslint:disable */
import { createStackNavigator } from 'react-navigation';

import { AllCategories } from '../screen/Home/AllCategories'; 
import { Home } from '../screen/Home/Home';
import { WebViewScreen } from '../screen/Home/WebViewScreen';
import { SelectCity } from '../screen/Home/SelectCity';
import { TransitionConfiguration } from './navigationConfig';
import {ScanScreen} from '../screen/Home/ScanScreen';
export const HomeStack = createStackNavigator({
  Home :{
    screen: Home,
    navigationOptions:{
      header: null,
    },
  },
  SelectCity:{
    screen:SelectCity,
    navigationOptions:{
      header: null,
    },
  },
  Search: {
    screen: Search,
    navigationOptions:{
      header: null,
    },
  },
  AllCategories:{
    screen:AllCategories,
    navigationOptions:{
      header: null,
    },
  },
  WebViewScreen:{
    screen:WebViewScreen,

  },
  ScanScreen:{
    screen:ScanScreen,
  },
  
 
}, {
  transitionConfig: TransitionConfiguration,
});
HomeStack.navigationOptions = ({ navigation }: any) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

