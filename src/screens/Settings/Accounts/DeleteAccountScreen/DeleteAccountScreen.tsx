import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { HeaderWithTitle } from "components/molecules";
import { useDeleteAccount } from "./hooks";
import { Images } from "assets/images";
import { ms, mvs, vs } from "react-native-size-matters";
import { FONTS } from "constants";
import MarkedList from "@jsamr/react-native-li";
import disc from "@jsamr/counter-style/presets/disc";
import { Button, TextInput } from "components/atoms";

const DeleteAccountScreen = () => {
  const {
    Color,
    isLoading,
    mobileNumber,
    setMobileNumber,
    handleDeleteAccountPress,
    handleChangeNumberPress,
  } = useDeleteAccount();
  const styles = screenStyles(Color);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="Delete my account" blackBar />
      <View style={styles.bodyContainer}>
        <View style={styles.titleContainer}>
          <Image
            source={Images.warning}
            style={styles.warningIcon}
            resizeMode={"contain"}
          />
          <Text style={styles.warningTitle}>Deleting your account will:</Text>
        </View>
        <View style={styles.warningDescriptionContainer}>
          <MarkedList
            counterRenderer={disc}
            markerTextStyle={{ color: Color.black }}
          >
            <Text
              style={styles.warningDescription}
            >{`Delete your account info and profile photo`}</Text>
            <Text
              style={styles.warningDescription}
            >{`Delete you from all Dint+ groups`}</Text>
            <Text
              style={styles.warningDescription}
            >{`Delete your message history on this phone and your iCloud backup`}</Text>
            <Text
              style={styles.warningDescription}
            >{`Delete any channel that you created`}</Text>
          </MarkedList>
        </View>
        <View style={styles.warningNoteContainer}>
          <Text style={styles.warningNote}>
            Please note, your account will be saved for 30 days after deletion.
            If you log in within this period, your account will be automatically
            reestablished.
          </Text>
        </View>

        <View style={styles.phoneNumberContainer}>
          <TextInput
            value={mobileNumber}
            onChangeText={(text: string) => setMobileNumber(text)}
            isCountryCodeDisplayed={true}
            editable={false}
            placeholder={"Your phone number"}
            lable={"Your phone number"}
            labelStyle={styles.labelStyle}
            keyboardType={"phone-pad"}
            containerStyle={styles.textPassInputStyle}
            inputViewStyle={styles.textInputViewStyle}
            inputStyle={styles.textInputStyle}
            placeholderTextColor={Color.inputPlaceholder}
          />
        </View>

        <View style={styles.deleteBtnContainer}>
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color={Color.deleteBtnTitle} size={30} />
            </View>
          ) : (
            <Button
              text="Delete my account"
              onPress={handleDeleteAccountPress}
              textStyle={styles.delete}
              btnStyle={styles.deleteBtn}
            />
          )}
        </View>

        <View>
          <Button
            text="Change number instead"
            onPress={handleChangeNumberPress}
            textStyle={styles.change}
            btnStyle={styles.changeBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DeleteAccountScreen;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    loaderContainer: {
      alignSelf: "center",
      marginTop: mvs(30),
    },
    change: {
      color: Color.white,
      fontSize: mvs(18),
      fontWeight: "600",
      fontFamily: FONTS.robotoMedium,
      textAlign: "center",
    },
    changeBtn: {
      borderRadius: ms(40),
      marginHorizontal: ms(25),
      marginTop: ms(25),
      backgroundColor: Color.primaryDark,
    },
    delete: {
      color: Color.deleteBtnTitle,
      fontSize: mvs(18),
      fontWeight: "600",
      fontFamily: FONTS.robotoMedium,
      textAlign: "center",
    },
    deleteBtn: {
      borderRadius: ms(40),
      marginHorizontal: ms(25),
      marginTop: ms(25),
      backgroundColor: Color.deleteBtnColor,
    },
    deleteBtnContainer: {
      marginTop: mvs(40),
    },
    textInputStyle: {
      fontSize: ms(13),
    },
    textPassInputStyle: {
      marginTop: vs(10),
    },
    textInputViewStyle: {
      borderRadius: ms(14),
      marginTop: mvs(14),
      height: mvs(48),
    },
    labelStyle: {
      fontSize: ms(14),
      fontWeight: "600",
    },
    phoneNumberContainer: {
      marginTop: mvs(40),
      paddingHorizontal: ms(20),
    },
    warningNote: {
      fontSize: ms(13),
      fontWeight: "400",
      textAlign: "justify",
      color: Color.descriptionColor,
      fontFamily: FONTS.robotoRegular,
      marginBottom: mvs(10),
      lineHeight: ms(16),
    },
    warningNoteContainer: {
      paddingHorizontal: ms(30),
    },
    warningDescription: {
      fontSize: ms(13),
      fontWeight: "400",
      color: Color.descriptionColor,
      fontFamily: FONTS.robotoRegular,
      marginBottom: mvs(10),
      lineHeight: ms(16),
      marginLeft: ms(10),
    },
    warningDescriptionContainer: {
      paddingHorizontal: ms(30),
    },
    warningTitle: {
      fontSize: ms(14),
      fontWeight: "600",
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
      textAlign: "center",
      marginBottom: mvs(10),
      lineHeight: ms(13),
      marginTop: mvs(5),
      marginLeft: ms(10),
    },
    warningIcon: {
      height: mvs(18.57),
      width: ms(20),
    },
    titleContainer: {
      marginTop: mvs(26),
      marginLeft: ms(23),
      flexDirection: "row",
    },
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    bodyContainer: {
      flex: 1,
    },
  });
};
