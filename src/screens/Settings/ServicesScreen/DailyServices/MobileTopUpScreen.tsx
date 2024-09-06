import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { ServicesHeader } from "components/molecules";
import { ms, mvs } from "react-native-size-matters";
import { wp } from "utils/metrix";
import { FONTS } from "constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { addWalletBalance, getUserWalletBalance } from "store/slices/bank";
import { showToastError, showToastSuccess } from "components";
import AccountItemForChangeUi from "components/molecules/AccountItem/AccountItem";
import { Images } from "assets/images";

const MobileTopUpScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Handler for TextInput change
  const handleChangeText = (text) => {
    setAmount(text);
  };

  const handleOkayOnPress = async () => {
    setLoading(true);
    try {
      if (amount.length > 0) {
        const res = await dispatch(addWalletBalance({ amount: amount }));
        if (res?.payload?.code == 200) {
          await dispatch(getUserWalletBalance());
          showToastSuccess(res?.payload?.message);
          navigation.goBack();
          setLoading(false);
        } else {
          setLoading(false);
          showToastError(res?.payload?.message);
        }
      } else {
        setLoading(false);
        showToastError("please enter amount");
      }
    } catch (error) {
      setLoading(false);
      showToastError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ServicesHeader title="Top Up" showRightIcon={false} />
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <View style={styles.newFriendView}>
          <AccountItemForChangeUi
            showIcon={false}
            title="Top-Up Method"
            icon={Images.custmerProtection}
            onPress={() => {}}
            showLine={false}
            children={
              <Text style={styles.blanceText}>Use new card to top up</Text>
            }
          />
        </View>
        <View style={styles.newFriendView}>
          <Text style={styles.topUpText}>Top-up Amount</Text>
          <View style={styles.textInput}>
            {amount.length > 0 && <Text style={styles.dollarText}>$</Text>}
            <TextInput
              keyboardType="number-pad"
              value={amount}
              placeholderTextColor={Color.black}
              style={styles.textInputView}
              placeholder="Enter Amount"
              onChangeText={handleChangeText}
            />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          handleOkayOnPress();
        }}
        style={styles.sendButtonView}
      >
        {loading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <Text style={styles.sendText}>Okay</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default MobileTopUpScreen;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    newFriendView: {
      marginTop: mvs(15),
      backgroundColor: Color.white,
      width: wp(100),
    },
    topUpText: {
      fontSize: ms(20),
      fontFamily: FONTS.robotoMedium,
      color: Color.black,
      paddingVertical: mvs(20),
      marginHorizontal: ms(20),
    },
    textInputView: {
      fontSize: ms(44),
      fontFamily: FONTS.robotoBold,
      color: Color.black,
    },
    dollarText: {
      fontSize: ms(44),
      fontFamily: FONTS.robotoBold,
      color: Color.black,
      marginRight: mvs(10),
    },
    textInput: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: ms(20),
      paddingBottom: mvs(20),
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
    blanceText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.grey,
      marginRight: ms(10),
    },
  });
};
