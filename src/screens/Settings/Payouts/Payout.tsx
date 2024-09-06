import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { Loader } from "components/atoms";
import { HeaderWithTitle, SettingItem } from "components/molecules";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";
import { CardList } from "components/molecules/CardList/CardList";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import useAppDispatch from "hooks/useAppDispatch";
import {
  bankSelectors,
  deleteBankAccListRequest,
  getbankAccListRequest,
  markAccAsDefaultRequest,
  resetdeleteBankAccResp,
  resetMarkAccAsDefaultResp,
} from "store/slices/bank";
import Toast from "react-native-toast-message";
import PayoutActionModal from "components/organisms/PayoutActionModal";

const Payout = (props: any) => {
  const { navigation } = props;
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useAppDispatch();
  const { loading, bankAccList, markAccAsDefaultResp, deleteBankAccountResp } =
    bankSelectors();
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>();

  useEffect(() => {
    dispatch(getbankAccListRequest());
  }, []);

  useEffect(() => {
    if (markAccAsDefaultResp?.code === 200) {
      Toast.show({
        type: "success",
        position: "top",
        text2: markAccAsDefaultResp?.message,
        visibilityTime: 5500,
      });
      dispatch(resetMarkAccAsDefaultResp());
    } else if (markAccAsDefaultResp?.code === 400) {
      Toast.show({
        type: "error",
        position: "top",
        text2: markAccAsDefaultResp?.message,
        visibilityTime: 5500,
      });
      dispatch(resetMarkAccAsDefaultResp());
    }
  }, [markAccAsDefaultResp]);

  useEffect(() => {
    if (deleteBankAccountResp?.code === 200) {
      dispatch(resetdeleteBankAccResp());
      dispatch(getbankAccListRequest());
    } else if (deleteBankAccountResp?.code === 400) {
      Toast.show({
        type: "error",
        position: "top",
        text2: deleteBankAccountResp?.message,
        visibilityTime: 5500,
      });
      dispatch(resetdeleteBankAccResp());
      dispatch(getbankAccListRequest());
    }
  }, [deleteBankAccountResp]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title={"Payouts"} blackBar />
      {loading && <Loader visible={loading} />}
      <View
        style={{
          height:
            bankAccList?.length === 0
              ? undefined
              : bankAccList?.length > 3
              ? hp(50)
              : hp(30),
        }}
      >
        <Text style={styles.titleText}>
          {bankAccList?.length === 0 && !loading
            ? "Add Payoutment Method"
            : "Saved Payout Method"}
        </Text>
        {bankAccList?.length > 0 ? (
          <CardList
            allCards={[...bankAccList]}
            type="payout"
            // onClickAddNewCard={() => {}}
            onClickCard={(item: any) => {
              setSelectedCard(item);
              setShowActionModal(true);
            }}
          />
        ) : (
          <Text style={styles.noCard}>No Cards</Text>
        )}
      </View>
      <View style={{ height: hp(20) }}>
        <Text style={styles.titleText}>Add Payment Method</Text>

        <SettingItem
          noLine
          icon={Images.card}
          title={"Add Bank Account"}
          onPress={() => {
            navigation.navigate("AddPayoutScreen");
          }}
        />
      </View>

      <PayoutActionModal
        isVisible={showActionModal}
        hideModal={() => setShowActionModal(false)}
        onSetAsDefault={() => {
          dispatch(markAccAsDefaultRequest(selectedCard?.id));
          setShowActionModal(false);
        }}
        onPressEdit={() => {
          navigation.navigate("AddPayoutScreen", { item: selectedCard });
          setShowActionModal(false);
        }}
        onPressDelete={() => {
          dispatch(deleteBankAccListRequest(selectedCard?.id));
          setShowActionModal(false);
        }}
        onPressCancel={() => setShowActionModal(false)}
      />

      {/* <Button text={"Pay Out"} btnStyle={styles.btnStyle} /> */}
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.plain_white,
    },
    innerContainer: {
      flex: 1,
      backgroundColor: Color.plain_white,
      padding: wp(5),
    },

    titleText: {
      fontSize: hp(1.8),
      color: Color.black,
      fontWeight: "400",
      marginVertical: hp(2),
      paddingHorizontal: wp(5),
    },
    noCard: {
      fontSize: hp(1.8),
      color: Color.black,
      paddingHorizontal: wp(5),
      fontWeight: "200",
    },

    btnStyle: {
      position: "absolute",
      bottom: hp(5),
      width: wp(90),
      alignSelf: "center",
    },
  });
};

export default Payout;
