import React, { FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Appearance,
  Alert,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "../ChatScreen";
import { Images } from "assets/images";
import { account } from "assets/images";
import { activity } from "assets/images";
import { moment } from "assets/images";
import { service } from "assets/images";
import { ms, mvs } from "react-native-size-matters";
import ActivityScreen from "../ActivityScreen";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import useCurrentScreenName from "hooks/useCurrentScreenName";
import { AccountScreensStack } from "navigator/bottomTabs/Account.tabs.stack";
import { ServicesScreensStack } from "navigator/bottomTabs/Services.tabs.stack";
import SelectContactScreen from "screens/SelectContactScreen";

type Props = Record<string, never>;
const Tab = createBottomTabNavigator();

const MainScreen: FunctionComponent<Props> = ({}: Props) => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen name="Chats" component={ChatScreen} />
      <Tab.Screen name="Contacts" component={SelectContactScreen} />
      <Tab.Screen name="Discover" component={ActivityScreen} />
      <Tab.Screen name="Me" component={AccountScreensStack} />
    </Tab.Navigator>
  );
};

function MyTabBar({ state, descriptors, navigation }) {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const currentRoute = useCurrentScreenName();

  const renderIcon = (label, isFocused) => {
    if (isFocused) {
    }
    switch (label) {
      case "Chats":
        return (
          <Image
            source={Images.chat}
            style={{
              width: mvs(24),
              height: mvs(24),
              tintColor: isFocused ? Color.primary : Color.disabled,
            }}
          />
        );
      case "Contacts":
        return (
          <Image
            source={Images.contact}
            style={{
              width: mvs(24),
              height: mvs(24),
              tintColor: isFocused ? Color.primary : Color.disabled,
            }}
          />
        );
      case "Discover":
        return (
          <Image
            source={Images.discover}
            style={{
              width: mvs(24),
              height: mvs(24),
              tintColor: isFocused ? Color.primary : Color.disabled,
            }}
          />
        );
      case "Me":
        return (
          <Image
            source={Images.channels}
            style={{
              width: mvs(24),
              height: mvs(24),
              tintColor: isFocused ? Color.primary : Color.disabled,
            }}
          />
        );
    }
  };
  return (
    <View style={{ backgroundColor: Color.white }}>
      <Image
        source={Color?.theme === "dark" ? Images.background : Images.white_back}
        resizeMode="contain"
        style={{
          height: hp(9.4),
          width: wp(100),
          backgroundColor:
            Color?.theme === "light" && currentRoute === "Account"
              ? Color.backgroundColor
              : Color.plain_white,
          overflow: "hidden",
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: ms(15),
          flexDirection: "row",
          backgroundColor: "transparent",
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, backgroundColor: "transparent" }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
              >
                {renderIcon(label, isFocused)}
                <Text
                  style={{
                    color: isFocused ? Color.primaryDark : Color.disabled,
                    marginTop: mvs(4),
                    fontSize: mvs(11),
                  }}
                >
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Services");
        }}
        style={styles.plusIconContainer}
      >
        <Image source={Images.plus} style={styles.iconStyle} />
      </TouchableOpacity>
    </View>
  );
}

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    plusIconContainer: {
      width: hp(5.5),
      height: hp(5.5),
      position: "absolute",
      backgroundColor: Color.primary,
      zIndex: 10,
      borderRadius: hp(5.5),
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      bottom: mvs(60),
    },
    iconStyle: {
      width: hp(3),
      height: hp(3),
      alignSelf: "center",
      tintColor: Color.plain_white,
    },
  });
};

export default MainScreen;
