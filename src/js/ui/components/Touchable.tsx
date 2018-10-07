
import React from 'react';
import { Platform, TouchableHighlight, TouchableNativeFeedback, View } from 'react-native';

interface IProps {
  onPress?: () => void;
  underlayColor?: string;
  style?: object;
}

export class Touchable extends React.Component<IProps, any> {

  private _timerFun = 0;

  constructor(props: any) {
    super(props);
  }

  public componentWillUnmount() {
    if (this._timerFun !== 0) {
      clearTimeout(this._timerFun);
    }
  }

  public render() {
    const isAndroid = Platform.OS === 'android';
    const children = this.props.children;
    const style = this.props.style || {};

    const onTouchPress = () => {
      if (this.props.onPress) {
        this._timerFun = setTimeout(() => {
          (this.props.onPress as (() => void))();
        });
      }
    };

    const TouchableContiner = isAndroid ?
      (
        <TouchableNativeFeedback onPress={onTouchPress} style={style}>
          {children}
        </TouchableNativeFeedback>
      )
      :
      (
        <TouchableHighlight onPress={onTouchPress} underlayColor={this.props.underlayColor} style={style}>
          {children}
        </TouchableHighlight>
      );
    return (
      TouchableContiner
    );
  }

}
