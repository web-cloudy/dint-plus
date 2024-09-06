import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";
import { ms, vs } from "react-native-size-matters";
import {
  getcountryCode,
  getCurrentLocation,
  getPlaceFromLatLng,
  requestLocationPermission,
} from "utils";
import { hp, wp } from "utils/metrix";

interface InputProps {
  placeholder: string;
  value: string | number | any;
  onChangeText: (value: string, code: string) => void;
  errorMessage?: string;
  label?: string;
  doNotEdit?: boolean;
  onPressField?: any;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
}
const PhoneInputField: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  errorMessage,
  label,
  doNotEdit,
  onPressField,
  style,
  inputStyle,
  labelStyle,
}) => {
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [flag, setFlag] = useState("");

  const { theme } = useTheme();
  const Colors = getCurrentTheme(theme || "light");
  const styles = screenStyles(Colors);

  async function getLocation() {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        console.log("latitude&longitude ", latitude, longitude);
        getAddressFromLocation(latitude.toString(), longitude.toString());
      } catch (error: any) {
        Alert.alert("Error getting location", error);
      }
    }
  }

  const getAddressFromLocation = useCallback(
    async (lat: string, lng: string) => {
      const address = await getPlaceFromLatLng(lat, lng);
      console.log("address ", address);
      setCountryCode(getcountryCode(address?.countryFullName)?.code || "");
      setFlag(getcountryCode(address?.countryFullName)?.flag || "");
      // setSearchMessage(address?.countryFullName || "");
    },
    [searchMessage]
  );

  useEffect(() => {
    getLocation();
  }, []);

  const PickerView = useCallback(() => {
    console.log(searchMessage);

    return (
      show && (
        <CountryPicker
          show={show}
          lang="en"
          pickerButtonOnPress={(item) => {
            setCountryCode(item.dial_code);
            setFlag(item?.flag);
            setShow(false);
            setSearchMessage("");
          }}
          initialState={searchMessage}
          searchMessage={searchMessage}
          onBackdropPress={() => setShow(false)}
          onRequestClose={() => setShow(false)}
          style={{
            modal: styles.countryCodeModal,
            textInput: styles.codeInputView,
            countryButtonStyles: styles.countryButtonStyle,
            countryName: styles.countryNameText,
            dialCode: styles.dialCodeStyle,
            searchMessageText: styles.searchMessageText,
            line: styles.lineView,
          }}
        />
      )
    );
  }, [searchMessage, show]);

  return (
    <TouchableOpacity
      onPress={onPressField}
      activeOpacity={1.0}
      style={styles.mainContainer}
    >
      <Text style={[{ color: Colors.black }, labelStyle && labelStyle]}>
        {label}
      </Text>
      <View style={[styles.inputContainer, style && style]}>
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={() => {
            !doNotEdit && setShow(true);
          }}
          style={styles.lineViewForDialCode}
        >
          <Text
            onPress={() => {
              !doNotEdit && setShow(true);
            }}
            style={styles.codeText}
          >
            {flag} {countryCode}
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={(text: string) => onChangeText(text, countryCode)}
          style={[styles.input, inputStyle && inputStyle]}
          keyboardType={"number-pad"}
          autoCapitalize="none"
          maxLength={15}
          placeholderTextColor={Colors.placeholder}
          editable={doNotEdit ? false : true}
        />
      </View>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <PickerView />
    </TouchableOpacity>
  );
};

export default PhoneInputField;
const screenStyles = (Colors: any) => {
  return StyleSheet.create({
    mainContainer: {
      marginTop: vs(10),
    },
    inputContainer: {
      paddingHorizontal: ms(16),
      paddingVertical: ms(8),
      borderWidth: 1,
      borderColor:
        Colors.theme === "dark" ? Colors.input_background : "#353535",
      borderRadius: ms(24),
      marginVertical: ms(8),
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.input_background,
    },
    input: {
      color: Colors.black,
      flex: 1,
      paddingVertical: 0,
      paddingLeft: wp(2),
    },
    iconStyle: {
      height: hp(2),
      width: hp(2),
    },
    errorText: {
      fontSize: hp(1.5),
      color: Colors.error,
      marginLeft: wp(3.5),
      marginVertical: hp(1),
    },
    countryCodeModal: {
      height: hp(50),
      backgroundColor: Colors.input_background,
    },
    codeText: {
      fontSize: hp(1.6),
      color: Colors.black,
    },
    codeInputView: {
      height: hp(5),
      color: Colors?.theme === "light" ? Colors.black : Colors.white,
      paddingHorizontal: wp(5),
      backgroundColor:
        Colors?.theme === "light" ? Colors.arrow_icon : Colors.black,
    },
    countryButtonStyle: {
      height: hp(5.2),
      backgroundColor:
        Colors?.theme === "light" ? Colors.arrow_icon : Colors.white,
    },
    countryNameText: {
      color: Colors.black,
      fontSize: hp(1.6),
    },
    dialCodeStyle: {
      color: Colors?.theme === "light" ? Colors.black : Colors.primary,
      fontSize: hp(1.6),
    },
    searchMessageText: {
      color: Colors.error,
    },
    lineView: {
      backgroundColor: Colors.primary,
      width: wp(100),
    },
    labelStyle: {
      fontSize: hp(1.6),
      color: Colors.black,
      marginLeft: wp(3.5),
      marginBottom: hp(1),
    },
    lineViewForDialCode: {
      borderRightWidth: 1,
      borderColor: Colors.grey,
      paddingRight: wp(2),
      alignItems: "center",
      justifyContent: "center",
    },
  });
};
