
import { navigate } from 'js/helper/navigate';
import { F, W } from 'js/helper/UI';
import { appHeader } from 'js/ui/components/Navigation';
import _ from 'lodash';
import { observer } from 'mobx-react/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import FastImage from 'react-native-fast-image';


interface IRules {
  title: string;
  index: number;
  content: string;
}
interface IProps {
  navigation: NavigationScreenProp<any, any>;
  rules: IRules[];
}

@appHeader('', {
  headerStyle: {
    borderBottomWidth: 0,
    backgroundColor: '#FFF',
  },
})
@observer
export class PaySuccess extends React.Component<IProps, any> {
  public currentPrice:number;
  constructor(props: IProps) {
    super(props);
    this.currentPrice = props.navigation.getParam('currentPrice');
  }

  public onPress = () => {
    navigate('Profile');
  }
  public render = () => {
    const props = this.props;
    const rules = props.rules;

    return (
      <View style={styles.container}>
        <View style={styles.midView}>
          <FastImage source={require('img/plusMember/payPic.png')} style={styles.payPic}/>
          <Text style={[styles.payText, styles.mt_12]}>支付成功</Text>
          <View style={styles.priceView}>
            <Text style={styles.priceIdent}>￥</Text>
            <Text style={styles.priceText}>{this.currentPrice}</Text>
          </View>
        </View>
        <View style={styles.btnView}>
          <TouchableOpacity 
            onPress={this.onPress} 
            activeOpacity={0.75}
            style={styles.btn}
          >
            <Text style={styles.payText}>完成</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    position:'relative',
    backgroundColor:'#fff',
  },
  midView:{
    marginTop: W(40),
    alignItems: 'center',
  },
  mt_12:{
    marginTop: W(12),
  },
  priceView:{
    flexDirection:'row',
    marginTop: W(40),
  },
  payPic:{
    width:W(59),
    height:W(59),
  },
  priceIdent:{
    color:'#333',
    width:W(18),
    height:W(30),
    fontWeight:'400',
  },
  priceText:{
    color:'#333',
    fontSize:F(25),
  },
  btnView:{
    marginTop: W(250),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn:{
    width:W(158),
    height:W(34),
    borderColor: '#F0C894',
    borderWidth:StyleSheet.hairlineWidth,
    borderRadius: W(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  payText:{
    color:'#F0C894',
    fontSize:F(16),
  },
  overText:{
    color:'#F0C894',
  },
});
