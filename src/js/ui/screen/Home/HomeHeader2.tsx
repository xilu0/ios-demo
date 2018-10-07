import React from 'react';
import { Animated, Image, LayoutChangeEvent, StyleSheet, Text, TouchableWithoutFeedback, View , TouchableOpacity} from 'react-native';
import { AnimatedValue, NavigationScreenProp } from 'react-navigation';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { getStore } from 'js/helper/Store';
import { F,isiPhone, W } from 'js/helper/UI';
import ImageCapInset from 'react-native-image-capinsets';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { action,  observable } from 'mobx';
import { observer } from 'mobx-react';
import FastImage from 'react-native-fast-image';


export enum HeaderMode {
  Home= 1, Near= 2, Result= 3,
}

interface IProps {
  type: HeaderMode;
  navigation: NavigationScreenProp<any>;
  onPress?: () => void;
  backPress?: () => void;
  content?: string;
  scrollY: AnimatedValue;
}

interface IState {
  fadeAnim: AnimatedValue;
  inputAnim: AnimatedValue;
  translateX: AnimatedValue;
  headerWidth: AnimatedValue;
  opacity: AnimatedValue;
}

let headerLeftSubWidth = W(15 + 26 + 5 + 6 + 15);
const headerRightSubWidth = W(17 + 18 + 17);
const headerWidht100 = W(375);
const inputRange = [0, W(60), W(120), W(121)];

@observer
export class HomeHeader2 extends React.Component<IProps, IState> {

  @observable public isShow:boolean = false;
  @action public setIsPressIn(isNo:boolean){
    this.isShow = isNo;
  }


  public onPressIn = () => {
    this.setIsPressIn(true);
  }

  public onPressOut = () => {
    this.setIsPressIn(false);
  }

  constructor(props: IProps) {
    super(props);
    const { scrollY } = this.props;
    const headerWidhtMax = headerWidht100 + headerLeftSubWidth + headerRightSubWidth;
    
    this.state = {
      fadeAnim: new Animated.Value(0),
      inputAnim: new Animated.Value(1),
      translateX: scrollY.interpolate({
        inputRange,
        outputRange: [0, 0, -1 * headerLeftSubWidth, -1 * headerLeftSubWidth],
      }),
      headerWidth: scrollY.interpolate({
        inputRange,
        outputRange: [headerWidht100, headerWidht100, headerWidhtMax, headerWidhtMax],
      }),
      opacity: scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 0, 0],
      }),
    };
  }

  private resetCityInterploate = (width: number) => {
    headerLeftSubWidth = width;
    const { scrollY } = this.props;
    const headerWidhtMax = headerWidht100 + headerLeftSubWidth + headerRightSubWidth - W(25);
    this.setState({
      translateX: scrollY.interpolate({
        inputRange,
        outputRange: [0, 0, -1 * headerLeftSubWidth + W(15), -1 * headerLeftSubWidth + W(15)],
      }),
      headerWidth: scrollY.interpolate({
        inputRange,
        outputRange: [headerWidht100, headerWidht100, headerWidhtMax, headerWidhtMax],
      }),
    });
  }

  private cityOnLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    this.resetCityInterploate(width);
  }

  private onQrCodeClick = () => {
    this.props.navigation.navigate(NavigationKeys.ScanScreen);
  }

  private onCityClick = () => {
    this.props.navigation.navigate(NavigationKeys.SelectCity);
  }

  private onSearchClick = () => {
    this.props.navigation.navigate(NavigationKeys.Search, { transition: 'forVertical' });
  }

  public render() {
    const { opacity, headerWidth: width, translateX } = this.state;
    const _city = getStore().geolocationStore.currentCity.name!;
    console.log(_city);

    const city = _city.split('').splice(0, 4).join('');
    const  img = this.isShow ? require('img/headerInputBg_touch.png') : require('img/header/Group.png');

    return (
      <Animated.View 
        style={[styles.header, { width, transform: [{ translateX }] }]}
      >
        <Animated.View
          style={[styles.header_subview, { opacity, paddingHorizontal: W(15) }]}
          onLayout={this.cityOnLayout}
        >
          <TouchableOpacity onPress={this.onCityClick}  style={{flex:1}} >
            <View style={[styles.header_subview_left]}>
              <Text style={styles.header_subview_left_text}>{city}</Text>
              <FastImage 
                style={styles.header_subview_left_arrow} 
                source={require('img/header/arrow_down_icon.png')} 
                resizeMode={FastImage.resizeMode.stretch} 
              />
            </View>
          </TouchableOpacity>
        </Animated.View>
        <TouchableWithoutFeedback 
          onPress={this.onSearchClick} 
          style={[styles.header_search_view]}
          onPressIn={this.onPressIn}
          onPressOut={this.onPressOut}
        >
        <View style={[styles.header_search_view]}>
          
            <ImageCapInset
                style={[styles.headerInputBg, styles.search_bar_view]}
                source={img}
                capInsets={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <FastImage 
                style={[styles.search_icon]} 
                source={require('img/header/search_icon.png')} 
                resizeMode={FastImage.resizeMode.stretch}
              />
              <Text style={[styles.search_text]}>{'菜品 店名 分类'}</Text>
            </ImageCapInset>
          
        </View>
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.header_subview, { opacity, paddingHorizontal: W(17) }]}>
          <TouchableWithoutFeedback onPress={this.onQrCodeClick}>
            <View style={[styles.header_subview_right]}>
              <FastImage source={require('img/header/qrcode_icon.png')} resizeMode={FastImage.resizeMode.stretch}/>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    width: W(375),
    transform: [{ translateX: 0 }],
    height:  W(52),
    marginTop:isiPhone() ? 0: getStatusBarHeight(),
    zIndex: 888,    
    flexDirection: 'row',
  },

  header_subview: {
    // paddingHorizontal: W(17),
  },

  header_search_view: {
    flex: 1,
    marginLeft: -W(15),
    marginRight: -W(10),
    marginVertical: -W(5),
  },
  search_bar_view: {
    paddingLeft: W(10),
  },
  search_icon: {
    width: W(14),
    height: W(14),
    marginLeft: W(14),
    marginRight: W(10),
  },
  search_text: {
    color: '#999999',
    fontSize: F(13),
  },

  header_subview_left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header_subview_left_text: {
    color: '#333333',
    fontSize: F(13),
  },
  header_subview_left_arrow: {
    width: W(6),
    height: W(4),
    marginLeft: W(5),
  },
  
  header_subview_right: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-end',
    justifyContent: 'center',
  },

  headerInputBg:{
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    opacity:1,
  },

});
