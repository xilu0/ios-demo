
import { F, W } from 'js/helper/UI';
import { Platform, ToastAndroid } from 'react-native';
import Toast from 'react-native-toast-native';

export const showToast = (text: string|boolean, message: string = '') => {
  const isBoolType = typeof text === 'boolean';
  let content: string;
  if (!isBoolType) {
    content = text.toString();
  } else if (text === true) {
    content = message;
  } else {
    return;
  }

  console.log(content);
  const style = {
    backgroundColor: '#88484848',
    width: W(300),
    height: 50,
    borderRadius: 15,
    color: '#FFFFFF',
    fontSize: F(15),
    lineHeight: 2,
  };
  Platform.OS === 'ios' ?
  Toast.show(
    content,
    Toast.LONG,
    Toast.CENTER,
    style,
  )
    :
  ToastAndroid.showWithGravity(
   content,
   ToastAndroid.LONG,
   ToastAndroid.CENTER,
  );

};
