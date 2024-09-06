import { Button, TextInput } from "components/atoms";
import { HeaderWithTitle } from "components/molecules";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ms, mvs, vs } from "react-native-size-matters";
import { useChangeEmail } from "./hooks";

const ChangeEmailScreen = () => {
  const {
    Color,
    currentEmail,
    setCurrentEmail,
    newEmail,
    setNewEmail,
    errorMsg,
    loading,
    handleChangePress,
    emailUpdateStatus,
    emailUpdateError,
  } = useChangeEmail();
  const styles = screenStyles(Color);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="Change Email" blackBar />
      <View style={styles.bodyContainer}>
        <View style={styles.emailsInputContainer}>
          {currentEmail && (
            <TextInput
              value={currentEmail}
              onChangeText={(text: string) => setCurrentEmail(text)}
              placeholder={"Your email address"}
              lable={"Enter your current email address"}
              labelStyle={styles.labelStyle}
              keyboardType={"email-address"}
              containerStyle={styles.textPassInputStyle}
              inputViewStyle={styles.testInputViewStyle}
              inputStyle={styles.textInputStyle}
              placeholderTextColor={Color.inputPlaceholder}
              editable={false}
            />
          )}

          <View style={styles.newPhoneNumberContainer}>
            <TextInput
              value={newEmail}
              onChangeText={(text: string) => setNewEmail(text)}
              placeholder={"Your email address"}
              lable={"Enter your new email address"}
              labelStyle={styles.labelStyle}
              keyboardType={"email-address"}
              containerStyle={styles.textPassInputStyle}
              inputViewStyle={styles.testInputViewStyle}
              inputStyle={styles.textInputStyle}
              placeholderTextColor={Color.inputPlaceholder}
            />
          </View>
        </View>

        <Text style={styles.successMsg}>{emailUpdateStatus}</Text>

        <Text style={styles.errorMsg}>
          {errorMsg ? errorMsg : emailUpdateError ? emailUpdateError : ""}
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

export default ChangeEmailScreen;

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
    emailsInputContainer: {
      paddingHorizontal: ms(21),
      marginTop: mvs(40),
    },
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    bodyContainer: {
      flex: 1,
    },
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
