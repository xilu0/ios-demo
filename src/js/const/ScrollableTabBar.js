import React from 'react';
const createReactClass = require('create-react-class');
import {
    View,
    Animated,
    StyleSheet,
    ScrollView,
    Text,
    Platform,
    Dimensions,
    Image,
    TouchableOpacity,
    ViewPropTypes,
} from 'react-native'
const PropTypes = require('prop-types');
import LinearGradient from 'react-native-linear-gradient'
const WINDOW_WIDTH = Dimensions.get('window').width;
const delayShowScrollTableTime = 100

const ScrollableTabBar = createReactClass({

    getInitialState() {
        this._tabsMeasurements = [];
        this.isInitialized = false
        return {
            delayShowScrollTableView: false,
            _leftTabUnderline: new Animated.Value(0),
            _containerWidth: null,
        };
    },

    componentDidMount() {
        this.props.scrollValue.addListener(this.updateView);
        this.delayShowScrollTable = setTimeout(()=>{
            this.setState({
                delayShowScrollTableView: true
            })
        },delayShowScrollTableTime)
    },

    componentWillUnmount() {
        if (this.delayShowScrollTable) {
            clearTimeout(this.delayShowScrollTable)
        }
    },

    updateView(offset) {
        const position = Math.floor(offset.value);
        const pageOffset = offset.value % 1;
        const tabCount = this.props.tabs.length;
        const lastTabPosition = tabCount - 1;

        if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
            return;
        }

        if (this.necessarilyMeasurementsCompleted(position, position === lastTabPosition)) {
            this.updateTabPanel(position, pageOffset);
            this.updateTabUnderline(position, pageOffset, tabCount);
        }
    },

    necessarilyMeasurementsCompleted(position, isLastTab) {
        return this._tabsMeasurements[position] &&
            (isLastTab || this._tabsMeasurements[position + 1]) &&
            this._tabContainerMeasurements &&
            this._containerMeasurements;
    },

    updateTabPanel(position, pageOffset) {
        const containerWidth = this._containerMeasurements.width;
        const tabWidth = this._tabsMeasurements[position].width;
        const nextTabMeasurements = this._tabsMeasurements[position + 1];
        const nextTabWidth = nextTabMeasurements && nextTabMeasurements.width || 0;
        const tabOffset = this._tabsMeasurements[position].left;
        const absolutePageOffset = pageOffset * tabWidth;
        let newScrollX = tabOffset + absolutePageOffset;

        // center tab and smooth tab change (for when tabWidth changes a lot between two tabs)
        newScrollX -= (containerWidth - (1 - pageOffset) * tabWidth - pageOffset * nextTabWidth) / 2;
        newScrollX = newScrollX >= 0 ? newScrollX : 0;

        // if (Platform.OS === 'android') {
        //     this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false,});
        // } else {
        //     const rightBoundScroll = this._tabContainerMeasurements.width - (this._containerMeasurements.width);
        //     newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX;
        //     this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false,});
        // }

    },

    updateTabUnderline(position, pageOffset, tabCount) {
        const lineLeft = this._tabsMeasurements[position].left;
        const lineRight = this._tabsMeasurements[position].right;
        this.isInitialized = true
        if (position < tabCount - 1) {
            const nextTabLeft = this._tabsMeasurements[position + 1].left;
            const nextTabRight = this._tabsMeasurements[position + 1].right;

            const newLineLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft);
            const newLineRight = (pageOffset * nextTabRight + (1 - pageOffset) * lineRight);

            this.state._leftTabUnderline.setValue((newLineLeft+newLineRight-this.props.underlineStyle.width)/2);
        } else {
            this.state._leftTabUnderline.setValue((lineRight + lineLeft-this.props.underlineStyle.width)/2);
        }
    },

    renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler) {
        const {activeTextColor, inactiveTextColor, textStyle,} = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';

        const tabItemText = (
            <Text allowFontScaling={false} style={{
                color: textColor,
                fontSize: 13,
                fontWeight
            }}>
                {this.props.tabs[page]}
            </Text>
        )

        let itemView ;
        if (this.props.activeTab == page) {
            if (!this.isInitialized) {
                itemView = (
                    <View style={styles.tabItem}>
                        {tabItemText}
                        <View style={[styles.tabUnderlineStyle,this.props.tabUnderlineColor ? {backgroundColor: this.props.tabUnderlineColor,bottom: 2} : {bottom: 2}]}/>
                    </View>
                )
            } else {
                itemView = (
                    <View style={styles.tabItem}>
                        {tabItemText}
                    </View>
                )
            }
        } else {
            itemView = (
                <View style={styles.tabItem}>
                    {tabItemText}
                </View>
            )
        }
        return (
            <TouchableOpacity onLayout={onLayoutHandler} onPress={() => onPressHandler(page)} key={page}>
                {itemView}
            </TouchableOpacity>
        );

    },

    measureTab(page, event) {
        const { x, width, height, } = event.nativeEvent.layout;
        this._tabsMeasurements[page] = {left: x, right: x + width, width, height, };
        this.updateView({value: this.props.scrollValue._value, });
    },

    render() {
        // const scrollView = (
        //     <ScrollView
        //         ref={(scrollView) => { this._scrollView = scrollView; }}
        //         horizontal={true}
        //         showsHorizontalScrollIndicator={false}
        //         showsVerticalScrollIndicator={false}
        //         directionalLockEnabled={true}
        //         bounces={false}
        //         scrollsToTop={false}>
        //         {this.state.delayShowScrollTableView?this._renderScrollTableView():<View/>}
        //     </ScrollView>
        // )
        if (this.props.linerColors) {
            return (
                <LinearGradient
                    colors={this.props.linerColors}
                    style={[styles.container, this.props.style]}
                    onLayout={this.onContainerLayout}>
                    {scrollView}
                </LinearGradient>
            )
        } else {
            return (
                <View
                    style={[styles.container, {backgroundColor: this.props.backgroundColor },this.props.style]}
                    onLayout={this.onContainerLayout}>
                    {this._renderScrollTableView()}
                </View>
            )
        }

    },

    _renderScrollTableView() {
        return (
          <View 
              style={[styles.tabs, {width: 200, }, this.props.tabsContainerStyle ]}
              ref={'tabContainer'}
              onLayout={this.onTabContainerLayout}>
              {this.props.tabs.map((name, page) => {
                  const isTabActive = this.props.activeTab === page;
                  const renderTab = this.props.renderTab || this.renderTab;
                  return renderTab(name, page, isTabActive, this.props.goToPage, this.measureTab.bind(this, page));
              })}
              <Animated.View style={[
                  styles.tabUnderlineStyle,
                  this.props.underlineStyle,
                  this.props.tabUnderlineColor ? {backgroundColor: this.props.tabUnderlineColor} : {},
                  {
                      left: this.state._leftTabUnderline,
                      width: this.isInitialized ? this.props.underlineStyle.width : 0
                  }
              ]} />
          </View>
        )
    },

    componentWillReceiveProps(nextProps) {
        // If the tabs change, force the width of the tabs container to be recalculated
        if (JSON.stringify(this.props.tabs) !== JSON.stringify(nextProps.tabs) && this.state._containerWidth) {
            this.setState({ _containerWidth: null, });
        }
    },

    onTabContainerLayout(e) {
        this._tabContainerMeasurements = e.nativeEvent.layout;
        let width = this._tabContainerMeasurements.width;
        if (width < WINDOW_WIDTH) {
            width = WINDOW_WIDTH;
        }
        this.setState({ _containerWidth: width, });
        this.updateView({value: this.props.scrollValue._value, });
    },

    onContainerLayout(e) {
        this._containerMeasurements = e.nativeEvent.layout;
        this.updateView({value: this.props.scrollValue._value, });
    },
});

ScrollableTabBar.defaultProps = {
    scrollOffset: 52,
    activeTextColor: 'navy',
    inactiveTextColor: 'black',
    backgroundColor: null,
    style: {},
    tabStyle: {},
    tabsContainerStyle: {},
    underlineStyle: {
        width: 23
    },
}

ScrollableTabBar.propTypes = {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    scrollOffset: PropTypes.number,
    style: ViewPropTypes.style,
    tabStyle: ViewPropTypes.style,
    tabsContainerStyle: ViewPropTypes.style,
    tabUnderlineColor: PropTypes.string,
    linerColors: PropTypes.array,
    textStyle: Text.propTypes.style,
    renderTab: PropTypes.func,
    underlineStyle: ViewPropTypes.style,
    onScroll: PropTypes.func,
}

module.exports = ScrollableTabBar;

const itemHeight = 39
const styles = StyleSheet.create({
    tab: {
        height: itemHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        height: itemHeight,
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabItem: {
        alignItems: 'center',
        padding: 13,
    },
    tabUnderlineStyle: {
        position: 'absolute',
        width: 23,
        height: 2,
        borderRadius: 2,
        backgroundColor: '#ff8a14',
        bottom: 0,
    }
});
