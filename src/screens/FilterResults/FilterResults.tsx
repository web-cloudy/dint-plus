import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { FONTS } from "constants";
import { PickerField } from "components/atoms/Picker/PickerField";
import { Button, TextInput } from "components/atoms";
import TimePickerModal from "components/organisms/TimePickerModal";
import moment from "moment";
import { Images } from "assets/images";
import { IEventFilterType } from "types/event";
import EventPricePicker from "components/molecules/EventPricePicker/EventPricePicker";
import { AddressInputField } from "components/atoms/AddressTextInput/addressInputField";
import {
  convertKmToM,
  convertMtoKM,
  getCurrentLocation,
  getPlaceFromLatLng,
  requestLocationPermission,
} from "utils";

const FilterResults = ({ navigation, route }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCurrentLocation, setShowCurrentLocation] = useState(false);
  const [currentLatLong, setCurrrentLatLong] = useState({
    latitude: "",
    lognitude: "",
  });

  const [price, setPrice] = useState("");

  const [filterData, setFilterData] = useState({
    location: "",
    date: "",
    priceType: "",
    type: "",
    price: 0,
    miles: "",
    address: {},
  });

  const [eventFiltersTypes, setEventFiltersTypes] = useState<IEventFilterType>({
    price: "",
    user_id: "",
    event_type: "",
    event_date: moment(new Date()).format("YYYY-MM-DD"),
    upcoming_events: true,
    search: "",
    latitude: "",
    longitude: "",
    max_distance_km: "",
  });

  async function getLocation(type: string) {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        console.log("latitude&longitude ", latitude, longitude);
        setCurrrentLatLong({
          latitude: latitude.toString(),
          lognitude: longitude.toString(),
        });

        if (
          type === "" &&
          route?.params?.filters?.latitude === latitude.toString()
        ) {
          setShowCurrentLocation(true);
        }

        type === "save" &&
          getAddressFromLocation(latitude.toString(), longitude.toString());
      } catch (error: any) {
        Alert.alert("Error getting location", error);
        setShowCurrentLocation(false);

        setFilterData({
          ...filterData,
          address: {},
          location: "",
        });
      }
    } else {
      setShowCurrentLocation(false);
      setFilterData({
        ...filterData,
        address: {},
        location: "",
      });
    }
  }

  const getAddressFromLocation = async (lat: any, lng: any) => {
    const address = await getPlaceFromLatLng(lat, lng);
    console.log("address ", address);
    setFilterData({
      ...filterData,
      address: address,
      location: address?.formattedAddress,
    });

    setShowCurrentLocation(true);
  };

  useEffect(() => {
    getLocation("");
    console.log(route?.params?.filters?.event_date);

    if (route?.params?.filters) {
      let filters = route?.params?.filters;
      setFilterData({
        ...filterData,
        price: filters?.price || 0,
        date: route?.params?.filters?.event_date
          ? filters?.event_date
          : route?.params?.filters?.user_id
          ? ""
          : "",
        type:
          (filters?.event_type &&
            (filters?.event_type === "virtual" ? "Virtual" : "Live")) ||
          "",
        location: route?.params?.filters?.user_id
          ? ""
          : route?.params?.filters?.latitude
          ? route?.params?.savedLocation?.formattedAddress
          : "" || "",
        address: route?.params?.filters?.user_id
          ? ""
          : route?.params?.filters?.latitude
          ? route?.params?.savedLocation
          : {} || {},
        miles: filters?.max_distance_km || "",
        priceType: "Paid",
      });
      setPrice(filters?.price || "");
    }
  }, []);

  function closePicker() {
    setShowDatePicker(false);
  }

  function handleConfirm(date: any) {
    Keyboard.dismiss();
    console.log(date);
    setFilterData({
      ...filterData,
      date: date,
    });
  }
  const handleValueChange = useCallback(
    (lowValue: any) => {
      //  setFilterData({ ...filterData, price: lowValue });
      setPrice(lowValue);
    },
    [setFilterData, filterData]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Filter your results</Text>
        <Text style={styles.labelStyle}>{"Location"}</Text>
        <AddressInputField
          // onPress={() => openMapModal()}
          value={filterData?.location || ""}
          onSelectAddress={(address) => {
            console.log(address);
            setFilterData({
              ...filterData,
              location: address?.formattedAddress,
              address: address,
            });
            setShowCurrentLocation(false);
          }}
          containerStyle={{
            backgroundColor: "transparent",
            borderRadius: 5,
            borderColor: Color.input_background,
          }}
        />

        <PickerField
          selectedValue={Number(convertKmToM(filterData?.miles)).toFixed(0)}
          label="Miles"
          labelStyle={styles.labelStyle}
          type="miles"
          data={[]}
          placeholder={"All"}
          value={Number(convertKmToM(filterData?.miles)).toFixed(0)}
          onChangeText={(text: string) => {
            console.log(text);
            setFilterData({
              ...filterData,
              miles: convertMtoKM(text),
            });
          }}
          containerStyle={{
            backgroundColor: "transparent",
            borderRadius: 5,
            borderColor: Color.input_background,
          }}
        />

        <TextInput
          lable={"Date"}
          labelStyle={styles.labelStyle}
          placeholder={
            filterData?.date ? moment(new Date()).format("DD-MM-YYYY") : ""
          }
          value={
            filterData?.date
              ? moment(filterData?.date).format("DD-MM-YYYY")
              : ""
          }
          onChangeText={(text: string) => {}}
          editable={false}
          onFocus={() => {
            Keyboard.dismiss();
            setShowDatePicker(true);
          }}
          inputViewStyle={{
            backgroundColor: "transparent",
            borderRadius: 5,
            borderColor: Color.input_background,
          }}
          icon={Images.calender}
        />
        <PickerField
          label={"Price"}
          labelStyle={styles.labelStyle}
          type="price"
          placeholder={"Paid"}
          value={filterData?.priceType}
          onChangeText={(text: string) => {
            setFilterData({
              ...filterData,
              priceType: text,
            });
          }}
          containerStyle={{
            backgroundColor: "transparent",
            borderRadius: 5,
            borderColor: Color.input_background,
          }}
        />
        <EventPricePicker
          priceType={filterData?.priceType || ""}
          disabled={filterData?.priceType?.includes("Paid") ? false : true}
          handleValue={handleValueChange}
        />
        <TouchableOpacity
          onPress={() => {
            if (showCurrentLocation) {
              setShowCurrentLocation(false);
              setFilterData({
                ...filterData,
                address: {},
                location: "",
              });
            } else {
              getLocation("save");
            }
          }}
          style={styles.locationView}
        >
          <View style={styles.checkbox}>
            {showCurrentLocation && (
              <Image
                source={showCurrentLocation ? Images.tick : null}
                resizeMode="contain"
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: showCurrentLocation
                      ? Color?.primary
                      : Color.black,
                    tintColor: Color.white,
                  },
                ]}
              />
            )}
          </View>
          <Text style={styles.currentTxt}>
            Show events for current location
          </Text>
        </TouchableOpacity>

        <PickerField
          label="Type"
          labelStyle={styles.labelStyle}
          type="eventType"
          placeholder={"Live"}
          value={filterData?.type}
          onChangeText={(text: string) => {
            setFilterData({
              ...filterData,
              type: text,
            });
          }}
          containerStyle={{
            backgroundColor: "transparent",
            borderRadius: 5,
            borderColor: Color.input_background,
          }}
        />
      </View>
      <TimePickerModal
        isVisible={showDatePicker}
        hideDatePicker={closePicker}
        handleConfirm={handleConfirm}
        date={filterData?.date}
        noCheck={true}
      />
      <View style={styles.btnView}>
        <Button
          btnStyle={styles.btnStyle}
          text="Apply"
          onPress={() => {
            let GivenDate =
              (filterData?.date &&
                moment(filterData?.date).format("YYYY-MM-DD")) ||
              "";
            var CurrentDate = new Date();
            let updatedGivenDate = new Date(GivenDate);

            let filterss: IEventFilterType = {
              ...eventFiltersTypes,
              upcoming_events: route?.params?.filters?.user_id
                ? false
                : GivenDate && updatedGivenDate > CurrentDate
                ? true
                : false,
              price: filterData?.priceType === "Paid" ? String(price) : "",
              event_date:
                (filterData?.date &&
                  moment(filterData?.date).format("YYYY-MM-DD")) ||
                "",
              event_type: filterData?.type
                ? filterData?.type?.includes("Live")
                  ? "live"
                  : "virtual"
                : "",
              latitude: filterData?.address?.latitude || "",
              longitude: filterData?.address?.longitude || "",
              max_distance_km: filterData?.miles,
              user_id: route?.params?.filters?.user_id || "",
            };
            console.log(filterss);

            setEventFiltersTypes(filterss);
            route?.params?.onGoBack(filterss);
            route?.params?.onSavedAddress(filterData?.address);
            filterData?.address?.latitude != route?.params?.filters?.latitude &&
              route?.params?.onShowActionModal(true);
            navigation.goBack();
          }}
        />
        <Button
          btnStyle={styles.btnStyle}
          text="Clear"
          onPress={() => {
            let filterss = {
              price: "",
              user_id: "",
              event_type: "",
              upcoming_events: false,
              search: "",
              latitude: "",
              longitude: "",
              event_date: "",
              max_distance_km: "40.2336",
            };
            setEventFiltersTypes(filterss);
            route?.params?.onClear(filterss);
            navigation.goBack();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.plain_white,
    },
    innerContainer: {
      flex: 1,
      backgroundColor: Color.plain_white,
      padding: wp(5),
    },
    title: {
      fontSize: hp(2.3),
      fontFamily: FONTS.Bold,
      color: Color.black,
      fontWeight: "500",
      marginVertical: hp(2),
    },
    labelStyle: {
      fontSize: hp(1.6),
      fontWeight: "500",
      color: Color.black,
      marginTop: hp(1),
    },
    btnStyle: { width: wp(42), alignSelf: "center", marginBottom: hp(3) },
    btnView: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: wp(90),
      alignSelf: "center",
    },
    checkbox: {
      height: hp(3),
      width: hp(3),

      borderRadius: 100,
      backgroundColor: Color?.primary,
    },
    locationView: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp(2),
    },
    currentTxt: {
      color: Color.black,
      marginLeft: wp(3),
      fontSize: hp(1.5),
      fontWeight: "400",
    },
  });
};

export default FilterResults;
