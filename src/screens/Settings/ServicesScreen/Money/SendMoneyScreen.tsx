import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { ServicesHeader } from "components/molecules";
import { AvatarPNG } from "assets/images";
import { ms, mvs } from "react-native-size-matters";
import { FONTS } from "constants";
import { wp } from "utils/metrix";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showToastError, showToastSuccess } from "components";
import {
  bankSelectors,
  getUserWalletBalance,
  sendAmountToAnotherUser,
} from "store/slices/bank";
import { useDispatch } from "react-redux";

const SendMoneyScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useDispatch();
  const { userDetails } = route.params;
  console.log("🚀 ~ SendMoneyScreen ~ userDetails:", userDetails);

  const { walletBalance } = bankSelectors();
  console.log("🚀 ~ ServicesScreen ~ walletBalance:", walletBalance);
  const [amount, setAmount] = useState("");
  const [addNote, setAddNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Handler for TextInput change
  const handleChangeText = (text) => {
    setAmount(text);
  };

  const handleOkayOnPress = async () => {
    setLoading(true);
    try {
      if (amount.length > 0) {
        if (amount <= parseInt(walletBalance)) {
          const res = await dispatch(
            sendAmountToAnotherUser({
              amount: amount,
              receiver_id: userDetails?.id,
            })
          );
          console.log("🚀 ~ handleOkayOnPress ~ res:", res);
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
          showToastError("Insufficient Balance");
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
      <ServicesHeader title="Money" showRightIcon={false} />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Image
          resizeMode="cover"
          style={styles.profileIcon}
          source={
            userDetails?.profile_image
              ? { uri: userDetails?.profile_image }
              : AvatarPNG
          }
        />
        <Text style={styles.transferText}>
          Transfer to:{" "}
          <Text style={styles.nameText}>{userDetails?.display_name}</Text>
        </Text>
        <Text style={styles.weChatText}>
          Dint+ : <Text>{userDetails?.display_name}</Text>
        </Text>
        <View style={styles.newFriendView}>
          <Text style={styles.topUpText}>Transfer Amount</Text>
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
          <TextInput
            value={addNote}
            placeholderTextColor={Color.grey}
            style={styles.addNoteTextInputView}
            placeholder="Add Note"
            onChangeText={(txt) => {
              setAddNote(txt);
            }}
          />
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
          <Text style={styles.sendText}>Transfer</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SendMoneyScreen;

const screenStyles = (Color) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    profileIcon: {
      height: mvs(80),
      width: mvs(80),
      borderRadius: mvs(80),
      marginTop: mvs(30),
      alignSelf: "center",
    },
    transferText: {
      fontSize: ms(20),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
      alignSelf: "center",
      marginTop: mvs(20),
    },
    nameText: {
      fontSize: ms(20),
      fontFamily: FONTS.robotoBold,
      color: Color.black,
    },
    weChatText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.grey,
      alignSelf: "center",
      marginTop: mvs(5),
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
    addNoteTextInputView: {
      fontSize: ms(18),
      fontFamily: FONTS.robotoRegular,
      color: Color.grey,
      paddingHorizontal: ms(20),
      paddingBottom: mvs(20),
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
  });
};
