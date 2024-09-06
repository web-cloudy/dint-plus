import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Modal, Pressable, Alert } from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { ms, mvs } from "react-native-size-matters";
import { LineDivider, Loader, TextInput } from "components/atoms";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import {
  getVerificationStatusRequest,
  ProfileSelectors,
  resetVerificationOtpResp,
  updateVerificationOtpRequest,
  updateVerifiedWithOtp,
} from "store/slices/profile";
import Toast from "react-native-toast-message";
import useAppDispatch from "hooks/useAppDispatch";

const AuthenticationPopup = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);

  const { verificationCodeResp, setVerificationOTPResp, verifiedWithOtp } =
    ProfileSelectors();

  useEffect(() => {
    dispatch(getVerificationStatusRequest());
  }, []);

  useEffect(() => {
    if (setVerificationOTPResp?.code === 200) {
      Toast.show({
        type: "success",
        position: "top",
        text2: "Turned off",
        visibilityTime: 5500,
      });
      dispatch(resetVerificationOtpResp());
      dispatch(getVerificationStatusRequest());
      dispatch(updateVerifiedWithOtp(false));
    }
  }, [setVerificationOTPResp]);

  return (
    <Modal
      visible={verifiedWithOtp}
      onRequestClose={() => dispatch(updateVerifiedWithOtp(false))}
      transparent={true}
    >
      <Pressable style={styles.outerContainer}>
        {verifiedWithOtp && loading && <Loader visible={loading} />}
        <View style={styles.innerContainer}>
          <Text style={styles.selectImage}>
            Enter your two-step verification PIN
          </Text>
          <LineDivider />
          <TextInput
            value={code}
            placeholder={"*** ***"}
            onChangeText={(code: string) => {
              setCode(code);
              if (code?.length === 6) {
                if (code === verificationCodeResp?.data?.verification_pin) {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);

                    dispatch(updateVerifiedWithOtp(false));
                  }, 500);
                } else {
                  setErr(false);
                }
              }
            }}
            keyboardType="phone-pad"
            inputViewStyle={{
              width: wp(70),
              alignItems: "center",
              alignSelf: "center",
              backgroundColor: "transparent",
              borderColor: "transparent",
              borderBottomColor: err ? Color.red : Color.primary,
              borderBottomWidth: 1,
              borderRadius: 0,
            }}
            inputStyle={{ textAlign: "center", fontSize: hp(3) }}
          />
          <Text
            onPress={() => {
              Alert.alert("Forgot PIN", "Turn off two-step verification ?", [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Turn Off",
                  onPress: async () => {
                    let params = {
                      is_pin_set: false,
                    };
                    dispatch(updateVerificationOtpRequest(params));
                  },
                },
              ]);
            }}
            style={styles.cancel}
          >
            You will be asked for it periodically to help you remeber it.
            <Text style={{ color: Color.primary }}> Forgot PIN?</Text>
          </Text>
        </View>
      </Pressable>
    </Modal>
  );
};

export default AuthenticationPopup;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff30",
    },

    outerContainer: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: Color.grey_transparent,
    },
    innerContainer: {
      borderRadius: ms(20),
      backgroundColor: Color.white,
      width: wp(90),
      alignSelf: "center",
      padding: wp(5),
    },
    selectImage: {
      color: Color.black,
      fontSize: mvs(16),
      fontWeight: "600",
      paddingBottom: mvs(16),
      textAlign: "center",
    },

    cancel: {
      color: Color.black,
      fontSize: mvs(16),
      fontWeight: "500",
      paddingVertical: mvs(15),
      textAlign: "center",
    },

    save: {
      color: Color.grey,
      fontSize: mvs(20),
      fontWeight: "500",
      textAlign: "center",
    },

    modeText: {
      color: Color.black,
      fontSize: mvs(15),
      fontWeight: "400",
      textAlign: "left",
    },
    descText: {
      color: Color.grey,
      fontSize: mvs(14),
      fontWeight: "500",
      textAlign: "left",
    },
    saveBtn: {
      borderRadius: 10,
      marginHorizontal: ms(25),
      marginTop: ms(25),
    },
  });
};
