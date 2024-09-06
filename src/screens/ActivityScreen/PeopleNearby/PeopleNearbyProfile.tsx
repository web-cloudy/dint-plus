import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { ServicesHeader } from "components/molecules";
import { AvatarPNG, Images } from "assets/images";
import { ms, mvs } from "react-native-size-matters";
import { hp, wp } from "utils/metrix";
import { FONTS } from "constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Back from "assets/images/back.png";
import {
  ChatSelectors,
  createChannelIdAPI,
  disappearingTimer,
  getChatMessagesAPI,
  resetChannelData,
} from "store/slices/chat";
import { useDispatch } from "react-redux";
import AccountItemForChangeUi from "components/molecules/AccountItem/AccountItem";
import BottomSheet from "@gorhom/bottom-sheet";

const PeopleNearbyProfile = ({ route, navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const { item } = route.params;
  console.log("🚀 ~ PeopleNearbyProfile ~ item:", item);
  const dispatch = useDispatch();
  const bottomSheetRef = useRef(null);
  const {
    matchingContactList,
    isChannelIdCreated,
    selectedChannelData,
    loading,
  } = ChatSelectors();
  console.log("🚀 ~ PeopleNearbyProfile ~ item:", item);
  const snapPoints = [hp(90)];
  const [lockChat, setLockChat] = useState(false);
  const { disappearingTimerDataState } = ChatSelectors();
  console.log(
    "🚀 ~ PeopleNearbyProfile ~ disappearingTimerDataState:",
    disappearingTimerDataState
  );

  const disappearingMessageTimer = async () => {
    const res = await dispatch(disappearingTimer());
    console.log("🚀 ~ dis ~ res:", res);
  };

  useEffect(() => {
    disappearingMessageTimer();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (isChannelIdCreated && selectedChannelData?.info) {
        try {
          await dispatch(getChatMessagesAPI(selectedChannelData.info.id));
          dispatch(resetChannelData());

          navigation?.replace("ChatDetail", {
            receiverId: selectedChannelData.info.id,
            receiverName: selectedChannelData.name,
            receiverImage: selectedChannelData.profile_image,
            channel_id: selectedChannelData.info.channel_id,
            item: item,
          });
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [isChannelIdCreated, selectedChannelData, dispatch, navigation]);

  const greetingOnPress = async () => {
    const obj = {
      id: item?.id,
      name: item?.display_name || "",
      profile_image: item?.profile_image || "",
    };
    await dispatch(createChannelIdAPI(obj));
  };

  const PlusIcon = () => (
    <View style={styles.plusContainer}>
      <Image style={styles.plusIcon} source={Images.plus} />
    </View>
  );

  const showTimer = () => {
    if (
      disappearingTimerDataState == null ||
      disappearingTimerDataState == undefined ||
      disappearingTimerDataState == 0
    ) {
      return "Off";
    } else if (parseInt(disappearingTimerDataState) == 2073600) {
      return "24 Hours";
    } else if (parseInt(disappearingTimerDataState) == 604800) {
      return "7 Days";
    } else if (parseInt(disappearingTimerDataState) == 7776000) {
      return "90 Days";
    }
  };

  return (
    <View style={styles.container}>
      {/* <ServicesHeader title="Profile" /> */}
      {/* <ScrollView>
        <View style={styles.userInfoContainer}>
          <Image
            source={
              item?.user?.profile_image
                ? { uri: item?.user?.profile_image }
                : AvatarPNG
            }
            style={styles.image}
          />
          <View style={styles.nameStatusContainer}>
            <Text style={styles.name}>{item?.user?.display_name || ""}</Text>
            <Text style={styles.status}>{`Within ${item?.distance.toFixed(
              2
            )}m`}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.newFriendView,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: ms(20),
              paddingVertical: mvs(10),
            },
          ]}
        >
          <Text style={styles.remarkText}>Set Remark and Tag</Text>
          <Image
            resizeMode="contain"
            style={styles.leftAerrowIcon}
            source={Images.arrowRight}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.newFriendView,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: ms(20),
              paddingVertical: mvs(10),
            },
          ]}
        >
          <Text style={styles.remarkText}>Region</Text>
          <Text style={[styles.remarkText, { color: Color.primary }]}>--</Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity onPress={greetingOnPress} style={styles.sendButtonView}>
        <Text style={styles.sendText}>Send Greeting</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.reportButtonView}>
        <Text style={styles.reportText}>Report</Text>
      </TouchableOpacity> */}
      <View style={styles.imageVIew}>
        <Image
          resizeMode="cover"
          source={
            item?.profile_image
              ? { uri: item?.profile_image }
              : Images.dummyProfileImage
          }
          style={styles.profileImage}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backIconView}
        >
          <Image source={Back} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.callView}>
          <Text style={styles.name}>{item?.display_name}</Text>
          <Text style={styles.lastSeenText}>last seen 08/05/24</Text>
          <View style={styles.showTabView}>
            <TouchableOpacity
              onPress={() => {
                greetingOnPress();
              }}
              style={styles.messageIconView}
            >
              <Image
                resizeMode="contain"
                style={styles.helpChatIcon}
                source={Images.contactChat}
              />
              <Text style={styles.messageText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.messageIconView}>
              <Image
                resizeMode="contain"
                style={styles.helpChatIcon}
                source={Images.phoneRounded}
              />
              <Text style={styles.messageText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.messageIconView}>
              <Image
                resizeMode="contain"
                style={styles.helpChatIcon}
                source={Images.videoCall}
              />
              <Text style={styles.messageText}>Video</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.messageIconView}>
              <Image
                resizeMode="contain"
                style={[styles.helpChatIcon]}
                source={Images.bellNew}
              />
              <Text style={styles.messageText}>Mute</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current?.expand();
              }}
              style={styles.messageIconView}
            >
              <Image
                resizeMode="contain"
                style={styles.helpChatIcon}
                source={Images.dot}
              />
              <Text style={styles.messageText}>More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.newFriendView}>
        <AccountItemForChangeUi
          title="Username"
          icon={Images.userCircle}
          onPress={() => {}}
          showIcon={false}
          showSubTitle={true}
          subTitle={item?.custom_username}
          subTitleStyle={styles.subTitle}
          showAerowDownIcon={false}
        />

        <AccountItemForChangeUi
          title="Bio"
          icon={Images.userCircle}
          onPress={() => {}}
          showIcon={false}
          showSubTitle={true}
          subTitle={"Only good vibes"}
          subTitleStyle={[styles.subTitle, { color: Color.grey }]}
          showAerowDownIcon={false}
        />

        <AccountItemForChangeUi
          title="Send Message"
          icon={Images.userCircle}
          onPress={() => {
            greetingOnPress();
          }}
          showIcon={false}
          showLine={false}
          showAerowDownIcon={false}
          titleStyle={{ color: Color.primary }}
        />
      </View>

      <View style={styles.newFriendView1}>
        <AccountItemForChangeUi
          title="Report"
          icon={Images.userCircle}
          onPress={() => {}}
          showIcon={false}
          showLine={false}
          showAerowDownIcon={false}
          titleStyle={{ color: "red" }}
        />
      </View>
      <BottomSheet
        enablePanDownToClose
        index={-1}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backgroundStyle={styles.handleIndicatorStyle}
        // handleIndicatorStyle={{ backgroundColor: "white" }}
      >
        <View style={styles.container}>
          <View style={styles.indicatorView} />
          <ScrollView contentContainerStyle={{ paddingBottom: mvs(30) }}>
            <View style={styles.newFriendView}>
              <AccountItemForChangeUi
                title="Search messages"
                icon={Images.SearchNew}
                onPress={() => {}}
                showLine={false}
                showAerowDownIcon={false}
              />
            </View>

            <View style={styles.newFriendView}>
              <AccountItemForChangeUi
                title="Media, links and docs"
                icon={Images.gallery}
                onPress={() => {}}
                children={<Text style={styles.childrenText}>2</Text>}
              />
              <AccountItemForChangeUi
                title="Starred messages"
                icon={Images.starAction}
                onPress={() => {}}
                showLine={false}
                children={<Text style={styles.childrenText}>None</Text>}
              />
            </View>

            <View style={styles.newFriendView}>
              <AccountItemForChangeUi
                title="Notifications"
                icon={Images.bellTransperent}
                onPress={() => {}}
              />
              <AccountItemForChangeUi
                title="Wallpaper"
                icon={Images.wallpaper}
                onPress={() => {}}
              />
              <AccountItemForChangeUi
                title="Save to Photos"
                icon={Images.Save}
                onPress={() => {}}
                showLine={false}
                children={<Text style={styles.childrenText}>Default</Text>}
              />
            </View>
            <View style={styles.newFriendView}>
              <AccountItemForChangeUi
                title="Disappearing messages"
                icon={Images.disappearingMessage}
                onPress={() => {
                  navigation.navigate("DisappearingMessagesScreen");
                }}
                children={
                  <Text style={styles.childrenText}>{showTimer()}</Text>
                }
              />
              <AccountItemForChangeUi
                title="Lock chat"
                icon={Images.lockChat}
                onPress={() => {}}
                showAerowDownIcon={false}
                children={
                  <Switch
                    trackColor={{ false: "#767577", true: Color.primary }}
                    thumbColor={"#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => {
                      setLockChat((prew) => !prew);
                    }}
                    value={lockChat}
                  />
                }
              />
              <AccountItemForChangeUi
                title="Encryption"
                icon={Images.encryptionLock}
                onPress={() => {}}
                showLine={false}
              />
            </View>

            <View style={styles.newFriendView}>
              <AccountItemForChangeUi
                title="Contact details"
                icon={Images.userCircle}
                onPress={() => {}}
                showLine={false}
              />
            </View>

            <View style={styles.newFriendView}>
              <AccountItemForChangeUi
                title="Create group with Mas Pas"
                showIcon={false}
                icon={Images.userCircle}
                onPress={() => {}}
                showLine={false}
                showAerowDownIcon={false}
                custemIcon={<PlusIcon />}
              />
            </View>
          </ScrollView>
        </View>
      </BottomSheet>
    </View>
  );
};

export default PeopleNearbyProfile;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    userInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Color.white,
      paddingVertical: mvs(8),
      paddingHorizontal: ms(16),
      marginTop: mvs(16),
      width: wp(100),
    },
    image: { width: ms(50), height: ms(50), borderRadius: ms(25) },
    nameStatusContainer: { marginStart: mvs(10), flex: 1 },
    name: {
      fontSize: mvs(22),
      color: Color.fixedWhite,
      fontFamily: FONTS.robotoBold,
      paddingHorizontal: ms(20),
    },
    status: {
      color: Color.grey,
      fontSize: mvs(14),
    },
    separator: {
      marginTop: mvs(16),
    },
    newFriendView: {
      marginTop: mvs(10),
      backgroundColor: Color.white,
      width: wp(100),
    },
    leftAerrowIcon: {
      width: ms(12),
      height: ms(12),
      tintColor: Color.black,
    },
    remarkText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
    },
    sendButtonView: {
      position: "absolute",
      width: wp(90),
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      height: mvs(56),
      backgroundColor: Color.primary,
      borderRadius: ms(40),
      bottom: useSafeAreaInsets().bottom + mvs(5),
    },
    sendText: {
      fontSize: ms(18),
      fontFamily: FONTS.robotoMedium,
      color: Color.chock_black,
    },
    reportButtonView: {
      position: "absolute",
      width: wp(90),
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      height: mvs(56),
      backgroundColor: Color.chock_black,
      borderRadius: ms(40),
      bottom: useSafeAreaInsets().bottom + mvs(67),
      borderWidth: 2,
      borderColor: Color.primary,
    },
    reportText: {
      fontSize: ms(18),
      fontFamily: FONTS.robotoMedium,
      color: Color.primary,
    },
    imageVIew: {
      width: wp(100),
      height: hp(50),
      backgroundColor: "white",
    },
    profileImage: {
      width: wp(100),
      height: hp(50),
    },
    backIcon: {
      width: hp(2.4),
      height: hp(2.4),
      tintColor: Color.white,
    },
    backIconView: {
      position: "absolute",
      top: useSafeAreaInsets().top + mvs(20),
      marginLeft: ms(20),
      backgroundColor: Color.black,
      borderRadius: mvs(10),
      paddingHorizontal: mvs(8),
      paddingVertical: mvs(8),
    },
    callView: {
      position: "absolute",
      backgroundColor: "background: rgba(44, 44, 44, 0.75)",
      paddingVertical: mvs(10),
      width: wp(100),
      bottom: 0,
    },
    lastSeenText: {
      fontSize: mvs(16),
      color: Color.fixedWhite,
      fontFamily: FONTS.robotoRegular,
      paddingHorizontal: ms(20),
    },
    messageIconView: {
      backgroundColor: Color.callingBackgroundColor,
      width: mvs(60),
      height: mvs(54),
      borderRadius: ms(8),
      justifyContent: "center",
      alignItems: "center",
    },
    helpChatIcon: {
      width: mvs(24),
      height: mvs(24),
      tintColor: Color.primary,
    },
    messageText: {
      fontSize: mvs(12),
      color: Color.fixedWhite,
      fontFamily: FONTS.robotoRegular,
      marginTop: mvs(5),
    },
    showTabView: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      marginTop: mvs(10),
    },
    subTitle: {
      color: Color.primary,
    },
    newFriendView1: {
      backgroundColor: Color.white,
      width: wp(100),
      position: "absolute",
      bottom: 0,
      paddingBottom: useSafeAreaInsets().bottom,
    },
    plusContainer: {
      backgroundColor: Color.backgroundColor,
      padding: mvs(5),
      borderRadius: hp(100),
      marginRight: ms(10),
    },
    plusIcon: {
      width: mvs(28),
      height: mvs(28),
      tintColor: Color.black,
    },
    childrenText: {
      fontSize: mvs(16),
      color: Color.black,
      fontFamily: FONTS.robotoRegular,
      marginRight: mvs(5),
    },
    handleIndicatorStyle: {
      backgroundColor: Color.backgroundColor,
    },
    indicatorView: {
      height: mvs(6),
      width: ms(80),
      backgroundColor: Color.grey,
      borderRadius: ms(10),
      alignSelf: "center",
      marginBottom: mvs(10),
    },
  });
};
