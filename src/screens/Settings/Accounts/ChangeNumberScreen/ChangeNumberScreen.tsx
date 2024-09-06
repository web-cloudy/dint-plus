import { Button, TextInput } from "components/atoms";
import { HeaderWithTitle } from "components/molecules";
import PhoneInputField from "components/molecules/PhoneInputField/PhoneInputField";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ms, mvs, vs } from "react-native-size-matters";
import { ProfileSelectors } from "store/slices/profile";
import { useChangeNumber } from "./hooks";

const ChangeNumberScreen = () => {
  const {
    Color,
    oldMobileNumber,
    setOldMobileNumber,
    newMobileNumber,
    setNewMobileNumber,
    errorMsg,
    loading,
    handleChangePress,
    numberUpdateStatus,
    numberUpdateError,
    countryCode,
    setCountryCode,
  } = useChangeNumber();
  const styles = screenStyles(Color);
  const { profileData } = ProfileSelectors();


  
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="Change Number" blackBar />
      <View style={styles.bodyContainer}>
        <View style={styles.mobileNumbersInputContainer}>
          <TextInput
            value={profileData?.phone_no || ""}
            onChangeText={(text: string) => setOldMobileNumber(text)}
            placeholder={"Your phone number"}
            lable={"Old phone number"}
            labelStyle={styles.labelStyle}
            keyboardType={"number-pad"}
            containerStyle={styles.textPassInputStyle}
            inputViewStyle={styles.testInputViewStyle}
            inputStyle={styles.textInputStyle}
            placeholderTextColor={Color.inputPlaceholder}
            editable={false}
          />

          <View style={styles.newPhoneNumberContainer}>
            <PhoneInputField
              labelStyle={styles.labelStyle}
              inputStyle={styles.textInputStyle}
              value={newMobileNumber}
              onChangeText={(number: string, code: string) => {
                console.log(number + "and " + code);
                setNewMobileNumber(number);
                setCountryCode(code);
              }}
              placeholder={"Your phone number"}
              label={"Enter your new phone number"}
              style={{ height: mvs(48), borderRadius: ms(14) }}
            />
          </View>
        </View>

        <Text style={styles.errorMsg}>
          {errorMsg ? errorMsg : numberUpdateError ? numberUpdateError : ""}
        </Text>
        <View style={styles.changeBtnContainer}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color={Color.primary} size={30} />
            </View>
          ) : (
            <Button
              text="Change"
              onPress={handleChangePress}
              textStyle={styles.change}
              btnStyle={styles.changeBtn}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangeNumberScreen;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    loaderContainer: {
      alignSelf: "center",
      marginTop: mvs(30),
    },
    successMsg: {
      alignSelf: "center",
      color: Color.primary,
      marginTop: 10,
    },
    errorMsg: {
      alignSelf: "center",
      color: "red",
      marginTop: 10,
    },
    changeBtnContainer: {
      marginTop: mvs(40),
    },
    newPhoneNumberContainer: {
      marginTop: mvs(13),
    },
    textInputStyle: {
      fontSize: ms(13),
    },
    testInputViewStyle: {
      borderRadius: ms(14),
      marginTop: mvs(14),
      height: mvs(48),
    },
    labelStyle: {
      fontSize: ms(14),
      fontWeight: "600",
    },
    mobileNumbersInputContainer: {
      paddingHorizontal: ms(21),
      marginTop: mvs(40),
    },
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    bodyContainer: { flex: 1 },
    textPassInputStyle: {
      marginTop: vs(10),
    },
    change: {
      color: Color.white,
      fontSize: mvs(20),
      fontWeight: "500",
      textAlign: "center",
    },
    changeBtn: {
      borderRadius: 10,
      marginHorizontal: ms(25),
      marginTop: ms(25),
      backgroundColor: Color.primaryDark,
    },
  });
};
