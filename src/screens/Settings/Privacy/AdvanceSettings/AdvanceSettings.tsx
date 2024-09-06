import React from "react";
import { View, StyleSheet, SafeAreaView, Text, Switch } from "react-native";
import { ms, mvs } from "react-native-size-matters";
import { HeaderWithTitle } from "components/molecules";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp } from "utils/metrix";

const AdvanceSettings = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="Advanced" blackBar />
      <View style={styles.bodyContainer}>
        <View style={styles.settingItemContainer}>
          <Text style={styles.title}>Protect IP Address in Calls</Text>

          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? Color.primary : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <Text style={styles.listOfChats}>
          To make it harder for people to infer your location, calls on this
          device will be securely relayed through WhatsApp servers. This will
          reduce call quality.
          <Text style={styles.learnMore}> Learn more</Text>
        </Text>

        <View style={styles.settingItemContainer}>
          <Text style={styles.title}>Disable Links Previews</Text>

          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? Color.primary : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <Text style={styles.listOfChats}>
          To help protect your IP address from being inferred by third-party
          websites, previews for the links you share in chats will no longer be
          generated.
          <Text style={styles.learnMore}> Learn more</Text>
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
    bodyContainer: { flex: 1, paddingBottom: hp(5) },

    settingItemContainer: {
      paddingHorizontal: ms(16),
      paddingVertical: mvs(10),
      backgroundColor: Color.white,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: hp(2),
    },
    title: {
      fontSize: mvs(14),
      color: Color.black,
    },
    value: { fontSize: mvs(14), marginEnd: mvs(8), color: Color.grey },
    valueContainer: { flexDirection: "row", alignItems: "center" },
    listOfChats: {
      paddingHorizontal: ms(16),
      fontSize: hp(1.4),
      marginTop: hp(2),
      color: Color.grey,
      fontWeight: "300",
    },
    learnMore: {
      fontWeight: "400",
      fontSize: hp(1.4),
      color: Color.primary,
    },
    icon: {
      height: hp(1.5),
      width: hp(1.5),
      tintColor: Color.arrow_icon,
    },
  });
};

export default AdvanceSettings;
