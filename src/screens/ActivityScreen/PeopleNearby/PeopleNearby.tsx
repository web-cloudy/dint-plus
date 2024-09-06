import {
  AppRegistry,
  AppState,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { ServicesHeader } from "components/molecules";
import { hp, wp } from "utils/metrix";
import { ms, mvs, scale, verticalScale } from "react-native-size-matters";
import { Images } from "assets/images";
import { FONTS } from "constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getCurrentLocation,
  requestLocationPermissionForNearbyPeople,
} from "utils";
import { useDispatch } from "react-redux";
import { groupNearby, peopleNearby } from "store/slices/chat";
import { useIsFocused } from "@react-navigation/native";

const PeopleNearby = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [showAllowButton, setShowAllowButton] = useState(false);
  console.log("🚀 ~ PeopleNearby ~ showAllowButton:", showAllowButton);
  const dispatch = useDispatch();

  const showPermision = async () => {
    const hasPermission = await requestLocationPermissionForNearbyPeople();
    if (!hasPermission) {
      setShowAllowButton(true);
    } else {
      setShowAllowButton(false);
      const { latitude, longitude } = await getCurrentLocation();
      const data = {
        latitude: latitude,
        longitude: longitude,
        max_distance_km: 100000,
      };
      const res = await dispatch(peopleNearby(data));
      const res1 = await dispatch(groupNearby(data));
      if (res?.payload?.data && res1?.payload?.data) {
        navigation.replace("ShowNearbyPeople");
      }
    }
  };

  useEffect(() => {
    showPermision();
  }, []);

  useEffect(() => {
    // Check the app state when the component is focused
    const instance = AppState.addEventListener("change", async (e) => {
      console.log("🚀 ~ instance ~ e:", e);
      if (e === "active" && Platform.OS == "ios") {
        showPermision();
      }
    });
    return () => {
      instance.remove();
    };
  }, []);

  const allowOnPress = async () => {
    await requestLocationPermissionForNearbyPeople();
  };
  return (
    <View style={styles.container}>
      <ServicesHeader title="People Nearby" showRightIcon={false} />
      <View style={styles.ringView}>
        <View style={styles.ringInnerView}>
          <View style={styles.innerView}>
            <Image
              style={styles.locationIcon}
              resizeMode="contain"
              source={Images.LocationNew}
            />
          </View>
        </View>
      </View>
      <Text style={styles.peopleText}>People Nearby</Text>
      <Text style={styles.quicklyText}>
        Quickly add people nearby who are also viewing this section and discover
        local group chats.
      </Text>
      {showAllowButton && (
        <>
          <Text style={[styles.quicklyText, { marginTop: hp(2) }]}>
            Please allow on location access to enable this feature.
          </Text>
          <TouchableOpacity onPress={allowOnPress} style={styles.allowButton}>
            <Text style={styles.allowText}>Allow Access</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PeopleNearby;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    ringView: {
      marginTop: hp(10),
      width: mvs(174),
      height: mvs(174),
      borderWidth: 1,
      borderColor: Color.primary,
      alignSelf: "center",
      borderRadius: mvs(174),
      alignItems: "center",
      justifyContent: "center",
    },
    ringInnerView: {
      width: mvs(150),
      height: mvs(150),
      borderWidth: 1,
      borderColor: Color.primary,
      alignSelf: "center",
      borderRadius: mvs(150),
      alignItems: "center",
      justifyContent: "center",
    },
    innerView: {
      width: mvs(120),
      height: mvs(120),
      backgroundColor: Color.primary,
      alignSelf: "center",
      borderRadius: mvs(120),
      alignItems: "center",
      justifyContent: "center",
    },
    locationIcon: {
      width: mvs(56),
      height: mvs(56),
      tintColor: Color.chock_black,
    },
    peopleText: {
      fontSize: ms(24),
      fontFamily: FONTS.robotoBold,
      color: Color.black,
      textAlign: "center",
      marginTop: hp(6),
    },
    quicklyText: {
      alignSelf: "center",
      fontSize: ms(18),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
      textAlign: "center",
      marginTop: hp(3),
      width: wp(90),
    },
    allowButton: {
      position: "absolute",
      bottom: useSafeAreaInsets().bottom + mvs(10),
      alignSelf: "center",
      height: mvs(56),
      width: wp(90),
      backgroundColor: Color.primary,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: ms(40),
    },
    allowText: {
      fontSize: ms(18),
      fontFamily: FONTS.robotoRegular,
    },
  });
};
