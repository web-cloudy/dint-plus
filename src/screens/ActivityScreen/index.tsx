import React, { FunctionComponent, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ms, mvs } from "react-native-size-matters";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { FONTS } from "constants";
import DiscoverData from "constants/DiscoverData";
import { useNavigation } from "@react-navigation/native";

type Props = Record<string, never>;

const ActivityScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const onEventPress = useCallback(() => {
    navigation.navigate("Events");
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerVIew}>
        <Text style={styles.title}>Discover</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        {DiscoverData.map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(item.route);
            }}
            key={index}
            style={styles.mapView}
          >
            <View style={styles.innerView}>
              <Image
                resizeMode="contain"
                style={styles.icon}
                source={item.icon}
              />
              <Text style={styles.nameText}>{item.name}</Text>
            </View>
            <Image
              resizeMode="contain"
              style={styles.leftAerrowIcon}
              source={item.leftAerrowIcon}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
      fontSize: ms(22),
      fontFamily: FONTS.robotoBold,
    },
    headerVIew: {
      paddingTop: useSafeAreaInsets().top + mvs(5),
      paddingBottom: mvs(10),
      width: wp(100),
      backgroundColor: Color.white,
      alignItems: "center",
      justifyContent: "center",
    },
    mapView: {
      backgroundColor: Color.white,
      marginTop: mvs(10),
      paddingVertical: mvs(12),
      paddingHorizontal: ms(15),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    nameText: {
      color: Color.black,
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      marginLeft: ms(10),
    },
    icon: {
      width: ms(24),
      height: ms(24),
      tintColor: Color.black,
    },
    innerView: {
      flexDirection: "row",
      alignItems: "center",
    },
    leftAerrowIcon: {
      width: ms(12),
      height: ms(12),
      tintColor: Color.deleteBtnColor,
    },
  });
};

export default ActivityScreen;
