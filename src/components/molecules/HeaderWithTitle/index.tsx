import React, { FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import Back from "assets/images/back.png";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "navigator/navigation";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";

type Props = {
  title: string;
  blackBar?: boolean;
  onPressBack?: any;
};
const HeaderWithTitle: FunctionComponent<Props> = ({
  title,
  blackBar,
  onPressBack,
}: Props) => {
  const navigation = useNavigation<RootNavigationProp>();
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  return (
    <View
      style={[
        styles.container,
        blackBar && {
          backgroundColor: Color.white,
          top: -hp(8),
          paddingTop: hp(8),
          marginBottom: -hp(8),
          borderBottomColor: Color.white,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          if (onPressBack) {
            onPressBack();
          } else {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              BackHandler.exitApp();
            }
          }
        }}
        style={[
          styles.backView,
          blackBar && {
            top: hp(8),
          },
        ]}
      >
        <Image source={Back} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default HeaderWithTitle;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingVertical: hp(1),
      paddingHorizontal: wp(5),
      borderBottomWidth: 1,
      borderBottomColor: Color.border,
      alignItems: "center",
      backgroundColor: Color.white,
      justifyContent: "center",
      width: wp(100),
    },
    backView: {
      width: wp(10),
      justifyContent: "flex-start",
      alignItems: "center",
      left: 0,
      position: "absolute",
      paddingHorizontal: hp(4),
      zIndex: 100,
    },
    backIcon: {
      width: hp(2.3),
      height: hp(2.3),
      tintColor: Color.black,
    },
    title: {
      fontSize: hp(2.4),
      color: Color.black,
      fontWeight: "600",
      textAlign: "center",
      alignSelf: "center",
      width: "100%",
    },
  });
};
