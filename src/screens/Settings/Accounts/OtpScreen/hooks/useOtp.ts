import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { showToastError, showToastSuccess } from "components";
import { ROUTES } from "constants";
import {
  savetoken,
  setCurrentInstanceSocket,
  setSocketConnection,
} from "constants/chatSocket";
import { getCurrentTheme } from "constants/Colors";
import { useAuth } from "contexts/AuthContext";
import { useTheme } from "contexts/ThemeContext";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  changeEmailAPI,
  changeNumberAPI,
  ProfileSelectors,
  resetChangeNumber,
  resetProfileData,
  resetVerifyOtpResp,
  verifyOtpAPI,
} from "store/slices/profile";
import {
  loginUserAPI,
  resetLoginData,
  resetSignUpData,
  signUpUserAPI,
  UserSelectors,
} from "store/slices/users";
import { OtpScreenParams } from "types/route";
import { removeDataInAsync, storeDataInAsync } from "utils/LocalStorage";

type OtpScreenRouteProp = RouteProp<{ params: OtpScreenParams }, "params">;

const useOtp = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const route: OtpScreenRouteProp = useRoute();
  const [code, setCode] = useState<string>();
  const { loading, numberUpdateStatus, numberUpdateError } = ProfileSelectors();
  const { loading: userLoading } = UserSelectors();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const dispatch = useDispatch();
  const isEmail = route.params?.isEmail;
  const isMobile = route.params?.isMobile;
  const isSignUp = route.params?.isSignUp;
  const isLogin = route.params?.isLogin;
  const isDeleteAccount = route.params?.isDeleteAccount;
  const userDetails = route.params?.userDetails;
  const verificationOtp = route.params?.verificationOtp;
  const { userId, setIsLoggedIn } = useAuth();
  const { signUpError, userData } = UserSelectors();
  const { verifyOtpResp, otpSendError } = ProfileSelectors();

  const { setUserId } = useAuth();

  let otpSendAt = isMobile
    ? route.params?.newMobileNumber
    : isSignUp
    ? userDetails?.phone_no
    : isDeleteAccount
    ? route.params?.mobileNumber
    : isLogin
    ? userDetails?.phone_no
    : "";

  useEffect(() => {
    if (verifyOtpResp?.code === 200) {
      if (isEmail) {
        const reqBody = {
          new_email: route.params?.newEmail,
          old_email: route.params?.currentEmail,
        };
        dispatch(changeEmailAPI(reqBody));
      } else if (isMobile) {
        const reqBody = {
          new_phone_no: route.params?.newMobileNumber,
          old_phone_no: route.params?.oldMobileNumber,
        };
        dispatch(changeNumberAPI(reqBody));
        showToastSuccess(numberUpdateStatus);
        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.Account }],
        });
        setErrorMsg("");
      }
      dispatch(resetVerifyOtpResp());
    }
  }, [verifyOtpResp]);
  useEffect(() => {
    if (otpSendError?.length > 0) {
      setErrorMsg(otpSendError);
      dispatch(resetVerifyOtpResp());
    }
  }, [otpSendError]);
  const handleSubmitPress = async () => {
    setErrorMsg("");
    if (code && code?.length !== 0) {
      dispatch(resetChangeNumber());
      const reqBody = {
        id: userId,
        otp: parseInt(code!),
      };
      if (isSignUp) {
        setIsLoading(true);
        setTimeout(() => {
          if (code.toString() === verificationOtp?.toString()) {
            dispatch(
              signUpUserAPI({
                ...userDetails,
              })
            );
          } else {
            setErrorMsg("Invalid OTP. Please try again.");
            return;
          }
        }, 2000);
        setIsLoading(false);
        return;
      } else if (isDeleteAccount) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        if (code.toString() === verificationOtp?.toString()) {
          const resultAction = await dispatch(deleteUserAPI());
          const deleteAccountData = resultAction.payload;
          if (deleteAccountData?.code === 200) {
            dispatch(resetLoginData());
            removeDataInAsync("token");
            removeDataInAsync("userId");
            showToastSuccess("Account deleted successfully.");
            setIsLoggedIn(false)
            navigation.reset({
              index: 0,
              routes: [{ name: ROUTES.Login }],
            });
          } else {
            showToastError("Failed to delete account. Please try again.");
          }
        } else {
          setErrorMsg("Invalid OTP. Please try again.");
          return;
        }
        return;
      } else if (isLogin) {
        setIsLoading(true);
        setTimeout(() => {
          if (code.toString() === verificationOtp?.toString()) {
            connect(userData?.data?.token);
            dispatch(resetProfileData());
            dispatch(resetSignUpData());
            setIsLoggedIn(true)
            navigation.reset({ index: 0, routes: [{ name: "Main" }] });
          } else {
            setErrorMsg("Invalid OTP. Please try again.");
            return;
          }
        }, 2000);
        setIsLoading(false);
        return;
      } else {
        dispatch(verifyOtpAPI(reqBody));
      }
    } else {
      setErrorMsg("Please enter valid OTP");
    }
  };

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
    if (userData && isSignUp) {
      setUserId(userData?.data?.id);
      storeDataInAsync("token", userData?.data?.token);
      storeDataInAsync("userId", userData?.data?.id + "");
      storeDataInAsync("email", userData?.data?.email + "");
      savetoken(userData?.data?.token);
      connect(userData?.data?.token);
      setIsLoggedIn(true)
      navigation.reset({ index: 0, routes: [{ name: "Main" }] });
      dispatch(resetProfileData());
      dispatch(resetSignUpData());
    }
    // return () => dispatch(resetLoginData());
  }, [userData]);

  useEffect(() => {
    return () => {
      dispatch(resetChangeNumber());
    };
  }, []);

  return {
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
  };
};

export default useOtp;
