
import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';

const uiWidth = 375;
const uiHeight = 667;

const X_WIDTH = 375;
const X_HEIGHT = 812;

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
const pixelRatio = PixelRatio.get();
const fontScale = PixelRatio.getFontScale();
const scale = Math.min(screenWidth / uiWidth, screenHeight / uiHeight);

export const StatusBarHeight = StatusBar.currentHeight || 0;

export const W = (v: number) => {
  return screenWidth * v / uiWidth;
};

export const H = (v: number) => {
  return screenHeight * v / uiHeight;
};

export const F = (v: number) => {
  // return v;
  const n = Math.round((v * scale) * pixelRatio / fontScale);
  return n / pixelRatio;
};

export const isiPhone = () => {
  return Platform.OS === 'ios';
};

export const isiPhoneX = () => {
  return (
    isiPhone() &&
    ((screenHeight === X_HEIGHT && screenWidth === X_WIDTH) ||
    (screenHeight === X_WIDTH && screenWidth === X_HEIGHT))
  );
};

export const ifiPhoneX = (iphoneXStyle: any, iosStyle: any, androidStyle: any) => {
  let style = androidStyle;
  if (isiPhoneX()) {
    style = iphoneXStyle;
  } else if (isiPhone()) {
    style = iosStyle;
  }
  return style;
};

export const HEADER_BAR_HEIGHT = W(ifiPhoneX(44, 64, 44 + StatusBarHeight));
