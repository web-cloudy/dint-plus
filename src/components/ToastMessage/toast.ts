import Toast from "react-native-toast-message";

export const showToastError = (message: string) => {
  Toast?.show({
    type: "ErrorToast",
    props: message,
  });
};

export const showToastSuccess = (message: string) => {
  Toast?.show({
    props: message,
    type: "SuccessToast",
  });
};
