import {
  ActivityIndicator,
  Alert,
  Button,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { ServicesHeader } from "components/molecules";
import AccountItemForChangeUi from "components/molecules/AccountItem/AccountItem";
import { CardField } from "@stripe/stripe-react-native";
import { hp, wp } from "utils/metrix";
import { ms, mvs } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FONTS } from "constants";
import { getDataFromAsync } from "utils/LocalStorage";
import { useDispatch } from "react-redux";
import {
  getSavedCardsListRequest,
  saveCardRequest,
  stripeSelectors,
} from "store/slices/stripe";
import {
  getCurrentLocation,
  getPlaceFromLatLng,
  requestLocationPermission,
} from "utils";
import { showToastError } from "components";

const AddCardForPaymentMethod = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [cardInfo, setCardInfo] = useState<any>();
  const dispatch = useDispatch();
  const { loading } = stripeSelectors();

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
    const res = await dispatch(saveCardRequest(formData));
    console.log("🚀 ~ addThisCard ~ res:", JSON.stringify(res));
    if (res?.payload?.status === 200) {
      console.log("called");
      await dispatch(getSavedCardsListRequest());
      navigation.goBack();
    } else {
      showToastError(res?.payload?.message);
    }
  }

  const getAddressFromLocation = async (lat, lng, existingCard) => {
    const address = await getPlaceFromLatLng(lat, lng);
    if (existingCard) {
      const email = await getDataFromAsync("email");
      if (email != "null") {
        addThisCard(address);
      } else {
        Alert.alert("Kindly add email on settings page");
      }
    }
  };

  async function AddPaymentMethod() {
    try {
      if (
        cardInfo?.number != "" &&
        cardInfo?.expiryMonth != 0 &&
        cardInfo?.expiryYear != 0 &&
        cardInfo?.cvc != "" &&
        cardInfo != undefined
      ) {
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
          Alert.alert("Need location permission");
        }
      } else {
        showToastError("please enter card details");
      }
    } catch (error) {
      showToastError(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <ServicesHeader title="Add Payment Method" showRightIcon={false} />
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: "Card Number",
          }}
          cardStyle={{
            backgroundColor:
              Color?.theme === "light" ? Color.add_pic_grey : Color.white,
            textColor: Color.black,
          }}
          style={styles.cardView}
          onFocus={(focusedField) => {
            console.log("focusField", focusedField);
          }}
          dangerouslyGetFullCardDetails={true}
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
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          AddPaymentMethod();
        }}
        style={styles.sendButtonView}
      >
        {loading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <Text style={styles.sendText}>Add Card</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddCardForPaymentMethod;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    cardView: {
      marginTop: mvs(30),
      paddingVertical: mvs(20),
      width: wp(100),
    },
    sendButtonView: {
      position: "absolute",
      width: wp(90),
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      height: mvs(55),
      backgroundColor: Color.primary,
      borderRadius: ms(40),
      bottom: useSafeAreaInsets().bottom + mvs(5),
    },
    sendText: {
      fontSize: ms(18),
      fontFamily: FONTS.robotoMedium,
      color: Color.chock_black,
    },
  });
};
