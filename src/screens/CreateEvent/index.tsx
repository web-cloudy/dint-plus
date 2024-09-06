import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Keyboard,
  Alert,
} from "react-native";
import useAppDispatch from "hooks/useAppDispatch";
import {
  createEventAPI,
  EventSelectors,
  getAllEventAPI,
  resetCreateEventData,
  updateEventAPI,
} from "store/slices/event";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "../../navigator/navigation";
import { HeaderWithTitle } from "components/molecules";
import { EventEmptyData, ICreateEvent } from "types/event";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { hp, wp } from "utils/metrix";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Images } from "assets/images";
import { Button, Loader, TextInput } from "components/atoms";
import { useImagePicker } from "hooks";
import {
  ProfileSelectors,
  resetProfileData,
  uploadMediaAPI,
} from "store/slices/profile";
import TimePickerModal from "components/organisms/TimePickerModal";
import moment from "moment";
import { useAuth } from "contexts/AuthContext";
import Toast from "react-native-toast-message";
import { AddressInputField } from "components/atoms/AddressTextInput/addressInputField";
import { PickerField } from "components/atoms/Picker/PickerField";
import EventPricePicker from "components/molecules/EventPricePicker/EventPricePicker";
import PickLocationOnMap from "components/organisms/PickLocationMap/PickLocationOnMap";
import {
  getCurrentLocation,
  getPlaceFromLatLng,
  requestLocationPermission,
} from "utils";
import { getDataFromAsync, storeDataInAsync } from "utils/LocalStorage";

type Props = Record<string, never>;

const CreateEvent: FunctionComponent<Props> = ({ route }: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useAppDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errCode, setErrCode] = useState(0);
  const [type, setType] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const isEdit = route?.params?.isEdit ? true : false;
  const [eventFormData, setEventFormData] =
    useState<ICreateEvent>(EventEmptyData);
  const [price, setPrice] = useState("");

  async function getCreateEventSavedData() {
    getDataFromAsync("eventData")
      .then((data: ICreateEvent | null) => {
        if (data != null) {
          let res = JSON?.parse(data);
          setEventFormData({
            eventName: res?.eventName || eventFormData?.eventName,
            pic: res?.pic || eventFormData?.pic,
            eventDesc: res?.eventDesc || eventFormData?.eventDesc,
            startingDate: res?.startingDate || eventFormData?.startingDate,
            startingTime: res?.startingTime || eventFormData?.startingTime,
            endingTime: res?.endingTime || eventFormData?.endingTime,
            eventEndTime: res?.eventEndTime || eventFormData?.eventEndTime,
            location:
              route?.params?.address ||
              res?.location ||
              eventFormData?.location,
            type: res?.type || eventFormData?.type,
            maxTicketAvail:
              res?.maxTicketAvail || eventFormData?.maxTicketAvail,
            formattedAddress:
              route?.params?.address?.formattedAddress ||
              res?.formattedAddress ||
              eventFormData?.formattedAddress,
            frequency: res?.frequency || eventFormData?.frequency,
            price: res?.price || price,
            showLocationToOthers:
              res?.showLocationToOthers || eventFormData?.showLocationToOthers,
            eventType: res?.eventType || eventFormData?.eventType,
            availableTickets:
              res?.availableTickets || eventFormData?.availableTickets,
            priceType: res?.priceType || eventFormData?.priceType,
          });
          setPrice(res?.price || "");
          res?.pic?.uri && setSelectedImage(res?.pic);
        }
      })
      .catch((err) => {
        console.log(err);
        !isEdit && setEventFormData(EventEmptyData);
      });
    // console.log('svedd', data);
  }

  function getDateWithExistingTime(time: string) {
    const date = moment().format("YYYY-MM-DD"); // get current date
    const dateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss");
    return dateTime.format();
  }

  function checkIfForEdit() {
    if (isEdit) {
      let res = route?.params?.event;
      setEventFormData({
        eventName: res?.eventName || eventFormData?.eventName,
        eventDesc: res?.eventDescription || eventFormData?.eventDesc,
        startingDate: res?.eventDate || eventFormData?.startingDate,
        startingTime:
          getDateWithExistingTime(res?.eventstartTime) ||
          eventFormData?.startingTime,
        endingTime:
          getDateWithExistingTime(res?.eventEndTime) ||
          eventFormData?.endingTime,
        eventEndTime: res?.eventEndTime || eventFormData?.eventEndTime,
        location: res?.location || eventFormData?.location,
        type: res?.event_type || eventFormData?.type,
        maxTicketAvail:
          res?.max_available_tickets.toString() ||
          eventFormData?.maxTicketAvail,
        formattedAddress:
          res?.location?.formattedAddress || eventFormData?.formattedAddress,
        frequency: res?.eventFequency || eventFormData?.frequency,
        price: res?.price || price,
        showLocationToOthers:
          res?.is_public || eventFormData?.showLocationToOthers,
        eventType: res?.event_type || eventFormData?.eventType,
        availableTickets:
          res?.max_available_tickets.toString() ||
          eventFormData?.availableTickets,
        priceType:
          res?.price === "0" ? "Free" : "Paid" || eventFormData?.priceType,
      });
      setPrice(res?.price || "");
    }
  }

  useEffect(() => {
    getCreateEventSavedData();
    checkIfForEdit();
  }, []);

  const navigation = useNavigation<RootNavigationProp>();
  const { selectedImage, setSelectedImage, showImagePickerOptions } =
    useImagePicker();
  const { mediaKey } = ProfileSelectors();
  const { createEventResponse, loading } = EventSelectors();
  const { userId } = useAuth();

  async function getLocation() {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        getAddressFromLocation(latitude.toString(), longitude.toString());

        dispatch(
          getAllEventAPI({
            price: "",
            user_id: "",
            event_type: "",
            event_date: moment(new Date()).format("YYYY-MM-DD"),
            upcoming_events: true,
            search: "",
            max_distance_km: "40.2336",
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          })
        );
      } catch (error: any) {
        Alert.alert("Error getting location", error);
      }
    } else {
      dispatch(
        getAllEventAPI({
          price: "",
          user_id: "",
          event_type: "",
          event_date: moment(new Date()).format("YYYY-MM-DD"),
          upcoming_events: true,
          search: "",
          max_distance_km: "40.2336",
        })
      );
    }
  }

  async function openMapModal() {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      setShowLocationModal(true);
    } else {
      alert("We need location permission");
    }
  }
  useEffect(() => {
    console.log("selectedImage", selectedImage);
    if (selectedImage) {
      const formData = new FormData();
      formData.append("media", selectedImage);
      dispatch(uploadMediaAPI(formData));
    }
  }, [selectedImage]);

  useEffect(() => {
    if (
      createEventResponse?.code === 200 ||
      createEventResponse?.code === 201
    ) {
      Toast.show({
        type: "success",
        position: "top",
        text2: createEventResponse?.message,
        visibilityTime: 5500,
      });

      isEdit ? navigation.popToTop() : navigation.goBack();
      dispatch(resetCreateEventData());
      dispatch(resetProfileData());
      getLocation();
    } else if (createEventResponse?.code === 400) {
      let data = createEventResponse?.data;
      const firstKey = Object.keys(data)[0];
      const firstMessage = data[firstKey][0];
      Toast.show({
        type: "error",
        position: "top",
        text2: firstKey + ": " + firstMessage,
        visibilityTime: 4000,
      });
      dispatch(resetCreateEventData());
    }
  }, [createEventResponse]);

  function closePicker() {
    setShowDatePicker(false);
    setType("");
  }

  function handleConfirm(date: any) {
    Keyboard.dismiss();
    if (type === "startDate") {
      setEventFormData({
        ...eventFormData,
        startingDate: String(date),
      });
      closePicker();
    } else if (type === "endTime") {
      setEventFormData({
        ...eventFormData,
        endingTime: String(date),
      });
      closePicker();
    } else if (type === "startTime") {
      setEventFormData({
        ...eventFormData,
        startingTime: String(date),
      });
      closePicker();
    }
  }
  function createEventPost() {
    setErrCode(0);
    if (!isEdit && !mediaKey) {
      setErrCode(1);
    } else if (
      eventFormData?.eventName === "" ||
      eventFormData?.eventName === undefined
    ) {
      setErrCode(2);
    } else if (
      eventFormData?.eventDesc == "" ||
      eventFormData?.eventDesc === undefined
    ) {
      setErrCode(3);
    } else if (
      eventFormData?.startingDate == "" ||
      eventFormData?.startingDate === undefined
    ) {
      setErrCode(4);
    } else if (
      eventFormData?.startingTime == "" ||
      eventFormData?.startingTime === undefined
    ) {
      setErrCode(5);
    } else if (
      eventFormData?.formattedAddress == "" ||
      eventFormData?.formattedAddress === undefined
    ) {
      setErrCode(6);
    } else if (
      eventFormData?.frequency == "" ||
      eventFormData?.frequency === undefined
    ) {
      setErrCode(7);
    } else if (
      eventFormData?.eventType == "" ||
      eventFormData?.eventType === undefined
    ) {
      setErrCode(8);
    } else if (
      eventFormData?.priceType == "Paid" &&
      (price === undefined || price === "0" || price === "")
    ) {
      setErrCode(9);
    } else if (
      eventFormData?.availableTickets == "" ||
      eventFormData?.availableTickets === undefined
    ) {
      setErrCode(10);
    } else {
      setErrCode(0);
      let params = {
        user: userId,
        eventFequency: eventFormData?.frequency,
        eventDate: moment(eventFormData?.startingDate).format("MM/DD/YYYY"),
        eventstartTime: moment(eventFormData?.startingTime).format("hh:mm"),
        eventEndTime: eventFormData?.endingTime
          ? moment(eventFormData?.endingTime).format("hh:mm")
          : null,
        eventDescription: eventFormData?.eventDesc,
        eventName: eventFormData?.eventName,
        eventPhoto: mediaKey || route?.params?.event?.eventPhoto,
        eventDateCreated: moment(new Date()).format("MM/DD/YYYY"),
        location: eventFormData?.location,
        is_public: eventFormData?.showLocationToOthers || false,
        price: eventFormData?.priceType === "Free" ? "0" : price || "",
        max_available_tickets: eventFormData?.availableTickets || "",
        event_type: eventFormData?.eventType?.includes("Live")
          ? "live"
          : "virtual",
      };

      isEdit
        ? dispatch(
            updateEventAPI({ id: route?.params?.event?.id, data: params })
          )
        : dispatch(createEventAPI(params));
    }
  }

  const getAddressFromLocation = async (lat: any, lng: any) => {
    const address = await getPlaceFromLatLng(lat, lng);
    console.log("address ", address);
    setEventFormData({
      ...eventFormData,
      formattedAddress: address?.formattedAddress,
      location: address,
    } as ICreateEvent);
  };

  const handleValueChange = (lowValue: any) => {
    console.log(eventFormData);
    setPrice(lowValue);
  };

  const EventPricehandler = useCallback(() => {
    return (
      <EventPricePicker
        priceType={price || ""}
        disabled={eventFormData?.priceType?.includes("Paid") ? false : true}
        handleValue={handleValueChange}
        marginVertical={hp(2.5)}
      />
    );
  }, [eventFormData?.priceType]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle
        title="Create Event"
        blackBar
        onPressBack={() => {
          console.log(price);
          let data = { ...eventFormData, price: price, pic: selectedImage };
          console.log(JSON.stringify(data));
          !isEdit && storeDataInAsync("eventData", JSON.stringify(data));
          dispatch(resetProfileData());
          navigation?.goBack();
        }}
      />
      {loading && <Loader visible={loading} />}
      <KeyboardAwareScrollView
        style={styles.innerContainer}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(8) }}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        scrollEnabled={true}
      >
        <TouchableOpacity
          onPress={showImagePickerOptions}
          activeOpacity={1.0}
          style={[
            styles.addPicView,
            { borderColor: errCode === 1 ? "red" : "transparent" },
          ]}
        >
          {selectedImage ? (
            <Image
              resizeMode="cover"
              style={styles.addPicView}
              source={{ uri: selectedImage?.uri }}
            />
          ) : route?.params?.event?.eventPhoto ? (
            <Image
              resizeMode="cover"
              style={styles.addPicView}
              source={{ uri: route?.params?.event?.eventPhoto }}
            />
          ) : (
            <Image
              resizeMode="contain"
              source={Images.addPic}
              style={styles.addPicIcon}
            />
          )}
        </TouchableOpacity>
        <Text
          onPress={showImagePickerOptions}
          style={[
            styles.addPhotoText,
            {
              color: errCode === 1 ? "red" : Color.primary,
            },
          ]}
        >
          Add Photo
        </Text>

        <TextInput
          placeholder="Event Name"
          value={eventFormData?.eventName || ""}
          onChangeText={(text: string) => {
            setEventFormData({
              ...eventFormData,
              eventName: text,
            });
          }}
          inputViewStyle={{
            borderColor:
              errCode === 2
                ? "red"
                : Color.theme === "dark"
                ? Color.input_background
                : "#353535",
          }}
        />
        <TextInput
          placeholder="Description"
          value={eventFormData?.eventDesc || ""}
          onChangeText={(text: string) => {
            setEventFormData({
              ...eventFormData,
              eventDesc: text,
            } as ICreateEvent);
          }}
          inputViewStyle={{
            borderColor:
              errCode === 3
                ? "red"
                : Color.theme === "dark"
                ? Color.input_background
                : "#353535",
          }}
          multiline
          inputStyle={{
            height: hp(12),
          }}
        />

        <PickerField
          type="frequency"
          placeholder={"Frequency"}
          value={eventFormData?.frequency || ""}
          onChangeText={(text: string) => {
            console.log(text);
            setEventFormData({
              ...eventFormData,
              frequency: text,
            } as ICreateEvent);
          }}
          containerStyle={{
            borderColor:
              errCode === 7
                ? "red"
                : Color.theme === "dark"
                ? Color.input_background
                : "#353535",
          }}
        />

        <TextInput
          placeholder={"Date"}
          value={
            eventFormData?.startingDate
              ? moment(eventFormData?.startingDate).format("MM/DD/YYYY")
              : ""
          }
          onChangeText={(text: string) => {}}
          editable={false}
          onFocus={() => {
            Keyboard.dismiss();
            setType("startDate"), setShowDatePicker(true);
          }}
          inputViewStyle={{
            borderColor:
              errCode === 4
                ? "red"
                : Color.theme === "dark"
                ? Color.input_background
                : "#353535",
          }}
        />
        <TextInput
          placeholder={"Starting Time"}
          value={
            eventFormData?.startingTime
              ? moment(eventFormData?.startingTime).format("hh:mm a")
              : ""
          }
          onChangeText={(text: string) => {}}
          editable={false}
          onFocus={() => {
            Keyboard.dismiss();
            setType("startTime"), setShowDatePicker(true);
          }}
          inputViewStyle={{
            borderColor:
              errCode === 5
                ? "red"
                : Color.theme === "dark"
                ? Color.input_background
                : "#353535",
          }}
        />

        <TextInput
          placeholder={"Ending Time"}
          value={
            eventFormData?.endingTime
              ? moment(eventFormData?.endingTime).format("hh:mm a")
              : ""
          }
          onChangeText={(text: string) => {}}
          editable={false}
          onFocus={() => {
            Keyboard.dismiss();
            setType("endTime"), setShowDatePicker(true);
          }}
        />

        <PickerField
          type="eventType"
          placeholder={"Type"}
          value={eventFormData?.eventType || ""}
          onChangeText={(text: string) => {
            console.log(text);
            setEventFormData({
              ...eventFormData,
              eventType: text,
            } as ICreateEvent);
          }}
          containerStyle={{
            borderColor:
              errCode === 8
                ? "red"
                : Color.theme === "dark"
                ? Color.input_background
                : "#353535",
          }}
        />
        <AddressInputField
          // onPress={() => openMapModal()}
          value={eventFormData?.formattedAddress}
          onSelectAddress={(address) => {
            console.log(address);
            setEventFormData({
              ...eventFormData,
              formattedAddress: address?.formattedAddress,
              location: address,
            } as ICreateEvent);
          }}
          containerStyle={{
            borderColor:
              errCode === 6
                ? "red"
                : Color.theme === "dark"
                ? Color.input_background
                : "#353535",
            marginTop: hp(2),
          }}
        />

        <PickerField
          type="price"
          placeholder={"Paid"}
          value={price}
          onChangeText={(text: string) => {
            setEventFormData({
              ...eventFormData,
              priceType: text,
              price: "0",
            });
            setPrice("0");
          }}
        />

        {eventFormData?.priceType?.includes("Paid") && <EventPricehandler />}
        {errCode === 9 && <Text style={styles.err}>Enter price please</Text>}
        {/* 
          // <TextInput
          //   placeholder="Price"
          //   value={eventFormData?.price || ""}
          //   onChangeText={(text: string) => {
          //     console.log(text);

          //     if (text && !text.startsWith("$")) {
          //       setEventFormData({
          //         ...eventFormData,
          //         price: "$" + text,
          //       } as ICreateEvent);
          //     } else if (text) {
          //       setEventFormData({
          //         ...eventFormData,
          //         price: "$" + text.replace("$", ""),
          //       } as ICreateEvent);
          //     } else {
          //       setEventFormData({
          //         ...eventFormData,
          //         price: "",
          //       } as ICreateEvent);
          //     }
          //   }}
          //   keyboardType="numeric"
          //   inputViewStyle={{
          //     borderColor:
          //       errCode === 9
          //         ? "red"
          //         : Color.theme === "dark"
          //         ? Color.input_background
          //         : "#353535",
          //   }}
          //   maxLength={40}
          // /> */}

        <TextInput
          placeholder="Max tickets available"
          value={eventFormData?.availableTickets || ""}
          onChangeText={(text: string) => {
            setEventFormData({
              ...eventFormData,
              availableTickets: text,
            } as ICreateEvent);
          }}
          keyboardType="number-pad"
          inputViewStyle={{
            borderColor:
              errCode === 10
                ? "red"
                : Color.theme === "dark"
                ? Color.input_background
                : "#353535",
          }}
          maxLength={40}
        />

        <TouchableOpacity
          onPress={() => {
            setEventFormData({
              ...eventFormData,
              showLocationToOthers: !eventFormData?.showLocationToOthers,
            } as ICreateEvent);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: hp(2),
            paddingLeft: wp(2),
          }}
        >
          <View style={styles.checkbox}>
            <Image
              source={eventFormData?.showLocationToOthers ? Images.tick : null}
              resizeMode="contain"
              style={[
                styles.checkbox,
                {
                  backgroundColor: eventFormData?.showLocationToOthers
                    ? Color?.primary
                    : Color.black,
                  tintColor: Color.white,
                },
              ]}
            />
          </View>
          <Text
            style={{
              color: Color.black,
              marginLeft: wp(3),
              fontSize: hp(1.5),
              fontWeight: "400",
            }}
          >
            Do you want to show your location to others ?
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
      <Button
        btnStyle={styles.btnStyle}
        onPress={createEventPost}
        text={isEdit ? "Update Event" : "Create Event"}
      />
      <TimePickerModal
        isVisible={showDatePicker}
        hideDatePicker={closePicker}
        handleConfirm={handleConfirm}
        type={
          type === "endTime" ? "time" : type === "startTime" ? "time" : "date"
        }
        date={
          type === "endTime"
            ? eventFormData?.endingTime
            : type === "startTime"
            ? eventFormData?.startingDate
            : eventFormData?.startingDate
        }
      />

      <PickLocationOnMap
        isVisible={showLocationModal}
        hideModal={() => setShowLocationModal(false)}
        onPressDone={(location: any) => {
          getAddressFromLocation(location?.latitude, location?.longitude);
          setShowLocationModal(false);
        }}
      />
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    innerContainer: {
      flex: 1,
      backgroundColor: Color.plain_white,
      paddingHorizontal: wp(5),
      // paddingTop: hp(2),
    },
    addPicView: {
      height: hp(20),
      width: wp(100),
      backgroundColor: Color.add_pic_grey,
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "transparent",
    },
    addPicIcon: {
      height: hp(6.5),
      width: hp(6.5),
      tintColor: Color.white,
    },
    container: {
      flex: 1,
      backgroundColor: Color.plain_white,
    },
    addPhotoText: {
      fontSize: hp(1.8),
      fontWeight: "500",
      textAlign: "center",
      marginTop: hp(1),
    },
    btnStyle: { width: wp(90), alignSelf: "center" },
    checkbox: {
      height: hp(3),
      width: hp(3),

      borderRadius: 100,
    },
    err: {
      fontSize: hp(1.5),
      fontWeight: "500",
      textAlign: "left",
      color: Color.red,
      marginLeft: wp(3),
    },
  });
};

export default CreateEvent;
