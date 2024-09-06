import { AddressInfo, AddressInfoType } from "../../../types/event";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { hp } from "utils/metrix";
import { ms } from "react-native-size-matters";

interface ButtonProps {
  onSelectAddress: (data: AddressInfoType) => void;
  value?: string;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: any;
}

export const AddressInputField = ({
  onSelectAddress,
  value,
  containerStyle,
  onPress,
}: ButtonProps) => {
  const { theme } = useTheme();
  const Colors = getCurrentTheme(theme || "light");
  const styles = screenStyles(Colors);
  const GOOGLE_API_KEY = "AIzaSyCmI0Rfe_sLW3KDfsFwhFQRDdMDJSojwn0";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1.0}
      style={[styles.container, containerStyle]}
    >
      {onPress ? (
        <Text style={{ fontSize: hp(1.5), width: "100%", color: Colors.black }}>
          {value || "Location"}
        </Text>
      ) : (
        <GooglePlacesAutocomplete
          keyboardShouldPersistTaps="handled"
          onPress={(data: any, details: any = null) => {
            const addressComponents = details.address_components;
            console.log(details);
            let addressData: AddressInfoType = AddressInfo;
            // Loop through the address components to find the desired components
            addressComponents.forEach((component: any) => {
              if (component.types.includes("street_number")) {
                addressData.street += component.long_name + " ";
              } else if (component.types.includes("premise")) {
                addressData.street += component.long_name + " ";
              } else if (component.types.includes("route")) {
                addressData.street += component.long_name;
              } else if (component.types.includes("sublocality")) {
                addressData.street += " " + component.long_name;
              } else if (component.types.includes("locality")) {
                addressData.city = component.long_name;
              } else if (
                component.types.includes("administrative_area_level_1")
              ) {
                addressData.state = component.long_name;
              } else if (component.types.includes("postal_code")) {
                addressData.pincode = component.long_name;
              } else if (component.types.includes("country")) {
                addressData.country = component.long_name;
              }
            });
            // Extract latitude and longitude
            addressData.latitude = details.geometry.location.lat.toString();
            addressData.longitude = details.geometry.location.lng.toString();
            addressData.formattedAddress = details?.formatted_address || "";
            onSelectAddress(addressData);
          }}
          textInputProps={{
            placeholderTextColor: Colors.placeholder,
            style: {
              fontSize: hp(1.5),
              width: "100%",
              color: Colors.black,
            },
          }}
          placeholder={value || "Location"}
          styles={{
            textInputContainer: styles.inputContainer,
            textInput: styles.inputText,
          }}
          enablePoweredByContainer={false}
          listViewDisplayed="auto"
          fetchDetails={true}
          filterReverseGeocodingByTypes={[
            "locality",
            "administrative_area_level_3",
          ]}
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
          }}
          disableScroll={true}
          onFail={(error: any) => console.error("Error:", error)}
        />
      )}
    </TouchableOpacity>
  );
};

const screenStyles = (Colors: any) => {
  return StyleSheet.create({
    container: {
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
      width: "100%",
    },
    inputContainer: {
      height: ms(18),
      width: "100%",
      backgroundColor: Colors.wild_sand,
      borderRadius: 8,
    },

    inputText: {
      fontSize: hp(1.9),
      textAlign: "left",
      color: Colors.black,
      height: ms(18),
      width: "100%",
      borderRadius: 8,
      backgroundColor: Colors.wild_sand,
      paddingHorizontal: 0,
    },
  });
};
