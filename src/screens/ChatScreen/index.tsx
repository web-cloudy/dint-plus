import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import useAppDispatch from "hooks/useAppDispatch";
import {
  ChatSelectors,
  getChatsAPI,
  handleIceCandidate,
  handleIncomingCall,
  handleReceiveCall,
  incomingCall,
  refreshChatsAPI,
  resetChatlist,
  searchUserAPI,
  updateFCMTokenRequest,
  updateUserLocation,
} from "store/slices/chat";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { ms, mvs } from "react-native-size-matters";
import { ChatHeader, ChatItem, SearchUserItem } from "components/molecules";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProfileData } from "store/slices/profile";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import ImageDisplayModal from "components/organisms/ImageDisplay/ImageDisplayModal";
import { getDataFromAsync } from "utils/LocalStorage";
import {
  setCurrentInstanceSocket,
  setSocketConnection,
} from "constants/chatSocket";
import ReconnectingWebSocket from "react-native-reconnecting-websocket";
import { useAuth } from "contexts/AuthContext";
import messaging from "@react-native-firebase/messaging";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { EventRegister } from "react-native-event-listeners";
import { Images } from "assets/images";
import { hp, wp } from "utils/metrix";
import { check, PERMISSIONS } from "react-native-permissions";
import { getCurrentLocation, requestLocationPermission } from "utils";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const URL = "wss://bedev.dint.com/ws/conversation/global/";

type Props = Record<string, never>;

const ChatScreen: FunctionComponent<Props> = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useAppDispatch();
  const { searchUserList, chatList, incomingCallState } = ChatSelectors();
  const [keyword, setKeyword] = useState("");
  const [imageToShow, setImageToShow] = useState("");
  const [startList, setStartList] = useState(0);
  // let ws = useRef(null);
  const { userId } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isFocused = useIsFocused();

  const updateFCMToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log("🚀 ~ updateFCMToken ~ fcmToken:", fcmToken);
    dispatch(updateFCMTokenRequest({ firebase_token: fcmToken }));
  };

  useEffect(() => {
    updateFCMToken();
    updateLocation();
  }, []);

  const updateLocation = async () => {
    const hasPermission = await requestLocationPermission();
    console.log("🚀 ~ updateLocation ~ hasPermission:", hasPermission);
    if (hasPermission) {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        const location = {
          latitude: latitude,
          longitude: longitude,
        };
        console.log("latitude&longitude ", latitude, longitude);
        await dispatch(updateUserLocation({ location }));
      } catch (error: any) {}
    }
  };

  const [activeFilter, setActiveFilter] = useState("all");
  const filterOptions = ["all", "unread", "group", "archived"];

  const fetchInitialChats = useCallback(() => {
    console.log(" ---fetchInitialChats---> ");
    let body = {
      val: 0,
      type: activeFilter,
    };
    dispatch(getChatsAPI(body)).then(() => setIsInitialLoad(false));
  }, [dispatch, activeFilter]);

  // Modify refreshChats
  const refreshChats = useCallback(() => {
    console.log(" ---refreshChats---> ");
    if (!isInitialLoad) {
      let body = {
        val: 0,
        type: activeFilter,
      };
      dispatch(refreshChatsAPI(body));
    }
  }, [dispatch, isInitialLoad]);

  const isMyMessage = (senderId: number | string | { id: number | string }) =>
    String(userId) ===
    String(typeof senderId === "object" ? senderId.id : senderId);

  // const isSender = isMyMessage(data?.sender);

  const fetchFilterChats = useCallback(
    async (filter: string) => {
      console.log(" ---fetchFilterChats---> ", filter);
      try {
        await dispatch(resetChatlist());
        const body = {
          val: 0,
          type: filter,
        };
        await dispatch(getChatsAPI(body));
        setActiveFilter(filter);
      } catch (error) {
        setActiveFilter(filter);
        console.log("No chats in", filter);
      }
    },
    [dispatch]
  );

  // Replace useFocusEffect with useEffect
  useEffect(() => {
    if (isFocused) {
      if (isInitialLoad) {
        fetchInitialChats();
      } else {
        fetchFilterChats(activeFilter);
      }
    }

    return () => {
      if (!isFocused) {
        dispatch(resetChatlist());
      }
    };
  }, [
    isFocused,
    isInitialLoad,
    fetchInitialChats,
    fetchFilterChats,
    dispatch,
    activeFilter,
  ]);

  useEffect(() => {
    const unsubscribe = EventRegister.addEventListener(
      "updateChats",
      (data) => {
        console.log(
          "----------------------updateChats--------------------------------->"
        );
        // console.log(' ---data--> ',data )
        // const isSender = isMyMessage(data?.sender);
        // console.log(' --isSender----> ',isSender )
        // if(isSender){
        //   Alert.alert('sender')
        // }else{
        //   Alert.alert('receiver')
        // }
        // refreshChats();
        let body = {
          val: 0,
          type: activeFilter,
        };
        dispatch(refreshChatsAPI(body));
      }
    );
    return () => EventRegister.removeEventListener(unsubscribe);
  }, []);

  useEffect(() => {
    dispatch(getProfileData());
  }, []);

  const ListEndCall = () => {
    if (chatList.length >= 20) {
      setStartList(startList + 20);

      let body = {
        val: startList + 20,
        type: activeFilter,
      };
      dispatch(getChatsAPI(body));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader hideIcon keyword={keyword} setKeyword={setKeyword} />
      <View style={styles.searchView}>
        <Image
          resizeMode="contain"
          style={styles.searchIcon}
          source={Images.searchIcon}
        />
        <TextInput
          underlineColorAndroid="transparent"
          placeholder="Search"
          style={styles.search}
          value={keyword}
          textColor={Color.black}
          placeholderTextColor={Color.black}
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
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filterOptions.map((filter) => (
          <TouchableOpacity
            activeOpacity={1}
            key={filter}
            style={[
              styles.filterPill,
              activeFilter === filter && styles.activeFilterPill,
            ]}
            onPress={() => fetchFilterChats(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: ms(16),
              paddingVertical: ms(8),
              backgroundColor: Color.plain_white,
            }}
          >
            {searchUserList?.length > 0 && keyword ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={searchUserList}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={({ item }) => <SearchUserItem data={item} />}
              />
            ) : keyword ? (
              <Text style={styles.noDataFound}>{"No Conversation Found"}</Text>
            ) : chatList?.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={chatList}
                refreshing={false}
                onEndReached={ListEndCall}
                onEndReachedThreshold={0}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={({ item }) => (
                  <ChatItem setImageToShow={setImageToShow} data={item} />
                )}
              />
            ) : (
              <Text style={styles.noDataFound}>{"No Conversation Found"}</Text>
            )}
          </View>
        </View>
      </GestureHandlerRootView>
      <ImageDisplayModal
        isVisible={imageToShow?.length > 0 ? true : false}
        hideModal={() => setImageToShow("")}
        selectedImage={imageToShow}
      />
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.plain_white,
    },
    noDataFound: {
      color: Color.black,
      fontSize: ms(20),
      textAlign: "center",
      alignSelf: "center",
      marginTop: mvs(50),
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    search: {
      flex: 1,
      backgroundColor: "transparent",
      height: hp(5),
      borderWidth: 0,
    },
    searchView: {
      width: wp(95),
      borderRadius: 10,
      backgroundColor: Color.search_back,
      height: hp(5),
      paddingHorizontal: wp(2),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "center",
      marginTop: 10,
    },
    searchIcon: {
      height: hp(1.5),
      width: hp(1.5),
      tintColor: Color.black,
    },
    closeIcon: {
      height: hp(1),
      width: hp(1),
      tintColor: Color.black,
    },
    filterContainer: {
      flexGrow: 0,
      marginVertical: 10,
      paddingHorizontal: 16,
    },
    filterPill: {
      height: 35,
      paddingHorizontal: 15,
      marginRight: 10,
      backgroundColor: Color.disabled,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Color.pillColor,
    },
    activeFilterPill: {
      backgroundColor: Color.pillColor,
      borderColor: Color.primary,
    },
    filterText: {
      color: Color.black,
      fontWeight: "bold",
      fontSize: 14,
      textTransform: "capitalize",
    },
    activeFilterText: {
      color: Color.black,
    },
  });
};

export default ChatScreen;
