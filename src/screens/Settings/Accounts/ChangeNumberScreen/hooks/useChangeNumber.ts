import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "constants";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ProfileService from "services/ProfileService";
import { ProfileSelectors, resetChangeNumber } from "store/slices/profile";
import { getDataFromAsync } from "utils/LocalStorage";

const useChangeNumber = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const [oldMobileNumber, setOldMobileNumber] = useState<string>("");
  const [newMobileNumber, setNewMobileNumber] = useState<string>("");
  const { loading, numberUpdateStatus, numberUpdateError } = ProfileSelectors();
  const [countryCode, setCountryCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { profileData, changeNumberResp } = ProfileSelectors();

  useEffect(() => {
    if (profileData?.phone_no) {
      setOldMobileNumber(profileData?.phone_no);
    }
  }, [profileData]);

  useEffect(() => {
    console.log(
      "changeNumberRespchangeNumberResp ",
      JSON.stringify(changeNumberResp)
    );
  }, [changeNumberResp]);

  const handleChangePress = async () => {
    if (oldMobileNumber?.length !== 0 && newMobileNumber?.length !== 0) {
      dispatch(resetChangeNumber());
      let reqBody = {
        new_phone_no: countryCode + `${newMobileNumber}`,
        old_phone_no: `${oldMobileNumber}`,
      };
      const res: any = await ProfileService.sendOtpToOldUserService(reqBody);

      if (res?.data?.code === 200) {
        const fcmToken = await getDataFromAsync("fcmToken");
        navigation.navigate("OtpScreen", {
          isMobile: true,
          newMobileNumber: countryCode + newMobileNumber,
          oldMobileNumber: oldMobileNumber,
          fire_base_auth_key: fcmToken || "",
          verificationOtp: res?.data?.data?.otp,
          userDetails: {
            fire_base_auth_key: fcmToken || "",
            newMobileNumber: countryCode + newMobileNumber,
          },
        });
      } else {
        setErrorMsg(res?.data?.message);
      }

      setErrorMsg("");
    } else {
      setErrorMsg("Please enter new mobile number.");
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetChangeNumber());
    };
  }, []);

  return {
    Color,
    oldMobileNumber,
    setOldMobileNumber,
    newMobileNumber,
    setNewMobileNumber,
    errorMsg,
    loading,
    handleChangePress,
    numberUpdateStatus,
    numberUpdateError,
    setCountryCode,
    countryCode,
  };
};

export default useChangeNumber;
