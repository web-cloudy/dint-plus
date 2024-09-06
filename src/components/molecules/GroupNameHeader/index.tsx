import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  BackHandler,
  TextInput,
  Pressable,
  ImageSourcePropType,
} from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Back from "assets/images/back.png";
import { useNavigation } from "@react-navigation/native";
import { ms, mvs, vs } from "react-native-size-matters";
import { useDispatch } from "react-redux";
import { searchUserAPI } from "store/slices/chat";
import { GroupImagePlaceholder, OptionSVG } from "assets/svgs";
import { RootNavigationProp } from "navigator/navigation";
import {getCurrentTheme} from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
const Color = getCurrentTheme();

type Props = {
  onClickGroupImage?: any;
  image?: ImageSourcePropType;
  onChangeText?: (text: string) => void;
  value?: string;
};
const GroupNameHeader: FunctionComponent<Props> = ({
  onClickGroupImage,
  image,
  onChangeText,
  value
}: Props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<RootNavigationProp>();
  const { theme } = useTheme()
  const Color = getCurrentTheme(theme || 'light')
  const styles = screenStyles(Color)

  const onBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      BackHandler.exitApp();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", flexDirection: "row" }}>
        <TouchableOpacity onPress={onBackPress}>
          <Image source={Back} style={styles.backIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClickGroupImage}>
          {image ? (
            <Image
              style={{
                width: ms(40),
                height: ms(40),
                borderRadius: 100,marginStart: ms(10)
              }}
              source={{ uri: image }}
            />
          ) : (
            <GroupImagePlaceholder
              style={{ marginStart: ms(10) }}
              width={ms(40)}
              height={ms(40)}
            />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Group Name (Optional)"
          placeholderTextColor={Color.black}
          value={value}
          onChangeText={onChangeText}
          style={{
            marginStart: ms(10),
            height: mvs(35),
            flex: 1,
          }}
        />
      </View>
    </View>
  );
};

export default GroupNameHeader;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: vs(8),
    paddingHorizontal: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Color.primary,
  },
  backIcon: {
    width: ms(16),
    height: ms(16),
  },
  image: {
    width: ms(50),
    height: ms(50),
    backgroundColor: "#dcdcdc",
    borderRadius: ms(25),
    marginStart: ms(10),
  },
  title: {
    fontSize: ms(18),
    color: Color.black,
    fontWeight: "500",
    marginStart: ms(10),
  },
  subTitle: {
    fontSize: ms(12),
    color: Color.black,
    fontWeight: "500",
    marginStart: ms(10),
  },
  search: {
    width: ms(200),
    backgroundColor: Color.messageBackgroundSender,
    paddingVertical: vs(5),
    height: mvs(30),
    paddingHorizontal: ms(10),
    fontSize: mvs(12),
  },
});
}