import React from "react";
import { View, StyleSheet, Text, Switch, Image } from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { ms, mvs } from "react-native-size-matters";
import { AccountItem, HeaderWithTitle } from "components/molecules";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";

const ChatsBackup = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="Chat Backup" blackBar />
      <View style={styles.bodyContainer}>
        <View style={styles.backupArea}>
          <Image
            source={Images.info}
            resizeMode="contain"
            style={styles.info}
          />

          <Text style={[styles.desc, { fontWeight: "400" }]}>
            Sign in to iCloud to back up your history. Tap here for
            instructions.
          </Text>
        </View>

        <View style={styles.separator}>
          <View style={styles.backupArea}>
            <Image
              source={Images.backup}
              resizeMode="contain"
              style={styles.backup}
            />
            <View>
              <Text style={styles.backupTxt}>Last backup : Unknown</Text>
              <Text style={styles.backupTxt}>Total size : Unknown</Text>
            </View>
          </View>

          <Text style={[styles.desc, { lineHeight: 22 }]}>
            Back up your chat history and media to iCloud so if you lose your
            iPhone or switch to a new one, your chat history is safe. You can
            restore your chat history and media when you reinstall Dint Plus
          </Text>
        </View>

        <View style={styles.separator}>
          <AccountItem title={"Auto backup"} option="Off" onPress={() => {}} />
        </View>

        <View
          style={[
            styles.topView,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <Text style={styles.topHeading}>Includes videos</Text>
          <Switch
            trackColor={{ false: "#767577", true: Color.primary }}
            thumbColor={isEnabled ? Color.black : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <Text style={styles.desc}>
          To avoid excessive data charges, connect your phone to Wi-Fi or
          disable cellular data for iCloud.
        </Text>
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
      backgroundColor: Color.white,
      marginTop: mvs(16),
    },

    topView: {
      width: wp(100),
      backgroundColor: Color.white,
      paddingHorizontal: wp(5),
      justifyContent: "space-between",
      paddingVertical: hp(1),
      marginTop: hp(2),
    },
    topHeading: {
      color: Color.black,
      fontSize: hp(1.8),
      fontWeight: "400",
    },
    desc: {
      fontSize: hp(1.4),
      color: Color.black,
      fontWeight: "300",
      paddingHorizontal: wp(5),
      marginVertical: hp(1),
    },
    primaryTxt: {
      fontSize: hp(1.87),
      color: Color.primary,
      fontWeight: "400",
      paddingHorizontal: wp(5),
      marginVertical: hp(1),
    },
    redTxt: {
      fontSize: hp(1.87),
      color: Color.red,
      fontWeight: "400",
      paddingHorizontal: wp(5),
      marginVertical: hp(1),
    },
    title: {
      fontSize: hp(1.87),
      color: Color.fixedWhite,
      fontWeight: "400",
      paddingHorizontal: wp(5),
      marginVertical: hp(1),
    },
    backupArea: {
      flexDirection: "row",
      width: "100%",
      paddingHorizontal: wp(5),
      paddingVertical: hp(2),
    },
    backupTxt: {
      fontSize: hp(1.5),
      fontWeight: "500",
      color: Color.black,
    },
    backup: {
      width: wp(10),
      height: hp(3.8),
      marginRight: wp(2),
    },
    info: {
      width: hp(1.9),
      height: hp(1.9),
      alignSelf: "center",
    },
  });
};

export default ChatsBackup;
