
import React from 'react';
import { Image,
  ScrollView,
  StyleProp, StyleSheet,  Text, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import Modal2 from 'react-native-modalbox';

import { F, W } from 'js/helper/UI';
import { LinerGradientButton } from 'js/ui/components/Common/LinerGradientButton';
import FastImage from 'react-native-fast-image';


interface IProps {
  visible: boolean;
  equestClose: () => void;
  contentRender: () => React.ReactNode;
  headerRightRender?: () => React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  title: string;
  buttonText: string;
  buttonClick: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  contentScroll?: boolean;
}

export class ProductPopoverComponent extends React.Component<IProps> {

  private modal: any;

  public onDismiss = () => {
    this.props.equestClose();
  }

  public setModalRef = (com: any) => {
    this.modal = com;
  }

  public onFooterButtonClick = () => {
    const fn = this.props.buttonClick;
    if (fn) {
      fn();
    }
  }

  public render() {

    const {
      title,
      buttonText,
      visible,
      equestClose,
      contentRender,
      contentStyle,
      headerRightRender,
      contentScroll,
    } = this.props;

    const contentView = contentRender();

    const headerRightView = (headerRightRender && headerRightRender()) || null;

    const ParentView = contentScroll ? ScrollView : View;

    return (
      // <Modal
      //   visible={visible}
      //   animationType={'none'}
      //   transparent={true}
      //   onRequestClose={equestClose}
      //   onShow={this.onShow}
      // >
      <Modal2
          isOpen={visible}
          style={[styles.wrap]}
          // swipeToClose={equestClose}
          backButtonClose={true}
          onClosed={equestClose}
          // onOpened={this.onShow}
          position={'bottom'}
          ref={this.setModalRef}
          swipeToClose={false}
          animationDuration={250}
          coverScreen={true}
          // onClosingState={this.onClosingState}
      >
        <View style={styles.container}>
          <View style={styles.header}>
          <TouchableWithoutFeedback style={styles.header_left_view} onPress={equestClose}>
              <View style={styles.header_left_view}>
                <FastImage style={styles.header_left_img} source={require('img/Order/close.png')} />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.header_center_view}>
              <Text style={styles.header_center_title}>{title}</Text>
            </View>

            <View style={styles.header_right_view}>
              {headerRightView}
            </View>
          </View>
          <ParentView style={contentStyle || null}>
            {contentView}
          </ParentView>
          <View style={styles.footer}>
            <LinerGradientButton
              style={[this.props.buttonStyle]}
              onPress={this.onFooterButtonClick}
              text={buttonText}
              // style={{ marginTop: W(20), marginBottom: W(10) }}
            />
          </View>
        </View>

      </Modal2>
      // </Modal>
    );
  }
}

const styles = StyleSheet.create({

  wrap: {
    width: '100%',
    height: W(440),
    backgroundColor: '#FFFFFF',
    top: 0,
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingLeft: W(24),
    paddingRight: W(24),
    height: W(47),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
  },

  header_left_view: {
    flex: 1,
    height:W(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header_left_img: {
    width: W(14),
    height: W(14),
    marginLeft: W(24),

  },
  header_center_view: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: W(24),
  },
  header_center_title: {
    color: '#050505',
    fontSize: F(18),

  },
  header_right_view: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  header_right_text: {
    fontSize: F(14),
    color: '#888888',
  },
  header_right_icon: {
    width: W(7),
    height: W(13),
    marginLeft: W(5),
  },

  footer: {
    backgroundColor: '#F8F8F8',
    paddingTop: W(15),
    paddingBottom: W(15),
  },
});
