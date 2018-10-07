import {
  createStackNavigator,
} from 'react-navigation';
import { Search } from '../screen/Merchant/Search';
import { Nearby } from '../screen/Nearby';
export const NearStack = createStackNavigator({
  Nearby :{
    screen: Nearby,
  },
  Search: {
    screen: Search,
    navigationOptions:{
      header: null,
    },
  },
});
