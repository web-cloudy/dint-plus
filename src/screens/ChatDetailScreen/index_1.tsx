import {
  Attachment,
  AvatarPNG,
  Camera,
  Emojis,
  Images,
  MicroPhone,
  Record,
  SendBlack,
} from "assets/images";
import VisionCamera from "components/atoms/VisionCamera";
import {
  ChatDetailHeader,
  MessageItem,
  ServicesHeader,
} from "components/molecules";
import ImageDisplayModal from "components/organisms/ImageDisplay/ImageDisplayModal";
import { COLORS, getCurrentTheme } from "constants/Colors";
import {
  getSocketConnection,
  setCurrentInstanceSocket,
  setSocketConnection,
} from "constants/chatSocket";
import { useAuth } from "contexts/AuthContext";
import { useTheme } from "contexts/ThemeContext";
import useAppDispatch from "hooks/useAppDispatch";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  LogBox,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
  Text,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import ImagePicker from "react-native-image-crop-picker";
import { PERMISSIONS, request } from "react-native-permissions";
import RBSheet from "react-native-raw-bottom-sheet";
import ReconnectingWebSocket from "react-native-reconnecting-websocket";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ms, mvs, scale } from "react-native-size-matters";
import SoundRecorder from "react-native-sound-recorder";
import uuid from "react-native-uuid";
import Video, { VideoRef } from "react-native-video";
import {
  ChatSelectors,
  getChatMessagesAPI,
  handleReceiveCall,
  hangUpCallForEndCall,
  incomingCall,
  patchUnreadChatMessageAPI,
  pinMessageRequest,
  resetMessageList,
  resetPinunpinData,
  updateMessaegList,
  updateMessageRequest,
  uplodAudioFileMessageAPI,
  handleIncomingCall as handleIncomingCallForVideoCall,
  handleIceCandidate,
  unStarMessage,
  starMessage,
  createMessageAPI,
} from "store/slices/chat";
import { setLoading } from "store/slices/stripe";
import { ChatMessage } from "types/chat";
import { getDataFromAsync } from "utils/LocalStorage";
import { hp, wp } from "utils/metrix";
import { Loader } from "components/atoms";
import NetInfo from "@react-native-community/netinfo";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from "react-native-webrtc";
import RNFetchBlob from "rn-fetch-blob";
import { CallingScreen } from "screens/Calling";
import { ProfileSelectors } from "store/slices/profile";
import inCallManager from "react-native-incall-manager";
import RNCallKeep from "react-native-callkeep";
import { useWebSocket } from "contexts/WebSocketContext";
import ReplyView from "components/molecules/Messages/ReplyView/ReplyView";
import { showToastError } from "components";
import StarredMessages from "screens/StarredMessages";
import { EventRegister } from "react-native-event-listeners";
import ChatOptionData from "constants/ChatOptionData";
import { FONTS } from "constants/fonts";
import { HorizontalFlatList } from "@idiosync/horizontal-flatlist";
import MapViewForSendLocation from "components/organisms/MapViewForSendLocation/MapViewForSendLocation";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("screen").width;

const URL = "wss://bedev.dint.com/ws/conversation/global/";
LogBox.ignoreAllLogs();

// let audioRecorderPlayer = new AudioRecorderPlayer();

const VideoPlayer = ({ source, fullscreen, customStyle }) => {
  console.log("source---", source);

  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<VideoRef>(null);
  const format = (seconds) => {
    if (isNaN(seconds)) {
      return "00:00"; // Return default value if seconds is NaN
    }
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, "0");
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <View style={customStyle}>
      <Video
        // fullscreen={fullscreen ? true : false}
        paused={paused}
        controls={true}
        onLoad={() => {
          // setPaused(true); // this will set first frame of video as thumbnail
          videoRef.current.seek(0);
        }}
        // onEnd={() => ref.current.setNativeProps({ paused: true })}
        source={source}
        ref={videoRef}
        onProgress={(x) => setProgress(x)}
        muted
        repeat={false}
        autoplay={false}
        style={customStyle ? customStyle : [{ width: "100%", height: ms(200) }]}
        resizeMode="contain"
      />
      {/* {clicked && (
            <TouchableOpacity
              activeOpacity={1}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setPaused(!paused);
                  setClicked(false);
                }}
              >
                <Image
                  source={
                    paused
                      ? require("../../assets/images/play-button.png")
                      : require("../../assets/images/pause.png")
                  }
                  style={{
                    width: RFValue(25),
                    height: RFValue(25),
                    tintColor: COLORS.White,
                  }}
                />
              </TouchableOpacity>

              {!paused && (
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    position: "absolute",
                    bottom: 0,
                    paddingLeft: 20,
                    paddingRight: 20,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white" }}>
                    {format(progress?.currentTime)}
                  </Text>
                  <Slider
                    style={{ width: "80%", height: 40 }}
                    minimumValue={0}
                    value={progress?.currentTime}
                    maximumValue={progress?.seekableDuration}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#fff"
                    onValueChange={(x) => {
                      ref.current.seek(x);
                    }}
                  />
                  <Text style={{ color: "white" }}>
                    {format(progress?.seekableDuration)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )} */}
    </View>
  );
};

const ChatDetailScreen = ({ navigation, route }) => {
  let dirs = RNFetchBlob.fs.dirs;
  const audioRecorderPlayer = new AudioRecorderPlayer();
  let currnetInstaceId = Math.floor(Math.random() * 100);
  const [text, setText] = useState<string>("");
  const [editData, setEditData] = useState<object>({});
  const [longpressActive, setLongpressActive] = useState<boolean>(false);
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [imageToShow, setImageToShow] = useState("");
  const { profileData } = ProfileSelectors();
  const inputRef = useRef<TextInput>(null);
  const { receiverId, receiverName, receiverImage, channel_id, chatMsgs } =
    route?.params;
  const { ws, connectWebSocket } = useWebSocket();

  const updatedUser = {
    custom_username: "",
    display_name: receiverName || "",
    profile_image: receiverImage || "",
    id: receiverId || "",
  };

  const [reversedMessageList, setReversedMessageList] = useState<
    Array<ChatMessage>
  >([chatMsgs]);
  // console.log("reversedMessageList---", reversedMessageList);
  const flatlistRef = useRef<FlatList>(null);
  const scrollRef = useRef<ScrollView>(null);
  const { userId } = useAuth();
  const dispatch = useAppDispatch();
  const [video, setVideo] = useState(null);
  const [selectedMsg, setSelectedMsg] = useState<any | undefined>();

  const [FlagForAlert, setFlagForAlert] = useState(false);
  const [selectedVideo, setselectedVideo] = useState(null);
  const [videoMime, setVideoMime] = useState("");
  const [tackPhotoClicked, setTakePhotoClicks] = useState(false);
  const [ConfirmSend, setConfirmSend] = useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [IMEINumber, setIMEINumber] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [CameraUsage, setCameraUsage] = useState(true);
  const {
    messageList,
    loading,
    createMessageData,
    uploadFileResp,
    pinUnpinMsgResp,
    selectedChannelInfo,
  } = ChatSelectors();
  const [internet, setInternet] = useState<boolean>(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [isVoiceOnly, setIsVoiceOnly] = useState(false);
  const [recordId, setRecordId] = useState(null);

  let messageResponse = {};
  // const [messageResponse, setMessageResonse] = useState();
  // console.log("🚀 ~ localStream:", localStream);
  const [localMicOn, setlocalMicOn] = useState(true);
  const [localWebcamOn, setlocalWebcamOn] = useState(true);
  const [loudSpeakerOff, setLoudSpeakerOff] = useState(true);
  const [calling, setCalling] = useState(false);
  const [isType, setIsType] = useState<boolean>(false);
  const refRBSheet = useRef<RBSheet>(null);
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [actionType, setActionType] = useState("");
  const [onRefresh, setOnRefresh] = useState(false);
  const [loader, setLoader] = useState(false);
  // let ws = useRef(null);
  const [currentVisibleDate, setCurrentVisibleDate] = useState<string | null>(
    null
  );

  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(undefined);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const staticKeyboardHeight = hp(39.82);
  const yourConn = useRef();
  const timerIntervalRef = useRef();
  const [showRecoder, setShowRecoder] = useState(false);
  const [isLocationModalVisible, setisLocationModalVisible] = useState(false);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [isLiveLocationMapModalVisible, setIsLiveLocationMapModalVisible] =
    useState(false);
  const totalPages = Math.ceil(ChatOptionData.length / 6);
  const [pageIndex, setPageIndex] = useState(0);

  const handlePlusPress = () => {
    if (isOptionsVisible) {
      setOptionsVisible(false);
    } else {
      Keyboard.dismiss();
      setOptionsVisible(true);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardVisible(true);
        setOptionsVisible(false);
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(undefined);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Function to switch camera side (front/back)
  const switchCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track._switchCamera();
      });
    }
  };

  // Function to enable/disable camera
  const toggleCamera = () => {
    if (localStream) {
      localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
      localStream.getVideoTracks().forEach((track) => {
        localWebcamOn ? (track.enabled = false) : (track.enabled = true);
      });
    }
  };

  // Function to enable/disable Mic
  const toggleMic = () => {
    if (localStream) {
      localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
      localStream.getAudioTracks().forEach((track) => {
        localMicOn ? (track.enabled = false) : (track.enabled = true);
      });
    }
  };

  // Function to toggleSpeaker loud or inner
  const toggleSpeaker = () => {
    inCallManager.setForceSpeakerphoneOn(!loudSpeakerOff);
    setLoudSpeakerOff(!loudSpeakerOff);
  };

  // const path =
  //   Platform.select({
  //     ios: `file://${RNFS.DocumentDir}/sound.m4a`,
  //     android: `${dirs.CacheDir}/hello.mp3`,
  //   })

  const takePicture = async (event) => {
    if (camera != null) {
      const photo = await camera.current.takePhoto();
      setImageData("file://" + photo.path);
      setTakePhotoClicks(false);
      console.log("photo", photo);
      // detectQRCode("file://" + photo.path);
    }
  };

  const openImagePicker = () => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("Image picker error: ", response.error);
      } else {
        // let imageUri = response.uri || response.assets?.[0]?.uri;
        setLoader(true);
        setImageData(response?.assets[0]?.uri);
        setTakePhotoClicks(false);
      }
    });
  };

  // const reconnectWebSocket = async () => {
  //   const token = await getDataFromAsync("token");
  //   if (token) {
  //     connectWebSocket(token);
  //   }
  // };

  const reconnectWebSocket = async () => {
    try {
      const token = await getDataFromAsync("token");
      if (token) {
        await connectWebSocket(token);
        console.log("WebSocket reconnected successfully");
      } else {
        console.log("No token available for reconnection");
        showToastError(
          "'Error-005', 'Unable to reconnect. Please try again later.'"
        );
      }
    } catch (error) {
      console.log("Error reconnecting WebSocket", error);
      showToastError(
        "Error-006, 'Failed to reconnect. Please check your internet connection and try again.'"
      );
    }
  };

  // useEffect(() => {
  //   const checkConnection = setInterval(() => {
  //     console.log(' ---30 sec check---> ', )
  //     if (ws.current && ws.current.readyState !== WebSocket.OPEN) {
  //       showToastError("Error-007 Connection Lost', 'Chat connection has been lost. Attempting to reconnect...'")
  //       reconnectWebSocket();
  //     }
  //   }, 30000); // Check every 30 seconds

  //   return () => clearInterval(checkConnection);
  // }, []);

  useEffect(() => {
    const netWorkSubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected && state.isInternetReachable;

      if (isConnected) {
        console.log("Network connection restored");
        reconnectWebSocket();
      } else {
        console.log("Network connection lost");
        Alert.alert(
          "No Internet",
          "Your internet connection appears to be offline. Chat may not work properly."
        );
      }
    });

    return netWorkSubscribe;
  }, []);

  const connectWeb = async () => {
    const token = await getDataFromAsync("token");
    if (token) {
      connectWebSocket(token);
    }
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "messageEvent",
      (message) => {
        console.log("🚀 ~ useEffect ~ event:", message);
        let isSuccess = message?.hasOwnProperty("user_id");
        if (isSuccess === false) {
          if (message.channel_id === channel_id) {
            console.log("free call", message);
            console.log(reversedMessageList, "----reversedMessageList");

            reversedMessageList.push(message);
            setReversedMessageList(reversedMessageList);
            dispatch(updateMessaegList(message));
            console.log(reversedMessageList, "222222----arr");
            scrollRef?.current?.scrollToEnd({ animated: true });
            flatlistRef?.current?.scrollToEnd({
              animated: true,
            });
          }
        }
      }
    );
    return () => {
      subscription.remove();
    };
  }, []);

  // useEffect(() => {
  //   connectWeb();
  // }, [ws.current]);

  // useEffect(() => {
  //   reconnectWebSocket();
  //   return () => {
  //     if (ws.current) {
  //       ws.current.close();
  //       // ws = useRef(null);
  //     }
  //   };
  // }, [receiverId]);

  // setupTrackListener for videocall
  const setupTrackListener = async () => {
    yourConn.current.addEventListener("track", (event) => {
      let remoteMediaStream = new MediaStream();
      remoteMediaStream.addTrack(event.track);
      setRemoteStream(remoteMediaStream);
    });

    await yourConn.current.addEventListener(
      "connectionstatechange",
      (event: any) => {
        console.log("connectionstatechange", yourConn.current.connectionState);
        if (yourConn.current.connectionState === "connected") {
          console.log("connectionstatechange", "connected🥳🥳🥳");
        }
      }
    );
  };

  useEffect(() => {
    if (pinUnpinMsgResp?.pin?.status === 200) {
      dispatch(resetPinunpinData());
    } else if (pinUnpinMsgResp?.pin?.status === 400) {
      dispatch(resetPinunpinData());
    } else if (pinUnpinMsgResp?.unpin?.status === 200) {
      dispatch(resetPinunpinData());
    } else if (pinUnpinMsgResp?.unpin?.status === 400) {
      dispatch(resetPinunpinData());
    }
  }, [pinUnpinMsgResp]);

  // Call setupTrackListener in useEffect
  useEffect(() => {
    if (yourConn.current) {
      setupTrackListener();
    }
  }, [yourConn.current]);

  //exchange peer connection for videocall
  const handleIceCandidateEvent = async (event) => {
    console.log("🚀 ~ handleIceCandidateEvent ~ event:", event);
    if (event.candidate) {
      const body = {
        type: "send_ice_candidate",
        candidate: event.candidate,
        channel_id: channel_id,
        secure_key: uuid.v4(),
      };
      setTimeout(async () => {
        const socket = getSocketConnection();
        if (socket) {
          socket.send(JSON.stringify(body));
        } else {
          const token = await getDataFromAsync("token");
          if (token) {
            connectWebSocket(token).then(() => {
              getSocketConnection()?.send(JSON.stringify(body));
            });
          }
        }
      }, 1000);
    }
  };

  //start call and sen request for another user
  const startCall = async () => {
    yourConn.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun2.l.google.com:19302",
        },
        {
          urls: "stun:stun1.l.google.com:19302",
        },
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });
    Keyboard.dismiss();
    inCallManager.start({ media: "video" });
    inCallManager.setForceSpeakerphoneOn(loudSpeakerOff);

    const local = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (isVoiceOnly) {
      let videoTrack = await local.getVideoTracks()[0];
      videoTrack.enabled = false;
    }
    // Add tracks from the local stream to the peer connection
    await local.getTracks().forEach((track) => {
      yourConn.current.addTrack(track, local);
    });
    setLocalStream(local);

    yourConn.current.onicecandidate = (event) => {
      console.log("🚀 ~ startCall ~ event:", event);
      if (event.candidate) {
        handleIceCandidateEvent(event);
      } else {
        console.log(" onicecandidate completed");
      }
    };
    console.log("called");
    const offerDescription = await yourConn.current.createOffer();
    await yourConn.current.setLocalDescription(offerDescription);
    const body = {
      type: "send_offer",
      offer: offerDescription,
      channel_id: channel_id,
      secure_key: uuid.v4(),
      sender_name: profileData?.display_name,
    };
    const socket = getSocketConnection();
    if (socket) {
      socket.send(JSON.stringify(body));
    } else {
      const token = await getDataFromAsync("token");
      if (token) {
        connectWebSocket(token).then(() => {
          getSocketConnection()?.send(JSON.stringify(body));
        });
      }
    }
  };

  //send massage for exchange ice candidate
  const handleIceCandidateMessage = (candidate) => {
    yourConn.current.addIceCandidate(new RTCIceCandidate(candidate.candidate));
  };

  // receive call from second user and handle it.
  const handleAnswerMessage = async (message) => {
    setCalling(false);
    await yourConn.current.setRemoteDescription(
      new RTCSessionDescription(message.answer)
    );
  };

  const handleIncomingCall = async (message) => {
    yourConn.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun2.l.google.com:19302",
        },
        {
          urls: "stun:stun1.l.google.com:19302",
        },
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });
    Keyboard.dismiss();
    setCalling(true);
    inCallManager.start({ media: "video" });
    inCallManager.startRingtone("_DEFAULT_", 1, "", 30);
    inCallManager.setForceSpeakerphoneOn(loudSpeakerOff);
    const local = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (isVoiceOnly) {
      let videoTrack = await local.getVideoTracks()[0];
      videoTrack.enabled = false;
    }
    await yourConn.current.setRemoteDescription(
      new RTCSessionDescription(message.offer)
    );
    setLocalStream(local);
    // Add tracks from the local stream to the peer connection
    await local.getTracks().forEach((track) => {
      yourConn.current.addTrack(track, local);
    });
    setupTrackListener();
  };

  const handleIncomingCallAccept = async () => {
    setCalling(false);
    inCallManager.stopRingtone();
    const answerDescription = await yourConn.current.createAnswer();
    await yourConn.current.setLocalDescription(answerDescription);
    const body = {
      type: "send_answer",
      answer: answerDescription,
      channel_id: channel_id,
      secure_key: uuid.v4(),
      record_id: recordId,
    };
    // Send answer to the remote peer
    const socket = getSocketConnection();
    if (socket) {
      socket.send(JSON.stringify(body));
    } else {
      const token = await getDataFromAsync("token");
      if (token) {
        connectWebSocket(token).then(() => {
          getSocketConnection()?.send(JSON.stringify(body));
        });
      }
    }
    console.log("Answer sent.");
  };

  const hangUpCall = async () => {
    try {
      const body = {
        type: "leave_call",
        channel_id: channel_id,
        secure_key: uuid.v4(),
      };
      const socket = getSocketConnection();
      if (socket) {
        socket.send(JSON.stringify(body));
      } else {
        const token = await getDataFromAsync("token");
        if (token) {
          connectWebSocket(token).then(() => {
            getSocketConnection()?.send(JSON.stringify(body));
          });
        }
      }
      inCallManager.stop();
      setCalling(false);
      // Close RTCPeerConnection
      if (localStream) {
        localStream?.getTracks().forEach((track) => track.stop());
        localStream.release();
        setLocalStream(null);
      }
      if (remoteStream) {
        remoteStream?.getTracks().forEach((track) => track.stop());
        remoteStream.release();
        setRemoteStream(null);
      }
      if (yourConn.current) {
        yourConn.current.close();
        yourConn.current.onicecandidate = null;
        yourConn.current.ontrack = null;
      }
    } catch (error) {
      console.error("Error hanging up call:", error);
    }
  };

  const callEnd = () => {
    try {
      inCallManager.stop();
      setCalling(false);
      if (yourConn.current) {
        setLocalStream(null);
        setRemoteStream(null);
        yourConn.current.close();
        yourConn.current.onicecandidate = null;
        yourConn.current.ontrack = null;
      }
    } catch (error) {
      console.error("Error hanging up call:", error);
    }
  };

  const send = async (body) => {
    //attach the other peer username to our messages
    console.log("Connected user in end----------", body);
    // if (connectedUser) {
    //   // body.name = connectedUser;
    // }

    const socket = getSocketConnection();
    if (socket) {
      socket.send(JSON.stringify(body));
    } else {
      const token = await getDataFromAsync("token");
      if (token) {
        connectWebSocket(token).then(() => {
          getSocketConnection()?.send(JSON.stringify(body));
        });
      }
    }
    setSocketConnection(ws.current);
    setCurrentInstanceSocket(0);
  };

  const getDistinctElements = (arr: []) => {
    // console.log("first-arr", arr);
    const uniqueArray = Array.from(
      arr
        .reduce((map, obj) => map.set(obj?.secure_key, obj), new Map())
        .values()
    );
    console.log("uniqueArray", uniqueArray);

    return uniqueArray;
  };

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      if (messageList?.length > 0) {
        scrollRef?.current?.scrollToEnd({ animated: true });
        // flatlistRef?.current?.scrollToIndex({
        //   animated: true,
        //   index: messageList?.length - 1,
        // });
        flatlistRef?.current?.scrollToOffset({
          offset: messageList?.length - 1,
        });
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [messageList]);

  // alert(route.params?.type)
  const onConfirmSendPress = async () => {
    setConfirmSend(false);
    setLoader(true);
    if (imageData !== null) {
      // await onStopPlay();
      let data = new FormData();
      let imageMedia = {
        uri: imageData,
        name: Platform.OS === "ios" ? "test.jpg" : "test.jpg",
        filename: Platform.OS === "ios" ? "test.jpg" : "test.jpg",
        type: Platform.OS === "ios" ? "image/jpeg" : "image/jpeg",
      };
      // data.append("media", imageMedia)
      console.log("-------imageMedia", imageMedia),
        data.append("media", imageMedia);
      console.log(JSON.stringify(data), "-------data");
      let res = await dispatch(uplodAudioFileMessageAPI(data));
      console.log(res, "-------rers");
      refRBSheet?.current?.close();

      let arr = selectedChannelInfo?.info?.group_name?.split("-");
      const body = {
        type: route.params?.type
          ? route.params?.type === "GROUP"
            ? "group_media"
            : "media"
          : arr?.length === 3
          ? "media"
          : "group_media",
        message: Platform.OS === "ios" ? "test.jpg" : "test.jpg",
        channel_id: route.params?.channel_id
          ? route.params?.channel_id
          : selectedChannelInfo?.info?.channel_id,
        content_type: "MEDIA",
        secure_key: uuid.v4(),
        media_meta_data: {
          name: "fileImage",
          url: res?.payload?.media_file_url,
        },
      };
      if (actionType === "reply") {
        body.reply_of = selectedMsg?.secure_key;
      }

      console.log("sent message body for Image ", body);
      ws.current?.send(JSON.stringify(body));
      const socket = getSocketConnection();
      if (socket) {
        socket.send(JSON.stringify(body));
        setText("");
      } else {
        const token = await getDataFromAsync("token");
        if (token) {
          await connectWebSocket(token);
          getSocketConnection()?.send(JSON.stringify(body));
          setText("");
        }
      }
      setSelectedMsg(undefined);
      setActionType("");
    } else {
      // await onStopPlay();
      let data = new FormData();
      let VideoMedia = {
        uri: video?.path,
        name: "video.mp4",
        filename: "video.mp4",
        type: Platform.OS === "ios" ? "video/mp4" : "video/mp4",
      };
      // data.append("media", VideoMedia)
      console.log("-------VideoMedia", VideoMedia),
        data.append("media", VideoMedia);
      console.log(JSON.stringify(data), "-------data");
      let res = await dispatch(uplodAudioFileMessageAPI(data));
      console.log(res, "-------rers");
      refRBSheet?.current?.close();

      let arr = selectedChannelInfo?.info?.group_name?.split("-");
      const body = {
        type: route.params?.type
          ? route.params?.type === "GROUP"
            ? "group_media"
            : "media"
          : arr?.length === 3
          ? "media"
          : "group_media",
        message: "video.mp4",
        channel_id: route.params?.channel_id
          ? route.params?.channel_id
          : selectedChannelInfo?.info?.channel_id,
        content_type: "MEDIA",
        secure_key: uuid.v4(),
        media_meta_data: {
          name: "fileVideo",
          url: res?.payload?.media_file_url,
        },
      };
      if (actionType === "reply") {
        body.reply_of = selectedMsg?.secure_key;
      }
      console.log("sent message body for Video ", body);
      ws.current?.send(JSON.stringify(body));
      const socket = getSocketConnection();
      if (socket) {
        socket.send(JSON.stringify(body));
        setText("");
      } else {
        const token = await getDataFromAsync("token");
        if (token) {
          await connectWebSocket(token);
          getSocketConnection()?.send(JSON.stringify(body));
          setText("");
        }
      }
      setSelectedMsg(undefined);
      setActionType("");
    }
  };

  const initializeWebSocket = async () => {
    const token = await getDataFromAsync("token");
    if (token) {
      await connectWebSocket(token);
    }
  };

  const sendMessage = async (message) => {
    console.log(" ----2--> ", message);
    const socket = getSocketConnection();
    if (socket) {
      await socket.send(JSON.stringify(message));
    } else {
      const token = await getDataFromAsync("token");
      if (token) {
        await connectWebSocket(token);
        getSocketConnection()?.send(JSON.stringify(message));
      }
    }
  };

  const onSendPress = async () => {
    if (!text) return;

    // let arr = selectedChannelInfo?.info?.group_name?.split("-");
    // const isGroup = route.params?.type === "GROUP" || arr?.length !== 3;
    const isGroup = route.params?.type === "GROUP";

    const body = {
      type: isGroup ? "group_text" : "text",
      message: text,
      channel_id:
        route.params?.channel_id || selectedChannelInfo?.info?.channel_id,
      content_type: "TEXT",
      secure_key: uuid.v4(),
    };

    if (actionType === "reply") {
      body.reply_of = selectedMsg?.secure_key;
    }

    if (actionType === "edit") {
      Alert.alert(
        "Edit Message",
        "Are you sure you want to edit this message?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Edit",
            onPress: async () => {
              const editBody = {
                type: "message_edited",
                message: text,
                channel_id: body.channel_id,
                secure_key: selectedMsg?.secure_key,
              };
              console.log(" ---edit data---> ", editBody);
              await sendMessage(editBody);
              // Update the message list with the edited message
              setReversedMessageList((prevList) =>
                prevList.map((msg) =>
                  msg.secure_key === selectedMsg?.secure_key
                    ? { ...msg, content: text }
                    : msg
                )
              );
              setText("");
              setSelectedMsg(undefined);
              setActionType("");
            },
          },
        ]
      );
    } else {
      console.log("sent message body test", body);
      await sendMessage(body);
    }
    setText("");
    setSelectedMsg(undefined);
    setActionType("");
  };

  const handleStar = async (msgContent: any) => {
    const updatedMessage = {
      ...msgContent,
      is_starred: !msgContent.is_starred,
    };
    console.log(" --msgContent?.id----> ", msgContent?.id);

    setReversedMessageList((prevList) => {
      const newList = prevList.map((msg) =>
        msg.secure_key === msgContent.secure_key ? updatedMessage : msg
      );
      console.log("Updated list:", newList);
      return newList;
    });

    // setTimeout(() => {
    //   setOnRefresh(prev => !prev);
    // }, 1000);
    if (msgContent.is_starred) {
      dispatch(unStarMessage(msgContent?.id));
    } else {
      dispatch(starMessage(msgContent?.id));
    }
  };
  const onDeletePress = async (msgContent: any) => {
    if (msgContent) {
      Alert.alert(
        "Delete Message",
        "Are you sure you want to delete this message?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              const body = {
                type: "message_deleted",
                message: "This message was deleted",
                channel_id: route.params?.channel_id
                  ? route.params?.channel_id
                  : selectedChannelInfo?.info?.channel_id,
                secure_key: msgContent?.secure_key,
              };

              console.log("Delete message body ---> ", body);
              await sendMessage(body);
              // Update the message list with the deleted message
              setReversedMessageList((prevList) =>
                prevList.map((msg) =>
                  msg.secure_key === msgContent.secure_key
                    ? {
                        ...msg,
                        content: "This message is deleted",
                        is_deleted: true,
                      }
                    : msg
                )
              );
              setText("");
              setSelectedMsg(undefined);
              setActionType("");
              setOnRefresh((pre) => !pre);
            },
          },
        ]
      );
    }
  };

  const getItemLayout = (data, index) => ({
    length: 100,
    offset: index * 100,
    index,
  });

  function onPressBackButton() {
    console.log("navigation.canGoBack()", navigation.canGoBack());
    if (route?.params?.newGroup) {
      navigation?.pop(2);
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        if (Platform.OS == "ios") {
          navigation.replace("Main");
        } else {
          BackHandler.exitApp();
        }
      }
    }
  }

  // useEffect(() => {
  //   if (text?.length > 0) {
  //     console.log("text?.length", text?.length)
  //     setIsType(false);
  //     scrollRef?.current?.scrollToEnd({ animated: true });
  //     flatlistRef?.current?.scrollToOffset({
  //       offset: messageList?.length - 1,
  //     });
  //   } else {
  //     setIsType(true);
  //   }
  // }, [text?.length]);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const atLeastAndroid13 =
        Platform.OS === "android" && Platform.Version >= 33;
      try {
        const grants = await PermissionsAndroid.requestMultiple(
          atLeastAndroid13
            ? [
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
              ]
            : [
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
              ]
        );

        if (
          atLeastAndroid13
            ? grants["android.permission.RECORD_AUDIO"] ===
              PermissionsAndroid.RESULTS.GRANTED
            : grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
                PermissionsAndroid.RESULTS.GRANTED &&
              grants["android.permission.READ_EXTERNAL_STORAGE"] ===
                PermissionsAndroid.RESULTS.GRANTED &&
              grants["android.permission.RECORD_AUDIO"] ===
                PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("permissions granted");
        } else {
          console.log("All required permissions not granted");
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const onStartRecord = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;
    try {
      SoundRecorder.start(SoundRecorder.PATH_CACHE + "/sound.m4a").then(
        function () {
          console.log("started recording");
          setIsRecording(true);
          startRecordingTimer();
        }
      );
    } catch (err) {
      console.log("failed", err);
      setTimer(0);
    }
  };

  // console.log("path", path);
  // console.log("Hello world--", text);

  const onStopRecord = async () => {
    setIsRecording(false);
    clearInterval(timerIntervalRef.current);
    setTimer(0);
    setLoader(true);
    SoundRecorder.stop().then(async function (result) {
      console.log("stopped recording, audio file saved at: " + result.path);
      // setPath(result.path)
      const path = result.path;
      if (path !== "") {
        // await onStopPlay();
        let data = new FormData();
        let audio = {
          uri: path,
          name: Platform.OS === "ios" ? "sound.m4a" : "hello.mp3",
          filename: Platform.OS === "ios" ? "sound.m4a" : "hello.mp3",
          type: Platform.OS === "ios" ? "media/m4a" : "media/mp3",
        };
        // data.append("media", audio)
        console.log("-------audio", audio), data.append("media", audio);
        console.log(JSON.stringify(data), "-------data");
        let res = await dispatch(uplodAudioFileMessageAPI(data));
        console.log(res, "-------rers");
        refRBSheet?.current?.close();

        let arr = selectedChannelInfo?.info?.group_name?.split("-");
        const body = {
          type: route.params?.type
            ? route.params?.type === "GROUP"
              ? "group_media"
              : "media"
            : arr?.length === 3
            ? "media"
            : "group_media",
          message: Platform.OS === "ios" ? "sound.m4a" : "hello.mp3",
          channel_id: route.params?.channel_id
            ? route.params?.channel_id
            : selectedChannelInfo?.info?.channel_id,
          content_type: "MEDIA",
          secure_key: uuid.v4(),
          media_meta_data: { name: "file", url: res?.payload?.media_file_url },
        };
        if (actionType === "reply") {
          body.reply_of = selectedMsg?.secure_key;
        }

        console.log("sent message body for Audio ", body);
        ws.current?.send(JSON.stringify(body));
        const socket = getSocketConnection();
        if (socket) {
          socket.send(JSON.stringify(body));
          setText("");
        } else {
          const token = await getDataFromAsync("token");
          if (token) {
            await connectWebSocket(token);
            getSocketConnection()?.send(JSON.stringify(body));
            setText("");
          }
        }
        setSelectedMsg(undefined);
        setActionType("");
      }
    });
    // console.log("Stop==============");
    // await audioRecorderPlayer.stopRecorder();
    // audioRecorderPlayer.removeRecordBackListener();
    // setRecTime(0)
  };

  const startRecordingTimer = () => {
    setTimer(0);
    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1); // Increment timer every second
    }, 1000);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleCameraButton = () => {
    setTakePhotoClicks(true);
    // setCameraUsage(true);
    // setLoader(true)
  };
  // useEffect(() => {
  //   async function resultImage() {
  //     if (imageData !== null) {

  //       // await onStopPlay();
  //       let data = new FormData();
  //       let imageMedia = {
  //         uri: imageData,
  //         name: Platform.OS === "ios" ? "test.jpg" : "test.jpg",
  //         filename: Platform.OS === "ios" ? "test.jpg" : "test.jpg",
  //         type: Platform.OS === "ios" ? "image/jpeg" : "image/jpeg",
  //       };
  //       // data.append("media", imageMedia)
  //       console.log("-------imageMedia", imageMedia), data.append("media", imageMedia);
  //       console.log(JSON.stringify(data), "-------data");
  //       let res = await dispatch(uplodAudioFileMessageAPI(data));
  //       console.log(res, "-------rers");
  //       refRBSheet?.current?.close();

  //       let arr = selectedChannelInfo?.info?.group_name?.split("-");
  //       const body = {
  //         type: route.params?.type
  //           ? route.params?.type === "GROUP"
  //             ? "group_media"
  //             : "media"
  //           : arr?.length === 3
  //             ? "media"
  //             : "group_media",
  //         message: Platform.OS === "ios" ? "test.jpg" : "test.jpg",
  //         channel_id: route.params?.channel_id
  //           ? route.params?.channel_id
  //           : selectedChannelInfo?.info?.channel_id,
  //         content_type: "MEDIA",
  //         secure_key: uuid.v4(),
  //         media_meta_data: { name: "fileImage", url: res?.payload?.media_file_url },
  //       };
  //       console.log("sent message body for Image ", body);
  //       ws.current?.send(JSON.stringify(body));
  //       const socket = getSocketConnection();
  //       if (socket) {

  //         socket.send(JSON.stringify(body));
  //         setText("");
  //       } else {
  //         const token = await getDataFromAsync("token");
  //         if (token) {
  //           await connectWebSocket(token);
  //           getSocketConnection()?.send(JSON.stringify(body));
  //           setText("");
  //         }
  //       }
  //     }
  //   }
  //   resultImage()
  // }, [imageData])

  // const handleImagePicker = async (isCamera: boolean) => {
  //   try {
  //     let image;
  //     if (isCamera) {
  //       image = await ImagePicker.openCamera({
  //         width: 500,
  //         height: 500,
  //         cropping: false,
  //         compressImageMaxWidth: 1000,
  //         compressImageMaxHeight: 1000,
  //         compressImageQuality: 0.8,
  //         compressVideoPreset: "MediumQuality",
  //         includeExif: true,
  //         mediaType: "any",
  //       });
  //     } else {
  //       image = await ImagePicker.openPicker({
  //         width: 500,
  //         height: 500,
  //         cropping: false,
  //         compressImageMaxWidth: 1000,
  //         compressImageMaxHeight: 1000,
  //         compressImageQuality: 0.8,
  //         compressVideoPreset: "MediumQuality",
  //         includeExif: true,
  //         mediaType: "any",
  //         // multiple: true,
  //       });
  //     }
  //     // onPress(image);
  //     // setConfirmSend(true)
  //     setLoader(true);
  //     console.log("imageeee", image);
  //     if (image?.mime === "image/jpeg") {
  //       let data = new FormData();
  //       let imageMedia = {
  //         uri: image?.path,
  //         name: Platform.OS === "ios" ? "test.jpg" : "test.jpg",
  //         filename: Platform.OS === "ios" ? "test.jpg" : "test.jpg",
  //         type: Platform.OS === "ios" ? "image/jpeg" : "image/jpeg",
  //       };
  //       // data.append("media", imageMedia)
  //       console.log("-------imageMedia", imageMedia),
  //         data.append("media", imageMedia);
  //       console.log(JSON.stringify(data), "-------data");
  //       let res = await dispatch(uplodAudioFileMessageAPI(data));
  //       console.log(res, "-------rers");
  //       refRBSheet?.current?.close();

  //       let arr = selectedChannelInfo?.info?.group_name?.split("-");
  //       const body = {
  //         type: route.params?.type
  //           ? route.params?.type === "GROUP"
  //             ? "group_media"
  //             : "media"
  //           : arr?.length === 3
  //           ? "media"
  //           : "group_media",
  //         message: Platform.OS === "ios" ? "test.jpg" : "test.jpg",
  //         channel_id: route.params?.channel_id
  //           ? route.params?.channel_id
  //           : selectedChannelInfo?.info?.channel_id,
  //         content_type: "MEDIA",
  //         secure_key: uuid.v4(),
  //         media_meta_data: {
  //           name: "fileImage",
  //           url: res?.payload?.media_file_url,
  //         },
  //       };
  //       if (actionType === "reply") {
  //         body.reply_of = selectedMsg?.secure_key;
  //       }

  //       console.log("sent message body for Image ", body);
  //       ws.current?.send(JSON.stringify(body));
  //       const socket = getSocketConnection();
  //       if (socket) {
  //         socket.send(JSON.stringify(body));
  //         setText("");
  //       } else {
  //         const token = await getDataFromAsync("token");
  //         if (token) {
  //           await connectWebSocket(token);
  //           getSocketConnection()?.send(JSON.stringify(body));
  //           setText("");
  //         }
  //       }

  //       setSelectedMsg(undefined);
  //       setActionType("");
  //     } else {
  //       // await onStopPlay();
  //       let data = new FormData();
  //       let VideoMedia = {
  //         uri: image?.path,
  //         name: "video.mp4",
  //         filename: "video.mp4",
  //         type: Platform.OS === "ios" ? "video/mp4" : "video/mp4",
  //       };
  //       // data.append("media", VideoMedia)
  //       console.log("-------VideoMedia", VideoMedia),
  //         data.append("media", VideoMedia);
  //       console.log(JSON.stringify(data), "-------data");
  //       let res = await dispatch(uplodAudioFileMessageAPI(data));
  //       console.log(res, "-------rers");
  //       refRBSheet?.current?.close();

  //       let arr = selectedChannelInfo?.info?.group_name?.split("-");
  //       const body = {
  //         type: route.params?.type
  //           ? route.params?.type === "GROUP"
  //             ? "group_media"
  //             : "media"
  //           : arr?.length === 3
  //           ? "media"
  //           : "group_media",
  //         message: "video.mp4",
  //         channel_id: route.params?.channel_id
  //           ? route.params?.channel_id
  //           : selectedChannelInfo?.info?.channel_id,
  //         content_type: "MEDIA",
  //         secure_key: uuid.v4(),
  //         media_meta_data: {
  //           name: "fileVideo",
  //           url: res?.payload?.media_file_url,
  //         },
  //       };
  //       if (actionType === "reply") {
  //         body.reply_of = selectedMsg?.secure_key;
  //       }

  //       console.log("sent message body for Video ", body);
  //       ws.current?.send(JSON.stringify(body));
  //       const socket = getSocketConnection();
  //       if (socket) {
  //         socket.send(JSON.stringify(body));
  //         setText("");
  //       } else {
  //         const token = await getDataFromAsync("token");
  //         if (token) {
  //           await connectWebSocket(token);
  //           getSocketConnection()?.send(JSON.stringify(body));
  //           setText("");
  //         }
  //       }
  //       setActionType("");
  //       setSelectedMsg(undefined);
  //     }
  //   } catch (error) {
  //     console.log("Error picking video:", error);
  //   }
  // };

  const handleImagePicker = async (isCamera: boolean) => {
    try {
      let images = [];
      if (isCamera) {
        const image = await ImagePicker.openCamera({
          width: 500,
          height: 500,
          cropping: false,
          compressImageMaxWidth: 1000,
          compressImageMaxHeight: 1000,
          compressImageQuality: 0.8,
          compressVideoPreset: "MediumQuality",
          includeExif: true,
          mediaType: "any",
        });
        images.push(image);
      } else {
        images = await ImagePicker.openPicker({
          width: 500,
          height: 500,
          cropping: false,
          compressImageMaxWidth: 1000,
          compressImageMaxHeight: 1000,
          compressImageQuality: 0.8,
          compressVideoPreset: "MediumQuality",
          includeExif: true,
          mediaType: "any",
          multiple: true,
          maxFiles: 10,
        });
        console.log("🚀 ~ handleImagePicker ~ images:", images);
      }
      // onPress(image);
      // setConfirmSend(true)
      setLoader(true);
      if (images[0]?.mime === "image/jpeg") {
        let data = new FormData();

        images.forEach((image, index) => {
          let imageMedia = {
            uri: image?.path,
            name: `image${index}.jpg`,
            filename: `image${index}.jpg`,
            type: "image/jpeg",
          };
          data.append("media", imageMedia);
          console.log("🚀 ~ handleImagePicker ~ data:", JSON.stringify(data));
        });
        let res = await dispatch(uplodAudioFileMessageAPI(data));
        console.log("🚀 ~ handleImagePicker ~ res:", res);
        console.log(res, "-------rers");
        refRBSheet?.current?.close();
        let arr = selectedChannelInfo?.info?.group_name?.split("-");
        const urls = res?.payload;

        urls.forEach(async (url) => {
          const body = {
            type: route.params?.type
              ? route.params?.type === "GROUP"
                ? "group_media"
                : "media"
              : arr?.length === 3
              ? "media"
              : "group_media",
            message: Platform.OS === "ios" ? "test.jpg" : "test.jpg",
            channel_id: route.params?.channel_id
              ? route.params?.channel_id
              : selectedChannelInfo?.info?.channel_id,
            content_type: "MEDIA",
            secure_key: uuid.v4(),
            media_meta_data: {
              name: "fileImage",
              url: url?.media_file_url,
            },
          };

          if (actionType === "reply") {
            body.reply_of = selectedMsg?.secure_key;
          }

          console.log("sent message body for Image ", body);
          ws.current?.send(JSON.stringify(body));

          const socket = getSocketConnection();
          if (socket) {
            socket.send(JSON.stringify(body));
            setText("");
          } else {
            const token = await getDataFromAsync("token");
            if (token) {
              await connectWebSocket(token);
              getSocketConnection()?.send(JSON.stringify(body));
              setText("");
            }
          }
        });

        setSelectedMsg(undefined);
        setActionType("");
      } else {
        let data = new FormData();
        images.forEach((video, index) => {
          let VideoMedia = {
            uri: video?.path,
            name: `video${index}.mp4`,
            filename: `video${index}.mp4`,
            type: "image/jpeg",
          };
          data.append("media", VideoMedia);
          console.log("🚀 ~ handleImagePicker ~ data:", JSON.stringify(data));
        });

        // data.append("media", VideoMedia)
        console.log("-------VideoMedia", VideoMedia),
          // data.append("media", VideoMedia);
          console.log(JSON.stringify(data), "-------data");
        let res = await dispatch(uplodAudioFileMessageAPI(data));
        console.log(res, "-------rers");
        refRBSheet?.current?.close();

        let arr = selectedChannelInfo?.info?.group_name?.split("-");
        const urls = res?.payload;

        urls.forEach(async (url) => {
          const body = {
            type: route.params?.type
              ? route.params?.type === "GROUP"
                ? "group_media"
                : "media"
              : arr?.length === 3
              ? "media"
              : "group_media",
            message: "video.mp4",
            channel_id: route.params?.channel_id
              ? route.params?.channel_id
              : selectedChannelInfo?.info?.channel_id,
            content_type: "MEDIA",
            secure_key: uuid.v4(),
            media_meta_data: {
              name: "fileVideo",
              url: url?.media_file_url,
            },
          };

          if (actionType === "reply") {
            body.reply_of = selectedMsg?.secure_key;
          }

          console.log("sent message body for Image ", body);
          ws.current?.send(JSON.stringify(body));

          const socket = getSocketConnection();
          if (socket) {
            socket.send(JSON.stringify(body));
            setText("");
          } else {
            const token = await getDataFromAsync("token");
            if (token) {
              await connectWebSocket(token);
              getSocketConnection()?.send(JSON.stringify(body));
              setText("");
            }
          }
        });

        setActionType("");
        setSelectedMsg(undefined);
      }
    } catch (error) {
      setLoader(false);
      console.log("Error picking video:", error);
    }
  };

  const requestPermission = async () => {
    await request(
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
    );

    await request(
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA
    );

    handleImagePicker(false);
  };

  const handleClose = () => {
    // const storedValues = await getDataFromStorage();
    // // console.log("ssss", storedValues);
    // // Use storedValues for any further operations or set it to the state if necessary
    // // setValues(storedValues); // Assuming you have a state variable to store values
    // setImageData(storedValues);
    // setImageData(null)
    // setVideo(null);
    // setVideoStart(false)
    setTakePhotoClicks(false);
    setCameraUsage(false);
    setConfirmSend(false);
    setLoader(false);
  };
  // useEffect(() => {
  //   console.log(chatMsgs, "----chatMsgs");
  //   dispatch(getChatMessagesAPI(receiverId));
  //   return () => {
  //     dispatch(resetMessageList());
  //   };
  // }, []);

  useEffect(() => {
    const netWorkSubscribe = NetInfo.addEventListener((state) => {
      setInternet(
        state.isConnected == true && state.isInternetReachable === true
      );
    });
    return netWorkSubscribe;
  }, []);

  // useEffect(() => {
  //   reconnectWebSocket();
  //   console.log("called--free");
  //   return () => {
  //     if (ws.current) {
  //       ws.current.close();
  //       // ws = useRef(null);
  //     }
  //   };
  // }, [receiverId]);

  useEffect(() => {
    if (messageList?.length > 0) {
      const tempList = messageList;

      setLoader(false);
      // console.log("free call---");
      setReversedMessageList(getDistinctElements(tempList));

      dispatch(patchUnreadChatMessageAPI(receiverId));
    }
  }, [messageList]);

  // const renderMessageItem = ({ item, index }) => (
  //   <MessageItem
  //     key={index}
  //     data={item}
  //     loader={loader}
  //     setLoader={setLoader}
  //     messages={[...reversedMessageList]} // Note: Removed spread operator here
  //     setImageToShow={setImageToShow}
  //   />
  // );

  // const memoizedData = useMemo(() => {
  //   const map = new Map();
  //   [...reversedMessageList].forEach((item: any) => {
  //     if (!map.has(item?.id)) {
  //       map.set(item?.id, item);
  //     }
  //   });
  //   const uniqueArray = Array.from(
  //     messageList
  //       .reduce((map, obj) => map.set(obj.secure_key, obj), new Map())
  //       .values()
  //   );
  //   return uniqueArray;
  // }, [reversedMessageList, onRefresh]);

  const formatMessageDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const memoizedData = useMemo(() => {
    console.log("Recalculating memoizedData");

    const uniqueMap = new Map();
    const groupedMessages = [];
    let currentDate = null;

    [...reversedMessageList].forEach((item: any) => {
      if (item?.id || item?.secure_key) {
        const messageDate = item.created_at
          ? new Date(item.created_at)
          : new Date();
        const formattedDate = formatMessageDate(messageDate);

        if (formattedDate !== currentDate) {
          groupedMessages.push({ type: "date", date: formattedDate });
          currentDate = formattedDate;
        }

        groupedMessages.push({ type: "message", ...item });
        uniqueMap.set(item.id || item.secure_key, item);
      }
    });

    return groupedMessages;
  }, [reversedMessageList, onRefresh]);

  const memoizedRenderMessageItem = useMemo(() => {
    return ({ item, index }) => (
      <MessageItem
        key={index}
        data={item}
        loader={loader}
        setLoader={setLoader}
        isDeleted={item?.is_deleted}
        messages={reversedMessageList}
        setImageToShow={setImageToShow}
        callMessageAction={(msg: any, type: string) => {
          if (type === "pin") {
            let params = {
              id: msg?.id,
              data: {
                group_id: receiverId,
                duration: 1,
              },
            };
            dispatch(pinMessageRequest(params));
          } else if (type === "edit") {
            setActionType("edit");
            setText(msg?.content || msg?.message);
            setSelectedMsg(msg);
            setTimeout(() => {
              inputRef?.current?.focus();
            }, 500);
          } else if (type === "reply") {
            setActionType("reply");
            setSelectedMsg(msg);
            setTimeout(() => {
              inputRef?.current?.focus();
            }, 500);
          } else if (type === "delete") {
            setActionType("delete");
            setSelectedMsg(msg);
            onDeletePress(msg);
            setTimeout(() => {
              inputRef?.current?.focus();
            }, 500);
          } else if (type === "star") {
            setActionType("star");
            setSelectedMsg(msg);
            handleStar(msg);
          }
        }}
      />
    );
  }, [reversedMessageList, onRefresh]);

  const renderItemForChatOption = ({ item, row, col }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          OptionOnpress(item?.name);
        }}
        style={[styles.renderItemForChatOptionView]}
      >
        <View style={styles.imageVIew}>
          <Image style={styles.iconForOption} source={item.icon} />
        </View>
        <Text style={styles.nameForOption}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderDots = () => (
    <View style={styles.dotContainer}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === pageIndex ? Color.black : "#484848",
            },
          ]}
        />
      ))}
    </View>
  );

  const OptionOnpress = async (name) => {
    if (name == "Album") {
      requestPermission();
    } else if (name == "Voice Call") {
      await dispatch(
        incomingCall({
          channel_id: channel_id,
          receiverName: receiverName,
          sender_name: profileData?.display_name,
          caller_id: userId,
          isVoiceOnly: true,
          receiverImage: receiverImage,
        })
      );
    } else if (name == "Camera") {
      handleCameraButton();
    } else if (name == "Location") {
      setisLocationModalVisible(true);
    } else if (name == "Video Call") {
      await dispatch(
        incomingCall({
          channel_id: channel_id,
          receiverName: receiverName,
          sender_name: profileData?.display_name,
          caller_id: userId,
          isVoiceOnly: false,
          receiverImage: receiverImage,
        })
      );
    } else if (name == "Transfer") {
      navigation.replace("SendMoneyScreen", {
        userDetails: updatedUser,
      });
    } else if (name == "Voice Input") {
    }
  };

  const handleRecoderOnpress = () => {
    if (!showRecoder) {
      Keyboard.dismiss();
      setText("");
      setShowRecoder(true);
    } else {
      setShowRecoder(false);
    }
  };

  return (
    <View style={styles.container}>
      {tackPhotoClicked ? (
        <VisionCamera
          setVideoPath={setVideo}
          Confirm={ConfirmSend}
          setConfirmSend={setConfirmSend}
          setTakePhotoClicks={setTakePhotoClicks}
          setImageData={setImageData}
          CameraUsage={CameraUsage}
          setCameraUsage={setCameraUsage}
          setLoader={setLoader}
          messages={[...reversedMessageList]}
          setImageToShow={setImageToShow}
        />
      ) : ConfirmSend ? (
        <View style={StyleSheet.absoluteFillObject}>
          {imageData !== null ? (
            <Image
              source={{ uri: imageData }}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <VideoPlayer
              customStyle={{ height: windowHeight }}
              source={{ uri: video?.path }}
            />
          )}
          <View
            style={[
              styles.bottomInnerContainer,
              {
                position: "absolute",
                bottom: ms(50),
              },
            ]}
          >
            <View
              style={[styles.messageInputContainer, { paddingVertical: ms(5) }]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <TouchableOpacity>
                  <Image
                    resizeMode="contain"
                    source={Emojis}
                    style={styles.emojis}
                  />
                </TouchableOpacity>
                <TextInput
                  multiline={true}
                  value={text}
                  onChangeText={setText}
                  style={styles.messageInput}
                  placeholder={
                    isRecording ? formatTime(timer) : "Add a caption"
                  }
                  placeholderTextColor={Color.disabled}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.sendContainer}
              onPress={onConfirmSendPress}
            >
              <Image source={SendBlack} style={styles.send} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            hitSlop={{ top: 0, bottom: 0, left: 30, right: 30 }}
            style={{
              // width: ms(50),
              // height: ms(50),
              // borderRadius: ms(25),
              // backgroundColor: COLORS.LightBlack,
              position: "absolute",
              top: ms(45),
              left: ms(15),
              alignSelf: "center",
              justifyContent: "center",
              zIndex: 999,
            }}
            onPress={handleClose}
          >
            {/* <Text style={{ alignSelf: "center", color: "white" }}>Cancel</Text> */}
            <Image
              style={{
                height: ms(20),
                width: ms(20),
              }}
              source={Images.Close}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <SafeAreaView style={[styles.container]}>
          <ServicesHeader
            containerStyles={styles.ServicesHeader}
            title="Message"
          />
          <ChatDetailHeader
            title={receiverName ?? ""}
            profilePic={receiverImage}
            onPressBackButton={onPressBackButton}
            setImageToShow={() => {
              navigation.navigate("PeopleNearbyProfile", { item: updatedUser });
            }}
            onVideoCallPress={async () => {
              await dispatch(
                incomingCall({
                  channel_id: channel_id,
                  receiverName: receiverName,
                  sender_name: profileData?.display_name,
                  caller_id: userId,
                  isVoiceOnly: false,
                  receiverImage: receiverImage,
                })
              );
            }}
            // onVideoCallPress={startCall}
            onPhoneCallPress={async () => {
              await dispatch(
                incomingCall({
                  channel_id: channel_id,
                  receiverName: receiverName,
                  sender_name: profileData?.display_name,
                  caller_id: userId,
                  isVoiceOnly: true,
                  receiverImage: receiverImage,
                })
              );
            }}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
          >
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() =>
                scrollRef?.current?.scrollToEnd({ animated: true })
              }
            >
              <View style={styles.bodyContainer}>
                {messageList.length === 0 ? (
                  <View style={styles.noMessagesContainer}>
                    <Text style={{ alignSelf: "center" }}>No messages yet</Text>
                  </View>
                ) : (
                  <FlatList
                    ref={flatlistRef}
                    showsVerticalScrollIndicator={false}
                    // data={[...reversedMessageList]}
                    refreshing={false}
                    // refreshing={}

                    onRefresh={() => {
                      console.log("Hello its refresh");
                    }}
                    data={memoizedData}
                    extraData={onRefresh}
                    scrollEnabled={false}
                    pagingEnabled={false}
                    getItemLayout={(item, index) => getItemLayout(item, index)}
                    keyExtractor={(item) =>
                      `${item?.secure_key}-${Math.random()}`
                    }
                    // initialScrollIndex={[...reversedMessageList]?.length - 1}
                    renderItem={({ item }) => {
                      if (item.type === "date") {
                        return (
                          <View style={styles.dateHeaderContainer}>
                            <View style={styles.dateBox}>
                              <Text style={styles.dateHeaderText}>
                                {item.date}
                              </Text>
                            </View>
                          </View>
                        );
                      } else {
                        return memoizedRenderMessageItem({ item });
                      }
                    }}
                    // onContentSizeChange={() => reversedMessageList && flatlistRef?.current?.scrollToEnd({ animated: true })}
                  />
                )}
              </View>
            </ScrollView>
            <View style={styles.bottomContainer}>
              {actionType === "reply" && selectedMsg?.id && (
                <ReplyView
                  data={selectedMsg}
                  OnPressClose={() => {
                    setText(""), setSelectedMsg(undefined), setActionType("");
                  }}
                  messageList={reversedMessageList}
                />
              )}
              <View
                style={[
                  styles.bottomInnerContainer,
                  {
                    paddingBottom: !isOptionsVisible
                      ? useSafeAreaInsets().bottom + mvs(10)
                      : mvs(20),
                  },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={handleRecoderOnpress}
                    style={styles.recoderIcon}
                  >
                    <Image
                      resizeMode="contain"
                      source={!showRecoder ? Images.recoder : Images.keyboard}
                      style={styles.emojis}
                    />
                  </TouchableOpacity>
                  <View style={styles.messageInputContainer}>
                    {!showRecoder ? (
                      <TextInput
                        onFocus={() => {
                          setOptionsVisible(false);
                        }}
                        ref={inputRef}
                        multiline={false}
                        value={text}
                        onChangeText={(e) => setText(e)}
                        style={styles.messageInput}
                        // placeholder={isRecording ? formatTime(timer) : "Message"}
                        placeholderTextColor={Color.disabled}
                        blurOnSubmit={false}
                        returnKeyType="send"
                        onSubmitEditing={() => {
                          onSendPress();
                        }}
                      />
                    ) : (
                      <TouchableOpacity
                        onLongPress={onStartRecord}
                        onPressOut={onStopRecord}
                        style={[
                          styles.messageInputContainer,
                          { alignItems: "center", justifyContent: "center" },
                        ]}
                      >
                        {isRecording ? (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={[styles.holdText, { marginRight: ms(10) }]}
                            >
                              {formatTime(timer)}
                            </Text>
                            <Text style={styles.holdText}>Release To Send</Text>
                          </View>
                        ) : (
                          <Text style={styles.holdText}>Hold To Talk</Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity style={styles.SmileIcon}>
                    <Image
                      resizeMode="contain"
                      source={Images.Smile}
                      style={styles.emojis}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handlePlusPress}>
                    <Image
                      resizeMode="contain"
                      source={Images.plusRounded}
                      style={styles.emojis}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {isOptionsVisible && (
                <View
                  style={[
                    styles.optionsPanel,
                    { height: keyboardHeight || staticKeyboardHeight },
                  ]}
                >
                  <HorizontalFlatList
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      width: wp(totalPages * 100),
                    }}
                    pagingEnabled
                    data={ChatOptionData}
                    numRows={2}
                    renderItem={renderItemForChatOption}
                    keyExtractor={(item, index) => index.toString()}
                    onMomentumScrollEnd={(event) => {
                      const newPageIndex = Math.round(
                        event.nativeEvent.contentOffset.x / wp(100)
                      );
                      setPageIndex(newPageIndex);
                    }}
                  />

                  {renderDots()}
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
          <ImageDisplayModal
            isVisible={imageToShow?.length > 0 ? true : false}
            hideModal={() => setImageToShow("")}
            selectedImage={imageToShow}
          />
          {/* </KeyboardAwareScrollView> */}
          {loader && (
            <View style={[styles.Loadercontainer]}>
              <ActivityIndicator size={"large"} color={Color.white} />
            </View>
          )}
        </SafeAreaView>
      )}

      {(localStream || remoteStream) && (
        <View
          style={{
            position: "absolute",
            height: hp(100),
            width: wp(100),
          }}
        >
          <CallingScreen
            calling={calling}
            toggleSpeaker={() => {
              toggleSpeaker();
            }}
            callerName={receiverName}
            remoteStream={remoteStream}
            localStream={localStream}
            callEnd={() => {
              hangUpCall();
            }}
            toggleCamera={() => {
              toggleCamera();
            }}
            switchCamera={() => {
              switchCamera();
            }}
            receiverImage={receiverImage}
            localWebcamOn={localWebcamOn}
            localMicOn={localMicOn}
            toggleMic={() => {
              toggleMic();
            }}
            onAnswer={() => {
              handleIncomingCallAccept();
            }}
            onDecline={() => {
              hangUpCall();
            }}
          />
        </View>
      )}

      {/* location modal */}
      <Modal
        animationType="fade"
        visible={isLocationModalVisible}
        onRequestClose={() => {
          setisLocationModalVisible((prew) => !prew);
        }}
        transparent={true}
      >
        <Pressable
          style={styles.outerContainer}
          onPress={() => {
            setisLocationModalVisible((prew) => !prew);
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setisLocationModalVisible(false);
            }}
            style={styles.cancelButtonView}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.clearLocationView}>
            <TouchableOpacity
              onPress={() => {
                setisLocationModalVisible(false);
                setIsMapModalVisible(true);
              }}
              style={styles.innerView}
            >
              <Text style={styles.cancelText}>Send Location</Text>
            </TouchableOpacity>
            <View style={styles.line1} />
            <TouchableOpacity
              onPress={() => {
                setisLocationModalVisible(false);
                setIsLiveLocationMapModalVisible(true);
              }}
              style={styles.innerView}
            >
              <Text style={styles.cancelText}>Real-time Location</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <MapViewForSendLocation
        hideModal={() => {
          setIsMapModalVisible(false);
        }}
        isVisible={isMapModalVisible}
        setIsVisible={setIsMapModalVisible}
        recieverId={receiverId}
        senderId={profileData?.id}
        showSearchPlace={true}
      />

      <MapViewForSendLocation
        hideModal={() => {
          setIsLiveLocationMapModalVisible(false);
        }}
        isVisible={isLiveLocationMapModalVisible}
        setIsVisible={setIsLiveLocationMapModalVisible}
        recieverId={receiverId}
        senderId={profileData?.id}
        showSearchPlace={false}
      />
    </View>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    bottonSheetStyle: {
      // wrapper: {
      //   backgroundColor: "rgba(0, 0, 0, 0.6)",
      // },
      // container: {
      //   paddingLeft: 20,
      //   paddingRight: 20,
      //   borderTopLeftRadius: 28,
      //   borderTopRightRadius: 28,
      //   backgroundColor: "#D3D3D3",
      // },
      // draggableIcon: {
      //   backgroundColor: Color.messageBackgroundReceiver,
      // },
    },
    container: {
      flex: 1,
      backgroundColor: Color.plain_white,
    },
    bodyContainer: {
      paddingHorizontal: wp(5),
      // height: hp(78),
      paddingVertical: hp(1),
    },
    bottomContainer: {
      marginBottom: -useSafeAreaInsets().bottom,
    },
    bottomInnerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: ms(16),
      backgroundColor: Color.white,
      paddingVertical: mvs(10),
      width: wp(100),
      justifyContent: "space-between",
    },

    emojis: { width: ms(24), height: ms(24), tintColor: Color.black },
    messageInputContainer: {
      backgroundColor: Color.messageBackgroundReceiver,
      borderRadius: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: ms(5),
      minHeight: mvs(44),
      maxHeight: hp(10),
      alignItems: "center",
      width: wp(60),
    },
    attachment: { width: ms(18), height: ms(18) },
    camera: { marginLeft: ms(14), width: ms(18), height: ms(18) },
    messageInput: {
      paddingHorizontal: ms(12),
      paddingVertical: ms(10),
      color: Color.black,
      fontSize: mvs(14),
      fontWeight: "500",
      flex: 1,
      paddingTop: ms(10),
    },
    sendContainer: {
      width: ms(40),
      height: ms(40),
      backgroundColor: Color.messageBackgroundReceiver,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: ms(20),
      marginLeft: ms(10),
    },
    send: { width: ms(16), height: ms(16) },
    btnContainer: {
      width: ms(50),
      height: ms(50),
      backgroundColor: Color.messageBackgroundReceiver,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: ms(25),
      marginLeft: ms(10),
    },
    btnIcon: { width: ms(24), height: ms(24) },
    viewRecorder: {
      marginTop: 40,
      width: "100%",
      alignItems: "center",
    },
    recordBtnWrapper: {
      flexDirection: "row",
    },
    playBtnWrapper: {
      flexDirection: "row",
      alignSelf: "center",
    },
    viewBarWrapper: {
      marginTop: wp(1),
      marginHorizontal: wp(2.5),
      alignSelf: "stretch",
    },
    viewBar: {
      backgroundColor: "#CCCCCC",
      height: 4,
      alignSelf: "stretch",
    },
    viewPlayer: {
      alignItems: "center",
    },
    txtRecordCounter: {
      color: "white",
      fontSize: 20,
      textAlignVertical: "center",
      fontWeight: "200",
      fontFamily: "Helvetica Neue",
      letterSpacing: 3,
    },
    txtCounter: {
      marginTop: wp(1),
      color: Color.messageBackgroundReceiver,
      fontSize: 20,
      textAlignVertical: "center",
      fontWeight: "200",
      fontFamily: "Helvetica Neue",
      letterSpacing: 3,
      textAlign: "center",
    },
    viewBarPlay: {
      backgroundColor: Color.messageBackgroundReceiver,
      height: 4,
      width: 0,
    },
    Loadercontainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    },
    videoContainer: {
      marginTop: mvs(1),
      width: "100%",
    },
    otherContainer: {
      flexDirection: "row",
    },
    videoCloseContainer: {
      position: "absolute",
      backgroundColor: COLORS.Blue,
      padding: ms(5),
      alignSelf: "flex-end",
      marginTop: ms(-3),
      marginLeft: ms(-10),
      borderRadius: ms(10),
    },
    videoStyle: {
      height: windowHeight * 0.17,
      width: "100%",
      borderRadius: ms(10),
    },
    closeImg: {
      height: ms(7),
      width: ms(7),
    },
    dateHeaderContainer: {
      alignItems: "center",
      marginVertical: 10,
    },
    dateBox: {
      backgroundColor: Color.pillColor,
      borderColor: Color.primary,
      borderWidth: 1,
      borderRadius: 20,
    },
    dateHeaderText: {
      // backgroundColor: Color.messageBackgroundReceiver,
      color: Color.black,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      fontSize: 14,
    },
    optionsPanel: {
      backgroundColor: Color.white,
      width: wp(100),
      marginBottom: -useSafeAreaInsets().bottom,
    },
    ServicesHeader: {
      marginTop: -useSafeAreaInsets().top,
    },
    recoderIcon: {
      marginRight: mvs(16),
    },
    SmileIcon: {
      marginRight: mvs(10),
    },
    imageVIew: {
      width: mvs(74),
      height: mvs(74),
      backgroundColor: "#2E2E2E",
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    renderItemForChatOptionView: {
      paddingBottom: mvs(20),
      alignItems: "center",
      justifyContent: "center",
      width: wp(33.3),
    },
    pageContainer: {
      width: wp(100),
      paddingHorizontal: ms(10),
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    optionContainer: {
      justifyContent: "center",
      alignItems: "center",
      width: wp(100) / 3,
    },

    iconForOption: {
      width: mvs(32),
      height: mvs(32),
      tintColor: Color.black,
    },
    nameForOption: {
      fontSize: ms(14),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
      textAlign: "center",
      marginTop: mvs(10),
    },
    dotContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: useSafeAreaInsets().bottom + mvs(20),
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 5,
      backgroundColor: "#484848",
      marginHorizontal: 5,
    },
    holdText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
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
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    innerView: {
      paddingVertical: mvs(10),
      width: wp(100),
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
    },

    line1: {
      borderBottomWidth: 1,
      borderBottomColor: Color.deleteBtnColor,
      width: wp(100),
      alignSelf: "center",
    },
  });
};

export default ChatDetailScreen;
