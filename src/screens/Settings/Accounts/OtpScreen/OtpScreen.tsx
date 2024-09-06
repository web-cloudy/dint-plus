import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { HeaderWithTitle } from "components/molecules";
import { useOtp } from "./hooks";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { ms, mvs } from "react-native-size-matters";
import { Button } from "components/atoms";

const OtpScreen = () => {
  const {
    Color,
    isLoading,
    loading,
    userLoading,
    errorMsg,
    setCode,
    otpSendAt,
    handleSubmitPress,
    numberUpdateStatus,
    numberUpdateError,
    signUpError,
  } = useOtp();
  const styles = screenStyles(Color);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="OTP" blackBar />
      <View style={styles.bodyContainer}>
        {/* TODO:{""} */}
        <View style={styles.otpSendContainer}>
          <Text style={styles.otpSendText}>{`OTP Send to ${otpSendAt}`}</Text>
        </View>
        <View style={styles.otpInputContainer}>
          <OTPInputView
            pinCount={6}
            editable={true}
            selectionColor={Color.primaryDark}
            autoFocusOnLoad
            onCodeFilled={(code) => setCode(code)}
            codeInputHighlightStyle={styles.codeInputHighlight}
            codeInputFieldStyle={styles.codeInputField}
            placeholderTextColor={Color.primaryDark}
          />
        </View>

        {/* <Text style={styles.successMsg}>{numberUpdateStatus}</Text> */}
        <Text style={styles.errorMsg}>
          {errorMsg
            ? errorMsg
            : numberUpdateError
            ? numberUpdateError
            : signUpError
            ? signUpError?.message
            : ""}
        </Text>
        <View style={styles.changeBtnContainer}>
          {isLoading || loading || userLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color={Color.primary} size={30} />
            </View>
          ) : (
            <Button
              text="Submit"
              onPress={handleSubmitPress}
              textStyle={styles.change}
              btnStyle={styles.changeBtn}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OtpScreen;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    otpSendText: {
      alignSelf: "center",
      fontSize: ms(16),
      color: Color.success_color,
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
      borderColor: Color.primaryDark,
      borderWidth: 2,
      borderRadius: ms(10),
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
