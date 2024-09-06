import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Pressable,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { ServicesHeader } from "components/molecules";
import { hp, wp } from "utils/metrix";
import { ms, mvs, scale, verticalScale } from "react-native-size-matters";
import { AvatarPNG, Images } from "assets/images";
import { FONTS } from "constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChatSelectors,
  deleteUsersLocation,
  locationExist,
  toggleLocationPrivacy,
} from "store/slices/chat";
import { useDispatch } from "react-redux";

const ShowNearbyPeople = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [showAllPeople, setShowAllPeople] = useState(false);
  const [showAllGroup, setShowAllGroup] = useState(false);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [isClearLocationModal, setIsClearLocationModal] = useState(false);
  const dispatch = useDispatch();
  const { locationExistDataState } = ChatSelectors();

  const dummyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const dummyDataGrup = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const dataGroup = showAllGroup ? dummyData : dummyData.slice(0, 5);

  const bottom =
    Dimensions.get("screen").height - Dimensions.get("window").height;
  console.log("🚀 ~ PeopleNearby ~ bottom:", bottom);

  const { peopleNearbyDataState, groupNearbyDataState } = ChatSelectors();

  const peopleNearby = showAllPeople
    ? peopleNearbyDataState
    : peopleNearbyDataState.slice(0, 5);

  const groupNearby = showAllGroup
    ? groupNearbyDataState
    : groupNearbyDataState.slice(0, 5);

  const fetchLocationExits = async () => {
    try {
      const res = await dispatch(locationExist());
      console.log("🚀 ~ fetchLocationExits ~ res:", res);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchLocationExits();
  }, []);

  const toggleLocation = async () => {
    try {
      const res = await dispatch(toggleLocationPrivacy());
      if (res?.payload?.data) {
        const res = await dispatch(locationExist());
      }
      console.log("🚀 ~ toggleLocationPrivacy ~ res:", res);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUsersLocationOnPress = async () => {
    try {
      const res = await dispatch(deleteUsersLocation());
      console.log("🚀 ~ deleteUsersLocationOnPress ~ res:", res);
      if (res?.payload?.code == 200) {
        toggleLocation();
        setIsClearLocationModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearLocationOnPress = () => {
    setisModalVisible(false);
    setIsClearLocationModal(true);
  };

  return (
    <View style={styles.container}>
      <ServicesHeader
        title="People Nearby"
        rightIconOnPress={() => {
          setisModalVisible(true);
        }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: mvs(20) }}>
        <Image style={styles.compassIcon} source={Images.compass} />
        <Text style={styles.exchangeText}>
          Exchange contact info with people nearby and find new friends.
        </Text>
        {/* people near by */}
        <Text style={styles.peopleText}> PEAOPLE NEARBY</Text>
        <View style={styles.newFriendView}>
          {locationExistDataState && (
            <>
              <TouchableOpacity
                onPress={() => {
                  toggleLocation();
                }}
                style={styles.myselfView}
              >
                <Image
                  resizeMode="contain"
                  style={styles.peopleNearbyIcon}
                  source={Images.PeopleNearby}
                />
                <Text style={styles.myselfText}>Make Myself Visible</Text>
              </TouchableOpacity>
              <View style={styles.line} />
            </>
          )}

          {peopleNearby.map((item, index) => (
            <>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PeopleNearbyProfile", {
                    item: item?.user,
                  });
                }}
                style={styles.mapView}
              >
                <Image
                  style={styles.itemIcon}
                  source={
                    item?.user?.profile_image
                      ? { uri: item?.user?.profile_image }
                      : AvatarPNG
                  }
                />
                <View style={styles.itemTextView}>
                  <Text style={styles.itemNameText}>
                    {item?.user?.display_name}
                  </Text>
                  <Text
                    style={styles.itemDistanceText}
                  >{`${item?.distance.toFixed(2)} mi away`}</Text>
                </View>
              </TouchableOpacity>
              {index != peopleNearbyDataState.length - 1 && (
                <View style={styles.line} />
              )}
            </>
          ))}

          {!showAllPeople && peopleNearbyDataState.length > 6 && (
            <TouchableOpacity
              onPress={() => {
                setShowAllPeople((prew) => !prew);
              }}
              style={styles.myselfView}
            >
              <Image
                resizeMode="contain"
                style={styles.peopleNearbyIcon}
                source={Images.ArrowDown}
              />
              <Text style={styles.myselfText}>{`Show ${
                peopleNearbyDataState.length - 5
              } More People`}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* groups near by */}
        <Text style={styles.peopleText}>GROUPS NEARBY</Text>
        <View style={styles.newFriendView}>
          <TouchableOpacity style={styles.myselfView}>
            <Image
              resizeMode="contain"
              style={styles.peopleNearbyIcon}
              source={Images.UsersGroupNearby}
            />
            <Text style={styles.myselfText}>Create a Local Group</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          {groupNearby.map((item, index) => (
            <>
              <TouchableOpacity style={styles.mapView}>
                <Image
                  style={styles.itemIcon}
                  source={
                    item?.group?.profile_image
                      ? { uri: item?.group?.profile_image }
                      : AvatarPNG
                  }
                />
                <View style={styles.itemTextView}>
                  <Text style={styles.itemNameText}>
                    {item?.group?.group_name}
                  </Text>
                  <Text
                    style={styles.itemDistanceText}
                  >{`${item?.distance.toFixed(2)} mi away`}</Text>
                </View>
              </TouchableOpacity>
              {index != groupNearbyDataState.length - 1 && (
                <View style={styles.line} />
              )}
            </>
          ))}

          {!showAllGroup && groupNearbyDataState.length > 6 && (
            <TouchableOpacity
              onPress={() => {
                setShowAllGroup((prew) => !prew);
              }}
              style={styles.myselfView}
            >
              <Image
                resizeMode="contain"
                style={styles.peopleNearbyIcon}
                source={Images.ArrowDown}
              />
              <Text style={styles.myselfText}>{`Show ${
                dummyDataGrup.length - 5
              } More People`}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* nearby all menu modal */}
      <Modal
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => {
          setisModalVisible((prew) => !prew);
        }}
        transparent={true}
      >
        <Pressable
          style={styles.outerContainer}
          onPress={() => {
            setisModalVisible((prew) => !prew);
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setisModalVisible(false);
            }}
            style={styles.cancelButtonView}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.clearLocationView}>
            <TouchableOpacity style={styles.innerView}>
              <Text style={styles.cancelText}>Female Only</Text>
            </TouchableOpacity>
            <View style={styles.line1} />
            <TouchableOpacity style={styles.innerView}>
              <Text style={styles.cancelText}>Males Only</Text>
            </TouchableOpacity>
            <View style={styles.line1} />
            <TouchableOpacity style={styles.innerView}>
              <Text style={styles.cancelText}>View All</Text>
            </TouchableOpacity>
            <View style={styles.line1} />
            <TouchableOpacity style={styles.innerView}>
              <Text style={styles.cancelText}>Greetings</Text>
            </TouchableOpacity>
            <View style={styles.line1} />
            <TouchableOpacity
              onPress={clearLocationOnPress}
              style={styles.innerView}
            >
              <Text style={styles.cancelText}>Clear Location</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* clear location modal */}
      <Modal
        animationType="fade"
        visible={isClearLocationModal}
        onRequestClose={() => {
          setIsClearLocationModal((prew) => !prew);
        }}
        transparent={true}
      >
        <Pressable
          style={styles.outerContainer}
          onPress={() => {
            setIsClearLocationModal((prew) => !prew);
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setIsClearLocationModal(false);
            }}
            style={styles.cancelButtonView}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.clearLocationView}>
            <Text style={styles.clearText}>
              “Clear Location” to prevent other people from seeing you in People
              Nearby.
            </Text>
            <TouchableOpacity
              onPress={deleteUsersLocationOnPress}
              style={[styles.innerView, { marginTop: mvs(20) }]}
            >
              <Text style={[styles.cancelText, { color: "red" }]}>
                Clear Location
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ShowNearbyPeople;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    compassIcon: {
      height: mvs(100),
      width: mvs(100),
      alignSelf: "center",
      marginTop: mvs(20),
    },
    exchangeText: {
      width: wp(90),
      alignSelf: "center",
      fontSize: ms(18),
      fontFamily: FONTS.robotoRegular,
      color: Color.grey,
      textAlign: "center",
      marginTop: mvs(20),
    },
    peopleText: {
      fontSize: ms(18),
      fontFamily: FONTS.robotoMedium,
      color: Color.black,
      marginTop: mvs(30),
      marginLeft: mvs(15),
    },
    newFriendView: {
      marginTop: mvs(10),
      backgroundColor: Color.white,
      width: wp(100),
    },
    peopleNearbyIcon: {
      width: mvs(24),
      height: mvs(24),
      marginRight: ms(10),
    },
    myselfText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.primary,
    },
    myselfView: {
      paddingHorizontal: ms(20),
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: mvs(10),
    },
    itemIcon: {
      width: mvs(44),
      height: mvs(44),
      marginRight: ms(10),
      borderRadius: mvs(44),
    },
    mapView: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: ms(20),
      paddingVertical: mvs(10),
    },
    itemNameText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
    },
    itemDistanceText: {
      fontSize: ms(14),
      fontFamily: FONTS.robotoRegular,
      color: Color.grey,
    },
    itemTextView: {},
    line: {
      borderBottomWidth: 1,
      borderBottomColor: Color.deleteBtnColor,
      width: wp(90),
      alignSelf: "center",
    },
    line1: {
      borderBottomWidth: 1,
      borderBottomColor: Color.deleteBtnColor,
      width: wp(100),
      alignSelf: "center",
    },
    outerContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
    cancelButtonView: {
      position: "absolute",
      bottom: 0,
      backgroundColor: Color.white,
      width: wp(100),
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: mvs(10),
      paddingBottom: useSafeAreaInsets().bottom + mvs(10),
    },
    cancelText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
    },
    clearLocationView: {
      position: "absolute",
      backgroundColor: Color.white,
      width: wp(100),
      alignItems: "center",
      justifyContent: "center",
      bottom: useSafeAreaInsets().bottom + mvs(50),
    },
    innerView: {
      paddingVertical: mvs(10),
      width: wp(100),
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
    },
    clearText: {
      width: wp(90),
      marginTop: mvs(10),
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
      textAlign: "center",
    },
  });
};
