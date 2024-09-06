import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { HeaderWithTitle } from "components/molecules";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { ms, mvs } from "react-native-size-matters";
import { Button, Loader } from "components/atoms";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import useAppDispatch from "hooks/useAppDispatch";
import {
  getVerificationStatusRequest,
  ProfileSelectors,
  resetVerificationOtpResp,
  updateVerificationOtpRequest,
  updateVerifiedWithOtp,
} from "store/slices/profile";
import Toast from "react-native-toast-message";

const OtpTwoStepVerification = (props: any) => {
  const { navigation, route } = props;
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [code, setCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [showConfirmCode, setShowConfirmCode] = useState(false);

  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const number = route?.params?.num;
  const toCreate = route?.params?.type === "create" ? true : false;
  const dispatch = useAppDispatch();
  const { loading, setVerificationOTPResp } = ProfileSelectors();

  function handleSubmitPress() {
    setErr(false);
    setErrMsg("");
    if (code?.length < 6) {
      setErr(true);
    } else {
      if (!showConfirmCode) {
        setShowConfirmCode(true);
      } else if (showConfirmCode) {
        if (confirmCode?.length < 6) {
          setErr(true);
        } else {
          if (code === confirmCode) {
            let params = {
              verification_pin: code,
            };
            dispatch(updateVerificationOtpRequest(params));
          } else {
            setErr(true);

            setErrMsg("PIN not matched");
          }
        }
      }
    }
  }

  useEffect(() => {
    if (setVerificationOTPResp?.code === 200) {
      Toast.show({
        type: "success",
        position: "top",
        text2: setVerificationOTPResp?.message,
        visibilityTime: 5500,
      });
      dispatch(resetVerificationOtpResp());
      dispatch(getVerificationStatusRequest());
      navigation.goBack();
      setTimeout(() => {
        dispatch(updateVerifiedWithOtp(true));
      }, 1500);
    }
    console.log("setVerificationOTPResp ", setVerificationOTPResp);
  }, [setVerificationOTPResp]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle
        title="Two Step Verification"
        blackBar
        onPressBack={() => {
          if (showConfirmCode) {
            setShowConfirmCode(false);
            setConfirmCode("");
            setErr(false);
            setErrMsg("");
          } else {
            navigation?.goBack();
          }
        }}
      />
      {loading && <Loader visible={loading} />}
      <View style={styles.bodyContainer}>
        <View style={styles.otpSendContainer}>
          <Text style={styles.otpSendText}>Enter a 6-digit PIN</Text>
        </View>
        <View style={styles.otpInputContainer}>
          {showConfirmCode ? (
            <>
              <OTPInputView
                key={2}
                pinCount={6}
                editable={true}
                selectionColor={Color.primaryDark}
                autoFocusOnLoad
                onCodeFilled={(text) => {
                  setConfirmCode(text);
                }}
                codeInputHighlightStyle={styles.codeInputHighlight}
                codeInputFieldStyle={[
                  styles.codeInputField,
                  { borderColor: err ? Color?.red : Color.primaryDark },
                ]}
                placeholderTextColor={Color.primaryDark}
              />

              <Text
                style={[
                  styles.otpSendText,
                  { color: errMsg ? Color.red : Color.primary },
                ]}
              >
                {errMsg ? errMsg : "Confirm OTP"}
              </Text>
            </>
          ) : (
            <OTPInputView
              key={1}
              pinCount={6}
              editable={true}
              selectionColor={Color.primaryDark}
              autoFocusOnLoad
              onCodeFilled={(code) => {
                setCode(code);
              }}
              codeInputHighlightStyle={styles.codeInputHighlight}
              codeInputFieldStyle={[
                styles.codeInputField,
                { borderColor: err ? Color?.red : Color.primaryDark },
              ]}
              placeholderTextColor={Color.primaryDark}
            />
          )}
        </View>

        <Text style={styles.errorMsg}></Text>
        <View style={styles.changeBtnContainer}>
          <Button
            text="Next"
            onPress={handleSubmitPress}
            textStyle={styles.change}
            btnStyle={styles.changeBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OtpTwoStepVerification;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    otpSendText: {
      alignSelf: "center",
      fontSize: ms(16),
      color: Color.primary,
    },
    otpSendContainer: {
      marginTop: mvs(20),
      alignSelf: "center",
    },
    successMsg: {
      alignSelf: "center",
      color: Color.primary,
      marginTop: 10,
    },
    errorMsg: {
      alignSelf: "center",
      color: "red",
      marginTop: 10,
    },
    change: {
      color: Color.white,
      fontSize: mvs(20),
      fontWeight: "500",
      textAlign: "center",
    },
    changeBtn: {
      borderRadius: 10,
      marginHorizontal: ms(25),
      marginTop: ms(25),
      backgroundColor: Color.primaryDark,
    },
    loaderContainer: {
      alignSelf: "center",
      marginTop: mvs(30),
    },
    changeBtnContainer: {
      marginTop: mvs(40),
    },
    codeInputField: {
      borderWidth: 2,
      borderRadius: 100,
      height: mvs(40),
      width: ms(40),
      color: Color.black,
      fontWeight: "bold",
      textAlign: "center",
      fontSize: ms(28),
      paddingBottom: mvs(3),
    },
    codeInputHighlight: {
      color: Color.primaryDark,
    },
    otpInputContainer: {
      height: "50%",
      paddingTop: mvs(100),
      width: "80%",
      alignSelf: "center",
    },
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    bodyContainer: {
      flex: 1,
    },
  });
};
