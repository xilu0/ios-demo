import { W } from 'js/helper/UI';

import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface IProps {
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export class LineView extends React.PureComponent<IProps> {
  public render() {
    const {
      width,
      height,
      color,
      style,
    } = this.props;

    const lineStyle = {
      width,
      height,
      backgroundColor: color,
    };
    return <View style={[styles.line, (style || null), lineStyle]}/>;
  }
}

const styles = StyleSheet.create({
  line: {
    height: W(0.8),
    width: W(375),
    backgroundColor:'#E6E6E6',
  },
});
