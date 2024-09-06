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
import { UserSelectors } from "store/slices/users";
import { Button, Loader } from "components/atoms";
import { HeaderWithTitle, SettingItem } from "components/molecules";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";
import { CardViewForPayment } from "components/molecules/CardForPayment/CardViewForPayment";
import { useStripe } from "@stripe/stripe-react-native";
import {
  getSavedCardsListRequest,
  getServiceIntent,
  makePaymentFromCardList,
  resetCardList,
  resetPaymentResp,
  resetSavedCardResp,
  resetServiceInstance,
  saveCardRequest,
  setLoading,
  stripeSelectors,
} from "store/slices/stripe";
import Toast from "react-native-toast-message";
import { getCurrentLocation, requestLocationPermission } from "utils";
import { AddressInfo, AddressInfoType } from "types/event";
import { getDataFromAsync } from "utils/LocalStorage";
import { CardList } from "components/molecules/CardList/CardList";
import {
  EventSelectors,
  getTickeIdRequest,
  resetTicketIdData,
  resetTicketSoldData,
  ticketSoldRequestApi,
} from "store/slices/event";

type Props = Record<string, never>;
type EventDetailsRouteProp = RouteProp<RootStackParamList, "EventDetails">;

const PaymentScreen: FunctionComponent<Props> = ({}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const navigation = useNavigation<RootNavigationProp>();
  const route = useRoute<EventDetailsRouteProp>();
  // const { event } = route.params;
  const dispatch = useAppDispatch();
  const [showPayment, setShowPayment] = useState(false);
  const [addNewCard, setAddNewCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState();
  const [allCards, setAllCards] = useState([]);
  const {
    loading,
    saveCardResponse,
    paymentServiceInstance,
    cardList,
    paymentResponse,
  } = stripeSelectors();
  console.log("🚀 ~ cardList:", cardList);
  const [address, setAddress] = useState<any>();
  const [cardInfo, setCardInfo] = useState<any>();
  const { ticketIdResponse, ticketSoldApiResp } = EventSelectors();
  const [paymentReferenceId, setPaymentReferenceId] = useState("");
  const [userId, setUserId] = useState("");

  async function getUserId() {
    const user_id = await getDataFromAsync("userId");
    user_id != null && setUserId(user_id || "");
  }
  useEffect(() => {
    dispatch(getSavedCardsListRequest());
    getUserId();
  }, []);

  useEffect(() => {
    if (cardList?.length > 0) {
      setAllCards(cardList);
      // dispatch(resetCardList());
    }
  }, [cardList]);

  useEffect(() => {
    if (saveCardResponse?.status === 400) {
      Toast.show({
        type: "error",
        position: "top",
        text2: saveCardResponse?.message,
        visibilityTime: 3000,
      });

      dispatch(resetSavedCardResp());
    } else if (
      saveCardResponse?.status === 200 ||
      saveCardResponse?.status === 201
    ) {
      setAddNewCard(false);
      dispatch(getSavedCardsListRequest());

      dispatch(resetSavedCardResp());
    }
  }, [saveCardResponse]);

  useEffect(() => {
    if (paymentServiceInstance?.clientSecret) {
      doPayment(paymentServiceInstance?.clientSecret);
    }
  }, [paymentServiceInstance]);

  const getPlaceFromLatLng = async (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCmI0Rfe_sLW3KDfsFwhFQRDdMDJSojwn0`;
    const response = await fetch(url);
    const data = await response.json();
    const mainAddress = data.results[0].address_components;
    let addressData: AddressInfoType = AddressInfo;
    // Loop through the address components to find the desired components
    mainAddress.forEach((component: any) => {
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
      }
    });

    // Extract latitude and longitude
    addressData.latitude = lat.toString();
    addressData.longitude = lng.toString();
    addressData.formattedAddress = data.results[0]?.formatted_address || "";

    return addressData;
  };

  const getAddressFromLocation = async (lat, lng, existingCard) => {
    const address = await getPlaceFromLatLng(lat, lng);
    console.log("address ", address);
    setAddress(address);
    if (existingCard) {
      const email = await getDataFromAsync("email");
      if (email != "null") {
        addThisCard(address);
      } else {
        alert("Kindly add email on settings page");
      }
    }
  };

  const { confirmPayment } = useStripe();

  async function doPayment(clientSecret: string) {
    const email = await getDataFromAsync("email");
    if (email != "null") {
      dispatch(setLoading(true));
      let option: any;
      if (selectedCard) {
        option = {
          paymentMethodType: "Card",
          payment_method_data: {
            type: "card",
            card: {
              token: selectedCard?.card_token,
              billingDetails: {
                email: email || "",
                address: {
                  line1: address?.formatted_address || "",
                  city: address?.city || "",
                  state:
                    address?.street?.length > 120
                      ? address?.street?.substring(0, 120)
                      : address?.street,
                  postal_code: address?.pincode || address?.postal_code || "",
                  country: address?.country || "",
                },
              },
            },
          },
          setup_future_usage: "off_session",
          use_stripe_sdk: true,
        };
      } else {
        option = {
          paymentMethodType: "Card",
          paymentMethodData: {
            card: {
              number: cardInfo?.number || "",
              exp_month: cardInfo?.expiryMonth || "",
              exp_year: cardInfo?.expiryYear || "",
              cvc: cardInfo?.cvc,
            },
            billingDetails: {
              email: email || "",
              address: {
                line1: address?.formatted_address || "",
                city: address?.city || "",
                state:
                  address?.street?.length > 120
                    ? address?.street?.substring(0, 120)
                    : address?.street,
                postal_code: address?.pincode || address?.postal_code || "",
                country: address?.country || "",
              },
            },
          },
        };
      }
      const { paymentIntent, error } = await confirmPayment(
        clientSecret,
        option
      );

      if (error) {
        dispatch(setLoading(false));
        console.log("Payment failed:", error.message);
        Alert.alert(
          "Error",
          error.message,
          [
            {
              text: "OK",
              onPress: () => {},
            },
          ],
          { cancelable: true }
        );
        dispatch(resetServiceInstance());
      } else if (paymentIntent) {
        dispatch(setLoading(false));
        console.log("Payment successful!", paymentIntent);
        Toast.show({
          type: "success",
          position: "top",
          text2: "Payment successful!",
          visibilityTime: 3000,
        });
        dispatch(resetServiceInstance());
      }
    } else {
      alert("Kindly add email on settings page");
    }
  }

  useEffect(() => {
    if (paymentResponse?.status === 200 || paymentResponse?.status === 201) {
      // navigation.goBack();
      setPaymentReferenceId(paymentResponse?.data?.payment_reference_id);
      dispatch(resetPaymentResp());
      Toast.show({
        type: "success",
        position: "top",
        text2: "Payment successful",
        visibilityTime: 3000,
      });
      dispatch(getTickeIdRequest(event?.id));
    } else if (paymentResponse?.status === 400) {
      Toast.show({
        type: "error",
        position: "top",
        text2: paymentResponse?.message,
        visibilityTime: 3000,
      });
      dispatch(resetPaymentResp());
    }
  }, [paymentResponse]);

  useEffect(() => {
    if (ticketIdResponse?.code === 200 || ticketIdResponse?.code === 201) {
      let params = {
        ticket: ticketIdResponse?.data?.id,
        user: userId,
        sale_date: new Date(),
        quantity_sold: route?.params?.quantity,
        total_price: route?.params?.total,
        payment_reference_id: paymentReferenceId,
      };
      dispatch(ticketSoldRequestApi(params));
      dispatch(resetTicketIdData());
    } else if (ticketIdResponse?.code === 400) {
      dispatch(resetTicketIdData());
    }
    console.log("ticketIdResponse ", JSON.stringify(ticketIdResponse));
  }, [ticketIdResponse]);

  useEffect(() => {
    console.log("ticketSoldApiResp ", JSON.stringify(ticketSoldApiResp));
    if (ticketSoldApiResp?.id) {
      navigation.goBack();
    } else if (ticketSoldApiResp?.status === 400) {
      dispatch(resetTicketSoldData());
    }
  }, [ticketSoldApiResp]);

  async function addThisCard(address: any) {
    const email = await getDataFromAsync("email");
    const formData = new FormData();
    formData.append("country", address?.country || "");
    formData.append("state", address?.state || "");
    formData.append("city", address?.city || "");
    formData.append("zip_code", address?.pincode || address?.postal_code || "");
    formData.append(
      "street",
      (address?.street?.length > 120
        ? address?.street?.substring(0, 120)
        : address?.street) || ""
    );
    formData.append("email", email);
    formData.append("card_number", cardInfo?.number || "");
    formData.append("exp_month", cardInfo?.expiryMonth || "");
    formData.append("exp_year", cardInfo?.expiryYear || "");
    formData.append("cvc", cardInfo?.cvc || "");
    formData.append("card_name", cardInfo?.brand || "");
    formData.append("mode", "DEV"); //TODO: Later we'll change this to 'PROD' its 'DEV' for now

    console.log(formData);

    dispatch(saveCardRequest(formData));
  }

  async function AddPaymentMethod() {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        console.log("latitude&longitude ", latitude, longitude);
        getAddressFromLocation(latitude, longitude, true);
      } catch (error: any) {
        Alert.alert("Error getting location", error);
      }
    } else {
      alert("Need location permission");
    }
  }

  const confirmThePayment = async (card: any) => {
    if (route?.params?.total) {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        try {
          const { latitude, longitude } = await getCurrentLocation();
          console.log("latitude&longitude ", latitude, longitude);
          getAddressFromLocation(latitude, longitude, false);
          let params = {
            amount: String(route?.params?.total)?.replace(".", "") || "",
          };
          if (Object?.keys(card)?.length === 0) {
            dispatch(getServiceIntent(params));
          } else {
            let data = {
              params: params,
              id: card?.id,
            };
            dispatch(makePaymentFromCardList(data));
          }
        } catch (error: any) {
          Alert.alert("Error getting location", error);
        }
      }
    } else {
      alert("Price not given for this event");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {loading && <Loader visible={loading} />}

      <HeaderWithTitle
        title={addNewCard ? "Add New Card" : showPayment ? "Cards" : "Payment"}
        blackBar
        onPressBack={() => {
          if (addNewCard) {
            setAddNewCard(false);
            setSelectedCard();
          } else if (showPayment) {
            setShowPayment(!showPayment);
          } else {
            setSelectedCard();
            navigation?.goBack();
          }
        }}
      />

      {addNewCard ? (
        <CardViewForPayment
          AddPaymentMethod={() => {
            AddPaymentMethod({});
          }}
          onCardChange={(cardDetails: any) => {
            console.log("cardDetails", cardDetails);
            setCardInfo({
              ...cardInfo,
              expiryMonth: cardDetails?.expiryMonth,
              expiryYear: cardDetails?.expiryYear,
              cvc: cardDetails?.cvc,
              number: cardDetails?.number,
              brand: cardDetails?.brand,
            });
          }}
        />
      ) : (
        <View style={styles.innerContainer}>
          <View
            style={{
              height: allCards?.length > 2 ? hp(50) : hp(28),
            }}
          >
            <Text style={styles.titleText}>Saved Payment Method</Text>
            {allCards?.length > 0 ? (
              <CardList
                selectedItem={selectedCard}
                allCards={[...allCards]}
                // onClickAddNewCard={() => {
                //   setAddNewCard(true), setSelectedCard();
                // }}
                onClickCard={(item: any) => {
                  setSelectedCard(item);
                }}
              />
            ) : (
              <Text style={styles.noCard}>No Cards</Text>
            )}
          </View>
          <View style={{ height: hp(20) }}>
            <Text style={styles.titleText}>Add Payment Method</Text>

            <SettingItem
              style={{
                borderBottomColor: Color.borderLine,
                borderBottomWidth: 0.8,
              }}
              noLine
              icon={Images.card}
              title={"Credit/Debit card"}
              onPress={() => setAddNewCard(true)}
            />
            <SettingItem noLine icon={Images.apple} title={"Apple pay"} />
          </View>

          {selectedCard && (
            <Button
              text={"Pay Now"}
              btnStyle={styles.btnStyle}
              onPress={() => confirmThePayment(selectedCard)}
            />
          )}
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

    titleText: {
      fontSize: hp(1.8),
      color: Color.black,
      fontWeight: "400",
      marginVertical: hp(2),
    },
    noCard: {
      fontSize: hp(1.7),
      color: Color.black,
      fontWeight: "200",
    },

    btnStyle: {
      position: "absolute",
      bottom: hp(5),
      width: wp(90),
      alignSelf: "center",
    },
  });
};

export default PaymentScreen;
