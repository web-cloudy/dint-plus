import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Button,
  TouchableOpacity,
  Animated,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { ms, mvs, vs } from "react-native-size-matters";
import { ChatMessage } from "types/chat";
import moment from "moment";
import { useAuth } from "contexts/AuthContext";
import { getCurrentTheme } from "constants/Colors";
import SoundPlayer from "react-native-sound-player";
import { useTheme } from "contexts/ThemeContext";
import { Play, Pause, Images } from "assets/images";
import { ProgressBar } from "react-native-paper";
import { Loader } from "components/atoms";
import Video, { VideoRef } from "react-native-video";
import FastImage from "react-native-fast-image";
import { FONTS } from "constants";
import MessageAction from "../Messages/MessagesAction/MessageAction";
import useModalEventOptions from "hooks/modalEvenHook";
import { hp, wp } from "utils/metrix";
import useAppDispatch from "hooks/useAppDispatch";
import { pinMessageRequest } from "store/slices/chat";
import { VideoPlayer } from "../Messages/VideoPlayer/VideoPlayer";

type Props = {
  data: ChatMessage;
  messages?: ChatMessage[];
  key: string;
  callMessageAction?: any;
  isDeleted?: boolean; // Add this new prop
};

const MessageItem: FunctionComponent<Props> = React.memo(
  ({ data, messages, key, callMessageAction, isDeleted }: Props) => {
    const lastItem = data?.created_at;
    const secondLastItem = messages[messages?.length - 1]?.created_at || "";
    const isMsgSentOnSameTime = lastItem === secondLastItem ? true : false;
    const { userId } = useAuth();
    const { theme } = useTheme();
    const Color = getCurrentTheme(theme || "light");
    const styles = screenStyles(Color);
    const [isPlaying, setIsPlaying] = useState(false); // State to tracqk if audio is currently playing
    const [loading, setLoading] = useState(false); // State to track if audio is currently playing
    const [progress, setProgress] = useState(0);
    const currentAudioUrlRef = useRef<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const [openMsgActions, setOpenMsgActions] = useState(false);
    const [selectedMsg, setSelectedMsg] = useState<any>();
    const { modalPosition, getModalPosition } = useModalEventOptions();
    const dispatch = useAppDispatch();

    function isMyMessage(senderId: number) {
      return String(userId) == String(senderId) ? true : false;
    }
    const isSender = isMyMessage(
      typeof data?.sender === "number" ? data?.sender : data?.sender?.id
    )
      ? true
      : false;

    const source = useMemo(
      () => ({ uri: data?.media_meta_data?.url }),
      [data?.media_meta_data?.url]
    );
    const style = useMemo(() => ({ width: 300, height: 200 }), []);
    const handleEnd = useCallback(() => {
      console.log("Video ended");
    }, []);

    // const VideoPlayer = memo(({ source, style, onEnd }) => {
    //   console.log("VideoPlayer re-render");
    //   return (
    //     <Video
    //       source={source}
    //       style={style}
    //       onEnd={onEnd}
    //     // other props
    //     />
    //   );
    // });

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

    // console.log("currentAudioUrlRef.current---data", data)
    // const updateProgress = () => {
    //   intervalRef.current = setInterval(async () => {
    //     try {
    //       const currentPosition = await SoundPlayer.getInfo();
    //       const { currentTime, duration } = currentPosition;
    //       if (currentTime.toFixed(2) === duration.toFixed(2)) {
    //         Animated.timing(progressAnim, {
    //           toValue: 0,
    //           duration: 200,
    //           useNativeDriver: false,
    //         }).start(() => {
    //           setIsPlaying(false);
    //           clearInterval(intervalRef.current);
    //         });
    //       } else if (duration > 0) {
    //         const progress = (currentTime / duration) * 100;
    //         Animated.timing(progressAnim, {
    //           toValue: progress,
    //           duration: 200,
    //           useNativeDriver: false,
    //         }).start();
    //       }
    //     } catch (error) {
    //       console.log("Error getting audio info:", error);
    //     }
    //   }, 200); // Update progress every 200 milliseconds
    // };

    // const toggleAudio = async (url: string) => {
    //   try {
    //     if (!isPlaying || currentAudioUrlRef.current !== url) {
    //       // Pause the currently playing audio if any
    //       if (currentAudioUrlRef.current) {
    //         SoundPlayer.pause();
    //         clearInterval(intervalRef.current); // Clear interval
    //         setProgress(0); // Reset progress for the previous audio
    //       }

    //       // Play the new audio
    //       SoundPlayer.playUrl(url);
    //       currentAudioUrlRef.current = url;
    //       setIsPlaying(true); // Update state for the new audio
    //       setLoading(true); // Show loading indicator
    //       updateProgress(); // Start updating progress
    //     } else {
    //       // Pause the current audio if it's the same as the one being played
    //       SoundPlayer.pause();
    //       setIsPlaying(false);
    //       clearInterval(intervalRef.current); // Clear interval
    //       setProgress(0); // Reset progress for the current audio
    //     }
    //   } catch (error) {
    //     console.log("Error toggling audio playback:", error);
    //     setIsPlaying(false);
    //   }
    // };

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
    // const toggleAudio = async (url: string) => {
    //   try {
    //     if (currentAudioUrlRef.current !== url) {
    //       SoundPlayer.playUrl(url);
    //       currentAudioUrlRef.current = url;
    //       setLoading(true)
    //       setIsPlaying(true)
    //       updateProgress(); // Start updating progress
    //     }
    //     else if (isPlaying) {
    //       SoundPlayer.pause();
    //       setIsPlaying(false);// Clear interval when playback is paused
    //     } else {
    //       SoundPlayer.resume()
    //       setIsPlaying(!isPlaying);
    //       updateProgress();
    //     }

    //     // if (currentAudioUrlRef.current === url) {
    //     //   SoundPlayer.resume()
    //     // }
    //   } catch (error) {
    //     console.log("Error toggling audio playback:", error);
    //     setIsPlaying(false);
    //   }
    // };
    const [modalVisible, setModalVisible] = useState(false);

    const ModelView = () => {
      return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(false);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black",
            }}
          >
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                padding: 15,
                backgroundColor: "grey",
                borderRadius: 10,
                position: "absolute",
                top: 60,
                right: 20,
                zIndex: 999,
              }}
            >
              <Image
                resizeMode="contain"
                style={styles.closeIcon}
                source={Images.Close}
              />
            </Pressable>
            <FastImage
              style={{ height: "100%", width: "100%" }}
              resizeMode="contain"
              source={{ uri: data?.media_meta_data?.url }}
            />
          </View>
        </Modal>
      );
    };

    const senderView = () => (
      <>
        <TouchableOpacity
          activeOpacity={1.0}
          onLongPress={(evt: any) => {
            if (!isDeleted) {
              console.log("okay");
              getModalPosition(evt, isSender ? wp(50) : wp(95), hp(47.4));
              setOpenMsgActions(true);
              setSelectedMsg(data);
            }
          }}
          style={[
            styles.senderContainer,
            { marginBottom: isMsgSentOnSameTime ? vs(10) : 0 },
          ]}
        >
          {isDeleted ? (
            <Text style={styles.deletedMessage}>This message is deleted</Text>
          ) : data?.content_type === "MEDIA" ? (
            data?.media_meta_data?.name === "fileImage" ? (
              <Pressable
                onPress={() => setModalVisible(true)}
                style={{ flex: 1 }}
              >
                <FastImage
                  style={{
                    height: ms(100),
                    width: wp(70),
                    marginBottom: mvs(10),
                  }}
                  source={{ uri: data?.media_meta_data?.url }}
                />
              </Pressable>
            ) : data?.media_meta_data?.name === "fileVideo" ? (
              loading ? (
                <View style={{ width: ms(30), height: ms(30) }}>
                  <Loader visible={loading} size={"small"} />
                </View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <VideoPlayer source={source} data={data} />
                  <Text style={{ marginStart: 10 }}>▶</Text>
                </View>
              )
            ) : (
              <View style={styles.recoderContainer}>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => toggleAudio(data?.media_meta_data?.url)}
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
              </View>
            )
          ) : (
            <View>
              {data?.reply_of ? (
                <TouchableOpacity
                  disabled
                  style={[
                    styles.replyContainer,
                    { marginBottom: isMsgSentOnSameTime ? vs(10) : 0 },
                  ]}
                >
                  <Text
                    onPress={() => console.log(data)}
                    style={styles.message}
                  >
                    {data?.reply_of?.content ||
                      data?.reply_of?.message ||
                      data?.reply_of_info?.content}
                  </Text>
                </TouchableOpacity>
              ) : null}
              <View style={{ flexDirection: "row" }}>
                {data?.is_starred ? (
                  <Image source={Images.star} style={styles.star} />
                ) : null}
                <Text onPress={() => console.log(data)} style={styles.message}>
                  {data?.content || data?.message}
                </Text>
              </View>
            </View>
          )}
          {!isMsgSentOnSameTime && (
            <Text style={[styles.timeText1]}>
              {moment(data?.created_at).format("hh:mm a")}
            </Text>
          )}
        </TouchableOpacity>
        {/* {!isMsgSentOnSameTime && (
          <Text style={[styles.timeText, { alignSelf: "flex-end" }]}>
            {moment(data?.created_at).format("hh:mm a")}
          </Text>
        )} */}
        <ModelView />
      </>
    );

    const receiverView = () => (
      <>
        <TouchableOpacity
          style={[
            styles.receiverContainer,
            { marginBottom: isMsgSentOnSameTime ? vs(10) : 0 },
          ]}
          onLongPress={(evt: any) => {
            if (!isDeleted) {
              console.log("okay");
              getModalPosition(evt, wp(95), hp(47.4));
              setOpenMsgActions(true);
              setSelectedMsg(data);
            }
          }}
          activeOpacity={1.0}
        >
          {isDeleted ? (
            <Text style={styles.deletedMessage}>This message is deleted</Text>
          ) : data?.content_type === "MEDIA" ? (
            data?.media_meta_data?.name == "fileImage" ? (
              <Pressable
                onPress={() => setModalVisible(true)}
                style={{ flex: 1 }}
              >
                <FastImage
                  style={{
                    height: ms(100),
                    width: wp(70),
                    marginBottom: mvs(10),
                  }}
                  source={{ uri: data?.media_meta_data?.url }}
                />
              </Pressable>
            ) : data?.media_meta_data?.name == "fileVideo" ? (
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <VideoPlayer source={source} data={data} />
                <Text style={{ marginStart: 10 }}>▶</Text>
              </View>
            ) : (
              <View style={styles.recoderContainer}>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => toggleAudio(data?.media_meta_data?.url)}
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
              </View>
            )
          ) : (
            <View>
              {data?.reply_of ? (
                <TouchableOpacity
                  disabled
                  style={[
                    styles.replyContainer,
                    { marginBottom: isMsgSentOnSameTime ? vs(10) : 0 },
                  ]}
                >
                  <Text
                    onPress={() => console.log(data)}
                    style={styles.message}
                  >
                    {data?.reply_of?.content ||
                      data?.reply_of?.message ||
                      data?.reply_of_info?.content}
                  </Text>
                </TouchableOpacity>
              ) : null}

              <View style={{ flexDirection: "row" }}>
                {data?.is_starred ? (
                  <Image source={Images.star} style={styles.star} />
                ) : null}
                <Text onPress={() => console.log(data)} style={styles.message}>
                  {data?.content || data?.message}
                </Text>
              </View>
            </View>
          )}
          {!isMsgSentOnSameTime && (
            <Text style={[styles.timeText1]}>
              {moment(data?.created_at).format("hh:mm a")}
            </Text>
          )}
        </TouchableOpacity>
        {/* {!isMsgSentOnSameTime && (
          <Text style={[styles.timeText]}>
            {moment(data?.created_at).format("hh:mm a")}
          </Text>
        )} */}
        <ModelView />
      </>
    );

    return (
      <View>
        {isSender ? senderView() : receiverView()}
        <MessageAction
          isSender={isSender}
          isVisible={openMsgActions}
          modalPosition={modalPosition}
          closeModal={() => {
            setOpenMsgActions(false);
          }}
          selectedMsg={selectedMsg}
          onForwardMsg={() => {}}
          onClickPin={() => {
            setOpenMsgActions(false);
            callMessageAction(selectedMsg, "pin");
          }}
          replyToMessage={() => {
            setOpenMsgActions(false);
            callMessageAction(selectedMsg, "reply");
          }}
          onEditMessage={() => {
            setOpenMsgActions(false);
            callMessageAction(selectedMsg, "edit");
          }}
          onDeleteMessage={() => {
            setOpenMsgActions(false);
            callMessageAction(selectedMsg, "delete");
          }}
          onStarMessage={() => {
            setOpenMsgActions(false);
            callMessageAction(selectedMsg, "star");
          }}
        />
      </View>
    );
  }
);

export default MessageItem;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    receiverContainer: {
      alignSelf: "flex-start",
      // flexDirection: "row",
      // alignItems: "center",
      paddingVertical: vs(10),
      paddingHorizontal: ms(13),
      backgroundColor: Color.messageBackgroundReceiver,
      maxWidth: wp(80),
      maxHeight: hp(20),
      borderRadius: ms(20),
      marginBottom: vs(16),
      marginTop: vs(10),
    },
    senderContainer: {
      alignSelf: "flex-end",
      maxHeight: hp(20),
      // flexDirection: "row",
      // alignItems: "center",
      paddingVertical: vs(10),
      paddingHorizontal: ms(13), // when message is audio instead of text need to adjust padding, previous value 20
      backgroundColor: Color.purple_theme,
      maxWidth: wp(80),
      borderRadius: ms(20),
      marginBottom: vs(16),
      marginTop: vs(10),
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
    timeText1: {
      color: Color.time_grey,
      fontSize: ms(12),
      fontWeight: "500",
      alignSelf: "flex-end",
    },
    recoderContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
};
