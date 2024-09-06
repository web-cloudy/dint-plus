import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { ServicesHeader } from "components/molecules";
import AccountItemForChangeUi from "components/molecules/AccountItem/AccountItem";
import { Images } from "assets/images";
import { ms, mvs } from "react-native-size-matters";
import { wp } from "utils/metrix";
import { FONTS } from "constants";
import { bankSelectors } from "store/slices/bank";

const WalletScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const { walletBalance } = bankSelectors();
  return (
    <View style={styles.container}>
      <ServicesHeader title="Wallet" showRightIcon={false} />
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <View style={styles.newFriendView}>
          <AccountItemForChangeUi
            title="Balance"
            icon={Images.balance}
            onPress={() => {}}
            showLine={false}
            children={<Text style={styles.blanceText}>${walletBalance}</Text>}
          />
          <AccountItemForChangeUi
            title="Payment methods"
            icon={Images.paymentMethod}
            onPress={() => {
              navigation.navigate("PaymentMethodScreen");
            }}
            showLine={false}
          />
          <AccountItemForChangeUi
            title="Payout methods"
            icon={Images.paymentMethod}
            onPress={() => {
              navigation.navigate("PayoutMethodScreen");
            }}
            showLine={false}
          />
        </View>

        <View style={[styles.newFriendView, { marginTop: mvs(20) }]}>
          <AccountItemForChangeUi
            title="Consumer Protection"
            icon={Images.custmerProtection}
            onPress={() => {}}
            showLine={false}
          />
        </View>

        <View style={[styles.newFriendView, { marginTop: mvs(20) }]}>
          <AccountItemForChangeUi
            title="ID Info"
            icon={Images.idInfo}
            onPress={() => {}}
            showLine={false}
          />
          <AccountItemForChangeUi
            title="Payment Settings"
            icon={Images.SettingsForMe}
            onPress={() => {}}
            showLine={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default WalletScreen;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    newFriendView: {
      marginTop: mvs(30),
      backgroundColor: Color.white,
      width: wp(100),
    },
    blanceText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
      marginRight: ms(10),
    },
  });
};
