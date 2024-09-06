import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  AppState,
} from "react-native";
// import { useCalling } from "./hooks";
import { AvatarPNG, Images } from "assets/images";
import { FONTS } from "constants";
import { ms, mvs } from "react-native-size-matters";
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from "react-native-webrtc";
import { hp, wp } from "utils/metrix";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import inCallManager from "react-native-incall-manager";
import { getSocketConnection } from "constants/chatSocket";
import { getDataFromAsync } from "utils/LocalStorage";
import uuid from "react-native-uuid";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import {
  ChatSelectors,
  incomingCall,
  handleIncomingCall as handleIncomingCallForHangUp,
  handleReceiveCall,
  handleIceCandidate,
  hangUpCallForEndCall,
} from "store/slices/chat";
import { useDispatch } from "react-redux";
import { useWebSocket } from "contexts/WebSocketContext";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import RNCallKeep from "react-native-callkeep";
import { navigate } from "navigator/RootNavigation";

const VideoCallComponent = ({ children }) => {
  return <>{children}</>;
};

const incomingCallScreen = ({}) => {
  const {
    incomingCallState,
    offerDataState,
    handleIncommingCallState,
    receiveDataSate,
    handleReceiveCallDataState,
    handleReceiveCallState,
    handleIceCandidateState,
    handleIceCandidateDataState,
    hangUpCallState,
  } = ChatSelectors();

  const { sendMessage, reconnectWebSocket } = useWebSocket();
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [toggleCameraView, setToggleCameraView] = useState(false);
  const dispatch = useDispatch();
  const [calling, setCalling] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [isVoiceOnly, setIsVoiceOnly] = useState(false);
  const [localMicOn, setlocalMicOn] = useState(true);
  const [localWebcamOn, setlocalWebcamOn] = useState(true);
  const [loudSpeakerOff, setLoudSpeakerOff] = useState(true);
  const yourConn = useRef();


  // setupTrackListener for videocall
  const setupTrackListener = async () => {
    if (yourConn.current) {
      yourConn.current.addEventListener("track", (event) => {
        console.log("🚀 ~ yourConn.current.addEventListener ~ event:", event);
        let remoteMediaStream = new MediaStream();
        remoteMediaStream.addTrack(event.track);
        // setRemoteStream((prevStreams) => [...prevStreams, remoteMediaStream]);
        setRemoteStream(remoteMediaStream);
      });

      await yourConn.current.addEventListener(
        "connectionstatechange",
        (event: any) => {
          console.log(
            "connectionstatechange",
            yourConn.current.connectionState
          );
          if (yourConn.current.connectionState === "connected") {
            console.log("connectionstatechange", "connected🥳🥳🥳");
          }
        }
      );
    }
  };

  //exchange peer connection for videocall
  const handleIceCandidateEvent = async (event) => {
    if (event.candidate) {
      const body = {
        type: "send_ice_candidate",
        candidate: event.candidate,
        channel_id: receiveDataSate?.sender,
        secure_key: uuid.v4(),
      };

      const socket = getSocketConnection();
      if (socket) {
        socket.send(JSON.stringify(body));
      } else {
        await reconnectWebSocket();
        await getSocketConnection()?.send(JSON.stringify(body));
      }
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

    if (offerDataState?.isVoiceOnly) {
      let videoTrack = await local.getVideoTracks()[0];
      videoTrack.enabled = false;
    }
    // Add tracks from the local stream to the peer connection
    await local.getTracks().forEach((track) => {
      yourConn.current.addTrack(track, local);
    });

    setLocalStream(local);

    console.log(' ----LocalStream--> ', )

    const offerDescription = await yourConn.current.createOffer();
    await yourConn.current.setLocalDescription(offerDescription);
    const body = {
      type: "send_offer",
      offer: offerDescription,
      channel_id: offerDataState?.channel_id,
      secure_key: uuid.v4(),
      sender_name: offerDataState?.sender_name,
      caller_id: offerDataState?.caller_id,
      media_type: offerDataState?.isVoiceOnly ? "audio" : "video",
      isVoiceOnly: offerDataState?.isVoiceOnly,
    };
    const socket = getSocketConnection();
    if (socket) {
      socket.send(JSON.stringify(body));
    } else {
      await reconnectWebSocket();
      await getSocketConnection()?.send(JSON.stringify(body));
    }
  };

  useEffect(() => {
    console.log(' ---incomingCallState uef call---> ', incomingCallState)
    if (incomingCallState) {
      if (offerDataState?.isVoiceOnly) {
        setIsVoiceOnly(true);
      } else {
        setIsVoiceOnly(false);
      }
      startCall();
    }
  }, [incomingCallState]);

  useEffect(() => {}, [isVoiceOnly]);

  //send massage for exchange ice candidate
  const handleIceCandidateMessage = (candidate) => {
    yourConn.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

  useEffect(() => {
    if (handleIceCandidateState) {
      // setTimeout(() => {
      handleIceCandidateMessage(handleIceCandidateDataState.message.candidate);
      // }, 1000);
    }
  }, [handleIceCandidateState]);

  // receive call from second user and handle it.
  const handleAnswerMessage = async (answer) => {
    setCalling(false);
    await yourConn.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  useEffect(() => {
    if (handleReceiveCallState) {
      handleAnswerMessage(handleReceiveCallDataState.answer);
    }
  }, [handleReceiveCallState]);

  // Call setupTrackListener in useEffect
  useEffect(() => {
    if (yourConn.current) {
      setupTrackListener();
    }
  }, [yourConn.current]);

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

  const handleIncomingCallAccept = async () => {
    setCalling(false);
    inCallManager.stopRingtone();
    yourConn.current.onicecandidate = (event) => {
      console.log("🚀 ~ setupTrackListener ~ event:", event);
      if (event.candidate) {
        handleIceCandidateEvent(event);
      } else {
        console.log(" onicecandidate completed");
      }
    };

    const answerDescription = await yourConn.current.createAnswer();
    await yourConn.current.setLocalDescription(answerDescription);
    const body = {
      type: "send_answer",
      answer: answerDescription,
      channel_id: receiveDataSate?.sender,
      secure_key: uuid.v4(),
      record_id: receiveDataSate?.record_id,
      caller_id: receiveDataSate?.caller_id,
    };

    // Send answer to the remote peer
    const socket = getSocketConnection();
    if (socket) {
      socket.send(JSON.stringify(body));
    } else {
      await reconnectWebSocket();
      await getSocketConnection()?.send(JSON.stringify(body));
    }
  };

  const handleIncoming = () => {
    const uuid = uuidv4();
    RNCallKeep.displayIncomingCall(
      uuid,
      "+911234567890",
      receiveDataSate?.sender_name,
      "generic",
      receiveDataSate?.isVoiceOnly ? false : true
    );
  };

  useEffect(() => {
    RNCallKeep.addEventListener("answerCall", async (data) => {
      RNCallKeep.answerIncomingCall(data.callUUID);
      RNCallKeep.backToForeground();
      RNCallKeep.endCall(data.callUUID);
      handleIncomingCall();
      setTimeout(() => {
        handleIncomingCallAccept();
      }, 1000);
    });

    RNCallKeep.addEventListener("endCall", async ({ callUUID }) => {
      // RNCallKeep.endCall(callUUID);
      // await hangUpCall();
    });

    return () => {
      RNCallKeep.removeEventListener("answerCall");
      RNCallKeep.removeEventListener("endCall");
    };
  }, []);

  useEffect(() => {

    console.log(' ---handleIncommingCallState---> ',handleIncommingCallState )
    console.log(' ---receiveDataSate---> ',receiveDataSate?.isFromKilled )
    if (handleIncommingCallState) {
      if (
        "background" in receiveDataSate &&
        receiveDataSate?.background == true
      ) {
        if (receiveDataSate?.isVoiceOnly) {
          setIsVoiceOnly(true);
        } else {
          setIsVoiceOnly(false);
        }
        handleIncoming();
      } else if (
        "background" in receiveDataSate &&
        receiveDataSate?.background == false
      ) {
        handleIncomingCall();
        setTimeout(() => {
          handleIncomingCallAccept();
        }, 1000);
      } else {
        if (receiveDataSate?.isVoiceOnly) {
          setIsVoiceOnly(true);
        } else {
          setIsVoiceOnly(false);
        }
        handleIncomingCall();
      }
    }
  }, [handleIncommingCallState]);

  

  const handleIncomingCall = async () => {
    Keyboard.dismiss();
    if ("background" in receiveDataSate && receiveDataSate?.background) {
      setCalling(false);
    } else {
      setCalling(true);
    }
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
    if (yourConn.current) {
      inCallManager.start({ media: "video" });
      inCallManager.startRingtone("_DEFAULT_", 1, "", 30);
      inCallManager.setForceSpeakerphoneOn(loudSpeakerOff);
      const local = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(local);

      if (isVoiceOnly) {
        let videoTrack = await local.getVideoTracks()[0];
        videoTrack.enabled = false;
      }

      // Add tracks from the local stream to the peer connection
      await local.getTracks().forEach((track) => {
        yourConn.current.addTrack(track, local);
      });
      await yourConn.current.setRemoteDescription(
        new RTCSessionDescription(receiveDataSate?.offer)
      );
    }
  };

  const hangUpCall = async () => {
    try {
      inCallManager.stopRingtone();
      const body = {
        type: "leave_call",
        channel_id: incomingCallState
          ? offerDataState?.channel_id
          : receiveDataSate?.sender,
        secure_key: uuid.v4(),
      };
      const socket = getSocketConnection();
      if (socket) {
        socket.send(JSON.stringify(body));
      } else {
        await reconnectWebSocket();
        await getSocketConnection()?.send(JSON.stringify(body));
      }
      inCallManager.stop();
      setCalling(false);

      if (incomingCallState) {
        await dispatch(incomingCall({}));
      }
      if (handleIncommingCallState) {
        await dispatch(handleIncomingCallForHangUp({}));
      }

      if (handleReceiveCallState) {
        await dispatch(handleReceiveCall({}));
      }

      if (handleIceCandidateState) {
        await dispatch(handleIceCandidate({}));
      }

      if (hangUpCallState) {
        await dispatch(hangUpCallForEndCall({}));
      }

      // await sendMessage(body);

      // Close RTCPeerConnection
      if (localStream) {
        localStream?.getTracks().forEach((track) => track.stop());
        localStream.release();
        setLocalStream(null);
        console.log("local streams destroy");
      }
      if (remoteStream) {
        remoteStream?.getTracks().forEach((track) => track.stop());
        remoteStream.release();
        setRemoteStream(null);
        console.log("remote streams destroy");
      }
      if (yourConn.current) {
        // setLocalStream(null);
        // setRemoteStream(null);
        yourConn.current.close();
        yourConn.current.onicecandidate = null;
        yourConn.current.ontrack = null;
        console.log("connection streams destroy");
      }
      RNCallKeep.endAllCalls();
    } catch (error) {
      console.error("Error hanging up call:", error);
    }
  };

  const callEnd = async () => {
    try {
      setCalling(false);
      inCallManager.stopRingtone();
      inCallManager.stop();
      if (incomingCallState) {
        await dispatch(incomingCall({}));
      }

      if (handleIncommingCallState) {
        await dispatch(handleIncomingCallForHangUp({}));
      }
      if (handleReceiveCallState) {
        await dispatch(handleReceiveCall({}));
      }
      if (handleIceCandidateState) {
        await dispatch(handleIceCandidate({}));
      }

      if (hangUpCallState) {
        await dispatch(hangUpCallForEndCall({}));
      }

      if (localStream) {
        localStream?.getTracks().forEach((track) => track.stop());
        localStream.release();
        setLocalStream(null);
        console.log("local streams destroy");
      }
      if (remoteStream) {
        remoteStream?.getTracks().forEach((track) => track.stop());
        remoteStream.release();
        setRemoteStream(null);
        console.log("remote streams destroy");
      }

      if (yourConn.current) {
        yourConn.current.close();
        yourConn.current.onicecandidate = null;
        yourConn.current.ontrack = null;
        console.log("connection streams destroy");
      }
      RNCallKeep.endAllCalls();
    } catch (error) {
      console.error("Error hanging up call:", error);
    }
  };

  useEffect(() => {
    if (hangUpCallState) {
      callEnd();
    }
  }, [hangUpCallState]);

  return (
    <SafeAreaView style={styles.container}>
      {calling ? (
        <>
          {localStream && (
            <>
              {isVoiceOnly || offerDataState?.isVoiceOnly ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: hp(100),
                    width: wp(100),
                  }}
                ></View>
              ) : (
                <RTCView
                  style={styles.userImage1}
                  streamURL={localStream?.toURL()}
                  objectFit={"cover"}
                />
              )}

              <View
                style={[
                  styles.encryptionContainer,
                  { position: "absolute", alignSelf: "center", top: hp(10) },
                ]}
              >
                <Image
                  source={Images.encryptionLock}
                  style={styles.encryptionLockIcon}
                  resizeMode="contain"
                />
                <Text style={styles.endToEndEncryptionText}>
                  End-to-end encrypted
                </Text>
              </View>
              <View
                style={[
                  styles.callerNameLabelContainer,
                  { position: "absolute", alignSelf: "center", top: hp(13) },
                ]}
              >
                <Text style={styles.callerName}>
                  {receiveDataSate?.sender_name}
                </Text>
                <Text style={styles.callingLabel}>Call from</Text>
              </View>
              <View
                style={{
                  position: "absolute",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: wp(100),
                  bottom: hp(12),
                  paddingHorizontal: mvs(40),
                }}
              >
                <TouchableOpacity
                  onPress={hangUpCall}
                  style={{
                    width: ms(70),
                    height: ms(70),
                    backgroundColor: "red",
                    borderRadius: ms(50),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={Images.Close}
                    style={styles.closeIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleIncomingCallAccept}
                  style={{
                    width: ms(70),
                    height: ms(70),
                    backgroundColor: "green",
                    borderRadius: ms(50),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={Images.correct}
                    style={styles.closeIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      ) : (
        <>
          <View>
            {!remoteStream && (
              <>
                <View style={styles.encryptionContainer}>
                  <Image
                    source={Images.encryptionLock}
                    style={styles.encryptionLockIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.endToEndEncryptionText}>
                    End-to-end encrypted
                  </Text>
                </View>

                <View style={styles.callerNameLabelContainer}>
                  <Text style={styles.callerName}>
                    {" "}
                    {offerDataState.receiverName}
                  </Text>
                  <Text style={styles.callingLabel}>Calling</Text>
                </View>
              </>
            )}

            <View style={styles.userImageCallEndContainer}>
              <VideoCallComponent
                children={
                  !remoteStream && localStream ? (
                    isVoiceOnly || offerDataState?.isVoiceOnly ? (
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          height: hp(100),
                          width: wp(100),
                        }}
                      ></View>
                    ) : (
                      <>
                        <RTCView
                          style={styles.userImage}
                          streamURL={localStream?.toURL()}
                          objectFit={"cover"}
                        />
                      </>
                    )
                  ) : (
                    <>
                      <View>
                        {(isVoiceOnly || offerDataState?.isVoiceOnly) &&
                        remoteStream ? (
                          <Text
                            style={[
                              styles.callerName,
                              { textAlign: "center", marginTop: hp(5) },
                            ]}
                          >
                            {offerDataState.receiverName ||
                              receiveDataSate?.sender_name}
                          </Text>
                        ) : (
                          <>
                            {remoteStream && (
                              <RTCView
                                style={styles.userImage}
                                streamURL={remoteStream?.toURL()}
                                objectFit={"cover"}
                              />
                            )}

                            {localStream && (
                              <RTCView
                                style={styles.userImage2}
                                streamURL={localStream?.toURL()}
                                objectFit={"cover"}
                              />
                            )}
                          </>
                        )}
                      </View>
                    </>
                  )
                }
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                hangUpCall();
              }}
              style={styles.callEndContainer}
              activeOpacity={0.7}
            >
              <Image
                source={Images.callEnd}
                style={styles.callEndIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={[styles.bottomBtnsContainer]}>
              <TouchableOpacity
                onPress={() => {
                  toggleSpeaker();
                }}
              >
                <Image
                  source={Images.speakerSound}
                  style={styles.speakerIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              {isVoiceOnly == false && (
                <TouchableOpacity
                  onPress={() => {
                    toggleCamera();
                  }}
                >
                  <Image
                    source={localWebcamOn ? Images.videoCall : Images.videoOff}
                    style={[
                      styles.videoCallIcon,
                      !localWebcamOn && {
                        height: ms(26),
                        width: ms(26),
                        tintColor: "white",
                      },
                    ]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  toggleMic();
                }}
              >
                <Image
                  source={localMicOn ? Images.micOpen : Images.micClose}
                  style={styles.micIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {isVoiceOnly == false && (
                <TouchableOpacity
                  onPress={() => {
                    switchCamera();
                  }}
                >
                  <Image
                    source={Images.cameraSwitch}
                    style={[styles.micIcon]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    encryptionContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      position: "absolute",
      top: hp(10),
      zIndex: 999,
    },
    encryptionLockIcon: {
      height: ms(13),
      width: ms(13),
    },
    closeIcon: {
      height: ms(24),
      width: ms(24),
      tintColor: Color.fixedWhite,
    },
    endToEndEncryptionText: {
      color: Color.primary,
      fontFamily: FONTS.robotoRegular,
      fontSize: ms(15),
      fontWeight: "400",
      marginLeft: ms(10),
    },
    callerNameLabelContainer: {
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      alignSelf: "center",
      zIndex: 999,
      top: hp(13),
    },
    callerName: {
      color: Color.callingTitleColor,
      fontFamily: FONTS.robotoRegular,
      fontSize: ms(30),
      fontWeight: "400",
      lineHeight: mvs(35),
    },
    callingLabel: {
      color: Color.callingTitleColor,
      fontFamily: FONTS.robotoRegular,
      fontSize: ms(19),
      fontWeight: "400",
      lineHeight: mvs(22),
      marginTop: mvs(12),
    },
    userImageCallEndContainer: {
      width: wp(100),
      height: hp(100),
    },
    userImage: {
      height: hp(100),
      width: wp(100),
    },
    userImage2: {
      position: "absolute",
      height: hp(20),
      width: wp(30),
      right: 10,
      top: hp(2),
      zIndex: 1,
    },
    userImage1: {
      height: hp(100),
      width: wp(100),
    },
    callEndContainer: {
      position: "absolute",
      bottom: hp(18),
      alignSelf: "center",
    },
    callEndIcon: {
      height: ms(58),
      width: ms(58),
    },
    bottomBtnsContainer: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-around",
      position: "absolute",
      width: "90%",
      bottom: hp(10),
      backgroundColor: Color.dark_theme,
      height: ms(50),
      alignSelf: "center",
      borderRadius: ms(12),
    },
    speakerIcon: {
      height: ms(19.36),
      width: ms(22.17),
      tintColor: Color.fixedWhite,
    },
    videoCallIcon: {
      height: ms(15),
      width: ms(24),
      tintColor: Color.fixedWhite,
    },
    micIcon: {
      height: ms(22),
      width: ms(22),
      tintColor: Color.fixedWhite,
    },
    container: {
      flex: 1,
      height: hp(100),
      width: wp(100),
      backgroundColor: Color.callingBackgroundColor,
      position: "absolute",
    },
  });
};

export default incomingCallScreen;
