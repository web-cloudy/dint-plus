import { Dimensions, Platform, StatusBar } from "react-native";
export const SCREEN_HEIGHT = Dimensions.get("screen").height;
export const SCREEN_WIDTH = Dimensions.get("screen").width;

export const hp = (height: number) => {
  return (height / 100) * SCREEN_HEIGHT;
};

export const wp = (width: number) => {
  return (width / 100) * SCREEN_WIDTH;
};

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

export const isIPhoneX = () =>
  Platform.OS === "ios" && !Platform.isPad && !Platform.isTVOS
    ? (SCREEN_WIDTH === X_WIDTH && SCREEN_HEIGHT === X_HEIGHT) ||
      (SCREEN_WIDTH === XSMAX_WIDTH && SCREEN_HEIGHT === XSMAX_HEIGHT)
    : false;

export const StatusBarHeight = Platform.select({
  ios: isIPhoneX() ? 42 : 20,
  android: StatusBar.currentHeight,
  default: 0,
});
