import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";
import { HeaderWithTitle } from "components/molecules";
import { Button } from "components/atoms";
import {
  EventSelectors,
  eventTicketInfoRequest,
  generateQRcodeRequest,
  resetGeneratedQRcodeData,
  resetTicketSoldData,
} from "store/slices/event";
import useAppDispatch from "hooks/useAppDispatch";
import QRCode from "react-native-qrcode-svg";

const BuyEvents = ({ navigation, route }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const EVENT = route?.params?.event;
  const QR_DATA = route?.params?.data || {};

  const [quantity, setQuantity] = useState(1);
  const [eventId, setEventId] = useState("");
  const [pressedEvent, setPressedEvent] = useState(1);
  const { ticketSoldApiResp, generatedQRcode } = EventSelectors();
  const dispatch = useAppDispatch();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [time, setTime] = useState(60);
  const [code, setCode] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (code && QR_DATA?.qr_code) {
        setTime(time - 1); // decrement time by 1 second
        if (time === 0) {
          dispatch(generateQRcodeRequest({ qr_code: QR_DATA?.qr_code }));
          setCode("");
        }
      }
    }, 1000);

    // interval is 1 second
    return () => clearInterval(intervalId); // clear interval when component unmounts
  }, [time, code]);

  useEffect(() => {
    if (generatedQRcode?.code === 200) {
      setCode(generatedQRcode?.token);
      setTime(60);
      dispatch(resetGeneratedQRcodeData());
    }
  }, [generatedQRcode]);

  useEffect(() => {
    console.log("ticketSoldApiResp ", JSON.stringify(ticketSoldApiResp));
    if (ticketSoldApiResp?.id) {
      setEventId(ticketSoldApiResp?.id);
      setShowSuccessModal(true);
      dispatch(resetTicketSoldData());
    } else if (ticketSoldApiResp?.status === 400) {
      dispatch(resetTicketSoldData());
    }
  }, [ticketSoldApiResp]);

  useEffect(() => {
    if (QR_DATA?.id) {
      setShowSuccessModal(true);
    }
    QR_DATA?.qr_code &&
      dispatch(generateQRcodeRequest({ qr_code: QR_DATA?.qr_code }));
  }, []);

  const DetailOption = (props: any) => {
    const { detail, type } = props;

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image
          style={styles.iconPic}
          resizeMode="contain"
          source={
            type === "date"
              ? Images.date
              : type === "location"
              ? Images.location
              : Images.time
          }
        />
        <Text style={styles.txt}>{detail}</Text>
      </View>
    );
  };

  function onPressDecBtn() {
    quantity > 1 && setQuantity(quantity - 1);
  }

  function onPressIncBtn() {
    setQuantity(quantity + 1);
  }

  useEffect(() => {
    if (showSuccessModal && !QR_DATA.id) {
      setTimeout(() => {
        setShowSuccessModal(false);
        dispatch(eventTicketInfoRequest(eventId));
        setEventId("");
        navigation.goBack();
      }, 3000);
    }
  }, [showSuccessModal]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            showSuccessModal && !QR_DATA?.id ? Color.white : Color.plain_white,
        },
      ]}
    >
      <HeaderWithTitle title="Events" blackBar />

      <View
        style={[
          styles.innerContainer,
          {
            backgroundColor:
              showSuccessModal && !QR_DATA ? Color.white : Color.plain_white,
          },
        ]}
      >
        <View style={styles.eventView}>
          <Image
            resizeMode="cover"
            style={styles.eventPhoto}
            source={{ uri: EVENT?.eventPhoto }}
          />
          <View style={styles.eventDetails}>
            <Text style={styles.nameTxt}>{EVENT?.eventName}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginTop: hp(1),
              }}
            >
              <DetailOption
                type={"date"}
                detail={EVENT?.eventDateCreated || ""}
              />
              <DetailOption
                type={"time"}
                detail={EVENT?.eventstartTime.replace(/:.{2}$/, "")}
              />
              <DetailOption
                type={"location"}
                detail={EVENT?.location?.city || EVENT?.location?.state}
              />
            </View>
          </View>
        </View>
        {/* {showSuccessModal && (
          <View style={styles.UpdateSection}>
            <Text style={styles.numTxt}>No. of tickets</Text>
            <View style={styles.incDecView}>
              <TouchableOpacity
                activeOpacity={1.0}
                onPress={() => {
                  setPressedEvent(0);
                  onPressDecBtn();
                }}
                style={[
                  styles.btnBox,
                  {
                    borderColor:
                      pressedEvent === 0 ? Color.primary : Color.black,
                    backgroundColor:
                      pressedEvent === 0 ? Color.primary : Color.transparent,
                  },
                ]}
              >
                <Text style={styles.incText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantityTxt}>{quantity}</Text>

              <TouchableOpacity
                activeOpacity={1.0}
                onPress={() => {
                  setPressedEvent(1);
                  onPressIncBtn();
                }}
                style={[
                  styles.btnBox,
                  {
                    borderColor:
                      pressedEvent === 1 ? Color.primary : Color.black,
                    backgroundColor:
                      pressedEvent === 1 ? Color.primary : Color.transparent,
                  },
                ]}
              >
                <Text style={styles.incText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )} */}
        {showSuccessModal && !QR_DATA?.id && (
          <Image
            resizeMode="contain"
            source={Images.success}
            style={styles.successView}
          />
        )}
        {QR_DATA?.id && code && (
          <>
            {code && (
              <View style={styles.QRView}>
                <QRCode
                  value={code}
                  logoBackgroundColor="transparent"
                  size={wp(70)}
                />
              </View>
            )}
            {time >= 0 && (
              <>
                <Text style={styles.info}>
                  Please show this QR at the entrance
                </Text>
                <Text style={styles.info}>
                  This QR Code is only valid for : {time >= 0 ? time : ""}
                </Text>
              </>
            )}
          </>
        )}
      </View>

      {!showSuccessModal && (
        <View style={styles.bottomView}>
          <Text style={styles.bottomHeading}>Order summery</Text>
          <View style={styles.detailView}>
            <Text style={styles.detailTxt}>Price</Text>
            <Text style={styles.detailTxt}>${quantity * EVENT?.price}</Text>
          </View>

          <View
            style={[
              styles.detailView,
              { borderBottomWidth: 1, borderBottomColor: Color.border },
            ]}
          >
            <Text style={styles.detailTxt}>Tax</Text>
            <Text style={styles.detailTxt}>Tax</Text>
          </View>

          <View style={styles.detailView}>
            <Text style={styles.detailTxt}>Total</Text>
            <Text style={styles.detailTxt}>${quantity * EVENT?.price}</Text>
          </View>

          <Button
            btnStyle={{ width: "100%" }}
            onPress={() =>
              navigation.navigate("PaymentScreen", {
                event: EVENT,
                total: quantity * EVENT?.price,
                quantity: quantity,
              })
            }
            text="Checkout"
          />
        </View>
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
    innerContainer: {
      flex: 1,
      backgroundColor: Color.plain_white,
      padding: wp(5),
    },
    eventView: {
      flexDirection: "row",
      width: "90%",
    },
    eventPhoto: {
      width: wp(24),
      height: hp(8),
      borderRadius: 5,
    },
    iconPic: {
      width: hp(1.6),
      height: hp(1.6),
      marginRight: wp(1),
    },
    eventDetails: {
      padding: wp(2),
      width: "75%",
    },
    nameTxt: {
      fontSize: hp(2),
      fontWeight: "500",
      color: Color.black,
    },
    txt: {
      fontSize: hp(1.2),
      fontWeight: "400",
      color: Color.black,
    },
    UpdateSection: {
      marginTop: hp(2),
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    numTxt: {
      color: Color.black,
      fontWeight: "400",
      fontSize: hp(2.2),
    },
    incDecView: {
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    incText: {
      fontWeight: "500",
      color: Color.black,
    },
    btnBox: {
      height: hp(2),
      width: hp(2),
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 3,
      margin: hp(0.5),
    },
    quantityTxt: {
      fontWeight: "500",
      color: Color.black,
      fontSize: hp(1.9),
      paddingHorizontal: wp(2),
    },
    bottomView: {
      bottom: 0,
      position: "absolute",
      width: wp(100),
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      backgroundColor: Color.white,
      shadowColor: "#000",
      shadowOpacity: 0.5,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 3 },
      elevation: 5,
      padding: wp(5),
      paddingBottom: hp(5),
      justifyContent: "center",
      alignItems: "center",
    },
    bottomHeading: {
      color: Color.primary,
      fontSize: hp(2.5),
      fontWeight: "600",
    },
    detailView: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      paddingVertical: hp(2),
    },
    detailTxt: {
      color: Color.black,
      fontSize: hp(1.9),
      fontWeight: "400",
    },
    successView: {
      alignSelf: "center",
      height: hp(44),
      width: hp(44),
      marginVertical: hp(5),
    },

    QRView: {
      alignSelf: "center",
      marginVertical: hp(5),
      paddingVertical: hp(4),
      backgroundColor: Color.white,
      paddingHorizontal: wp(5),
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    info: {
      color: Color.black,
      fontSize: hp(1.5),
      fontWeight: "400",
      alignSelf: "center",
    },
  });
};

export default BuyEvents;
