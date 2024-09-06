import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Button, Loader, TextInput } from "components/atoms";
import { HeaderWithTitle } from "components/molecules";
import { hp, wp } from "utils/metrix";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { getDataFromAsync } from "utils/LocalStorage";
import useAppDispatch from "hooks/useAppDispatch";
import {
  addBankAccountRequest,
  bankSelectors,
  editBankAccountRequest,
  getbankAccListRequest,
  resetAddBankAccResp,
} from "store/slices/bank";
import { removeSpace } from "utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

const AddPayout = (props: any) => {
  const { navigation, route } = props;
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useAppDispatch();
  const { loading, bankAccList, addBankAccountResp } = bankSelectors();
  const [userId, setUserId] = useState("");
  const [err, setErr] = useState<number | null>(null);
  const isEdit = route?.params?.item ? true : false;
  const [payoutData, setPayoutData] = useState({
    name_on_account: "",
    account_number: "",
    routing_number: "",
    bank_name: "",
    ifsc_code: "",
  });
  async function getUserId() {
    const user_id = await getDataFromAsync("userId");
    user_id != null && setUserId(user_id || "");
  }
  useEffect(() => {
    dispatch(getbankAccListRequest());
    getUserId();
    checkExistingData();
  }, []);

  function checkExistingData() {
    if (route?.params?.item) {
      setPayoutData(route?.params?.item);
    }
  }

  function onClickAddPayout() {
    if (payoutData?.name_on_account?.length === 0) {
      setErr(0);
    } else if (payoutData?.account_number?.length === 0) {
      setErr(1);
    } else if (payoutData?.routing_number?.length === 0) {
      setErr(2);
    } else if (payoutData?.bank_name?.length === 0) {
      setErr(3);
    } else if (payoutData?.ifsc_code?.length === 0) {
      setErr(4);
    } else {
      setErr(null);

      if (isEdit) {
        let params = {
          id: route?.params?.item?.id,
          data: payoutData,
        };
        dispatch(editBankAccountRequest(params));
      } else {
        dispatch(addBankAccountRequest(payoutData));
      }
    }
  }

  useEffect(() => {
    console.log("addBankAccountResp ", addBankAccountResp);
    if (addBankAccountResp?.code === 400) {
      Toast.show({
        type: "error",
        position: "top",
        text2: addBankAccountResp?.message,
        visibilityTime: 5500,
      });
      dispatch(resetAddBankAccResp());
    } else if (addBankAccountResp?.account_number) {
      Toast.show({
        type: "success",
        position: "top",
        text2: isEdit
          ? "Payout edited successfully"
          : "Payout added successfully",
        visibilityTime: 5500,
      });
      dispatch(resetAddBankAccResp());
      dispatch(getbankAccListRequest());
      navigation.goBack();
    }
  }, [addBankAccountResp]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title={"Add Payout"} blackBar />
      {loading && <Loader visible={loading} />}
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.innerContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          placeholder="Account Name"
          placeholderTextColor={Color.black}
          value={payoutData?.name_on_account}
          onChangeText={(text: string) =>
            setPayoutData({ ...payoutData, name_on_account: removeSpace(text) })
          }
          error={err === 0 ? true : false}
        />
        <TextInput
          placeholder="Account Number"
          placeholderTextColor={Color.black}
          keyboardType="number-pad"
          maxLength={16}
          value={payoutData?.account_number}
          onChangeText={(text: string) =>
            setPayoutData({ ...payoutData, account_number: removeSpace(text) })
          }
          error={err === 1 ? true : false}
        />
        <TextInput
          placeholder="Routing Number"
          placeholderTextColor={Color.black}
          keyboardType="number-pad"
          value={payoutData?.routing_number}
          onChangeText={(text: string) =>
            setPayoutData({ ...payoutData, routing_number: removeSpace(text) })
          }
          error={err === 2 ? true : false}
        />
        <TextInput
          placeholder="Bank Name"
          placeholderTextColor={Color.black}
          value={payoutData?.bank_name}
          onChangeText={(text: string) => setPayoutData(text)}
          error={err === 3 ? true : false}
        />
        {/* <TextInput
          placeholder="Swift Code"
          placeholderTextColor={Color.black}
          value={payoutData?.ifsc_code}
          onChangeText={(text: string) =>
            setPayoutData({ ...payoutData, ifsc_code: removeSpace(text) })
          }
          error={err === 4 ? true : false}
        /> */}
      </KeyboardAwareScrollView>

      <Button
        text={isEdit ? "Edit Payout" : "Add Payout"}
        btnStyle={styles.btnStyle}
        onPress={onClickAddPayout}
      />
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.plain_white,
      height: hp(100),
    },
    innerContainer: {
      marginHorizontal: wp(5),
      alignSelf: "center",
      width: wp(90),
    },
    btnStyle: {
      position: "absolute",
      bottom: hp(5),
      width: wp(90),
      alignSelf: "center",
    },
  });
};

export default AddPayout;
