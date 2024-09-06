import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import useAppDispatch from "hooks/useAppDispatch";
import {
  ChatSelectors,
  getChatsAPI,
  getStarredMessages,
  handleIceCandidate,
  handleIncomingCall,
  handleReceiveCall,
  incomingCall,
  resetChatlist,
  updateFCMTokenRequest,
} from "store/slices/chat";
import { useFocusEffect } from "@react-navigation/native";
import { ms, mvs, vs } from "react-native-size-matters";
import { ChatHeader, ChatItem, SearchUserItem } from "components/molecules";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProfileData } from "store/slices/profile";
import { COLORS, getCurrentTheme } from "constants/Colors";
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
import { ActivityIndicator, ProgressBar } from "react-native-paper";
import { hp, wp } from "utils/metrix";
import FastImage from "react-native-fast-image";
import { VideoPlayer } from "components/molecules/Messages/VideoPlayer/VideoPlayer";
import { Loader } from "components/atoms";
import { Images, Pause, Play } from "assets/images";
import { ChatMessage } from "types/chat";
import SoundPlayer from "react-native-sound-player";
const URL = "wss://bedev.dint.com/ws/conversation/global/";
const windowHeight = Dimensions.get("window").height;

type Props = Record<string, never>;

const StarredMessages: FunctionComponent<Props> = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { starredMessagesState: data } = ChatSelectors() as {
    starredMessagesState: ChatMessage[];
  };
  const { userId } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentAudioUrlRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  console.log(" ---starredMessagesState---> ", data);

  function isMyMessage(senderId: number | { id: number }) {
    const id = typeof senderId === "number" ? senderId : senderId.id;
    return String(userId) === String(id);
  }

  const updateProgress = () => {
    intervalRef.current = setInterval(async () => {
      try {
        const currentPosition = await SoundPlayer.getInfo();
        console.log("currentPosition", currentPosition);
        const { currentTime, duration } = currentPosition;

        if (duration > 0) {
          const progress = (currentTime / duration) * 100;
          setProgress(progress);
          setLoading(false);
          if (currentTime.toFixed(2) == duration.toFixed(2)) {
            setProgress(0);
            setIsPlaying(false);
            currentAudioUrlRef.current = null; // Clear interval when playback completes
            clearInterval(intervalRef.current!);
          }
        }
      } catch (error) {
        console.log("Error getting audio info:", error);
      }
    }, 100); // Update progress every secon
  };

  const toggleAudio = async (url: string) => {
    try {
      if (!isPlaying && currentAudioUrlRef.current !== url) {
        SoundPlayer.playUrl(url);
        currentAudioUrlRef.current = url;
        setLoading(true);
        setIsPlaying(true);
        updateProgress(); // Start updating progress
      } else if (isPlaying) {
        SoundPlayer.pause();
        setIsPlaying(false);
        clearInterval(intervalRef.current!); // Clear interval when playback is paused
      } else {
        SoundPlayer.resume();
        setIsPlaying(true);
        updateProgress();
        // clearInterval(intervalRef.current)
      }

      // if (currentAudioUrlRef.current === url) {
      //   SoundPlayer.resume()
      // }
    } catch (error) {
      console.log("Error toggling audio playback:", error);
      setIsPlaying(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      dispatch(getStarredMessages({})).then(() => setIsLoading(false));
    }, [])
  );

  console.log(" ---dtaa---> ", data?.content);

  const source = useMemo(
    () => ({ uri: data?.media_meta_data?.url }),
    [data?.media_meta_data?.url]
  );

  const senderView = (item: ChatMessage) => (
    <>
      <TouchableOpacity activeOpacity={1.0} style={[styles.senderContainer]}>
        {item?.content_type === "MEDIA" ? (
          item?.media_meta_data?.name === "fileImage" ? (
            <Pressable style={{ flex: 1 }}>
              <FastImage
                style={{ height: ms(100), width: "100%" }}
                source={{ uri: item?.media_meta_data?.url }}
              />
            </Pressable>
          ) : item?.media_meta_data?.name === "fileVideo" ? (
            loading ? (
              <View style={{ width: ms(30), height: ms(30) }}>
                <Loader visible={loading} size={"small"} />
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <VideoPlayer source={source} data={item} />
                <Text style={{ marginStart: 10 }}>▶</Text>
              </View>
            )
          ) : (
            <>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => toggleAudio(item?.media_meta_data?.url)}
              >
                {loading ? (
                  <View style={{ width: ms(30), height: ms(30) }}>
                    <Loader visible={loading} size={"small"} />
                  </View>
                ) : (
                  <FastImage
                    source={isPlaying ? Pause : Play}
                    style={styles.btnIcon}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
              <ProgressBar
                progress={progress / 100}
                color={"red"}
                style={{ height: 3, width: 200, marginLeft: 10 }}
              />
            </>
          )
        ) : (
          <View>
            {item?.reply_of ? (
              <TouchableOpacity disabled style={[styles.replyContainer]}>
                <Text onPress={() => console.log(item)} style={styles.message}>
                  {item?.reply_of?.content ||
                    item?.reply_of?.message ||
                    item?.reply_of_info?.content}
                </Text>
              </TouchableOpacity>
            ) : null}
            <View style={{ flexDirection: "row" }}>
              {item ? <Image source={Images.star} style={styles.star} /> : null}
              <Text onPress={() => console.log(item)} style={styles.message}>
                {item?.content || item?.message}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </>
  );

  const receiverView = (item: ChatMessage) => (
    <>
      <TouchableOpacity
        style={[styles.receiverContainer]}
        disabled
        activeOpacity={1.0}
      >
        {item?.content_type === "MEDIA" ? (
          item?.media_meta_data?.name == "fileImage" ? (
            <Pressable onPress={() => {}} style={{ flex: 1 }}>
              <FastImage
                style={{ height: ms(100), width: "100%" }}
                source={{ uri: item?.media_meta_data?.url }}
              />
            </Pressable>
          ) : item?.media_meta_data?.name == "fileVideo" ? (
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <VideoPlayer source={source} data={item} />
              <Text style={{ marginStart: 10 }}>▶</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => toggleAudio(item?.media_meta_data?.url)}
              >
                {loading ? (
                  <View style={{ width: ms(30), height: ms(30) }}>
                    <Loader visible={loading} size={"small"} />
                  </View>
                ) : (
                  <FastImage
                    source={isPlaying ? Pause : Play}
                    style={styles.btnIcon}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
              <ProgressBar
                progress={progress / 100}
                color={"red"}
                style={{ height: 3, width: 200, marginLeft: 10 }}
              />
            </>
          )
        ) : (
          <View>
            {item?.reply_of ? (
              <TouchableOpacity disabled style={[styles.replyContainer]}>
                <Text onPress={() => console.log(item)} style={styles.message}>
                  {item?.reply_of?.content ||
                    item?.reply_of?.message ||
                    item?.reply_of_info?.content}
                </Text>
              </TouchableOpacity>
            ) : null}

            <Text onPress={() => console.log(item)} style={styles.message}>
              {item?.content || item?.message}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </>
  );

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={()=>{
            navigation.goBack()
          }}>
          <Image source={Images.arrowRight} style={styles.image} />
          </TouchableOpacity>
          <Text style={styles.title}>Starred Messages</Text>
          <Text> </Text>
        </View>
      </View>
  
      <FlatList
        data={data}
        keyExtractor={(item) => item.secure_key}
        renderItem={({ item }) => {
          return isMyMessage(typeof item.sender === "number" ? item.sender : item.sender.id)
            ? senderView(item)
            : receiverView(item);
        }}
        contentContainerStyle={styles.messageList}
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
    searchContainer: {
      paddingVertical: vs(8),
      paddingHorizontal: ms(16),
      borderBottomWidth: 1,
      borderBottomColor: Color?.theme === "dark" ? "transparent" : Color.border,
      backgroundColor: Color.white,
      height: hp(12),
      marginTop: -hp(6),
      marginBottom: 10,
    },
    title: {
      fontSize: ms(18),
      color: Color.black,
      fontWeight: "600",
      marginStart: ms(10),
      marginTop: hp(6),
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
    receiverContainer: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: vs(10),
      paddingHorizontal: ms(13),
      backgroundColor: Color.messageBackgroundReceiver,
      width: "80%",
      borderRadius: ms(20),
      marginBottom: vs(16),
    },
    senderContainer: {
      alignSelf: "flex-end",
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: vs(10),
      paddingHorizontal: ms(13), // when message is audio instead of text need to adjust padding, previous value 20
      backgroundColor: Color.purple_theme,
      width: "80%",
      borderRadius: ms(20),
      marginBottom: vs(16),
    },
    replyContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: vs(10),
      paddingHorizontal: ms(13),
      backgroundColor: Color.reply_theme,
      borderRadius: ms(10),
      marginBottom: vs(16),
    },
    message: { color: Color.black, fontSize: mvs(15), fontWeight: "500" },
    timeText: {
      color: Color.time_grey,
      fontSize: mvs(12),
      fontWeight: "500",
      marginBottom: vs(10),
      marginLeft: vs(10),
      marginTop: vs(5),
    },
    btnIcon: { width: ms(30), height: ms(30), tintColor: Color.black },
    closeIcon: { width: ms(12), height: ms(12), tintColor: Color.black },
    deletedMessage: {
      fontStyle: "italic",
      color: Color.disabled,
      fontSize: mvs(14),
    },
    star: {
      width: 20,
      height: 20,
      resizeMode: "contain",
      tintColor: "gold",
    },
    image: {
      height: 15,
      width: 15,
      resizeMode: "contain",
      marginStart: ms(10),
      marginTop: hp(6.5),
      transform: [{ rotate: "180deg" }],
    },
    messageList: {
      paddingHorizontal: wp(5),
    },
  });
};

export default StarredMessages;
