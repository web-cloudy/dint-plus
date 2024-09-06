import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Camera,
    getCameraDevice,
    useCameraDevices,
} from "react-native-vision-camera";
import { ms, mvs } from "react-native-size-matters";
import { Images } from "assets/images";
import { COLORS, getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
// import { handleOpenSettings } from "../Utils/CommonFunction";

const VisionCamera = ({ setTakePhotoClicks, setVideoPath, setImageData, CameraUsage, setCameraUsage, setLoader, setConfirmSend }) => {
    const [device, setDevice] = useState(null);
    const { theme } = useTheme();
    const Color = getCurrentTheme(theme || "light");
    console.log("devcixe", device);
    const camera = useRef(null);
    const [videoStart, setVideoStart] = useState(false);
    const [cameraSwitch, setCamerSwitch] = useState(false);
    // const [imageData, setImageData] = useState("");

    //   const [videoPath, setVideoPath] = useState("");

    useEffect(() => {
        checkPermission();
    }, []);
    const switchCamera = async () => {
        setCamerSwitch(!cameraSwitch)
        const devices = await Camera.getAvailableCameraDevices();
        // const backCamera = getCameraDevice(devices, "back");
        const frontCamera = devices.find((d) => d.position === "front");
        const backCamera = devices.find((d) => d.position === "back");
        setDevice(!cameraSwitch ? backCamera : frontCamera);
    }
    const checkPermission = async () => {
        try {
            const newCameraPermission = await Camera.requestCameraPermission();
            console.log('=========>', newCameraPermission);


            if (
                newCameraPermission === "granted"
            ) {
                // const devices = Camera.getAvailableCameraDevices();
                // const backCamera = devices.find((d) => d.position === "back");
                const devices = await Camera.getAvailableCameraDevices();
                // const backCamera = getCameraDevice(devices, "back");
                const backCamera = devices.find((d) => d.position === "back");
                setDevice(backCamera);
                // let devices = await Camera.getAvailableCameraDevices();
                // console.log("cddd", devices);
                // let backCamera = devices?.back;// Assuming you want to use the first available camera
            } else {
                console.error("Camera permission not granted");
                Alert.alert(
                    "Alert",
                    "Camera permission not granted",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                // handleOpenSettings()
                                console.log("called")
                            }
                        }
                    ]
                );
                setDevice('')
                setTakePhotoClicks(false)
                setLoader(false)
            }
        } catch (error) {
            console.error("Error checking permissions:", error);
        }
    };

    if (device === null)
        return (
            <ActivityIndicator
                style={{
                    flex: 1,
                    backgroundColor: 'black',
                    justifyContent: "center",
                    alignItems: "center",
                }}
            />
        );
    //   const takePicture = async () => {
    //     setVideoStart(!videoStart);
    //     if (camera != null) {
    //       const photo = await camera.current.takePhoto();
    //       setImageData(photo.path);
    //       setTakePhotoClicks(false);
    //       console.log("photo", photo);
    //     }
    //   };
    const takePicture = async (event) => {
        if (camera != null) {
            const photo = await camera.current.takePhoto();
            setImageData("file://" + photo.path);
            setTakePhotoClicks(false);
            setConfirmSend(true)
            // setVideoPath(null) /// remove if you want previous video data 
            console.log("photo", photo);
            // detectQRCode("file://" + photo.path);
        }
    };


    const handleClose = () => {
        setVideoStart(false)
        setTakePhotoClicks(false);
        setCameraUsage(false)
        setConfirmSend(false)
        setLoader(false)
    };
    const handleRecordVideo = async () => {
        setVideoStart(true);

        try {
            camera.current.startRecording({
                fileType: "mp4",
                videoBitRate: 'extra-high',
                onRecordingFinished: async (video) => {
                    const path = video.path;
                    console.log("path", video);
                    // await CameraRoll.saveAsset(path, {
                    //   type: "video",
                    // });
                    setVideoPath(video);
                },

                onRecordingError: (error) => console.error(error),
            });
        } catch (e) {
            console.log(e);
        }


    };
    const handleStopVideo = async () => {
        setVideoStart(false)
        try {
            await camera.current.stopRecording();
            setTakePhotoClicks(false);
            setConfirmSend(true);
            setImageData(null) /// remove if you want previous image data 
        } catch (e) {
            console.log(e);
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
                video={true}
            />
            <TouchableOpacity
                style={{
                    width: ms(60),
                    height: ms(60),
                    borderRadius: ms(30),
                    borderWidth: CameraUsage ? ms(32) : videoStart ? ms(15) : ms(5),
                    borderColor: Color.white,
                    backgroundColor: "red",
                    position: "absolute",
                    bottom: ms(50),
                    alignSelf: "center",
                }}
                onLongPress={handleRecordVideo}
                onPressOut={handleStopVideo}
                onPress={takePicture}
            ></TouchableOpacity>

            <TouchableOpacity
                hitSlop={{ top: 0, bottom: 0, left: 30, right: 30 }}
                style={{
                    // width: ms(50),
                    // height: ms(50),
                    // borderRadius: ms(25),
                    // backgroundColor: COLORS.LightBlack,
                    position: "absolute",
                    top: ms(45),
                    right: ms(15),
                    alignSelf: "center",
                    justifyContent: "center",
                }}
                onPress={handleClose}
            >
                {/* <Text style={{ alignSelf: "center", color: "white" }}>Cancel</Text> */}
                <Image style={{
                    height: ms(20),
                    width: ms(20),
                }} source={Images.Close} />
            </TouchableOpacity>
            <TouchableOpacity
                hitSlop={{ top: 0, bottom: 0, left: 30, right: 30 }}
                style={{
                    // width: 60,
                    // height: 60,
                    // borderRadius: 30,
                    // backgroundColor: COLORS.LightBlack,
                    position: "absolute",
                    top: ms(85),
                    right: ms(11),
                    alignSelf: "center",
                    justifyContent: "center",
                }}
                // onPress={openImagePicker}
                onPress={() => switchCamera()}
            >
                {/* <Text style={{ alignSelf: "center", color: "white" }}>Gallery</Text> */}
                <Image style={{ height: ms(25), width: ms(25) }} source={Images.CameraSwitch} />
            </TouchableOpacity>
        </View>
    );
};

export default VisionCamera;