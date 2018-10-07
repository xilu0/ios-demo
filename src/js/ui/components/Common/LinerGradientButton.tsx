
import { F, W } from 'js/helper/UI';
import { FontWeight } from 'js/style/fonts';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

interface IProps {
  text: string | React.ReactElement<Text>;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  colors?: string[];
  locations?: number[];
  buttonStyles?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeOpacity?: number;
}

export class LinerGradientButton extends React.Component<IProps> {

  public onPress = () => {
    const fn = this.props.onPress;
    if (fn) {
      fn();
    }
  }

  public render() {
    const colors = this.props.colors || ['#FF4A00', '#FF7301'];
    const locations = this.props.locations || [0.1, 1];
    const btnStyle = this.props.buttonStyles || null;

    const textStyle = this.props.textStyle || null;

    const textView = typeof this.props.text === 'string' ?
    (
      <Text style={[styles.button_text, FontWeight.Light, textStyle]}>{this.props.text}</Text>
    ) :
    this.props.text as React.ReactElement<Text>;

    return (
      <TouchableOpacity onPress={this.onPress} activeOpacity={this.props.activeOpacity || 0.75}>
        <View style={[styles.footer, this.props.style || null]}>
          <LinearGradient
            colors={colors}
            locations={locations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.button, btnStyle]}
          >
            {textView}
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({

  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: W(40),
    width: W(328),
    // backgroundColor: 'red',
    borderRadius: W(3),
    alignItems: 'center',
    justifyContent: 'center',

  },
  button_text: {
    color: '#FFFFFF',
    fontSize: F(16),
  },
  tips_text: {
    color: '#ABABAB',
    fontSize: F(12),
  },
});
