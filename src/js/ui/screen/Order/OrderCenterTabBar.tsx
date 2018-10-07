import React from 'react';
import { Animated, Platform, ScrollView, StyleProp, StyleSheet, Text, TextStyle, TouchableNativeFeedback, TouchableOpacity, View, ViewStyle } from 'react-native';

interface IPrpps {
  goToPage?: () => void;
  actionveTab?: number;
  tabs: any[];
  backgroundColor?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  textStyle?: ViewStyle;
  tabStyle?: TextStyle;
  renderTab?: () => void;
  underlineStyle?: StyleProp<View>;

  containerWidth: number;
  scrollValue: ScrollView;

}

const Button = (props: any) => {
  const view = Platform.OS === 'android' ? (
    <TouchableNativeFeedback
      delayPressIn={0}
      background={TouchableNativeFeedback.SelectableBackground()} // eslint-disable-line new-cap
      {...props}
    >
      {props.children}
    </TouchableNativeFeedback>
  ) : (
    <TouchableOpacity {...props}>
      {props.children}
    </TouchableOpacity>
  );
  return view;
};

export class OrderCenterTabBar extends React.Component<IPrpps, any> {

  public onPressHandler = (page: number) => {
    return page;
  }

  public renderTab = (name: string, page: number, isTabActive: boolean) => {
    const { activeTextColor, inactiveTextColor, textStyle } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';

    return (
      <Button
        style={{ flex: 1 }}
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits='button'
        onPress={this.onPressHandler.bind(this, page)}
      >
        <View style={[styles.tab, this.props.tabStyle]}>
          <Text style={[{ fontWeight, color: textColor }, textStyle]}>
            {name}
          </Text>
        </View>
      </Button>
    );
  }

  public render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0,  containerWidth / numberOfTabs],
    });

    const AnimatedViewStyles = [
      tabUnderlineStyle,
      {
        transform: [
          { translateX },
        ],
      },
      this.props.underlineStyle,
    ];

    const view = this.props.tabs.map((name, page) => {
      const isTabActive = this.props.activeTab === page;
      const renderTab = this.props.renderTab || this.renderTab;
      return this.renderTab(name, page, isTabActive);
    });

    return (
      <View style={[styles.tabs, { backgroundColor: this.props.backgroundColor }, this.props.style]}>
        {view}
        <Animated.View
          style={AnimatedViewStyles}
        />
      </View>
    );

  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
});
