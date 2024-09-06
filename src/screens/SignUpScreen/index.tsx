import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  UserSelectors,
  resetSignUpData,
  loginUserAPI,
  resetLoginData,
} from "store/slices/users";
import useAppDispatch from "hooks/useAppDispatch";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "../../navigator/navigation";
import { ms, mvs, vs } from "react-native-size-matters";
import { getCurrentTheme } from "constants/Colors";
import { Button, Loader, TextInput } from "components/atoms";
import { useTheme } from "contexts/ThemeContext";
import PhoneInputField from "components/molecules/PhoneInputField/PhoneInputField";
import { useAuth } from "contexts/AuthContext";
import { getDataFromAsync, storeDataInAsync } from "utils/LocalStorage";
import {
  savetoken,
  setCurrentInstanceSocket,
  setSocketConnection,
} from "constants/chatSocket";
import {
  checkCodeExistence,
  checkContactPermissionIOS,
  displayOverAppPermission,
  openSettingsForPhoneState,
  requestPhoneNumPermission,
  validatePhoneNumber,
} from "utils";
import SimCardsManagerModule from "react-native-sim-cards-manager";
import PhoneNumbersModal from "components/organisms/PhoneNumbersModal";
import { Images } from "assets/images";
import { hp, wp } from "utils/metrix";
import { useImagePicker } from "hooks";
import {
  ProfileSelectors,
  resetProfileData,
  resetSentOtpToNewUser,
  sendOtpToNewUserAPI,
  uploadMediaAPI,
} from "store/slices/profile";

type Props = Record<string, never>;

const SignUpScreen: FunctionComponent<Props> = ({}: Props) => {
  const [displayName, setDisplayName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneFromList, setPhoneFromList] = useState<string>("");
  const [countryCode, setCountryCode] = useState("");
  const { loginError } = UserSelectors();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [phoneModal, showNumberModal] = useState(false);
  const dispatch = useAppDispatch();
  const { setUserId } = useAuth();
  const { loading, signUpError, userData } = UserSelectors();
  const { newUserOtpResp } = ProfileSelectors();

  const navigation = useNavigation<RootNavigationProp>();
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [contactNumbers, setContactNumbers] = useState<any[]>([]);
  const [fcmToken, setFCMToken] = useState<string>("");

  const { selectedImage, showImagePickerOptions } = useImagePicker();

  async function checkPhonePermission() {
    const hasPermission = await requestPhoneNumPermission();

    if (hasPermission) {
      const NumberDetails = await SimCardsManagerModule.getSimCards({
        title: "App Permission",
        message: "This app needs read your phone number",
        buttonNeutral: "Not now",
        buttonNegative: "Not OK",
        buttonPositive: "OK",
      });
      setContactNumbers([...NumberDetails]);
      if (NumberDetails?.length > 1) {
        showNumberModal(true);
      } else {
        if (
          checkCodeExistence(NumberDetails[0]?.isoCountryCode?.toUpperCase())
            ?.exists
        ) {
          let foundItem = checkCodeExistence(
            NumberDetails[0]?.isoCountryCode?.toUpperCase()
          );

          let validatedPhoneNumber = validatePhoneNumber(
            NumberDetails[0]?.phoneNumber,
            foundItem?.dialCode
          );
          setPhoneNumber(validatedPhoneNumber);
          setPhoneFromList(validatedPhoneNumber);
          setCountryCode(foundItem?.dialCode);
        } else {
          setCountryCode("");
          setPhoneNumber(NumberDetails[0]?.phoneNumber);
          setPhoneFromList(NumberDetails[0]?.phoneNumber);
        }
      }
    } else if (!hasPermission && Platform?.OS === "android") {
      openSettingsForPhoneState();
      setPhoneNumber("");
      setPhoneFromList("");
    }
  }
  async function saveFcmToken() {
    const fcmToken = await getDataFromAsync("fcmToken");
    setFCMToken(fcmToken || "");
  }
  useEffect(() => {
    saveFcmToken();
    if (Platform.OS == "android") {
      // checkContactPermissionAndroid();
    } else {
      checkContactPermissionIOS();
    }
  }, []);

  useEffect(() => {
    checkPhonePermission();
    displayOverAppPermission()
  }, []);

  useEffect(() => {
    console.log("loginError ", loginError);
    if (loginError?.status === 400 || loginError?.status === 404) {
      console.log(mediaKey);
      let params = {
        phone_no: countryCode + phoneNumber,
      };
      dispatch(sendOtpToNewUserAPI(params));
      dispatch(resetLoginData());
    } else {
      dispatch(resetLoginData());
    }
  }, [loginError]);

  useEffect(() => {
    if (newUserOtpResp?.code == 200 && newUserOtpResp?.data?.otp) {
      if (userData?.data?.token) {
        navigation.navigate("OtpScreen", {
          isLogin: true,
          phone_no: countryCode + phoneNumber,
          verificationOtp: newUserOtpResp?.data?.otp,
          userDetails: {
            phone_no: countryCode + phoneNumber,
            fire_base_auth_key: fcmToken || "",
          },
        });
      } else {
        navigation.navigate("OtpScreen", {
          isSignUp: true,
          phone_no: countryCode + phoneNumber,
          verificationOtp: newUserOtpResp?.data?.otp,
          userDetails: {
            display_name: displayName,
            phone_no: countryCode + phoneNumber,
            profile_image: mediaKey || "",
            fire_base_auth_key: fcmToken || "",
          },
        });
      }

      dispatch(resetSentOtpToNewUser());
    } else if (newUserOtpResp?.code == 400) {
      setErrorMsg("Invalid Number");
      dispatch(resetSentOtpToNewUser());
    } else if (newUserOtpResp?.code == 200 && newUserOtpResp?.data === null) {
      setErrorMsg("Invalid Number");
      dispatch(resetSentOtpToNewUser());
    }
  }, [newUserOtpResp]);

  function connect(token: string) {
    // Start the connection
    const URL = "wss://bedev.dint.com/ws/conversation/global/";
    const origin = "https://bedev.dint.com";
    const ws = new WebSocket(URL + "?token=" + token);
    ws.onopen = function () {
      console.log("opened:");
      setSocketConnection(ws);
      setCurrentInstanceSocket(0);
    };
  }

  useEffect(() => {
    if (userData) {
      setUserId(userData?.data?.id);
      storeDataInAsync("token", userData?.data?.token);
      storeDataInAsync("userId", userData?.data?.id + "");
      storeDataInAsync("email", userData?.data?.email + "");
      savetoken(userData?.data?.token);
      // connect(userData?.data?.token);
      // navigation.reset({index: 0,routes: [{name: "Main"}],});
      let params = {
        phone_no: countryCode + phoneNumber,
      };
      dispatch(sendOtpToNewUserAPI(params));

      dispatch(resetProfileData());
    }
    // return () => dispatch(resetLoginData());
  }, [userData]);

  useEffect(() => {
    return () => dispatch(resetSignUpData());
  }, []);

  const onSignUpClick = useCallback(async () => {
    const fcmToken = await getDataFromAsync("fcmToken");

    if (!displayName) {
      setErrorMsg("Enter valid display name");
      return;
    } else if (!phoneNumber) {
      setErrorMsg("Enter phone number");
      return;
    } else {
      setErrorMsg("");
    }
    try {
      dispatch(
        loginUserAPI({
          phone_no: countryCode + phoneNumber,
          fire_base_auth_key: fcmToken || "",
        })
      );
    } catch (error) {
      console.log("error", error);
    }
  }, [phoneNumber, displayName, dispatch, phoneFromList]);

  const onChangeDisplayName = (text: string) => {
    setDisplayName(text);
    setErrorMsg("");
  };

  const onLoginPress = () => {
    navigation.replace("Login");
    dispatch(resetProfileData());
  };

  const { mediaKey } = ProfileSelectors();

  useEffect(() => {
    console.log("selectedImage", selectedImage);
    if (selectedImage) {
      const formData = new FormData();
      formData.append("media", selectedImage);
      dispatch(uploadMediaAPI(formData));
    }
  }, [selectedImage]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        style={styles.bodyContainer}
      >
        <View>
          {/* <Image resizeMode={"cover"} style={styles.logoImg} source={logo} /> */}

          <TouchableOpacity
            onPress={showImagePickerOptions}
            style={styles.addPicView}
          >
            {selectedImage ? (
              <Image
                resizeMode="cover"
                style={styles.addPicView}
                source={{ uri: selectedImage?.uri }}
              />
            ) : (
              <Image
                resizeMode="contain"
                style={styles.iconView}
                source={Images.addPic}
              />
            )}
          </TouchableOpacity>
          <TextInput
            value={displayName}
            onChangeText={onChangeDisplayName}
            placeholder={"Enter Your Display Name"}
            lable={"Display Name"}
            keyboardType={"email-address"}
            containerStyle={styles.textPassInputStyle}
          />
          {contactNumbers?.length === 0 && (
            <PhoneInputField
              value={phoneNumber}
              onChangeText={(number: string, code: string) => {
                console.log(number + "and " + code);
                let updatedNum = number?.replace(/\s+/g, "");
                setPhoneNumber(updatedNum),
                  setCountryCode(code),
                  setErrorMsg("");
              }}
              placeholder={"Enter Mobile Number"}
              label={"Mobile Number"}
            />
          )}

          {phoneFromList?.length > 0 && (
            <PhoneInputField
              value={phoneFromList}
              onChangeText={(number: string, code: string) => {
                console.log(number + "and " + code);
                let updatedNum = number?.replace(/\s+/g, "");
                setPhoneFromList(updatedNum);
                setPhoneNumber(updatedNum),
                  setCountryCode(code),
                  setErrorMsg("");
              }}
              placeholder={"Enter Mobile Number"}
              label={"Mobile Number"}
              doNotEdit
              onPressField={() => showNumberModal(true)}
            />
          )}

          <View style={styles.forgotPasswordContainer}>
            <View>
              <Text style={{ color: Color.black }}>
                You can add more details in settings
              </Text>
            </View>
          </View>
          <Text style={styles.errorMsg}>
            {errorMsg ? errorMsg : signUpError ? signUpError?.message : ""}
          </Text>

          <Button
            text="Sign Up"
            btnStyle={styles.btnContainer}
            onPress={onSignUpClick}
          />

          <View style={styles.signUpContainer}>
            <Text style={styles.dontHaveAnAccount}>
              Already have an account?{" "}
            </Text>
            <Text onPress={onLoginPress} style={styles.signUp}>
              Login
            </Text>
          </View>
        </View>
      </ScrollView>

      <Loader visible={loading} />
      {contactNumbers?.length > 0 && phoneModal && (
        <PhoneNumbersModal
          data={contactNumbers}
          isVisible={phoneModal}
          hideModal={() => {
            showNumberModal(false), setContactNumbers([]);
            setPhoneFromList("");
            setCountryCode("");
          }}
          onPressNumber={(item: any) => {
            showNumberModal(false);
            if (
              checkCodeExistence(item?.isoCountryCode?.toUpperCase())?.exists
            ) {
              let foundItem = checkCodeExistence(
                item?.isoCountryCode?.toUpperCase()
              );
              let validatedPhoneNumber = validatePhoneNumber(
                item?.phoneNumber,
                foundItem?.dialCode
              );
              setPhoneNumber(validatedPhoneNumber);
              setPhoneFromList(validatedPhoneNumber);
              setCountryCode(foundItem?.dialCode);
            } else {
              setCountryCode("");
              setPhoneNumber(item?.phoneNumber);
              setPhoneFromList(item?.phoneNumber);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Color.plain_white },
    loaderContainer: {
      alignSelf: "center",
      marginTop: mvs(30),
    },
    bodyContainer: {
      flex: 1,
      paddingHorizontal: ms(16),
      paddingVertical: ms(16),
    },
    logoImg: {
      width: ms(40),
      height: ms(40),
    },
    textPassInputStyle: {
      marginTop: vs(10),
    },
    textInputStyle: {
      marginTop: vs(32),
    },
    errorMsg: {
      color: "red",
      marginTop: 10,
    },
    forgotPasswordContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: ms(8),
    },
    forgotPassword: { color: Color.black, fontWeight: "700" },
    btnContainer: {
      marginTop: vs(30),
    },
    signUpContainer: {
      flexDirection: "row",
      marginTop: vs(10),
      alignSelf: "center",
    },
    signUp: {
      color: Color.black,
      fontSize: mvs(14),
      fontWeight: "700",
    },
    dontHaveAnAccount: { fontSize: mvs(14), color: Color.black },
    addPicView: {
      height: hp(12),
      width: hp(12),
      borderRadius: 100,
      borderColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Color.add_pic_grey,
      alignSelf: "center",
      marginVertical: hp(5),
    },
    iconView: {
      height: hp(3),
      width: wp(8),
    },
  });
};

export default SignUpScreen;
