import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Images } from "assets/images";
import { FONTS } from "constants";
import { ms, mvs } from "react-native-size-matters";
import { useVideoCall } from "./hooks";
import { Camera } from "react-native-vision-camera";

interface Props {
  callerName: string;
  onAnswer: () => void;
  onDecline: () => void;
}

const VideoCallingScreen = ({
  callerName = "john Duo",
  onAnswer,
  onDecline,
}: Props) => {
  const {
    Color,
    cameraSide,
    isMicOn,
    micOnOffIcon,
    videoOnOffIcon,
    localStream,
    isCameraActive,
    handleFlipCamera,
    handleCameraSwitch,
    handleMicSwitch,
  } = useVideoCall();

  const styles = screenStyles(Color);

  return (
    <SafeAreaView style={styles.container}>
      {cameraSide && isCameraActive && (
        <Camera
          device={cameraSide}
          style={StyleSheet.absoluteFill}
          isActive={isCameraActive}
          video={localStream}
          audio={isMicOn}
        />
      )}
      <View style={styles.encryptionContainer}>
        <Image
          source={Images.encryptionLock}
          style={styles.encryptionLockIcon}
          resizeMode="contain"
        />
        <Text style={styles.endToEndEncryptionText}>End-to-end encrypted</Text>
      </View>

      <View style={styles.callerNameLabelContainer}>
        <Text style={styles.callerName}>{callerName}</Text>
        <Text style={styles.callingLabel}>calling</Text>
      </View>
      <View style={styles.userImageCallEndContainer}>
        {/* <Image
          source={Images.sampleUser}
          resizeMode={"cover"}
          style={styles.userImage}
        /> */}
        <View style={styles.userImage} />
        <TouchableOpacity style={styles.callEndContainer} activeOpacity={0.7}>
          <Image
            source={Images.callEnd}
            style={styles.callEndIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBtnsContainer}>
        <TouchableOpacity onPress={handleFlipCamera}>
          <Image
            source={Images.flipCamera}
            style={styles.speakerIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCameraSwitch}>
          <Image
            source={videoOnOffIcon}
            style={[
              styles.videoCallIcon,
              !isCameraActive && styles.videoOffIcon,
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleMicSwitch}>
          <Image
            source={micOnOffIcon}
            style={styles.micIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VideoCallingScreen;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    videoOffIcon: {
      height: ms(25),
      width: ms(25),
    },
    encryptionContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: mvs(13),
    },
    encryptionLockIcon: {
      height: ms(13),
      width: ms(13),
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
      marginTop: mvs(12),
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
      width: "100%",
      marginTop: mvs(14),
    },
    userImage: {
      height: mvs(480),
      width: "100%",
    },
    callEndContainer: {
      position: "absolute",
      top: "82%",
      left: "42%",
    },
    callEndIcon: {
      height: ms(58),
      width: ms(58),
    },
    bottomBtnsContainer: {
      flex: 1,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-around",

      backgroundColor: Color.callingBackgroundColor,
    },
    speakerIcon: {
      height: ms(24),
      width: ms(24),
    },
    videoCallIcon: {
      tintColor: Color.fixedWhite,
      height: ms(15),
      width: ms(24),
    },
    micIcon: {
      height: ms(22),
      width: ms(22),
    },
    container: {
      flex: 1,
      backgroundColor: Color.callingBackgroundColor,
    },
  });
};
