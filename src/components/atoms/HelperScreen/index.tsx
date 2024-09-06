import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Image,
    Keyboard,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Camera } from "react-native-vision-camera";
import CommonButton from "../../common/Components/CommonButton";
import CommonTextInput from "../../common/Components/CommonTextInput";
import { PreviewHeader } from "../../common/Components/Header";
import PageIndicator from "../../common/Components/PageIndicator";
import { COLORS } from "../../common/Utils/Colors";
import { SCREENS } from "../../common/Utils/ScreenName";
import { FONTS } from "../../common/Utils/fonts";
import { IMAGE } from "../../common/Utils/image";
import { STRING } from "../../localization/en";
import RNTextDetector from "rn-text-detector";
import Loader from "../../common/Components/Loader";
import { handleOpenSettings } from "../../common/Utils/CommonFunction";
import DeviceInfo from "react-native-device-info";

const ShowDeviceScreen = ({ navigation, route }) => {
    const _isFromIncompleteRegistration =
        route?.params?.isFromIncompleteRegistration;
    const [device, setDevice] = useState(null);
    const [IMEINumber, setIMEINumber] = useState([]);
    const camera = useRef(null);
    const [imageData, setImageData] = useState(null);
    console.log("IMEINumber-->", IMEINumber);
    const [tackPhotoClicked, setTakePhotoClicks] = useState(false);
    const [isAlert, setIsAlert] = useState(true);
    const [selectedValue, setSelectedValue] = useState(null);
    const [loader, setLoader] = useState(false);
    const IMEIPattern = /\b\d{15}\b/g;
    const SerialNoPattern = /\b[0-9A-Za-z]{6,20}\b/g;

    const goBackAction = () => {
        navigation.goBack();
    };

    const checkPermission = async () => {
        try {
            const newCameraPermission = await Camera.requestCameraPermission();

            if (newCameraPermission === "authorized") {
                // const devices = Camera.getAvailableCameraDevices();
                // const backCamera = devices.find((d) => d.position === "back");
                const devices = await Camera.getAvailableCameraDevices();
                // const backCamera = getCameraDevice(devices, "back");
                const backCamera = devices.find((d) => d.position === "back");
                setDevice(backCamera);
                // setImageData("");
                setLoader(true)
                setTakePhotoClicks(true); // Assuming you want to use the first available camera
            } else {
                console.error("Camera permission not granted");
                Alert.alert(
                    "Alert",
                    "Camera permission not granted",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                handleOpenSettings()
                                console.log("called")
                            }
                        }
                    ]
                );;
            }
        } catch (error) {
            console.error("Error checking permissions:", error);
        }
    };

    // Call the detectQRCode function with the image data when needed

    const takePicture = async (event) => {
        if (camera != null) {
            const photo = await camera.current.takePhoto();
            setImageData("file://" + photo.path);
            setTakePhotoClicks(false);
            console.log("photo", photo);
            // detectQRCode("file://" + photo.path);
        }
    };
    // const takePicture = async () => {
    //   if (camera != null) {
    //     try {
    //       const photo = await camera.current.takePhoto();
    //       console.log("Captured photo:", photo); // Log the entire photo object
    //       const { uri } = photo;
    //       setImageData(uri);
    //       setTakePhotoClicks(false);
    //       console.log("Captured photo URI:", uri);

    //       // Call detectQRCode function with the captured photo URI
    //       detectQRCode(uri);
    //     } catch (error) {
    //       console.error("Error capturing photo:", error);
    //     }
    //   }
    // };
    const CustomRadioButton = ({ label, selected, onSelect }) => (
        <TouchableOpacity
            style={[styles.radioButtonContainer,
            ]}
            onPress={onSelect}
        >
            <View style={[styles.radioButton, {
                borderColor: selected ? '#007BFF' : '#FFF',
                borderWidth: selected ? RFValue(5) : RFValue(2),
            }
            ]} />


            <Text style={[styles.radioButtonText]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
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
                setLoader(true)
                setImageData(response?.assets[0]?.uri);
                setTakePhotoClicks(false);
            }
        });
    };
    const getDataFromStorage = async () => {
        try {
            let imeiNumber = await AsyncStorage.getItem("IMEINumber");
            imeiNumber = JSON.parse(imeiNumber)// Retrieve data for the specified keys
            let whichDevice = await AsyncStorage.getItem("WhichDevice");
            whichDevice = JSON.parse(whichDevice)// Retrieve data for the specified keys
            // Retrieve data for the specified keys
            return { imeiNumber, whichDevice };
        } catch (error) {
            console.error("Error retrieving data:", error);
            return {};
        }
    };
    const handleNext = async () => {
        if (!(IMEIPattern || SerialNoPattern)) {
            alert("Please provide valid IMEI number");
        }
        else if (IMEINumber?.length < 1) {
            alert("Please provide valid IMEI number");
        } else if (IMEINumber == null) {
            alert("Please provide the IMEI image");
        } else {
            try {
                await AsyncStorage.setItem("IMEIimg", JSON.stringify(imageData));
                await AsyncStorage.setItem("IMEINumber", JSON.stringify(IMEINumber));
                await AsyncStorage.setItem("WhichDevice", JSON.stringify(selectedValue));
            } catch (error) {
                console.error("Error saving data:", error);
            }
            console.log("IMEINumber", IMEINumber);
            // navigation.navigate(SCREENS.DeviceIdScreen, {
            //   isFromIncompleteRegistration: _isFromIncompleteRegistration,
            //   IMEINumber: IMEINumber,
            //   whichDevice: selectedValue
            // });
            navigation.navigate(SCREENS.VideoUploadInstructions, {
                isFromIncompleteRegistration: _isFromIncompleteRegistration,
                IMEINumber: IMEINumber,
                whichDevice: selectedValue
            });
        }
    };
    const handleClose = () => {
        // const storedValues = await getDataFromStorage();
        // // console.log("ssss", storedValues);
        // // Use storedValues for any further operations or set it to the state if necessary
        // // setValues(storedValues); // Assuming you have a state variable to store values
        // setImageData(storedValues);
        setImageData(null);
        setTakePhotoClicks(false);
        setLoader(false)
    };
    useEffect(() => {
        // Pattern to match 15-digit numbers
        async function performTextRecognition() {
            const textRecognition = await RNTextDetector.detectFromUri(imageData);
            console.log("textRecognition:", textRecognition);
            let concatenatedText = "";
            textRecognition.forEach((item) => {
                concatenatedText += item.text + "\n"; // Add a newline character between each recognized text
            });

            // Split the concatenated text into an array of lines
            const textArray = concatenatedText.split("\n").filter(Boolean); // Filter out empty lines

            // Regular expression pattern to match IMEI numbers
            console.log("Matched textArray:", textArray);
            // Array to store matched IMEI numbers

            // Iterate through each line of text and search for matching IMEI numbers
            let matchedIMEIs = [];
            let matchedSerials = [];
            console.log("matchedIMEIs?.length", matchedIMEIs?.length)

            textArray.forEach((line) => {
                console.log("line:", line); // Log each line to see what's being processed
                console.log("***********:", line.replace(/ /g, "")); // Log each line to see what's being processed

                // const SerialNoPattern = /[0-9A-Za-z]{6,20}/g
                // const SerialNoPattern = /.*\d.*/;

                // const SerialNoPattern = Platform.OS == 'ios' ? /^(?=.*\d)[0-9A-Za-z]{10,20}$/ : /^(?=.*\d)[0-9A-Za-z]{6,20}$/;
                // const SerialNoPattern = /^(?=.*\d)[0-9A-Za-z]{6,20}$/;
                // const SerialNoPattern = /^(?=.*\d)[0-9A-Za-z]{6,20}(?![A-Za-z]O[A-Za-z])/;

                // const SerialNoPattern = /^(?=.*\d)[0-9A-Za-z][0-9A-Za-z]*$/;

                let matches = line.includes('IMEI') ? line.replace("IMEI", "").match(IMEIPattern) : line.replace(/ /g, "").match(IMEIPattern);
                // let serialMatches = line.includes('Serial') ? line.replace("Serial", "").match(SerialNoPattern) : line.replace(/ /g, "").match(SerialNoPattern);
                // let serialMatches = line.match(SerialNoPattern) || [];
                // let serialMatches = (line.match(SerialNoPattern) || []).filter(match => SerialNoPattern.test(match)); // Filter serial numbers for every line
                // console.log("serialMatches:", serialMatches); // Log the matches for each line
                if (matches) {
                    matchedIMEIs.push(...matches);
                }
                // if (serialMatches) {
                //   matchedSerials.push(...serialMatches);
                // }
                console.log("Matched Imei:", matchedIMEIs);

            });

            if (matchedIMEIs.length < 1) {
                // const correctedTextArray = textArray.map(line => line.replace(/O/g, '0'));
                textArray.forEach((line) => {
                    console.log("line:", line); // Log each line to see what's being processed
                    console.log("***********:", line.replace(/ /g, "")); // Log each line to see what's being processed

                    // const SerialNoPattern = /^(?=.*\d)[0-9A-Za-z]{6,20}(?![A-Za-z]O[A-Za-z])/;



                    let serialMatches = (line.match(SerialNoPattern) || []).filter(match => SerialNoPattern.test(match)); // Filter serial numbers for every line
                    console.log("serialMatches:", serialMatches); // Log the matches for each line

                    if (serialMatches) {
                        matchedSerials.push(...serialMatches);
                    }
                    console.log("Matched Serial:", serialMatches);

                });


            }
            console.log("match found=====", matchedSerials)
            if (matchedIMEIs?.length) {
                setIMEINumber(matchedIMEIs[0]);
                setLoader(false)
            } else if (matchedSerials?.length) {

                console.log("match found", matchedSerials)

                let largestString = null;
                let maxLength = 0;

                matchedSerials.forEach(match => {
                    console.log("leng", match.length)
                    if (match.length > maxLength) {
                        maxLength = match.length;
                        largestString = match;
                    }
                });

                console.log("Largest string:", largestString);
                setIMEINumber(largestString);
                setLoader(false)

            }
            else {
                alert("Can not read the IMEI/SERIAL from the provided image");
                setIMEINumber(null);
                setLoader(false)
            }
        }
        if (imageData != null) {
            performTextRecognition();
        }
    }, [imageData]);
    // useEffect(() => {
    //   // Pattern to match 15-digit numbers
    //   async function performTextRecognition() {
    //     const textRecognition = await RNTextDetector.detectFromUri(imageData);
    //     console.log("textRecognition:", textRecognition);
    //     let concatenatedText = "";
    //     textRecognition.forEach((item) => {
    //       concatenatedText += item.text + "\n"; // Add a newline character between each recognized text
    //     });

    //     // Split the concatenated text into an array of lines
    //     const textArray = concatenatedText.split("\n").filter(Boolean); // Filter out empty lines

    //     // Regular expression pattern to match IMEI numbers
    //     console.log("Matched textArray:", textArray);
    //     // Array to store matched IMEI numbers

    //     // Iterate through each line of text and search for matching IMEI numbers
    //     let matchedIMEIs = [];
    //     let matchedSerials = [];

    //     textArray.forEach((line) => {
    //       console.log("line:", line); // Log each line to see what's being processed
    //       console.log("***********:", line.replace(/ /g, "")); // Log each line to see what's being processed
    //       const IMEIPattern = /\b\d{15}\b/g;
    //       // const SerialNoPattern = /[0-9A-Za-z]{6,20}/g
    //       // const SerialNoPattern = /.*\d.*/;

    //       // const SerialNoPattern = Platform.OS == 'ios' ? /^(?=.*\d)[0-9A-Za-z]{10,20}$/ : /^(?=.*\d)[0-9A-Za-z]{6,20}$/;
    //       const SerialNoPattern = /^(?=.*\d)[0-9A-Za-z]{6,20}$/;

    //       let matches = line.includes('IMEI') ? line.replace("IMEI", "").match(IMEIPattern) : line.replace(/ /g, "").match(IMEIPattern);
    //       // let serialMatches = line.includes('Serial') ? line.replace("Serial", "").match(SerialNoPattern) : line.replace(/ /g, "").match(SerialNoPattern);
    //       // let serialMatches = line.match(SerialNoPattern) || [];
    //       let serialMatches = (line.match(SerialNoPattern) || []).filter(match => SerialNoPattern.test(match)); // Filter serial numbers for every line
    //       console.log("serialMatches:", serialMatches); // Log the matches for each line
    //       if (matches) {
    //         matchedIMEIs.push(...matches);
    //       }
    //       if (serialMatches) {
    //         matchedSerials.push(...serialMatches);
    //       }
    //       console.log("Matched Serial:", serialMatches);

    //     });
    //     console.log("match found=====", matchedSerials)
    //     if (matchedIMEIs?.length) {
    //       setIMEINumber(matchedIMEIs[0]);
    //       setLoader(false)
    //     } else if (matchedSerials?.length) {
    //       if (Platform.OS == 'ios') {
    //         console.log("match found", matchedSerials)

    //         let largestString = null;
    //         let maxLength = 2;

    //         matchedSerials.forEach(match => {
    //           console.log("leng", match.length)
    //           if (match.length > maxLength) {
    //             maxLength = match.length;
    //             largestString = match;
    //           }
    //         });

    //         console.log("Largest string:", largestString);
    //         setIMEINumber(largestString);
    //         setLoader(false)
    //       }
    //       else {
    //         setIMEINumber(matchedSerials[0]);
    //         setLoader(false)
    //       }
    //     }
    //     else {
    //       alert("Can not read the IMEI/SERIAL from the provided image");
    //       setIMEINumber(null);
    //       setLoader(false)
    //     }
    //   }
    //   if (imageData != null) {
    //     performTextRecognition();
    //   }
    // }, [imageData]);

    const onBottomButtonPressed = (event) => {
        const captureImage = JSON.stringify(event.captureImage);
        console.log(captureImage);
        if (event.type == "left") {
            setImageData(captureImage);
            setTakePhotoClicks(false);
        } else if (event.type == "right") {
            setTakePhotoClicks(false);
        }
    };
    // useEffect(() => {

    //   if (_isFromIncompleteRegistration) {

    //   }
    // }, [selectedValue])
    useEffect(() => {
        const subscribeFocus = navigation.addListener("focus", () => {
            console.log("subscribeFocus-ShowDeviceScreen");
            if (_isFromIncompleteRegistration) {
                // setIMEINumber(null);
                console.log("subscribeFocus-ShowDeviceScreen-----isfromincomplete");
                const fetchData = async () => {
                    const storedValues = await getDataFromStorage();
                    console.log("ssss", storedValues);
                    if (typeof storedValues?.imeiNumber == 'string') {
                        setIMEINumber(storedValues?.imeiNumber);
                        setLoader(false)
                    }
                    else {
                        setIMEINumber(storedValues?.imeiNumber?.[0])
                        setLoader(false)
                    }
                    // Use storedValues for any further operations or set it to the state if necessary
                    // setValues(storedValues); // Assuming you have a state variable to store values

                    setSelectedValue(storedValues?.whichDevice);
                    if (selectedValue != null) {
                        console.log("first")
                        setIsAlert(false)
                    }
                    // else {
                    //   console.log("second")
                    //   setIsAlert(true)
                    // }

                }
                fetchData();
            }
            else {
                if (selectedValue != null) {
                    console.log("thrid")
                    setIsAlert(false)
                }
                // else {
                //   console.log("four")
                //   setIsAlert(true)
                // }


            }
        });

        const unsubscribeBlur = navigation.addListener("blur", () => {
            console.log("unsubscribeBlur-ShowDeviceScreen");
        });

        return () => {
            unsubscribeBlur();
        };
    }, []);

    console.log("selectedValue", selectedValue)
    return tackPhotoClicked ? (
        <View style={{ flex: 1 }}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
            // sensorOrientation={sensorOrientation}
            // frameProcessor={frameProcessor}
            />

            {/* {imageData != null && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Image
            resizeMode={"contain"}
            source={{ uri: imageData }}
            style={{
              ...StyleSheet.absoluteFill,
            }}
          />
        </View>
      )} */}
            <TouchableOpacity
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: "red",
                    position: "absolute",
                    bottom: RFValue(40),
                    alignSelf: "center",
                }}
                onPress={takePicture}
            ></TouchableOpacity>

            {/* <TouchableOpacity
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: COLORS.LightBlack,
          position: "absolute",
          bottom: RFValue(40),
          left: RFValue(40),
          alignSelf: "center",
          justifyContent: "center",
        }}
        onPress={openImagePicker}
      >
        <Text style={{ alignSelf: "center", color: "white" }}>Gallery</Text>
      </TouchableOpacity> */}

            <TouchableOpacity
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: COLORS.LightBlack,
                    position: "absolute",
                    bottom: RFValue(40),
                    right: RFValue(40),
                    alignSelf: "center",
                    justifyContent: "center",
                }}
                onPress={handleClose}
            >
                <Text style={{ alignSelf: "center", color: "white" }}>Cancel</Text>
            </TouchableOpacity>
            {/* </View> */}
        </View>
    ) : (
        (device === null || device) && (
            // <SafeAreaView style={styles.container}>
            //   <ScrollView
            //     showsVerticalScrollIndicator={false}
            //     bounces={false}
            //     contentContainerStyle={{
            //       justifyContent: "space-between",
            //       flexGrow: 1,
            //     }}
            //   >
            //     <View>
            //       <PreviewHeader previewGoback={goBackAction} />
            //       <View style={styles.titleContainer}>
            //         <Text style={styles.titleText}>{STRING.UploadMirrorPhoto}</Text>

            //         {imageData != null && (
            //           <View style={styles.otherContainer}>
            //             <Image
            //               resizeMode="contain"
            //               source={{ uri: "file://" + imageData }}
            //               style={{
            //                 marginTop: RFPercentage(3),
            //                 width: RFPercentage(40),
            //                 height: RFPercentage(40),
            //                 alignSelf: "center",
            //                 justifyContent: "center",
            //                 transform: [
            //                   {
            //                     rotate: Platform.OS == "android" ? "0deg" : "0deg",
            //                   },
            //                 ],
            //               }}
            //             />
            //             <TouchableOpacity
            //               onPress={() => {
            //                 setImageData(null);
            //                 // setDevice(null);
            //               }}
            //               style={styles.videoCloseContainer}
            //             >
            //               <Image style={styles.closeImg} source={IMAGE.Close} />
            //             </TouchableOpacity>
            //           </View>
            //         )}

            //         <TouchableOpacity
            //           style={{
            //             backgroundColor: COLORS.Blue,
            //             paddingVertical: RFValue(12),
            //             paddingHorizontal: RFValue(18),
            //             borderRadius: RFValue(20),
            //             flexDirection: "row",
            //             alignItems: "center",
            //             justifyContent: "center",
            //             // alignSelf: "center",
            //             marginTop: RFPercentage(3),
            //           }}
            //           onPress={checkPermission}
            //         >
            //           <Image source={IMAGE.Camera} style={styles.cameraIcon} />
            //           <Text style={styles.btnText}>
            //             {imageData ? STRING.TakeAnotherPhoto : STRING.UseCamera}
            //           </Text>
            //         </TouchableOpacity>
            //       </View>
            //     </View>

            //     <View>
            //       <CommonButton
            //         onPress={handleNext}
            //         label={STRING.Next}
            //         buttonStyle={styles.nextBtn}
            //       />
            //       <PageIndicator leftNo={"06"} rightNo={"07"} />
            //     </View>
            //   </ScrollView>
            // </SafeAreaView>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <SafeAreaView style={styles.container}>
                    <View>
                        <PreviewHeader previewGoback={goBackAction} />
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>{STRING.SerialorIMEINumber}</Text>

                            <CommonTextInput
                                placeholder={STRING.IMEINumber}
                                value={IMEINumber ? IMEINumber : IMEINumber?.[0]}
                                onChangeText={(text) => {
                                    const updatedIMEINumber = [...(IMEINumber || [])]; // Create a copy of the IMEINumber array
                                    updatedIMEINumber[0] = text; // Update the value at index 0 with the entered text
                                    setIMEINumber(updatedIMEINumber);
                                }}
                                textInputStyle={styles.TextInputTextStyle}
                                componentStyle={styles.TextInputView}
                                returnKeyType={"next"}
                                keyboardType={"number-pad"}
                                autoCapitalize={"none"}
                                icon={IMAGE.IMEI}
                                maxLength={16}
                            />
                        </View>
                        {/* <UseCamera setIsPermitted={setIsPermitted} /> */}
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                        contentContainerStyle={{
                            justifyContent: "space-between",
                            flexGrow: 1,
                        }}
                    >
                        <View>
                            {/* <Text style={styles.titleText}>{STRING.UploadMirrorPhoto}</Text> */}

                            {/* {imageData != null && (
                <View style={styles.otherContainer}>
                  <Image
                    resizeMode="contain"
                    source={{ uri: imageData }}
                    style={{
                      marginTop: RFPercentage(3),
                      width: RFPercentage(40),
                      height: RFPercentage(40),
                      alignSelf: "center",
                      justifyContent: "center",
                      transform: [
                        {
                          rotate: Platform.OS == "android" ? "0deg" : "0deg",
                        },
                      ],
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setImageData(null);
                      // setDevice(null);
                    }}
                    style={styles.videoCloseContainer}
                  >
                    <Image style={styles.closeImg} source={IMAGE.Close} />
                  </TouchableOpacity>
                </View>
              )} */}

                            <TouchableOpacity
                                style={{
                                    backgroundColor: COLORS.Blue,
                                    paddingVertical: RFValue(12),
                                    paddingHorizontal: RFValue(18),
                                    borderRadius: RFValue(20),
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    // alignSelf: "center",
                                    // marginTop: RFPercentage(3),
                                }}
                                onPress={checkPermission}
                            >
                                <Image source={IMAGE.Camera} style={styles.cameraIcon} />
                                <Text style={styles.btnText}>{STRING.UseCamera}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: COLORS.Blue,
                                    paddingVertical: RFValue(12),
                                    paddingHorizontal: RFValue(18),
                                    borderRadius: RFValue(20),
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: RFValue(18),
                                    // alignSelf: "center",
                                    // marginTop: RFPercentage(3),
                                }}
                                onPress={openImagePicker}
                            >
                                <Image source={IMAGE.Gallery} style={styles.cameraIcon} />
                                <Text style={styles.btnText}>{STRING.UseGallery}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <View>
                        <CommonButton
                            onPress={handleNext}
                            label={STRING.Next}
                            buttonStyle={styles.nextBtn}
                        />
                        <PageIndicator leftNo={"04"} rightNo={"07"} />
                    </View>
                    <Modal animationType="slide" visible={isAlert} transparent={true}>
                        <View style={[styles.alertContainer]}>
                            <View style={[styles.alertWrapper]}>
                                <Text style={[styles.alertText]}>
                                    {"Alert !!!"}
                                </Text>
                                <Text style={[styles.alertMessageText]}>{"Please select the either option while fetching IMEI Numner"}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginHorizontal: RFValue(10) }}>


                                    <CustomRadioButton
                                        label="Same Device"
                                        selected={selectedValue === 'Same Device'}
                                        onSelect={() => setSelectedValue('Same Device')}
                                    />
                                    <CustomRadioButton
                                        label="Different Device"
                                        selected={selectedValue === 'Different Device'}
                                        onSelect={() => setSelectedValue('Different Device')}
                                    />
                                </View>
                                <CommonButton
                                    label={"OK"}
                                    buttonStyle={styles.commonButtonStyle}
                                    onPress={() => {
                                        if (selectedValue == null) {
                                            alert('Selecting either option is mandtory to proceed further!')
                                        } else {

                                            setIsAlert(false);
                                        }
                                    }}
                                />
                            </View>
                        </View>
                    </Modal>
                    {/* <Modal animationType="slide" visible={isAlert} transparent={true}>
            <View
              style={[
                styles.alertContainer,
                {
                  backgroundColor: COLORS.transparentWB,
                },
              ]}
            >
              <View
                style={[
                  styles.alertWrapper,
                  {
                    backgroundColor: COLORS.GreyBackground,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.alertText,
                    {
                      color: COLORS.White,
                    },
                  ]}
                >
                  {"Alert !!"}
                </Text>
                <Text
                  style={[
                    styles.alertMessageText,
                    {
                      color: COLORS.GreyLight,
                    },
                  ]}
                >
                </Text>
                <CommonButton
                  label={"OK"}
                  buttonStyle={styles.commonButtonStyle}
                  onPress={() => {
                    setAlertModal(false);
                    setAlertMessage("");
                  }}
                />
              </View>
            </View>
          </Modal> */}
                    {loader ? <Loader isloading={loader} size={"large"} /> : undefined}
                </SafeAreaView>
            </TouchableWithoutFeedback>
        )
    );
};

export default ShowDeviceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.Black,
        paddingHorizontal: RFValue(20),
        // justifyContent: "space-between",
    },
    titleContainer: {
        marginTop: RFPercentage(4),
        marginBottom: RFPercentage(3),
    },
    titleText: {
        color: COLORS.White,
        fontSize: RFValue(14),
        fontFamily: FONTS.Medium,
    },

    nextBtn: {
        backgroundColor: COLORS.Blue,
        // marginBottom: RFPercentage(5),
    },

    closeImg: {
        height: RFValue(7),
        width: RFValue(7),
    },

    txtbox: {
        fontSize: RFValue(20, 580),
        fontWeight: "bold",
    },
    cameraContainer: {
        backgroundColor: COLORS.Blue,
        paddingVertical: RFValue(12),
        paddingHorizontal: RFValue(18),
        borderRadius: RFValue(20),
        flexDirection: "row",
        alignItems: "center",
    },
    cameraIcon: {
        height: RFValue(14),
        width: RFValue(14),
        marginRight: RFPercentage(1),
    },
    btnText: {
        color: COLORS.White,
        fontFamily: FONTS.Bold,
        fontSize: RFValue(12),
    },
    titleContainer: {
        marginTop: RFPercentage(4),
        marginBottom: RFPercentage(3),
    },
    titleText: {
        color: COLORS.White,
        fontSize: RFValue(14),
        fontFamily: FONTS.Medium,
    },
    cameraIcon: {
        height: RFValue(14),
        width: RFValue(14),
        marginRight: RFPercentage(1),
    },
    btnText: {
        color: COLORS.White,
        fontFamily: FONTS.Bold,
        fontSize: RFValue(12),
    },
    otherContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    videoCloseContainer: {
        position: "absolute",
        backgroundColor: COLORS.Blue,
        padding: RFValue(5),
        right: 0,
        borderRadius: RFValue(10),
    },
    TextInputTextStyle: {
        fontFamily: FONTS.Regular,
        fontSize: RFValue(12),
        color: COLORS.TextInputPlaceholder,
    },
    TextInputView: {
        backgroundColor: COLORS.Black,
        marginTop: RFPercentage(2),
    },
    alertContainer: {
        flex: 1,
        // alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        // backgroundColor: "red",
    },
    alertWrapper: {
        backgroundColor: COLORS.LightBlack,
        marginHorizontal: RFPercentage(5),
        paddingTop: RFPercentage(3),
        paddingBottom: RFPercentage(3),
        borderRadius: RFPercentage(1),
        paddingHorizontal: RFPercentage(2),
    },
    alertText: {
        textAlign: "center",
        fontFamily: FONTS.Bold,
        color: COLORS.White,
        fontSize: RFValue(15),
        marginBottom: RFPercentage(3),
    },
    alertMessageText: {
        color: COLORS.Sky,
        textAlign: "center",
        // lineHeight: RFValue(20),
        fontFamily: FONTS.Medium,
        fontSize: RFValue(13),

    },
    commonButtonStyle: {
        marginHorizontal: RFPercentage(2),
        backgroundColor: COLORS.Blue,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: RFPercentage(3),

    },

    radioButton: {
        height: RFValue(10),
        width: RFValue(10),
        borderRadius: RFValue(10),
        borderWidth: 1,
        borderColor: '#007BFF',
        alignItems: 'center',
    },
    radioButtonText: {
        fontSize: RFValue(12),
        marginLeft: RFValue(5),
        color: COLORS.White
    },
});