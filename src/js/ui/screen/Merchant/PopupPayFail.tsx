import { F, W } from 'js/helper/UI';

import { FontWeight } from 'js/style/fonts';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Image, StyleProp, StyleSheet, Text, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';


interface IProps {
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

class PayResultStore {
  @observable public visible: boolean = false;
  // @observable public message: string = '';
  private timer: number = 0;
  private hideCallback?: () => void;

  private timeout: number = 2000;

  @action public hide() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }
    this.visible = false;
    if (this.hideCallback) {
      this.hideCallback();
    }
  }
  @action public show() {
    if (this.timer) {
      return;
    }
    this.visible = true;
    this.timer = setTimeout(() => {
      this.hide();
    },                      this.timeout);
  }

  @action public setHideCallback(fn: () => void) {
    this.hideCallback = fn;
  }
}

const payResultStore = new PayResultStore();

export const payRsShow = (fn?: () => void) => {
  if (fn) {
    payResultStore.setHideCallback(fn!);
  }
  payResultStore.show();
};

@observer
export class PopoverPayFail extends React.Component<IProps> {

  public render() {
    const payRsView = payResultStore.visible ?
    (
      <View style={{ flex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
          <TouchableWithoutFeedback onPress={payResultStore.hide}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.payrs}>
                <FastImage style={styles.payrs_img} source={require('img/Order/canle.png')} />
                <Text style={[styles.payrs_text, FontWeight.Regular]}>支付失败</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
    ) : null;

    return payRsView;
  }
}

const styles = StyleSheet.create({

  payrs: {
    width: W(145),
    height: W(130),
    borderRadius: W(9),
    backgroundColor:
    'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payrs_img: {
    width: W(46),
    height: W(46),
    marginBottom: W(10),
  },
  payrs_text: {
    color: '#FFFFFF',
    fontSize: F(18),
  },
});
