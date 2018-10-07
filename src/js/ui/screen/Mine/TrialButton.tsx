import { W } from 'js/helper/UI';
import { UserStore } from 'js/store/UserStore';
import { LinerGradientButton } from 'js/ui/components/Common/LinerGradientButton';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

type pressFun = () => void;

interface IStyles {
  [propName: string]: any;
}
interface IProps {
  navigation: NavigationScreenProp<any>;
  userStore: UserStore;
  name: string;
  callback?: pressFun;
  styles?: object;
  otherStyle?: object;
  textStyle?: object;
}

export class TrialButton extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }
  private static defaultProps = {
    name: '登录',
  };
  public render() {
    const props = this.props;
    return(
      <LinerGradientButton
        locations={[0.3, 1]}
        colors={['#F6E8DB', '#F0C894']}
        buttonStyles={[styles.btn, props.otherStyle]}
        textStyle={[props.textStyle, styles.text]}
        text={props.name}
        onPress={props.callback}
      />
      // <View style={{ flex:1 }}>
      //   <Image source={require('img/buttonPic.png')} style={styles.buttonPic}/>
      //   <TouchableOpacity
      //     onPress={props.callback}
      //     activeOpacity={0.75}
      //     // style={styles.btn}
      //   >
      //     <Text style={props.textStyle}>{props.name}</Text>
      //   </TouchableOpacity>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonPic:{
    // position:'relative',
    width:(400),
    height:(68),
  },
  btn:{
    // position:'absolute',
    width: W(345),
    height:W(50),
    borderRadius: W(80),
    justifyContent:'center',
    alignItems: 'center',
  },

  text:{
    fontSize:16,
    color:'#9A6F44',
  },
});
