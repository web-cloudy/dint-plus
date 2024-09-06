import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { ServicesHeader, SettingItem } from "components/molecules";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";
import { ms, mvs } from "react-native-size-matters";
import AccountItemForChangeUi from "components/molecules/AccountItem/AccountItem";
import { getSavedCardsListRequest, stripeSelectors } from "store/slices/stripe";
import { useDispatch } from "react-redux";
import { CardList } from "components/molecules/CardList/CardList";
import { FONTS } from "constants";

const PaymentMethodScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useDispatch();
  const { cardList } = stripeSelectors();

  console.log("🚀 ~ PaymentMethodScreen ~ cardList:", cardList);

  useEffect(() => {
    dispatch(getSavedCardsListRequest());
  }, []);
  return (
    <View style={styles.container}>
      <ServicesHeader title="Payment" showRightIcon={false} />
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <View
          style={{
            height:
              cardList?.length <= 0
                ? hp(10)
                : cardList?.length > 2
                ? hp(50)
                : hp(28),
          }}
        >
          <Text style={styles.titleText}>Saved Payment Method</Text>
          {cardList?.length > 0 ? (
            <CardList
              allCards={[...cardList]}
              onClickAddNewCard={() => {}}
              onClickCard={(item: any) => {}}
            />
          ) : (
            <Text style={styles.noCard}>No Cards</Text>
          )}
        </View>
        <Text style={styles.titleText}>Add Payment Method</Text>
        <View style={styles.newFriendView}>
          <AccountItemForChangeUi
            title="Add Debit/Credit Card"
            icon={Images.card}
            onPress={() => {
              navigation.navigate("AddCardForPaymentMethod");
            }}
            showLine={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentMethodScreen;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    titleText: {
      fontSize: ms(16),
      color: Color.black,
      fontWeight: "400",
      marginHorizontal: ms(20),
      marginTop: mvs(30),
    },
    newFriendView: {
      marginTop: mvs(20),
      backgroundColor: Color.white,
      width: wp(100),
    },
    noCard: {
      fontSize: hp(1.7),
      color: Color.black,
      fontFamily: FONTS.robotoRegular,
      paddingTop: mvs(10),
      paddingLeft: wp(20),
    },
  });
};
