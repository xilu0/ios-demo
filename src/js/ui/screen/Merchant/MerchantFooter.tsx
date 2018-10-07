import { F,  W } from 'js/helper/UI';
import { Colors } from 'js/style/colors';
import React from 'react';
import { Image , StyleSheet, Text, View } from 'react-native';
import { Touchable } from 'js/ui/components/Touchable';

interface IProps {
  onPress?: () => void;
  text?: string;
  buttonText?: string;
}

export class MerchantFooter extends React.Component<IProps, any> {
  public render() {
    return(
      <View style={styles.footer}>
          <View style={styles.footer_wrap}>
            <Text style={styles.footer_text}>{this.props.text || '10折'}</Text>
            <Touchable  style={styles.buyBtn}  onPress={this.props.onPress}>
              <View style={styles.footer_pay_button}>
                <Image source={require('img/merchant/buy.png')} style={styles.image}/>
                <Text style={styles.textStyle}>
                      {this.props.buttonText || '立即买单'}
                </Text>
                </View>
              </Touchable>
          </View>
        </View>

    );
  }
}
const styles = StyleSheet.create({
  buyBtn:{
    flex: 1,
    right:0,
    position:'absolute',

  },

  footer: {
    height: W(49),
    borderTopColor:Colors.LINE,
    borderTopWidth: W(1),
    backgroundColor: '#FFFFFF',

  },

  footer_wrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer_text: {
    // width: W(45),
    marginLeft: W(24),
    color: Colors.TITLE_RED,
    fontSize: F(22),
    fontWeight: '400',
    fontFamily:'DIN-Medium',
  },
  footer_pay_button: {
    width: W(143),
    height: W(49),
    justifyContent:'center',
    alignItems: 'center',

  },
  textStyle:{ fontSize: F(15), color: '#FFFFFF' },
  image:{
    position:'absolute',
    width: W(143),
    height: W(49),
    resizeMode:'stretch',
  },
});
