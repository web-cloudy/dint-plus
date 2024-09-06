import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Appearance,
  Alert,
} from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { AvatarPNG, Images } from "assets/images";
import { ms, mvs } from "react-native-size-matters";
import { HeaderWithTitle, SettingItem } from "components/molecules";
import { ProfileSelectors } from "store/slices/profile";
import { Loader } from "components/atoms";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "contexts/ThemeContext";
import { hp } from "utils/metrix";

const Help = ({ navigation }) => {
  const { loading } = ProfileSelectors();
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  return (
    <SafeAreaView style={styles.container}>
      {loading && <Loader visible={loading} />}
      <HeaderWithTitle title="Help" blackBar />
      <View style={styles.bodyContainer}>
 
        <View style={styles.separator}>
          <SettingItem
            help
            icon={Images.getStarted}
            title={"Get Started"}
          />
          <SettingItem
            help
            icon={Images.helpChat}
            title={"Chats"}
            onPress={() => navigation.navigate("ChatHelp")}

          />
          <SettingItem
            help
            icon={Images.bussiness}
            title={"Connection with Businesses"}
          />
          <SettingItem
            help
            icon={Images.call}
            title={"Voice and Video call"}
          />
          <SettingItem
            help
            icon={Images.chat}
            title={"Communities"}
          />

          <SettingItem
            help
            icon={Images.safe}
            title={"Privacy, Security and safty"}
            noLine
          />
        </View>
        <View style={styles.bottomView}>
          <Image
            resizeMode="contain"
            source={Images.helpImg}
            style={styles.helpIcon}
          />
          <Text style={styles.heading1}>Need more help?</Text>
          <Text style={styles.heading2}>
            Contact us. We will respond you in a Dint chat
          </Text>
          <Text style={styles.heading3}>Contact Support</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    bodyContainer: { flex: 1 },
    userInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Color.white,
      paddingVertical: mvs(8),
      paddingHorizontal: ms(16),
      marginTop: mvs(16),
    },
    image: { width: ms(50), height: ms(50), borderRadius: ms(25) },
    nameStatusContainer: { marginStart: mvs(10), flex: 1 },
    name: {
      fontSize: mvs(16),
      color: Color.black,
      fontWeight: "700",
    },
    status: {
      color: Color.grey,
      fontSize: mvs(14),
    },
    separator: {
      marginTop: mvs(16),
    },
    bottomView: {
      marginVertical: hp(4),
      alignSelf: "center",
      alignItems: "center",
    },
    helpIcon: {
      height: hp(5),
      width: hp(5),
    },
    heading1: {
      fontSize: hp(2.1),
      color: Color.black,
      fontWeight: "600",
      marginTop: hp(0.5),
    },
    heading2: {
      fontSize: hp(1.6),
      color: Color.black,
      fontWeight: "400",
      marginVertical: hp(1),
    },
    heading3: {
      fontSize: hp(2.1),
      color: Color.primary,
      fontWeight: "600",
      textDecorationLine:'underline'
    },
  });
};

export default Help;
