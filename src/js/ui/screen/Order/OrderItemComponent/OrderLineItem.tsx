import React from 'react';
import { StyleSheet, View } from 'react-native';

import { F, W } from 'js/helper/UI';
import { LineView } from 'js/ui/components/Common/LineView';
import { Touchable } from 'js/ui/components/Touchable';
import { observer } from 'mobx-react/native';

export interface IItemProps {
  onPress?: () => void;
  renderLeftText: () => React.ReactElement<Text>;
  renderRightCom?: () => React.ReactElement<any>;
  lineLeft?: number;
}

@observer
export class OrderLineItem extends React.Component<IItemProps> {
  public render() {
    const leftText = this.props.renderLeftText();
    const rightCom = (this.props.renderRightCom || (() => null))();
    const lineView = this.props.lineLeft === undefined ?
     null
      :
    (
    <LineView
      width={W(375 - this.props.lineLeft)}
      height={StyleSheet.hairlineWidth}
      color={'#E6E6E6'}
      style={{ marginLeft: W(this.props.lineLeft) }}
    />);

    const renderView = () => {
      return (
        <View>
          <View style={commonStyle.line_item}>
            <View style={[commonStyle.line_left]}>
              {leftText}
            </View>
            <View style={[commonStyle.line_right]}>
              {rightCom}
            </View>
          </View>
          <View style={{ backgroundColor: '#FFFFFF' }}>
            {lineView}
          </View>

        </View>

      );
    };

    const TouchableView = this.props.onPress ?
    <Touchable children={renderView()} onPress={this.props.onPress} /> :
    renderView();

    return TouchableView;
  }
}

export const commonStyle = StyleSheet.create({
  line_item: {
    height: W(40),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  line_left: {
    paddingLeft: W(24),
  },
  line_right: {
    paddingRight: W(24),
    // alignItems: 'flex-end',
  },

  text_15_27: {
    color: '#272727',
    fontSize: F(15),
  },

  text_14_ff5000: {
    color: '#FF5000',
    fontSize: F(14),
  },

  active_icon: {
    width: W(24),
    height: W(24),
  },

});
