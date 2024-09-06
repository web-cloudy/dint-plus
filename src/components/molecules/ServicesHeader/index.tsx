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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ms, mvs, scale } from "react-native-size-matters";
import { Images } from "assets/images";
import { FONTS } from "constants/fonts";

type Props = {
  title: string;
  blackBar?: boolean;
  onPressBack?: any;
  showRightIcon?: boolean;
  rightIconOnPress?: void;
  showSubHeader?: boolean;
  subHeader?: string;
  containerStyles?: any;
};
const ServicesHeader: FunctionComponent<Props> = ({
  title,
  blackBar,
  onPressBack,
  showRightIcon = true,
  rightIconOnPress,
  showSubHeader,
  subHeader,
  containerStyles,
}: Props) => {
  const navigation = useNavigation<RootNavigationProp>();
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  return (
    <View style={[styles.container, containerStyles]}>
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
      >
        <Image source={Back} style={styles.backIcon} />
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>{title}</Text>
        {showSubHeader && <Text style={styles.subHeaderText}>{subHeader}</Text>}
      </View>
      {showRightIcon ? (
        <TouchableOpacity onPress={rightIconOnPress}>
          <Image source={Images.dot} style={styles.dotIcon} />
        </TouchableOpacity>
      ) : (
        <View style={styles.dotIcon} />
      )}
    </View>
  );
};

export default ServicesHeader;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      paddingTop: useSafeAreaInsets().top + mvs(5),
      flexDirection: "row",
      borderBottomColor: Color.border,
      alignItems: "center",
      backgroundColor: Color.white,
      justifyContent: "space-between",
      width: wp(100),
      paddingHorizontal: scale(10),
      paddingBottom: mvs(10),
    },
    backIcon: {
      width: hp(2.4),
      height: hp(2.4),
      tintColor: Color.primary,
    },
    dotIcon: {
      width: ms(24),
      height: ms(24),
      tintColor: Color.black,
    },
    title: {
      fontSize: hp(2.4),
      color: Color.black,
      fontWeight: "600",
      textAlign: "center",
      alignSelf: "center",
    },
    subHeaderText: {
      fontSize: ms(16),
      color: Color.grey,
      textAlign: "center",
      alignSelf: "center",
      fontFamily: FONTS.robotoRegular,
    },
  });
};
