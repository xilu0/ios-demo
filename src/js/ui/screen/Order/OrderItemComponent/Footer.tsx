
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { W } from 'js/helper/UI';
import { PAGE_PADDING } from 'js/style/common';

interface IProps {
  render: () => React.ReactElement<View>;
  style?: StyleProp<ViewStyle>;
}

export class OrderItemFooter extends React.Component<IProps, any> {
  public render() {
    return (
        <View style={[style.footer, this.props.style || null]}>
          {this.props.render()}
        </View>
    );
  }
}

const style = StyleSheet.create({

  footer: {
    height: W(50),
    alignItems: 'center',
    // paddingVertical: W(12),
    paddingHorizontal: W(PAGE_PADDING),
    flexDirection: 'row-reverse',
  },

});
