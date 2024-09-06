import React, { useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { ms, mvs, verticalScale } from "react-native-size-matters";
import { ServicesHeader } from "components/molecules";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";
import { FONTS } from "constants";
import ServiceList from "components/molecules/ServicesHeader/ServiceList";
import { useDispatch } from "react-redux";
import { bankSelectors, getUserWalletBalance } from "store/slices/bank";

type Props = Record<string, never>;

const ServicesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useDispatch();
  const { walletBalance } = bankSelectors();
  console.log("🚀 ~ ServicesScreen ~ walletBalance:", walletBalance);

  const onChatPress = useCallback(() => {
    navigation.navigate("Chats");
  }, []);

  const onEventPress = useCallback(() => {
    navigation.navigate("Events");
  }, []);

  const fetchWalletBalance = () => {
    try {
      const res = dispatch(getUserWalletBalance());
      console.log("🚀 ~ fetchWalletBalance ~ res:", res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  return (
    <View style={styles.container}>
      <ServicesHeader title="Services" />
      {/* <View style={styles.bodyContainer}> */}
      {/* <Text style={styles.services}>Services</Text>
      <View style={styles.servicesContainer}>
        <View style={styles.firstRowContainer}>
          <TouchableOpacity
            style={styles.serviceContainer}
            onPress={onChatPress}
          >
            <View style={styles.serviceBodyContainer}>
              <Text style={styles.serviceTitle}>Chats</Text>
            </View>

            <View style={styles.serviceImageContainer}>
              <Image
                source={Images.chats}
                resizeMode="contain"
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.serviceDivider} />
          <TouchableOpacity
            style={styles.serviceContainer}
            onPress={onEventPress}
          >
            <View style={styles.serviceBodyContainer}>
              <Text style={styles.serviceTitle}>Events</Text>
            </View>

            <View style={styles.serviceImageContainer}>
              <Image
                resizeMode="contain"
                source={Images.events}
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View> */}
      {/* </View> */}
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <View style={styles.moneyContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MoneyScreen");
            }}
            style={styles.moneyView}
          >
            <Image style={styles.moneyIcon} source={Images.money} />
            <Text style={styles.moneyText}>Money</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("WalletScreen");
            }}
            style={[styles.moneyView, { marginTop: ms(12) }]}
          >
            <Image style={styles.moneyIcon} source={Images.wallet} />
            <Text style={styles.moneyText}>Wallet</Text>
            <Text style={styles.moneyNomberText}>${walletBalance}</Text>
          </TouchableOpacity>
        </View>
        <ServiceList
          title={"Daily Services"}
          serviceName={"Mobile Top Up"}
          image={Images.mobile}
          onPress={() => {
            navigation.navigate("MobileTopUpScreen");
          }}
        />

        <ServiceList
          onPress={onEventPress}
          title={"Entertainment"}
          serviceName={"Event Tickets"}
          image={Images.transportation}
          serviceStyle={{ marginTop: mvs(30) }}
        />
      </ScrollView>
    </View>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    bodyContainer: {
      flex: 1,
      paddingHorizontal: ms(16),
      paddingVertical: mvs(16),
      backgroundColor: Color.plain_white,
      bottom: 0,
      top: hp(10),
      position: "absolute",
      width: wp(100),
    },
    services: { color: Color.black, fontSize: hp(2.4), fontWeight: "700" },
    servicesContainer: { flex: 1, marginTop: mvs(10) },
    firstRowContainer: { flexDirection: "row" },
    serviceContainer: { flex: 1, height: mvs(100) },
    serviceBodyContainer: {
      flex: 1,
      backgroundColor: "#D4D0CB40",
      borderRadius: ms(10),
      padding: ms(10),
      justifyContent: "flex-end",
    },
    serviceTitle: {
      color: Color.black,
      fontSize: hp(1.6),
      fontWeight: "700",
    },
    serviceImageContainer: { position: "absolute", right: 0 },
    serviceDivider: { width: ms(16) },
    icon: { height: hp(8), width: hp(8), marginTop: -hp(0.8) },
    moneyContainer: {
      paddingVertical: mvs(10),
      backgroundColor: Color.primaryDark,
      marginTop: mvs(10),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    moneyView: {
      justifyContent: "center",
      alignItems: "center",
    },
    moneyIcon: {
      height: ms(32),
      width: ms(32),
      tintColor: Color.chock_black,
    },
    moneyText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.chock_black,
      marginTop: ms(10),
    },
    moneyNomberText: {
      fontSize: ms(12),
      fontFamily: FONTS.robotoRegular,
      color: Color.dark_theme,
    },
  });
};

export default ServicesScreen;
