import { useNavigation } from "@react-navigation/native";
import { showToastError } from "components";
import { ROUTES } from "constants";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import ProfileService from "services/ProfileService";
import { UserSelectors } from "store/slices/users";

const useDeleteAccount = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const { userData } = UserSelectors();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDeleteAccountPress = () => {
    setIsLoading(true);
    Alert.alert(
      "Are you sure you want to delete account?",
      "If yes, then OTP will send to registered mobile number.",
      [
        {
          text: "No",
          onPress: () => setIsLoading(false),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: handleDeleteYesPress,
        },
      ]
    );
  };

  const handleDeleteYesPress = async () => {
    let reqBody = {
      phone_no: `+1${mobileNumber}`,
    };

    if (mobileNumber.includes("+1")) {
      reqBody = {
        phone_no: `${mobileNumber}`,
      };
    }
    const res: any = await ProfileService.sendOtpToNewUserService(reqBody);
    if (res?.data?.code === 200) {
      setIsLoading(false);
      navigation.navigate(ROUTES.OtpScreen, {
        isDeleteAccount: true,
        mobileNumber: mobileNumber,
        verificationOtp: res?.data?.data?.otp,
      });
    } else {
      showToastError("Something went wrong");
    }
    setIsLoading(false);
  };

  const handleChangeNumberPress = () => {
    navigation.navigate(ROUTES.ChangeNumberScreen);
  };

  useEffect(() => {
    if (userData) {
      setMobileNumber(userData?.data?.phone_no);
    }
  }, [userData]);

  return {
    Color,
    isLoading,
    mobileNumber,
    setMobileNumber,
    handleDeleteAccountPress,
    handleChangeNumberPress,
  };
};

export default useDeleteAccount;
