import React, { FunctionComponent, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AccountItem, HeaderWithTitle } from "components/molecules";
import useAppDispatch from "hooks/useAppDispatch";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getVerificationStatusRequest,
  ProfileSelectors,
  resetVerificationOtpResp,
  updateVerificationOtpRequest,
  updateVerifiedWithOtp,
} from "store/slices/profile";
import Toast from "react-native-toast-message";
import { Loader } from "components/atoms";

type Props = Record<string, never>;

const TwoStepVerification: FunctionComponent<Props> = ({}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const dispatch = useAppDispatch();
  const { verificationCodeResp, setVerificationOTPResp, loading } =
    ProfileSelectors();
  console.log("setVerificationOTPResp ", setVerificationOTPResp);

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
      dispatch(updateVerifiedWithOtp(false));
      dispatch(resetVerificationOtpResp());
      dispatch(getVerificationStatusRequest());
    }
  }, [setVerificationOTPResp]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="Two Step Verification" blackBar />
      {loading && <Loader visible={loading} />}

      <View style={styles.topView}>
        <Text style={styles.rateTxt}>*</Text>
        <Text style={styles.rateTxt}>*</Text>
        <Text style={styles.rateTxt}>*</Text>
      </View>
      <Text style={styles.decText}>
        Two-step verification is on. You'll need to enter your PIN if you
        register your phone number on Dint plus again.
        <Text style={styles.learnText}>
          {"  "}
          Learn more
        </Text>
      </Text>
      <AccountItem
        title={
          verificationCodeResp?.data?.is_pin_set === true
            ? "Turn off"
            : "Turn on"
        }
        onPress={() => {
          if (verificationCodeResp?.data?.is_pin_set === true) {
            let params = {
              is_pin_set: false,
            };
            dispatch(updateVerificationOtpRequest(params));
          } else {
            navigation.navigate("OtpTwoStepVerification", {
              type: "create",
            });
          }
        }}
        titleStyle={{ color: "red" }}
        style={{ borderBottomColor: Color.border, borderBottomWidth: 0.4 }}
      />
      {verificationCodeResp?.data?.is_pin_set === true && (
        <AccountItem
          title={"Change pin"}
          onPress={() => {
            navigation.navigate("OtpTwoStepVerification", { type: "create" });
          }}
          titleStyle={{ color: Color.primary }}
        />
      )}
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },

    decText: {
      color: Color.black,
      fontSize: hp(1.7),
      fontWeight: "500",
      paddingHorizontal: wp(5),
      marginBottom: hp(3),
    },
    learnText: {
      color: Color.primary,
      fontSize: hp(1.7),
      fontWeight: "700",
    },
    topView: {
      backgroundColor: Color.primary,
      borderRadius: 13,
      width: wp(33),
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: hp(3),
      alignSelf: "center",
      flexDirection: "row",
      paddingHorizontal: wp(5),
      height: hp(4.6),
    },
    rateTxt: {
      color: Color.choc_black,
      fontSize: hp(6),
      alignSelf: "center",
    },
  });
};

export default TwoStepVerification;
