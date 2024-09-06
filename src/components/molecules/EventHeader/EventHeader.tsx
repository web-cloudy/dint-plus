import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  BackHandler,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Back from "assets/images/back.png";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "navigator/navigation";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";
import { ms, mvs } from "react-native-size-matters";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

type Props = {
  title: string;
  blackBar?: boolean;
  onPressBack?: any;
  keyword: string;
  setKeyword: any;
};
const EventHeader: FunctionComponent<Props> = ({
  title,
  blackBar,
  onPressBack,
  keyword,
  setKeyword,
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
          justifyContent: "space-between",
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
            top: hp(8.5),
          },
        ]}
      >
        <Image source={Back} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.searchView}>
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
            // dispatch(searchUserAPI(text));
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
      </View>
      <TouchableOpacity onPress={() => setKeyword("")}></TouchableOpacity>

      <Menu>
        <MenuTrigger>
          {/* <OptionSVG width={ms(18)} height={ms(18)} /> */}
          <Image
            resizeMode="contain"
            style={styles.groupIcon}
            source={Images.group}
          />
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={{
            padding: ms(5),
            backgroundColor: Color?.white,
          }}
        >
          <MenuOption onSelect={() => navigation.navigate("CreateEvent")}>
            <Text style={{ color: Color.black, fontSize: mvs(14) }}>
              New event
            </Text>
          </MenuOption>
          <MenuOption onSelect={() => navigation.navigate("Earnings")}>
            <Text style={{ color: Color.black, fontSize: mvs(14) }}>
              Earnings
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
  );
};

export default EventHeader;

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
      alignSelf: "center",
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
      marginLeft: wp(10),
    },
    search: {
      flex: 1,
      paddingLeft: wp(2),
      fontSize: hp(1.5),
      color: Color.light_grey,
      paddingVertical: 0,
    },
    searchView: {
      width: wp(55),
      borderRadius: 40,
      backgroundColor: Color.search_back,
      height: hp(3),
      paddingHorizontal: wp(2),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginLeft: wp(3),
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
    groupIcon: {
      height: hp(2),
      width: wp(1),
      paddingHorizontal: wp(3),
      marginRight: -wp(3),
    },
  });
};
