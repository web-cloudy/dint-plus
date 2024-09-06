import React, { FunctionComponent, useState } from "react";
import { StyleSheet, Text, Image } from "react-native";

import { getCurrentTheme } from "constants/Colors";
import { Button } from "components/atoms";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";
import { SafeAreaView } from "react-native-safe-area-context";
import AllowTermsModal from "components/organisms/AllowTermsModal/AllowTermsModal";

type Props = Record<string, never>;

const OnBoardingScreen: FunctionComponent<Props> = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [showModal, setShowModal] = useState(false);
  return (
    <SafeAreaView style={[styles.container]}>
      <Text style={styles.titleText}>Welcome to Dint Plus</Text>
      <Text numberOfLines={2} style={styles.heading}>
        A simple, secure and reliable way for your business to connect with your
        customers
      </Text>

      <Image
        source={Images.onboarding}
        resizeMode="contain"
        style={styles.imgIcon}
      />

      <Text numberOfLines={3} style={styles.detailTxt}>
        To help improve experiences for you and your customers, Dint plus parent
        company Meta receives information like your business profile and
        catalog. Learn more
      </Text>

      <Text numberOfLines={2} style={styles.terms}>
        Tap <Text style={{ color: Color.primary }}>"Agree & continue"</Text> to
        accept the Dint Plus Terms of Service
      </Text>

      <Button
        btnStyle={styles.btnView}
        text="Agree & Continue"
        onPress={() => {
          setShowModal(true);
        }}
      />

      <AllowTermsModal
        isVisible={showModal}
        hideModal={() => setShowModal(false)}
        onPressAllow={() => {
          navigation.navigate("SignUp");
          setShowModal(false);
        }}
        onPressDontAllow={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.plain_white,
      paddingVertical: hp(2),
      alignItems: "center",
      paddingHorizontal: wp(5),
    },
    titleText: {
      fontSize: hp(2.8),
      marginTop: hp(3),
      fontWeight: "700",
      color: Color.black,
    },
    heading: {
      fontSize: hp(1.6),
      fontWeight: "500",
      color: Color.primary,
      marginVertical: hp(2),
      textAlign: "center",
      paddingHorizontal: wp(4),
    },
    imgIcon: {
      marginVertical: hp(4),
      height: hp(31),
      width: hp(31),
    },
    detailTxt: {
      fontSize: hp(1.4),
      fontWeight: "300",
      color: Color.black,
      textAlign: "center",
      lineHeight: hp(2.5),
    },
    terms: {
      fontSize: hp(1.5),
      fontWeight: "400",
      color: Color.black,
      marginVertical: hp(5),
      textAlign: "center",
      paddingHorizontal: wp(4),
    },
    btnView: {
      alignSelf: "center",
      width: wp(90),
      bottom: hp(5),
      position: "absolute",
    },
  });
};

export default OnBoardingScreen;
