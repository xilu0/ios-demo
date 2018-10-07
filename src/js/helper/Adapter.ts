import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';
import { isiPhone } from './UI';
const BASE_WIN_HEIGHT = 667;  // iPhone 6高度
const BASE_WIN_WIDTH = 375;    // iPhone 6宽度
const currentWidth = Dimensions.get('window').width;   // 当前设备宽度
const currentHeight = Dimensions.get('window').height;    // 当前设备高度
const pixelRatio = PixelRatio.get();      // 返回设备的像素密度
const pixelRatio6 = 2;      // 返回iPhone6的像素密度
const fontScale = PixelRatio.getFontScale();  // 字体大小缩放比例
const scale = Math.min(currentHeight / BASE_WIN_HEIGHT / pixelRatio6, currentWidth / BASE_WIN_WIDTH / pixelRatio6);

export function setFontSize(val: number) {
  return val / fontScale;
}

export function scaleWidth(val: number) {
  return val / pixelRatio;
}

export function scaleHeight(val: number) {
  return val * pixelRatio;
}

// UI 默认给图是 640
const uiWidthPx = 750;

export function px2dp(px: number) {
  return px *  currentWidth / uiWidthPx;
}

export function px2dpFont(px: number) {
  return px / 2 / fontScale;
}

export function isPhoneX() {
  return isIphone && currentHeight === 812;
}

export function isIphone() {
  return Platform.OS === 'android' ? false : true;
}

export function getStatusBarHeight() {
  return isIphone() ? 0 : (StatusBar.currentHeight || 0);
}

export function getCurrentWidth() {
  return currentWidth;
}
