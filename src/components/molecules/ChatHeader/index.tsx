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
import { OptionSVG } from "assets/svgs";
import { RootNavigationProp } from "navigator/navigation";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";

type Props = {
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  hideIcon?: boolean;
};
const ChatHeader: FunctionComponent<Props> = ({
  keyword,
  setKeyword,
  hideIcon,
}: Props) => {
  const dispatch = useDispatch();
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
      <View style={{ alignItems: "center", flexDirection: "row" }}>
        {hideIcon ? null : (
          <TouchableOpacity onPress={onBackPress}>
            <Image source={Back} style={styles.backIcon} />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>Chats</Text>
      </View>
      <View
        style={{
          alignSelf: "flex-end",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* <View style={styles.searchView}>
          <Image
            resizeMode="contain"
            style={styles.searchIcon}
            source={Images.searchIcon}
          />
          <TextInput
            placeholder="Search"
            style={styles.search}
            value={keyword}
            onChangeText={(text: string) => {
              setKeyword(text);
              dispatch(searchUserAPI(text || ""));
            }}
          />
          {keyword && (
            <TouchableOpacity onPress={() => setKeyword("")}>
              <Image
                resizeMode="contain"
                style={styles.closeIcon}
                source={Images.Close}
              />
            </TouchableOpacity>
          )}
        </View> */}

        <Menu>
          <MenuTrigger>
            {/* <OptionSVG width={ms(18)} height={ms(18)} /> */}
            <Image
              resizeMode="contain"
              style={styles.menuIcon}
              source={Images.menu}
            />
          </MenuTrigger>
          <MenuOptions
            optionsContainerStyle={{
              padding: ms(5),
              backgroundColor: Color?.white,
            }}
          >
            <MenuOption onSelect={() => navigation.navigate("NewGroup")}>
              <Text style={{ color: Color.black, fontSize: mvs(14) }}>
                New Group
              </Text>
            </MenuOption>
            <MenuOption onSelect={() => navigation.navigate("CreateEvent")}>
              <Text style={{ color: Color.black, fontSize: mvs(14) }}>
                New Event
              </Text>
            </MenuOption>
            <MenuOption onSelect={() => navigation.navigate("StarredMessages")}>
              <Text style={{ color: Color.black, fontSize: mvs(14) }}>
                Starred Messages
              </Text>
            </MenuOption>

            <MenuOption onSelect={() => navigation.navigate("Settings")}>
              <Text style={{ color: Color.black, fontSize: mvs(14) }}>
                Settings
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
};

export default ChatHeader;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingVertical: vs(8),
      paddingHorizontal: ms(16),
      borderBottomWidth: 1,
      borderBottomColor: Color?.theme === "dark" ? "transparent" : Color.border,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Color.white,
      height: hp(12),
      marginTop: -hp(6),
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
      fontWeight: "600",
      marginStart: ms(10),
      marginTop: hp(6),
    },
    search: {
      flex: 1,
      paddingLeft: wp(2),
      fontSize: hp(1.5),
      color: Color.light_grey,
      paddingVertical: 0,
    },
    searchView: {
      width: wp(52),
      borderRadius: 40,
      backgroundColor: Color.search_back,
      height: hp(3),
      paddingHorizontal: wp(2),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    searchIcon: {
      height: hp(1.5),
      width: hp(1.5),
      tintColor: Color.light_grey,
    },
    closeIcon: {
      height: hp(1),
      width: hp(1),
      tintColor: Color.light_grey,
    },

    menuIcon: {
      height: hp(2.5),
      width: hp(2.5),
      tintColor: Color.black,
    },
  });
};
