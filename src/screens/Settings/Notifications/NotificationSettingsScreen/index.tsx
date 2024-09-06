import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Switch,
  Image,
} from "react-native";
import { ms, mvs } from "react-native-size-matters";
import { AccountItem, HeaderWithTitle } from "components/molecules";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { Images } from "assets/images";
import { hp } from "utils/metrix";

const NotificationSettingsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="Notifications" blackBar />
      <View style={styles.bodyContainer}>
        {/* Message Notifications */}
        <View style={{ marginTop: mvs(32) }}>
          <Text style={styles.messageNotification}>MESSAGE NOTIFICATIONS</Text>
          <View style={styles.settingItemContainer}>
            <Text style={styles.title}>Show Notifications</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? Color.primary : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <AccountItem title="Sound" option="Note" line />
        </View>

        {/* In-App Notifications */}
        <View style={{ marginTop: mvs(20), marginBottom: mvs(8) }}>
          <View style={styles.settingItemContainer}>
            <View>
              <Text style={styles.title}>In-App Notifications</Text>
              <Text
                style={{
                  fontSize: mvs(10),
                  color: Color.black,
                }}
              >
                Banners, Sounds, Vibrate
              </Text>
            </View>

            <Image
              resizeMode="contain"
              source={Images.arrowRight}
              style={styles.icon}
            />
          </View>
        </View>

        <View style={styles.settingItemContainer}>
          <Text style={styles.title}>Show Preview</Text>

          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? Color.primary : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <Text style={styles.previewMessage}>
          Preview message text inside new message notifications
        </Text>

        <View style={styles.settingItemContainer}>
          <Text style={styles.resetNotification}>
            Reset Notification Settings
          </Text>
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
    messageNotification: {
      paddingHorizontal: ms(16),
      fontSize: mvs(12),
      marginBottom: mvs(5),
      color: Color.grey,
    },
    settingItemContainer: {
      paddingHorizontal: ms(16),
      paddingVertical: mvs(10),
      backgroundColor: Color.white,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: mvs(14),
      color: Color.black,
    },
    previewMessage: {
      paddingHorizontal: ms(16),
      fontSize: mvs(12),
      marginTop: mvs(15),
      marginBottom: mvs(20),

      color: Color.grey,
    },
    resetNotification: {
      fontSize: mvs(14),
      color: "red",
    },
    icon: {
      height: hp(1.5),
      width: hp(1.5),
      tintColor: Color.white,
    },
  });
};
export default NotificationSettingsScreen;
