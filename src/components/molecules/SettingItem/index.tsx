import React, { FunctionComponent, ReactElement } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ViewStyle,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import { ms, mvs } from "react-native-size-matters";
import { arrowRight, Images } from "assets/images/index";
import { useNavigation } from "@react-navigation/native";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp } from "utils/metrix";

type Props = {
  style?: ViewStyle;
  icon: ImageSourcePropType;
  title: string;
  route?: string;
  noLine?: boolean;
  onPress?: () => void;
  help?: boolean;
};

const SettingItem: FunctionComponent<Props> = ({
  style,
  icon,
  title,
  route,
  noLine,
  onPress,
  help,
}: Props) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  return (
    <TouchableOpacity
      activeOpacity={1.0}
      style={style}
      onPress={() => {
        (route && navigation.navigate(route)) || (onPress && onPress());
      }}
    >
      <View style={styles.container}>
        <View style={styles.iconView}>
          <Image
            resizeMode="contain"
            source={icon}
            style={[
              styles.iconStyle,
              title === "Payouts" && {
                width: hp(2.5),
                height: hp(2.5),
              },
              title?.includes("Appearance") && styles.appearanceStyle,
              {
                tintColor: help ? Color.primary : Color.black,
              },
            ]}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: noLine ? 0 : 0.5,
            height: "100%",
            borderBottomColor: Color.borderLine,
            flex: 1,
            paddingRight: ms(16),
            marginLeft: ms(16),
            paddingVertical: mvs(15),
          }}
        >
          <Text style={styles.title}>{title}</Text>
          <Image
            resizeMode="contain"
            source={Images.arrowRight}
            style={{
              width: hp(1.4),
              height: hp(1.4),
              tintColor: Color.grey,
              alignSelf: "center",
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SettingItem;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Color.white,
      paddingLeft: ms(16),
    },
    title: {
      fontSize: mvs(14),
      color: Color.black,
      flex: 1,
    },
    iconView: {
      height: hp(3.4),
      width: hp(3.4),
      justifyContent: "center",
      alignItems: "center",
    },
    iconStyle: {
      height: hp(3.4),
      width: hp(3.4),
      tintColor: Color.black,
    },
    appearanceStyle: {
      height: hp(2),
      width: hp(2),
    },
  });
};
