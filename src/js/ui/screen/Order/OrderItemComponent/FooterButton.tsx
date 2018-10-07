
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { F, W } from 'js/helper/UI';
import { Styles } from 'js/style/common';

interface IPorps {
  onPress: () => void;
  text: string;
}

export class OrderItemFooterButton extends React.PureComponent<IPorps, any> {
  public render() {
    return (
        <TouchableOpacity activeOpacity={0.35} onPress={this.props.onPress}>
          <View style={style.wrap}>
            <Text style={[style.text, Styles.text_no_padding]}>{this.props.text}</Text>
          </View>
        </TouchableOpacity>
    );
  }
}

const color_red = '#FC0204';

const style = StyleSheet.create({

  wrap: {
    borderColor: color_red,
    borderWidth: 0.5,
    borderRadius: W(3),
    // paddingHorizontal: W(9.5),
    // paddingVertical: W(6.5),
    justifyContent:'center',
    alignItems: 'center',
    height:W(27),
    width:W(75),
  },

  text: {
    color: color_red,
    fontSize: F(14),
    fontWeight: '300',
  },

});
