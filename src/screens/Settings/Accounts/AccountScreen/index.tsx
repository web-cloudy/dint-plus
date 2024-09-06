import React from "react";
import { View, StyleSheet, Image, SafeAreaView } from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { ms, mvs } from "react-native-size-matters";
import { AccountItem, HeaderWithTitle } from "components/molecules";
import { useTheme } from "contexts/ThemeContext";
import { ROUTES } from "constants";

const SettingsAccountScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="Account" blackBar />
      <View style={styles.bodyContainer}>
        {/* Setting Option 1 */}
        <View style={styles.separator}>
          <AccountItem
            title={"Email Address"}
            onPress={() => navigation.navigate(ROUTES.ChangeEmailScreen)}
          />
        </View>

        {/* Setting Option 2 */}
        <View style={styles.separator}>
          <AccountItem
            title={"Request Account Info"}
            onPress={() => navigation.navigate("RequestAccountInfo")}
          />
          <AccountItem
            title={"Delete My Account"}
            onPress={() => navigation.navigate(ROUTES.DeleteAccountScreen)}
          />
        </View>
        <View style={styles.separator}>
          <AccountItem
            title={"Change Mobile Number"}
            onPress={() => navigation.navigate(ROUTES.ChangeNumberScreen)}
          />
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
    separator: {
      marginTop: mvs(16),
    },
  });
};

export default SettingsAccountScreen;
