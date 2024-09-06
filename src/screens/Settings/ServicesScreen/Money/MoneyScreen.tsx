import {
  Image,
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
import { ms, mvs } from "react-native-size-matters";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";
import { FONTS } from "constants";
import AccountItemForChangeUi from "components/molecules/AccountItem/AccountItem";
import QRCode from "react-native-qrcode-svg";
import { ProfileSelectors } from "store/slices/profile";
import { navigate } from "navigator/RootNavigation";

const MoneyScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [showQrCode, setShowQrCode] = useState(false);
  const { profileData } = ProfileSelectors();
  return (
    <View style={styles.container}>
      <ServicesHeader title="Money" showRightIcon={false} />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {showQrCode && (
          <View style={styles.newFriendView1}>
            <AccountItemForChangeUi
              title="Pay Vendor"
              icon={Images.billCheck}
              onPress={() => {}}
              showLine={false}
              leftIconStyle={styles.balance}
              titleStyle={styles.receiveMoneyText}
            />
          </View>
        )}

        <View style={styles.newFriendView}>
          {showQrCode ? (
            <>
              <Text style={styles.tapText}>Tap to view payment code</Text>
              <View style={styles.barcodeView}>
                <QRCode size={hp(25)} value={JSON.stringify(profileData)} />
              </View>
            </>
          ) : (
            <>
              <Image
                resizeMode="contain"
                style={styles.infoCircleIcon}
                source={Images.infoCircle}
              />
              <Text style={styles.quickText}>
                Quick Pay not enabled. Enable it to make paying merchants fast
                and easy -flash the code and go.
              </Text>
              <View style={styles.agreeTextView}>
                <Image
                  resizeMode="contain"
                  style={styles.checkCircleIcon}
                  source={Images.checkCircle}
                />
                <Text style={styles.agreeText}>
                  You have read and agree to the{" "}
                  <Text style={{ color: Color.primary }}>
                    “Payment User Service Agreement”
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowQrCode((prew) => !prew);
                }}
                style={styles.sendButtonView}
              >
                <Text style={styles.sendText}>Enable</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dintView}>
                <Text style={styles.dintText}>
                  Dint+ Pay ensures the security of your funds.
                </Text>
                <Image
                  style={styles.arrowRightIcon}
                  resizeMode="contain"
                  source={Images.arrowRight}
                />
              </TouchableOpacity>
            </>
          )}
        </View>

        {showQrCode && (
          <View style={[styles.newFriendView1, { marginTop: mvs(10) }]}>
            <AccountItemForChangeUi
              title="Balance"
              icon={Images.balance}
              onPress={() => {}}
              showLine={false}
              leftIconStyle={styles.balance}
              subTitle={"Default payment method"}
              showSubTitle={true}
            />
          </View>
        )}

        <View style={[styles.newFriendView1, { marginTop: mvs(10) }]}>
          <AccountItemForChangeUi
            title="Receive Money"
            icon={Images.balance}
            onPress={() => {}}
            showLine={false}
          />
          <AccountItemForChangeUi
            title="Reward Code"
            icon={Images.like}
            onPress={() => {}}
            showLine={false}
          />
          <AccountItemForChangeUi
            title="Split Bill"
            icon={Images.splitBill}
            onPress={() => {}}
            showLine={false}
          />
          <AccountItemForChangeUi
            title="Transfer to Bank Card/Mobile No."
            icon={Images.moneyTransfer}
            onPress={() => {}}
            showLine={false}
          />
          <AccountItemForChangeUi
            title="QRCode Scan"
            icon={Images.moneyTransfer}
            onPress={() => {
              navigation.navigate("QRCodeScanScreen");
            }}
            showLine={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default MoneyScreen;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    newFriendView: {
      marginTop: mvs(10),
      backgroundColor: Color.white,
      width: wp(100),
      alignItems: "center",
    },
    infoCircleIcon: {
      width: mvs(64),
      height: mvs(64),
      marginTop: mvs(10),
      tintColor: Color.grey,
    },
    quickText: {
      fontSize: ms(18),
      fontFamily: FONTS.robotoRegular,
      color: Color.grey,
      textAlign: "center",
      paddingHorizontal: ms(20),
      marginTop: mvs(20),
    },
    checkCircleIcon: {
      width: mvs(20),
      height: mvs(20),
      marginRight: ms(10),
      marginTop: mvs(-2),
    },
    agreeTextView: {
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: ms(30),
      marginTop: mvs(20),
    },
    agreeText: {
      fontSize: ms(14),
      fontFamily: FONTS.robotoRegular,
      color: Color.grey,
      textAlign: "center",
    },
    sendButtonView: {
      marginTop: mvs(40),
      width: wp(50),
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      height: mvs(45),
      backgroundColor: Color.primary,
      borderRadius: ms(40),
    },
    sendText: {
      fontSize: ms(18),
      fontFamily: FONTS.robotoMedium,
      color: Color.chock_black,
    },
    dintText: {
      fontSize: ms(12),
      fontFamily: FONTS.robotoRegular,
      color: Color.grey,
    },
    dintView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: mvs(20),
      paddingHorizontal: ms(20),
    },
    arrowRightIcon: {
      width: mvs(10),
      height: mvs(10),
      tintColor: Color.grey,
      marginHorizontal: ms(10),
    },
    newFriendView1: {
      marginTop: mvs(20),
      backgroundColor: Color.white,
      width: wp(100),
    },
    balance: {
      tintColor: Color.primary,
    },
    receiveMoneyText: {
      color: Color.primary,
    },
    tapText: {
      fontSize: ms(18),
      fontFamily: FONTS.robotoRegular,
      color: Color.grey,
      marginTop: mvs(20),
    },
    barcodeView: {
      marginTop: mvs(50),
      paddingBottom: mvs(40),
    },
  });
};
