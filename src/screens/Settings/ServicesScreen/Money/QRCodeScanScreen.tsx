import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { ms, mvs } from "react-native-size-matters";
import { hp, wp } from "utils/metrix";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Images } from "assets/images";
import { FONTS } from "constants";

const QRCodeScanScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  const onSuccess = (e) => {
    navigation.replace("SendMoneyScreen", {
      userDetails: JSON.parse(e?.data),
    });
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        cameraStyle={styles.camera}
        fadeIn={true}
        showMarker={true}
        reactivate={true}
        customMarker={
          <View style={styles.overlay}>
            <View style={styles.topOverlay} />
            <View style={styles.bottomOverlay} />
            <View style={styles.leftOverlay} />
            <View style={styles.rightOverlay} />
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        }
      />
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.backButton}
      >
        <Image style={styles.cancelIcon} source={Images.cancel} />
      </TouchableOpacity>
      <Text style={styles.scanText}>
        Scan by aligning the bank card and card number within the frame
      </Text>
    </View>
  );
};

export default QRCodeScanScreen;

const screenStyles = (Color) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    camera: {
      height: hp(100),
      width: wp(100),
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    corner: {
      position: "absolute",
      width: mvs(45),
      height: mvs(45),
      borderColor: "rgba(213, 255, 240, 1)",
    },
    topLeft: {
      top: hp(35),
      left: wp(25),
      borderLeftWidth: 2,
      borderTopWidth: 2,
    },
    topRight: {
      top: hp(35),
      right: wp(25),
      borderRightWidth: 2,
      borderTopWidth: 2,
    },
    bottomLeft: {
      bottom: hp(40),
      left: wp(25),
      borderLeftWidth: 2,
      borderBottomWidth: 2,
    },
    bottomRight: {
      bottom: hp(40),
      right: wp(25),
      borderRightWidth: 2,
      borderBottomWidth: 2,
    },
    topOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: hp(35),
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    bottomOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: hp(40),
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    leftOverlay: {
      position: "absolute",
      top: hp(35),
      bottom: hp(40),
      left: 0,
      width: wp(25),
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    rightOverlay: {
      position: "absolute",
      top: hp(35),
      bottom: hp(40),
      right: 0,
      width: wp(25),
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    backButton: {
      position: "absolute",
      backgroundColor: "rgba(36, 37, 37, 1)",
      width: mvs(40),
      height: mvs(40),
      right: mvs(20),
      top: useSafeAreaInsets().top + mvs(30),
      borderRadius: mvs(30),
      justifyContent: "center",
      alignItems: "center",
    },
    cancelIcon: {
      height: mvs(15),
      width: mvs(15),
      tintColor: Color.fixedWhite,
    },
    scanText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.fixedWhite,
      textAlign: "center",
      alignSelf: "center",
      paddingHorizontal: ms(20),
      position: "absolute",
      bottom: Platform.OS == "ios" ? hp(30) : hp(23),
    },
  });
};
