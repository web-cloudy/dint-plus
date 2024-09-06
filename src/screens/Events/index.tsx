import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  ListRenderItemInfo,
  View,
  Image,
  Text,
  Alert,
} from "react-native";
import useAppDispatch from "hooks/useAppDispatch";
import { EventSelectors, getAllEventAPI } from "store/slices/event";
import { UserSelectors } from "store/slices/users";
import { useFocusEffect } from "@react-navigation/native";
import EventItem from "./components/EventItem";
import { IEvent, IEventFilterType } from "types/event";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { hp } from "utils/metrix";
import EventHeader from "components/molecules/EventHeader/EventHeader";
import FilterView from "components/molecules/FilterView/FilterView";
import moment from "moment";
import { getDataFromAsync } from "utils/LocalStorage";
import { Images } from "assets/images";
import {
  getCurrentLocation,
  getPlaceFromLatLng,
  requestLocationPermission,
} from "utils";
import CreateEventActionModal from "components/organisms/CreateEventActionModal/CreateEventActionModal";

type Props = Record<string, never>;

const Events = (props: any) => {
  const { theme } = useTheme();
  const { navigation } = props;

  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useAppDispatch();
  const { eventList, loading } = EventSelectors();
  const [keyword, setKeyword] = useState("");
  const [eventFilters, setEventFilters] = useState([
    { id: 0, title: "Upcoming", selected: true },
    { id: 1, title: "In progress", selected: false },
    { id: 2, title: "My events", selected: false },
  ]);
  const [savedLocation, setSavedLocation] = useState<any | null>(null);
  const [onShowActionModal, setOnShowActionModal] = useState(false);
  const [eventFiltersTypes, setEventFiltersTypes] = useState<IEventFilterType>({
    price: "",
    user_id: "",
    event_type: "",
    event_date: "",
    upcoming_events: true,
    search: "",
    latitude: "",
    longitude: "",
    max_distance_km: "",
  });

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
    } else {
      setEventFiltersTypes({
        ...eventFiltersTypes,
        event_date: moment(new Date()).format("YYYY-MM-DD"),
        max_distance_km: "40.2336",
      });
      callEventsWithFilters({
        ...eventFiltersTypes,
        event_date: moment(new Date()).format("YYYY-MM-DD"),
        max_distance_km: "40.2336",
      });
    }
  }

  const getAddressFromLocation = async (lat: string, lng: string) => {
    const address = await getPlaceFromLatLng(lat, lng);
    setSavedLocation(address);
    setEventFiltersTypes({
      ...eventFiltersTypes,
      latitude: address?.latitude || "",
      longitude: address?.longitude || "",
      event_date: moment(new Date()).format("YYYY-MM-DD"),
      max_distance_km: "40.2336",
    });
    callEventsWithFilters({
      ...eventFiltersTypes,
      latitude: address?.latitude || "",
      longitude: address?.longitude || "",
      event_date: moment(new Date()).format("YYYY-MM-DD"),
      max_distance_km: "40.2336",
    });
    return;
  };

  useEffect(() => {
    getLocation();
  }, []);

  function callEventsWithFilters(filters: IEventFilterType) {
    console.log(filters);
    if (filters?.max_distance_km) {
      dispatch(getAllEventAPI(filters));
    }
  }

  const onPressViewDetail = (item: IEvent) => {
    navigation.navigate("EventDetails", { event: item });
  };

  const renderEventItem = ({ item, index }: ListRenderItemInfo<IEvent>) => {
    return (
      <EventItem
        item={item}
        index={index}
        onPressViewDetail={() => onPressViewDetail(item)}
      />
    );
  };

  function onClickFilter() {
    setEventFiltersTypes({ ...eventFiltersTypes, price: "" });
    navigation.navigate("FilterResults", {
      filters: eventFiltersTypes,
      savedLocation: savedLocation,
      onGoBack: (data: any) => {
        console.log("onGoBack ", data);
        setEventFiltersTypes(data);
        callEventsWithFilters(data);
        if (data?.upcoming_events === true) {
          let data = [...eventFilters];
          data[0].selected = true;
          setEventFilters(data);
        }
      },
      onClear: (data: any) => {
        setEventFilters([
          { id: 0, title: "Upcoming", selected: false },
          { id: 1, title: "In progress", selected: false },
          { id: 2, title: "My events", selected: false },
        ]);
        setEventFiltersTypes(data);
        callEventsWithFilters(data);
      },
      onSavedAddress: (address: any) => {
        setSavedLocation(address);
      },
      onShowActionModal: (type: boolean) => {
        console.log("onShowActionModal ", type);
        setTimeout(() => {
          setOnShowActionModal(type);
        }, 500);
      },
    });
  }

  async function onClickFilterOption(index: number) {
    let data = [...eventFilters];
    let item = data[index];

    if (item?.id === 0 && item?.selected === false) {
      setEventFiltersTypes({ ...eventFiltersTypes, upcoming_events: true });
      callEventsWithFilters({ ...eventFiltersTypes, upcoming_events: true });
    } else if (item?.id === 0 && item?.selected === true) {
      setEventFiltersTypes({ ...eventFiltersTypes, upcoming_events: false });
      callEventsWithFilters({ ...eventFiltersTypes, upcoming_events: false });
    } else if (item?.id === 1 && item?.selected === false) {
      setEventFiltersTypes({ ...eventFiltersTypes, upcoming_events: null });
      callEventsWithFilters({ ...eventFiltersTypes, upcoming_events: null });
    } else if (item?.id === 1 && item?.selected === true) {
      setEventFiltersTypes({ ...eventFiltersTypes, upcoming_events: false });
      callEventsWithFilters({ ...eventFiltersTypes, upcoming_events: false });
    } else if (item?.id === 2 && item?.selected === false) {
      const userId = (await getDataFromAsync("userId")) || "";
      userId != null &&
        setEventFiltersTypes({
          ...eventFiltersTypes,
          user_id: userId,
          upcoming_events: false,
          event_date: "",
          longitude: "",
          latitude: "",
        });
      callEventsWithFilters({
        ...eventFiltersTypes,
        user_id: userId,
        upcoming_events: false,
        event_date: "",
        latitude: "",
        longitude: "",
      });
    } else if (item?.id === 2 && item?.selected === true) {
      const userId = (await getDataFromAsync("userId")) || "";
      userId != null &&
        setEventFiltersTypes({
          ...eventFiltersTypes,
          user_id: "",
          event_date: moment(new Date()).format("YYYY-MM-DD"),
          longitude: savedLocation?.longitude || "",
          latitude: savedLocation?.latitude || "",
        });
      callEventsWithFilters({
        ...eventFiltersTypes,
        user_id: "",
        event_date: moment(new Date()).format("YYYY-MM-DD"),
        longitude: savedLocation?.longitude || "",
        latitude: savedLocation?.latitude || "",
      });
    }
    item.selected = !data[index]?.selected;
    console.log(item?.selected);

    if (item?.id === 2 && item?.selected === true) {
      data[0].selected = false;
    }
    setEventFilters([...data]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <EventHeader
        title="Events"
        blackBar
        keyword={keyword}
        setKeyword={(text: string) => {
          setKeyword(text);
          if (text) {
            setEventFiltersTypes({ ...eventFiltersTypes, search: text });
            callEventsWithFilters({ ...eventFiltersTypes, search: text });
          } else {
            setEventFiltersTypes({ ...eventFiltersTypes, search: "" });
            callEventsWithFilters({ ...eventFiltersTypes, search: "" });
          }
        }}
      />
      <FilterView
        onClickFilterOption={onClickFilterOption}
        filters={[...eventFilters]}
        onClickFilter={onClickFilter}
      />

      {eventList?.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, paddingTop: hp(2) }}
          data={eventList}
          renderItem={renderEventItem}
        />
      ) : (
        <View>
          {eventFilters[2]?.selected === true && (
            <Image source={Images.noEvent} style={styles.noEvent} />
          )}
          <Text style={styles.noEventTxt}>
            {eventFilters[2]?.selected === true
              ? "No events hosted by you"
              : !loading && "No events Found"}
          </Text>
        </View>
      )}

      {eventList?.length === 0 && (
        <CreateEventActionModal
          isVisible={onShowActionModal}
          hideModal={() => setOnShowActionModal(false)}
          onPressNo={() => {
            setOnShowActionModal(false);
            getLocation();
          }}
          onPressYes={() => {
            navigation.navigate("CreateEvent", { address: savedLocation });
            setOnShowActionModal(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    noEvent: {
      height: hp(30),
      width: hp(30),
      alignSelf: "center",
      margin: hp(2),
    },
    noEventTxt: {
      fontSize: hp(2),
      fontWeight: "600",
      color: Color.black,
      textAlign: "center",
      marginTop: hp(2),
    },
  });
};

export default Events;
