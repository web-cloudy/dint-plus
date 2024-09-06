import { useNavigation } from "@react-navigation/native";
import { Images } from "assets/images";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { useEffect, useState } from "react";
import { Alert, ImageSourcePropType } from "react-native";
import {
  Camera,
  CameraPosition,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

const useVideoCall = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const [changedSide, setChangedSide] = useState<CameraPosition>("front");
  const cameraSide = useCameraDevice(changedSide);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [micOnOffIcon, setMicOnOffIcon] = useState<ImageSourcePropType>(
    Images.micOpen
  );
  const [videoOnOffIcon, setVideoOnOffIcon] = useState<ImageSourcePropType>(
    Images.videoCall
  );
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const navigation = useNavigation();
  const { hasPermission } = useCameraPermission();

  const checkForNecessaryPermissions = async () => {
    if (!hasPermission) {
      const cameraPermission = await Camera.requestCameraPermission();
      const microphonePermission = await Camera.requestMicrophonePermission();
      if (
        cameraPermission !== "granted" ||
        microphonePermission !== "granted"
      ) {
        console.error("Permissions not granted");
        return;
      }
    }
  };

  const handleFlipCamera = () => {
    setChangedSide(changedSide === "front" ? "back" : "front");
  };

  const handleCameraSwitch = () => {
    setIsCameraActive(isCameraActive ? false : true);
    setVideoOnOffIcon(isCameraActive ? Images.videoOff : Images.videoCall);
  };

  const handleMicSwitch = () => {
    setIsMicOn(!isMicOn);
    setMicOnOffIcon(isMicOn ? Images.micClose : Images.micOpen);
  };

  useEffect(() => {
    if (cameraSide == null) {
      Alert.alert("Oops!!", "There is no camera in the device");
      navigation.goBack();
      return;
    }
    checkForNecessaryPermissions();
  }, []);

  useEffect(() => {}, [hasPermission]);

  return {
    Color,
    cameraSide,
    isCameraActive,
    isMicOn,
    micOnOffIcon,
    videoOnOffIcon,
    localStream,
    handleFlipCamera,
    handleCameraSwitch,
    handleMicSwitch,
  };
};

export default useVideoCall;
