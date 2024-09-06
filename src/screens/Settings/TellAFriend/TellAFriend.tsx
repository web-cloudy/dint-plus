import React, { FunctionComponent } from "react";
import { StyleSheet, Alert, Text, View, Switch, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ms, mvs } from "react-native-size-matters";
import {
  AccountItem,
  HeaderWithTitle,
  SettingItem,
} from "components/molecules";
import useAppDispatch from "hooks/useAppDispatch";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { SafeAreaView } from "react-native-safe-area-context";
import { Images } from "assets/images";

type Props = Record<string, never>;

const TellAFriend: FunctionComponent<Props> = ({}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="Tell A Friend" blackBar />
      <Image
        source={Images.tellAfriend}
        resizeMode="contain"
        style={styles.iconView}
      />
      <Text style={styles.decText}>SHARE YOUR LINK</Text>
      <View style={styles.bottomView}>
        <Image
          source={Images.link}
          resizeMode="contain"
          style={styles.linkIcon}
        />
        <Text style={styles.linkText}>https://www.Dint.com</Text>
      </View>
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
      alignItems: "center",
    },
    iconView: {
      height: hp(30),
      width: hp(30),
    },
    decText: {
      color: Color.primary,
      fontSize: hp(1.7),
      fontWeight: "700",
      paddingHorizontal: wp(5),
      marginVertical: hp(3),
    },
    bottomView: {
      width: wp(90),
      alignSelf: "center",
      backgroundColor: Color.white,
      borderRadius: 5,
      alignItems: "center",
      flexDirection: "row",
      padding: wp(3),
    },
    linkIcon: {
      height: hp(2.1),
      width: hp(2.1),
      tintColor: Color.black,
    },
    linkText: {
      fontSize: hp(1.7),
      fontWeight: "600",
      color: Color.black,
      marginLeft: wp(5),
    },
  });
};

export default TellAFriend;
