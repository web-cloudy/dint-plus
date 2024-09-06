import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { ServicesHeader } from "components/molecules";
import { AvatarPNG } from "assets/images";
import { ms, mvs } from "react-native-size-matters";
import { hp, wp } from "utils/metrix";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FONTS } from "constants/fonts";

const QRCodeViewScreen = ({ route }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const { profileData } = route.params;
  console.log("🚀 ~ QRCodeViewScreen ~ profileData:", profileData);
  return (
    <View style={styles.container}>
      <ServicesHeader title="QR Code" showRightIcon={false} />
      <View style={styles.QRview}>
        <View style={styles.newFriendView}>
          <Image
            source={
              profileData?.profile_image
                ? { uri: profileData?.profile_image }
                : AvatarPNG
            }
            style={styles.image}
          />
          <View style={styles.QRContainer}>
            <QRCode
              color={Color.primary}
              backgroundColor={Color.white}
              size={hp(25)}
              value={JSON.stringify(profileData)}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => {}} style={styles.sendButtonView}>
        <Text style={styles.sendText}>Share QR Code</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QRCodeViewScreen;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
      alignItems: "center",
    },
    newFriendView: {
      width: wp(90),
      backgroundColor: Color.white,
      alignItems: "center",
      height: hp(50),
      borderRadius: mvs(40),
    },
    image: {
      width: mvs(120),
      height: mvs(120),
      borderRadius: mvs(120),
      marginTop: mvs(-60),
    },
    QRview: {
      flex: 1,
      alignItems: "center",
      marginTop: mvs(110),
    },
    QRContainer: {
      marginTop: mvs(30),
    },
    sendButtonView: {
      position: "absolute",
      width: wp(90),
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      height: mvs(55),
      backgroundColor: Color.primary,
      borderRadius: ms(40),
      bottom: useSafeAreaInsets().bottom + mvs(5),
    },
    sendText: {
      fontSize: ms(18),
      fontFamily: FONTS.robotoMedium,
      color: Color.chock_black,
    },
  });
};
