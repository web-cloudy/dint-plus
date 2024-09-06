import React, { FunctionComponent, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ms, mvs } from "react-native-size-matters";
import { clearAllInAsync } from "utils/LocalStorage";
import { AccountItem, SettingItem } from "components/molecules";
import useAppDispatch from "hooks/useAppDispatch";
import { getProfileData, ProfileSelectors } from "store/slices/profile";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { resetLoginData } from "store/slices/users";
import { getToken } from "hooks/NotificationLisenters";
import { useAuth } from "contexts/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AvatarPNG, Images } from "assets/images";
import AccountItemForChangeUi from "components/molecules/AccountItem/AccountItem";
import { FONTS } from "constants/fonts";

type Props = Record<string, never>;

const MainSettings: FunctionComponent<Props> = ({}: Props) => {
  const { theme } = useTheme();
  const { profileData, loading } = ProfileSelectors();
  const { setIsLoggedIn } = useAuth();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const dintPlusId = "wxid_s1tpelfergabcdtsaj";

  useEffect(() => {
    dispatch(getProfileData());
  }, []);

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
          // getToken();
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerVIew}>
        <View style={styles.userInfoContainer}>
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
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("QRCodeViewScreen", {
                  profileData: profileData,
                });
              }}
              style={styles.innerView}
            >
              <View style={styles.QRCodeVIew}>
                <Text style={styles.status}>
                  Dint+ ID:{" "}
                  <Text style={styles.status}>
                    {dintPlusId.length > 11
                      ? dintPlusId.slice(0, 11) + "..."
                      : dintPlusId}
                  </Text>
                </Text>
                <Image style={styles.QRCodeIcon} source={Images.QRCode} />
              </View>
              <Image
                resizeMode="contain"
                style={styles.leftAerrowIcon}
                source={Images.arrowRight}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MyStatusScreen");
            }}
            style={styles.statuasView}
          >
            <Text style={styles.StatusText}>+ Status</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statuasView1}>
            <Image
              resizeMode="contain"
              style={styles.statuasIcon}
              source={Images.statuas}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <View style={styles.newFriendView}>
          <AccountItemForChangeUi
            title="Edit Profile"
            icon={Images.userCircle}
            onPress={() => {
              navigation.navigate("EditProfile");
            }}
          />
          <AccountItemForChangeUi
            title="Favorites"
            icon={Images.HeartAngle}
            onPress={() => {}}
          />
          <AccountItemForChangeUi
            title="Services"
            icon={Images.setting}
            onPress={() => {
              navigation.navigate("Services");
            }}
            showLine={false}
          />
        </View>

        <View style={styles.newFriendView}>
          <AccountItemForChangeUi
            title="Settings"
            icon={Images.SettingsForMe}
            onPress={() => {
              navigation.navigate("Settings");
            }}
            showLine={false}
          />
        </View>
      </ScrollView>

      {/* <AccountItem
        style={{ marginTop: ms(20) }}
        title={"Logout"}
        onPress={onLogoutPress}
      />
      <AccountItem
        title={"Settings"}
        onPress={() => navigation.navigate("Settings")}
      /> */}
    </View>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
      alignItems: "center",
    },
    title: {
      color: Color.black,
      fontSize: ms(22),
      fontFamily: FONTS.robotoBold,
    },
    headerVIew: {
      paddingTop: useSafeAreaInsets().top + mvs(5),
      paddingBottom: mvs(20),
      width: wp(100),
      backgroundColor: Color.white,
    },
    userInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Color.white,
      paddingHorizontal: ms(16),
      marginTop: mvs(10),
      width: wp(100),
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
    QRCodeIcon: {
      width: mvs(20),
      height: mvs(20),
      marginLeft: ms(10),
    },
    QRCodeVIew: {
      flexDirection: "row",
      alignItems: "center",
    },
    leftAerrowIcon: {
      width: ms(12),
      height: ms(12),
      tintColor: Color.black,
    },
    innerView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    statuasView: {
      borderWidth: 1,
      borderRadius: mvs(60),
      alignItems: "center",
      justifyContent: "center",
      borderColor: Color.grey,
      width: ms(75),
      height: mvs(27),
      marginRight: ms(10),
    },
    statuasView1: {
      borderWidth: 1,
      borderRadius: mvs(24),
      alignItems: "center",
      justifyContent: "center",
      borderColor: Color.grey,
      width: mvs(24),
      height: mvs(24),
    },
    StatusText: {
      color: Color.grey,
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
    },
    statuasIcon: {
      width: mvs(16),
      height: mvs(16),
      tintColor: Color.grey,
    },
    statusContainer: {
      flexDirection: "row",
      marginLeft: ms(76),
      alignItems: "center",
    },
  });
};

export default MainSettings;
