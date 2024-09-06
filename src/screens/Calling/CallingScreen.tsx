import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
// import { useCalling } from "./hooks";
import { Images } from "assets/images";
import { FONTS } from "constants";
import { ms, mvs } from "react-native-size-matters";
import { useCalling } from "./hooks";
import { MediaStream, RTCView } from "react-native-webrtc";
import { hp, wp } from "utils/metrix";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  callerName: string;
  localStream: MediaStream;
  remoteStream: MediaStream;
  onAnswer: () => void;
  onDecline: () => void;
  callEnd: () => void;
  switchCamera: () => void;
  toggleCamera: () => void;
  receiverImage: any;
  localWebcamOn: boolean;
  toggleMic: () => void;
  localMicOn: boolean;
  toggleSpeaker: () => void;
  calling: boolean;
}

const VideoCallComponent = ({ children }) => {
  return <>{children}</>;
};

const CallingScreen = ({
  calling,
  callerName = "John Duo",
  localStream,
  remoteStream,
  onAnswer,
  onDecline,
  callEnd,
  switchCamera,
  toggleCamera,
  receiverImage,
  localWebcamOn,
  toggleMic,
  localMicOn,
  toggleSpeaker,
}: Props) => {
  console.log("LocalStream", localStream);
  const { Color } = useCalling();
  const top = useSafeAreaInsets().top;
  console.log("🚀 ~ top:", top);
  const bottom = useSafeAreaInsets().top;
  console.log("🚀 ~ bottom:", bottom);
  // const { Color, handleStartCall } = useCalling();
  const styles = screenStyles(Color);
  const [toggleCameraView, setToggleCameraView] = useState(false);
  console.log("REMOTE STREAM:", remoteStream);

  return (
    <SafeAreaView style={styles.container}>
      {calling ? (
        <>
          {localStream && (
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
            <Text style={styles.callerName}>{callerName}</Text>
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
              onPress={onDecline}
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
              onPress={onAnswer}
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
      ) : (
        <>
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
                <Text style={styles.callerName}>{callerName}</Text>
                <Text style={styles.callingLabel}>Calling</Text>
              </View>
            </>
          )}

          {/* {!remoteStream ? ( */}
          <View style={styles.userImageCallEndContainer}>
            <VideoCallComponent
              children={
                !remoteStream && toggleCameraView ? (
                  localStream && (
                    <RTCView
                      style={styles.userImage}
                      streamURL={localStream?.toURL()}
                      objectFit={"contain"}
                    />
                  )
                ) : (
                  <>
                    {localStream && (
                      <RTCView
                        style={styles.userImage}
                        streamURL={localStream?.toURL()}
                        objectFit={"contain"}
                      />
                    )}
                    {remoteStream && (
                      <RTCView
                        onTouchStart={() =>
                          setToggleCameraView(!toggleCameraView)
                        }
                        style={styles.userImage2}
                        streamURL={remoteStream?.toURL()}
                        objectFit={"contain"}
                      />
                    )}
                  </>
                )
              }
            />
          </View>
          {/* ) : (
            <View style={styles.userImageCallEndContainer}>
              {remoteStream && (
                <RTCView
                  style={styles.userImage}
                  streamURL={remoteStream?.toURL()}
                  objectFit={"contain"}
                />
              )}
              {localStream && (
                <RTCView
                  style={styles.userImage2}
                  streamURL={localStream?.toURL()}
                  objectFit={"contain"}
                />
              )}
            </View>
          )} */}

          <TouchableOpacity
            onPress={() => {
              callEnd();
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
      backgroundColor: Color.callingBackgroundColor,
    },
  });
};

export default CallingScreen;
