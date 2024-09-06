import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import {
  RootNavigationProp,
  RootStackParamList,
} from "../../navigator/navigation";
import useAppDispatch from "hooks/useAppDispatch";
import { Button } from "components/atoms";
import { HeaderWithTitle } from "components/molecules";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";
import {
  EventSelectors,
  eventTicketInfoRequest,
  generateQRcodeRequest,
  getTickeIdRequest,
  resetEventTicketInfo,
  resetTicketIdData,
  resetTicketSoldData,
  ticketSoldRequestApi,
} from "store/slices/event";
import { getDataFromAsync, removeDataInAsync } from "utils/LocalStorage";

type EventDetailsRouteProp = RouteProp<RootStackParamList, "EventDetails">;

const EventDetails = ({ navigation }: any) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const route = useRoute<EventDetailsRouteProp>();
  const { event } = route.params;
  const [showPayment, setShowPayment] = useState(false);
  const [userId, setUserId] = useState("");

  const [addNewCard, setAddNewCard] = useState(false);
  const [reservedTicket, setReservedTicket] = useState<any>();

  const dispatch = useAppDispatch();

  const { eventTicketInfo, loading, ticketIdResponse, ticketSoldApiResp } =
    EventSelectors();

  async function getid() {
    const userId = (await getDataFromAsync("userId")) || "";
    setUserId(userId);
  }
  useEffect(() => {
    dispatch(eventTicketInfoRequest(event?.id));
    getid();
  }, []);

  useEffect(() => {
    if (eventTicketInfo?.code === 200 || eventTicketInfo?.code === 201) {
      setReservedTicket(eventTicketInfo?.data);
      dispatch(resetEventTicketInfo());
    }
    if (eventTicketInfo?.code === 400) {
      //TODO: buy ticket for free events
      dispatch(resetEventTicketInfo());
    }
  }, [eventTicketInfo]);

  useEffect(() => {
    if (ticketIdResponse?.code === 200 || ticketIdResponse?.code === 201) {
      let params = {
        ticket: ticketIdResponse?.data?.id,
        user: userId,
        sale_date: new Date(),
        quantity_sold: 1,
        total_price: "0",
        payment_reference_id: "",
      };
      dispatch(ticketSoldRequestApi(params));
      dispatch(resetTicketIdData());
    } else if (ticketIdResponse?.code === 400) {
      dispatch(resetTicketIdData());
    }
  }, [ticketIdResponse]);

  useEffect(() => {
    if (ticketSoldApiResp?.id) {
      dispatch(eventTicketInfoRequest(event?.id));
      dispatch(resetTicketSoldData());
    } else if (ticketSoldApiResp?.status === 400) {
      dispatch(resetTicketSoldData());
    }
  }, [ticketSoldApiResp]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle
        title={"Event Detail"}
        blackBar
        onPressBack={() => {
          if (addNewCard) {
            setAddNewCard(false);
          } else if (showPayment) {
            setShowPayment(!showPayment);
          } else {
            navigation?.goBack();
          }
        }}
      />

      <TouchableOpacity activeOpacity={1.0} onPress={() => Keyboard.dismiss()}>
        <View style={{ height: hp(75) }}>
          <ScrollView contentContainerStyle={styles.innnerContainer}>
            <Image
              source={{ uri: event?.eventPhoto }}
              style={styles.eventPic}
            />
            {Number(event?.price) > 0 && (
              <View style={[styles.midSection, { marginTop: hp(2) }]}>
                <Image
                  resizeMode="contain"
                  source={Images.price}
                  style={styles.dateIcon}
                />
                <Text style={styles.timeText}>${event?.price}</Text>
              </View>
            )}

            <View
              style={[
                styles.midSection,
                { marginTop: event?.price ? hp(1) : hp(2) },
              ]}
            >
              <Image
                resizeMode="contain"
                source={Images.date}
                style={styles.dateIcon}
              />
              <Text style={styles.timeText}>{event?.eventDate}</Text>
            </View>

            <View style={styles.midSection}>
              <Image
                resizeMode="contain"
                source={Images.time}
                style={styles.dateIcon}
              />
              <Text style={styles.timeText}>
                {event?.eventstartTime.replace(/:.{2}$/, "")}
                {event?.eventEndTime
                  ? " To " + event?.eventEndTime.replace(/:.{2}$/, "")
                  : ""}
              </Text>
            </View>

            {event?.location && event?.is_public && (
              <View style={styles.midSection}>
                <Image source={Images.location} style={styles.dateIcon} />
                <Text style={styles.timeText}>
                  {event?.location?.city || event?.location?.state}
                </Text>
              </View>
            )}

            <Text style={styles.titleText}>Title</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.eventName}>{event?.eventName}</Text>
              {reservedTicket?.id && (
                <View style={styles.reserveView}>
                  <Text style={styles.reserveTxt}> Reserved</Text>
                </View>
              )}
            </View>

            <Text style={[styles.titleText, { marginTop: hp(4) }]}>
              Description
            </Text>
            <Text style={styles.eventDetail}>
              {event?.eventDescription}
              {event?.eventDescription}
            </Text>
          </ScrollView>
        </View>
      </TouchableOpacity>
      {String(event?.user?.id) === String(userId) ? (
        <Button
          text="Edit"
          btnStyle={styles.btnStyle}
          onPress={() => {
            removeDataInAsync('eventData')
            navigation?.navigate("CreateEvent",{isEdit: true, event: event});
          }}
        />
      ) : String(event?.price) === "0" ? (
        <Button
          text={reservedTicket?.id ? "View Ticket" : "Buy Ticket"}
          btnStyle={styles.btnStyle}
          onPress={() => {
            reservedTicket?.id
              ? navigation.navigate("BuyEvents", {
                  event: event,
                  data: reservedTicket,
                })
              : dispatch(getTickeIdRequest(event?.id));
          }}
        />
      ) : (
        <Button
          text={reservedTicket?.id ? "QR Code" : "Buy a Ticket"}
          btnStyle={styles.btnStyle}
          onPress={() => {
            navigation.navigate("BuyEvents", {
              event: event,
              data: reservedTicket,
            });
            reservedTicket?.id &&
              dispatch(
                generateQRcodeRequest({ qr_code: reservedTicket?.qr_code })
              );
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
      backgroundColor: Color.plain_white,
    },
    eventPic: {
      width: wp(100),
      height: hp(18),
      alignSelf: "center",
    },
    nameTxt: {
      fontSize: hp(1.8),
      color: Color.black,
      paddingHorizontal: wp(3),
      fontWeight: "600",
    },
    dateIcon: {
      height: hp(1.6),
      width: hp(1.6),
      tintColor: Color.black,
    },
    midSection: {
      marginTop: hp(1),
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: wp(5),
    },
    titleText: {
      fontSize: hp(1.8),
      color: Color.black,
      fontWeight: "800",
      marginTop: hp(3),
      paddingHorizontal: wp(5),
    },
    eventName: {
      fontSize: hp(1.8),
      color: Color.black,
      fontWeight: "400",
      marginTop: hp(0.5),
      paddingHorizontal: wp(5),
    },
    reserveView: {
      marginLeft: -wp(2),
      backgroundColor: "red",
      borderRadius: 21,
      padding: 5,
      borderWidth: 1,
      alignSelf: "center",
    },
    reserveTxt: {
      fontSize: hp(1.6),
      fontWeight: "600",
      color: Color.black,
    },

    btnStyle: {
      position: "absolute",
      bottom: hp(8),
      width: wp(90),
      alignSelf: "center",
    },

    eventDetail: {
      fontSize: hp(1.8),
      color: Color.black,
      fontWeight: "400",
      marginTop: hp(0.5),
      paddingHorizontal: wp(5),
    },
    innnerContainer: {
      flexGrow: 1,
      paddingBottom: hp(3),
    },
    timeText: {
      fontSize: hp(1.5),
      fontWeight: "400",
      marginLeft: wp(3),
      color: Color.black,
    },
  });
};

export default EventDetails;
