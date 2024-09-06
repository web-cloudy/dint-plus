import React, { FunctionComponent, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  BackHandler,
} from "react-native";
import Back from "assets/images/back.png";
import { useNavigation } from "@react-navigation/native";
import { ms, mvs, vs } from "react-native-size-matters";
import { getCurrentTheme } from "constants/Colors";
import { AvatarPNG, Images } from "assets/images";
import { RootNavigationProp } from "navigator/navigation";
import { useTheme } from "contexts/ThemeContext";
import { hp } from "utils/metrix";

type Props = {
  title: string;
  profilePic?: string;
  onPressBackButton?: any;
  setImageToShow?: any;
  onVideoCallPress?: () => void;
  onPhoneCallPress?: () => void;
};
const ChatDetailHeader: FunctionComponent<Props> = ({
  title,
  profilePic,
  onPressBackButton,
  setImageToShow,
  onVideoCallPress,
  onPhoneCallPress,
}: Props) => {
  const navigation = useNavigation<RootNavigationProp>();
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  const onBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      BackHandler.exitApp();
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        onPress={() => (onPressBackButton ? onPressBackButton() : onBackPress)}
      >
        <Image source={Back} style={styles.backIcon} />
      </TouchableOpacity> */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => setImageToShow(profilePic || "empty")}>
          <Image
            style={styles.image}
            source={profilePic ? { uri: profilePic } : AvatarPNG}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={{ marginRight: ms(20) }}
          onPress={onVideoCallPress}
        >
          <Image style={styles.videoCallIcon} source={Images.videoCall} />
        </TouchableOpacity>

        <TouchableOpacity style={{}} onPress={onPhoneCallPress}>
          <Image
            resizeMode="contain"
            style={styles.phoneIcon}
            source={Images.phone}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatDetailHeader;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",

      paddingHorizontal: ms(16),
      borderBottomWidth: 1,
      borderBottomColor: Color?.theme === "dark" ? "transparent" : Color.border,
      alignItems: "center",
      backgroundColor: Color.white,
      // marginTop: -hp(5.5),
      // paddingTop: hp(5.5),
      paddingVertical: mvs(10),
      justifyContent: "space-between",
    },
    backIcon: {
      width: hp(2),
      height: hp(2),
      tintColor: Color.black,
    },
    image: {
      width: hp(5),
      height: hp(5),
      backgroundColor: "#dcdcdc",
      borderRadius: hp(5),
    },
    title: {
      fontSize: hp(2),
      color: Color.black,
      fontWeight: "600",
      marginStart: ms(10),
    },
    videoCallIcon: {
      tintColor: Color.black,
      height: ms(15),
      width: ms(24),
    },
    phoneIcon: {
      tintColor: Color.black,
      height: ms(16),
      width: ms(24),
    },
  });
};
