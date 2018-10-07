
import {
  createStackNavigator,
} from 'react-navigation';
import { ReviewPage } from '../screen/Review/ReviewPage';
export const ReviewStack = createStackNavigator({
  ReviewPage :{
    screen: ReviewPage,
    navigationOptions: {
      header: null,
    },
  },
});
