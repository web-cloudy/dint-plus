import React from "react";
import { View, StyleSheet, Text, Switch } from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { ms, mvs } from "react-native-size-matters";
import {
  AccountItem,
  HeaderWithTitle,
} from "components/molecules";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";

const ChatHelp = ({ navigation }) => {
  const { theme, setTheme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="Chats" blackBar />
      <View style={styles.bodyContainer}>
        <View style={styles.separator}>
          <AccountItem title={"Chat Wallpaper"} onPress={() => {}} />
        </View>
        <View style={styles.separator}>
          <AccountItem title={"Chat backup"} onPress={() => {navigation.navigate('ChatBackup')}} />
          <AccountItem title={"Export chat"} onPress={() => {}} />
        </View>

        <View
          style={[
            styles.topView,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <Text style={styles.topHeading}>Save to photos</Text>
          <Switch
            trackColor={{ false: "#767577", true: Color.primary }}
            thumbColor={isEnabled ? Color.black : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <View
          style={[
            styles.topView,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <Text style={styles.topHeading}>Keep chats archived</Text>
          <Switch
            trackColor={{ false: "#767577", true: Color.primary }}
            thumbColor={isEnabled ? Color.black : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <Text style={styles.desc}>
          Archived chats will remains archived when you receive a new message .
        </Text>
        <View style={styles.separator}>
          <Text style={styles.primaryTxt}>Move chats to Android </Text>

          <Text style={styles.primaryTxt}>Move chats to Iphone</Text>
        </View>

        <View style={styles.separator}>
          <Text style={styles.title}>Archive all chats</Text>

          <Text style={styles.redTxt}>Clear all chats</Text>

          <Text style={styles.redTxt}>Delete all chats</Text>
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
  });
};

export default ChatHelp;
