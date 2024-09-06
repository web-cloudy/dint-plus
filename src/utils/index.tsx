import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import {
  Platform,
  Alert,
  Settings,
  Linking,
  PermissionsAndroid,
} from "react-native";
import { AddressInfo, AddressInfoType } from "types/event";

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const getRandomNum = () => {
  return Math.floor(Math.random() * 100000 + 999999);
};

interface Coordinates {
  latitude: number;
  longitude: number;
  heading?: number | null;
}

export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const cords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading,
        };
        resolve(cords);
      },
      (error) => {
        reject(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    try {
      const permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      if (!permission) {
        Alert.alert("Location permission not available on this platform.");
        return false;
      }

      const result = await check(permission);
      console.log("🚀 ~ requestLocationPermission ~ result:", result);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert("Location services are not available on this device.");
          return false;
        case RESULTS.DENIED:
          // openSettings();
          const requestResult = await request(
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          );
          return requestResult === RESULTS.GRANTED;
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          Alert.alert(
            "Location services are blocked. Please enable them in settings."
          );
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.error("Error requesting location permission", error);
      return false;
    }
  } else {
    try {
      const permission = await Geolocation.requestAuthorization("whenInUse");
      console.log(permission);

      if (!permission) {
        Alert.alert("Location permission not available on this platform.");
        return false;
      }

      switch (permission) {
        case "disabled":
          openSettings();

          return false;
        case "denied":
          openSettings();

          return false;
        case "restricted":
          openSettings();

          return false;

        case RESULTS.GRANTED:
          return true;

        default:
          return false;
      }
    } catch (error) {
      console.error("Error requesting location permission", error);
      return false;
    }
  }
};

export const requestLocationPermissionForNearbyPeople =
  async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      try {
        const permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

        if (!permission) {
          Alert.alert("Location permission not available on this platform.");
          return false;
        }

        const result = await check(permission);
        console.log("🚀 ~ requestLocationPermission ~ result:", result);

        switch (result) {
          case RESULTS.UNAVAILABLE:
            Alert.alert("Location services are not available on this device.");
            return false;
          case RESULTS.DENIED:
            openSettingsForNearbyPeople();
          // const requestResult = await request(
          //   PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          // );
          // return requestResult === RESULTS.GRANTED;
          case RESULTS.GRANTED:
            return true;
          case RESULTS.BLOCKED:
            Alert.alert(
              "Location services are blocked. Please enable them in settings."
            );
            return false;
          default:
            return false;
        }
      } catch (error) {
        console.error("Error requesting location permission", error);
        return false;
      }
    } else {
      try {
        const permission = await Geolocation.requestAuthorization("whenInUse");
        console.log(permission);

        if (!permission) {
          Alert.alert("Location permission not available on this platform.");
          return false;
        }

        switch (permission) {
          case "disabled":
            openSettingsForNearbyPeople();

            return false;
          case "denied":
            openSettingsForNearbyPeople();

            return false;
          case "restricted":
            openSettingsForNearbyPeople();

            return false;

          case RESULTS.GRANTED:
            return true;

          default:
            return false;
        }
      } catch (error) {
        console.error("Error requesting location permission", error);
        return false;
      }
    }
  };

export function openSettings() {
  Alert.alert(
    "Location Services Disabled",
    "To use this feature, please enable location services for our app in your device settings.",
    [
      {
        text: "OK",
        onPress: () => {
          const url = "app-settings:";
          Linking.canOpenURL(url).then((supported) => {
            if (supported) {
              Linking.openURL(url);
            } else {
              console.log("Cannot open Settings app");
            }
          });
        },
      },
    ],
    { cancelable: false }
  );
}

export function openSettingsForNearbyPeople() {
  Alert.alert(
    "Location Services Disabled",
    "To use this feature, please enable location services for our app in your device settings.",
    [
      {
        text: "OK",
        onPress: () => {
          if (Platform.OS == "ios") {
            const url = "app-settings:";
            Linking.canOpenURL(url).then((supported) => {
              if (supported) {
                Linking.openURL(url);
              } else {
                console.log("Cannot open Settings app");
              }
            });
          } else {
            Linking.openSettings();
          }
        },
      },
    ],
    { cancelable: false }
  );
}

export const requestPhoneNumPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: "Phone State Permission",
          message: "This app needs read your phone number ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return false;
  }
};

export const checkContactPermissionAndroid = () => {
  request(PERMISSIONS.ANDROID.READ_CONTACTS)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            "This feature is not available (on this device / in this context)"
          );
          return false;
        case RESULTS.DENIED:
          console.log(
            "The permission has not been requested / is denied but requestable"
          );
          return false;
        case RESULTS.LIMITED:
          console.log("The permission is limited: some actions are possible");
          return false;
        case RESULTS.GRANTED:
          console.log("The permission is granted");
          return true;
        case RESULTS.BLOCKED:
          console.log("The permission is denied and not requestable anymore");
          return false;
      }
    })
    .catch((error) => {
      return false;
    });
};

export const checkContactPermissionIOS = async () => {
  try {
    let result = await request(PERMISSIONS.IOS.CONTACTS);
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log(
          "This feature is not available (on this device / in this context)"
        );
        return false;
      case RESULTS.DENIED:
        console.log(
          "The permission has not been requested / is denied but requestable"
        );
        return false;
      case RESULTS.LIMITED:
        console.log("The permission is limited: some actions are possible");
        break;
      case RESULTS.GRANTED:
        console.log("The permission is granted");
        return true;
      case RESULTS.BLOCKED:
        console.log("The permission is denied and not requestable anymore");
        return false;
    }
  } catch (err) {
    return false;
  }
};

export function openSettingsForPhoneState() {
  Alert.alert(
    "Phone state Permission Disabled",
    "To use this feature, please enable Phone state Permission in your device settings.",
    [
      {
        text: "OK",
        onPress: () => {
          const url = "app-settings:";
          Linking.canOpenURL(url).then((supported) => {
            if (supported) {
              Linking.openURL(url);
            } else {
              Linking.openSettings();
            }
          });
        },
      },
    ],
    { cancelable: false }
  );
}

export const displayOverAppPermission = () => {
  if (Platform.OS === "android") {
    Alert.alert(
      "Permission required",
      "App require permission to display over app, Click 'Open Settings' and allow.",
      [
        {
          text: "Ask me later",
          onPress: () => console.log("Ask me later pressed"),
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Open Settings",
          onPress: () =>
            Linking.sendIntent(
              "android.settings.action.MANAGE_OVERLAY_PERMISSION",
              [{ key: "package:", value: "com.dint.society" }]
            ),
        },
      ]
    );
  }
};
export const checkCodeExistence = (code: string) => {
  let codelist = require("../assets/json/countryCode.json");
  const foundItem = codelist?.find((item: any) => item.code === code);
  if (foundItem) {
    return { exists: true, dialCode: foundItem.dialCode };
  } else {
    return { exists: false };
  }
};

export const getcountryCode = (name: string) => {
  let codelist = require("../assets/json/countryCode.json");
  const foundItem = codelist?.find((item: any) => item.name === name);
  if (foundItem) {
    return { flag: foundItem?.emoji, code: foundItem.dialCode };
  } else {
    return {};
  }
};

export const validatePhoneNumber = (
  number: string,
  countryDialCode: string
) => {
  if (number.startsWith(countryDialCode)) {
    return number?.replace(countryDialCode, "");
  } else if (number.startsWith(countryDialCode?.replace("+", ""))) {
    return number?.replace(countryDialCode?.replace("+", ""), "");
  } else {
    return number;
  }
};

export const getPlaceFromLatLng = async (lat: any, lng: any) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCmI0Rfe_sLW3KDfsFwhFQRDdMDJSojwn0`;
  const response = await fetch(url);
  const data = await response.json();
  const address = data.results[0].address_components;
  let addressData: AddressInfoType = AddressInfo;
  // Loop through the address components to find the desired components
  address.forEach((component: any) => {
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
    } else if (component.types.includes("administrative_area_level_1")) {
      addressData.state = component.long_name;
    } else if (component.types.includes("postal_code")) {
      addressData.pincode = component.long_name;
    } else if (component.types.includes("country")) {
      addressData.country = component.short_name;
      addressData.countryFullName = component?.long_name;
    }
  });
  // Extract latitude and longitude
  addressData.latitude = lat.toString();
  addressData.longitude = lng.toString();
  addressData.formattedAddress = data.results[0]?.formatted_address || "";
  return addressData;
};

export const convertKmToM = (values: any) => {
  // you can make change as per requirement
  var realMiles = values * 0.621371;
  return realMiles.toFixed(4);
};

export const convertMtoKM = (miles: any) => {
  // you can make change as per requirement
  var realKm = miles * 1.609344;
  return realKm.toFixed(4);
};

export function removeSpace(value: string) {
  return value?.replace(/\s+/g, "") || "";
}
