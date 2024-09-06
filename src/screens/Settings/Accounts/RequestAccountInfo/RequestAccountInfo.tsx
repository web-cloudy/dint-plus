import React, { FunctionComponent } from "react";
import { StyleSheet, Alert, Text, View, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ms, mvs } from "react-native-size-matters";
import { AccountItem, HeaderWithTitle } from "components/molecules";
import useAppDispatch from "hooks/useAppDispatch";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = Record<string, never>;

const RequestAccountInfo: FunctionComponent<Props> = ({}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="Request Account Info" blackBar />
      <Text style={styles.title}>Account Information</Text>
      <View style={styles.topView}>
        <Text style={styles.topHeading}>Request Sent</Text>
        <Text style={styles.topDesc}>22 june , 2024</Text>
      </View>
      <Text style={styles.decText}>
        Your report will be ready in about 3 days. You'll have a few weeks to
        download your report after it's available.{"\n\n"}Your request will be
        canceled if you make changes to your account such as changing your
        number or deleting your account
      </Text>
      <View
        style={[styles.topView, { flexDirection: "row", alignItems: "center" }]}
      >
        <Text style={styles.topHeading}>Request Sent</Text>
        <Switch
          trackColor={{ false: "#767577", true: Color.primary }}
          thumbColor={isEnabled ? Color.black : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <Text style={styles.decText}>
        New report will be created every month.
        <Text style={{ color: Color.primary, fontWeight: "500" }}>
          {" "}
          Learn more
        </Text>
      </Text>
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    title: {
      color: Color.black,
      fontSize: hp(1.6),
      fontWeight: "600",
      padding: wp(5),
    },
    topView: {
      width: wp(100),
      backgroundColor: Color.white,
      padding: wp(5),
      justifyContent: "space-between",
    },
    topHeading: {
      color: Color.black,
      fontSize: hp(1.8),
      fontWeight: "400",
    },
    topDesc: {
      color: Color.black,
      fontSize: hp(1.3),
      fontWeight: "400",
      marginTop: hp(0.3),
    },
    decText: {
      color: Color.descriptionColor,
      fontSize: hp(1.5),
      fontWeight: "400",
      padding: wp(5),
    },
  });
};

export default RequestAccountInfo;
