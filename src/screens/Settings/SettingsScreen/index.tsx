import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Appearance,
  ScrollView,
  Alert,
} from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { AvatarPNG, Images } from "assets/images";
import { ms, mvs } from "react-native-size-matters";
import { arrowRight } from "assets/images/index";
import {
  HeaderWithTitle,
  ServicesHeader,
  SettingItem,
} from "components/molecules";
import { ProfileSelectors } from "store/slices/profile";
import { Loader } from "components/atoms";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectAppearanceModal from "components/organisms/SelectAppearanceModal";
import { clearAllInAsync, storeDataInAsync } from "utils/LocalStorage";
import { useTheme } from "contexts/ThemeContext";
import HeaderWithBackButton from "components/molecules/HeaderWithTitle/HeaderWithBackButton";
import { hp, wp } from "utils/metrix";
import AccountItemForChangeUi from "components/molecules/AccountItem/AccountItem";
import { FONTS } from "constants";
import { useDispatch } from "react-redux";
import { resetLoginData } from "store/slices/users";
import { getToken } from "hooks/NotificationLisenters";
import { useAuth } from "contexts/AuthContext";

const SettingsScreen = ({ navigation }) => {
  const { profileData, loading } = ProfileSelectors();
  const [isModalVisible, setisModalVisible] = useState(false);
  const { theme, setTheme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useDispatch();
  const { setIsLoggedIn } = useAuth();

  const onLogoutPress = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          dispatch(resetLoginData());
          clearAllInAsync();
          dispatch(resetLoginData());
          setIsLoggedIn(false);
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
          getToken();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {loading && <Loader visible={loading} />}
      {/* <HeaderWithTitle title="Settings" blackBar /> */}
      {/* <View style={styles.bodyContainer}> */}
      {/* User Info Container */}
      {/* <TouchableOpacity
          style={styles.userInfoContainer}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Image
            source={
              profileData?.profile_image
                ? { uri: profileData?.profile_image }
                : AvatarPNG
            }
            style={styles.image}
          />
          <View style={styles.nameStatusContainer}>
            <Text style={styles.name}>{profileData?.display_name || ""}</Text>
            <Text style={styles.status}>Good Vibes only</Text>
          </View>
          <Image
            resizeMode="contain"
            source={arrowRight}
            style={{ width: ms(12), height: ms(12), tintColor: Color.grey }}
          />
        </TouchableOpacity> */}

      {/* Setting Option 1 */}
      {/* <View style={styles.separator}>
          <SettingItem icon={Images.star} title={"Starred Messages"} />
          <SettingItem icon={Images.linked} title={"Linked Devices"} noLine />
        </View> */}

      {/* Setting Option 2 */}
      {/* <View style={styles.separator}>
        <SettingItem
          icon={Images.accounts}
          title={"Account"}
          route="SettingsAccount"
        />
        <SettingItem
          icon={Images.data}
          title={"Privacy"}
          route="PrivacySettings"
        />
        <SettingItem
          icon={Images.notifi}
          title={"Notifications"}
          route="NotificationSettings"
        />
        <SettingItem
          icon={Images.chat}
          title={"Chats"}
          onPress={() => navigation.navigate("Chats")}
        />
        <SettingItem
          icon={Color.theme === "dark" ? Images.dark : Images.light}
          title={"Appearance"}
          onPress={() => setisModalVisible(true)}
        />
        <SettingItem
          icon={Images.payout}
          title={"Wallet"}
          noLine
          onPress={() => navigation.navigate("Payout")}
        />
      </View> */}

      {/* Setting Option 3 */}
      {/* <View style={styles.separator}>
          <SettingItem
            icon={Images.help}
            title={"Help"}
            onPress={() => navigation.navigate("Help")}
          />

          <SettingItem
            icon={Images.tell}
            title={"Tell a Friend"}
            noLine
            onPress={() => navigation.navigate("TellAFriend")}
          />
        </View> */}

      {/* Setting Option 4 */}
      {/* <View style={styles.separator}>
          <SettingItem
            icon={Images.verification}
            title={"Two Step Verification"}
            onPress={() => navigation.navigate("TwoStepVerification")}
            noLine
          />
        </View> */}

      <ServicesHeader title="Settings" showRightIcon={false} />

      <ScrollView>
        <View style={styles.newFriendView}>
          <AccountItemForChangeUi
            title="Account"
            icon={Images.userCircle}
            onPress={() => {
              navigation.navigate("SettingsAccount");
            }}
          />
          <AccountItemForChangeUi
            title="Privacy"
            icon={Images.PrivacyNewIcon}
            onPress={() => {
              navigation.navigate("PrivacySettings");
            }}
          />
          <AccountItemForChangeUi
            title="Notifications"
            icon={Images.NotificationNew}
            onPress={() => {
              navigation.navigate("NotificationSettings");
            }}
          />
          <AccountItemForChangeUi
            title="Chats"
            icon={Images.chat}
            onPress={() => navigation.navigate("ChatSettings")}
          />
          <AccountItemForChangeUi
            title="Appearance"
            icon={Images.light}
            onPress={() => setisModalVisible(true)}
            showLine={false}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={onLogoutPress}
        activeOpacity={0.5}
        style={styles.logoutButtonView}
      >
        <Text style={styles.logOutText}>Logout</Text>
      </TouchableOpacity>

      <SelectAppearanceModal
        isVisible={isModalVisible}
        hideModal={() => setisModalVisible(false)}
        onPressSave={(option: number) => {
          setisModalVisible(false);
          let selectedTheme =
            option === 0
              ? "light"
              : option === 1
              ? "dark"
              : Appearance?.getColorScheme();

          storeDataInAsync("theme", selectedTheme);
          setTheme(selectedTheme);
        }}
        onPressCancel={() => setisModalVisible(false)}
      />
      {/* </View> */}
    </View>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    bodyContainer: { flex: 1 },
    userInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Color.white,
      paddingVertical: mvs(8),
      paddingHorizontal: ms(16),
      marginTop: mvs(16),
    },
    image: { width: ms(50), height: ms(50), borderRadius: ms(25) },
    nameStatusContainer: { marginStart: mvs(10), flex: 1 },
    name: {
      fontSize: mvs(16),
      color: Color.black,
      fontWeight: "700",
    },
    status: {
      color: Color.grey,
      fontSize: mvs(14),
    },
    separator: {
      marginTop: mvs(16),
    },
    newFriendView: {
      marginTop: mvs(20),
      backgroundColor: Color.white,
      width: wp(100),
    },
    logoutButtonView: {
      backgroundColor: Color.white,
      width: wp(100),
      position: "absolute",
      bottom: hp(8),
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: mvs(10),
    },
    logOutText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
    },
  });
};

export default SettingsScreen;
