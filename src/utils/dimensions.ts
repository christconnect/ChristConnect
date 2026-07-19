import { Dimensions, Platform } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export const ScreenDimensions = {
  width: windowWidth,
  height: windowHeight,
  isSmallDevice: windowWidth < 375,
  isTablet: windowWidth >= 768,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

/**
 * Returns a scaled pixel value based on the standard window size
 * @param percent percentage of screen width (0-100)
 */
export const wp = (percent: number) => {
  return (windowWidth * percent) / 100;
};

/**
 * Returns a scaled pixel value based on the standard window size
 * @param percent percentage of screen height (0-100)
 */
export const hp = (percent: number) => {
  return (windowHeight * percent) / 100;
};

export default ScreenDimensions;
