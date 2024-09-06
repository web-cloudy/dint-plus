import React from "react";
import { Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";
import { CardField } from "@stripe/stripe-react-native";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { hp, wp } from "utils/metrix";
import { Button } from "components/atoms";

interface Props {
  AddPaymentMethod?: any;
  onCardChange?: any;
}
export const CardViewForPayment = ({
  AddPaymentMethod,
  onCardChange,
}: Props) => {
  const { theme } = useTheme();
  const Colors = getCurrentTheme(theme || "light");
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={() => Keyboard?.dismiss()}
      style={{ alignSelf: "center", flex: 1 }}
    >
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={{
          backgroundColor:
            Colors?.theme === "light" ? Colors.add_pic_grey : Colors.white,
          textColor: Colors.black,
        }}
        style={styles.container}
        onCardChange={onCardChange}
        onFocus={(focusedField) => {
          console.log("focusField", focusedField);
        }}
        dangerouslyGetFullCardDetails={true}
      />
      <Button
        btnStyle={{ bottom: hp(10), position: "absolute", width: wp(90) }}
        onPress={AddPaymentMethod}
        text={"Add payment method"}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(90),
    height: hp(15),
    marginVertical: 30,
  },
});
