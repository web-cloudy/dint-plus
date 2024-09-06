import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "constants";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import {
  ProfileSelectors,
  resetChangeEmail,
  updateProfileAPI,
} from "store/slices/profile";
import { validateEmail } from "utils";
import { getDataFromAsync, storeDataInAsync } from "utils/LocalStorage";

const useChangeEmail = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const navigation = useNavigation();
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const { loading, emailUpdateStatus, emailUpdateError } = ProfileSelectors();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const dispatch = useDispatch();
  const { profileData } = ProfileSelectors();

  async function checkEmail() {
    let email = await getDataFromAsync("email");
    email != "null" && setCurrentEmail(email || "");
  }

  useEffect(() => {
    checkEmail();
  }, []);

  const handleChangePress = () => {
    if (currentEmail) {
      if (currentEmail?.length === 0 && newEmail?.length === 0) {
        setErrorMsg("Please enter current & new email both.");
        return;
      } else if (!validateEmail(currentEmail) && !validateEmail(newEmail)) {
        setErrorMsg("Please enter valid email.");
        return;
      }
      if (
        currentEmail?.length !== 0 &&
        newEmail?.length !== 0 &&
        validateEmail(currentEmail) &&
        validateEmail(newEmail)
      ) {
        Alert.alert("Feature is in progress");
        // navigation.navigate(ROUTES.OtpScreen, {
        //   isEmail: true,
        //   newEmail: newEmail,
        //   currentEmail: currentEmail,
        // });
        setErrorMsg("");
      }
    } else {
      if (!validateEmail(currentEmail) && !validateEmail(newEmail)) {
        setErrorMsg("Please enter valid email.");
        return;
      } else {
        setErrorMsg("");
        const obj = { email: newEmail };
        dispatch(updateProfileAPI(obj));
      }
    }
  };

  async function checkupdatedData() {
    let email = await getDataFromAsync("email");
    if (profileData?.email?.length > 0 && email === "null") {
      dispatch(resetChangeEmail());
      storeDataInAsync("email", newEmail);
      navigation?.goBack();
    }
  }

  useEffect(() => {
    checkupdatedData();
  }, [emailUpdateError, profileData]);

  useEffect(() => {
    return () => {
      dispatch(resetChangeEmail());
    };
  }, []);

  return {
    Color,
    currentEmail,
    setCurrentEmail,
    newEmail,
    setNewEmail,
    errorMsg,
    loading,
    handleChangePress,
    emailUpdateStatus,
    emailUpdateError,
  };
};

export default useChangeEmail;
