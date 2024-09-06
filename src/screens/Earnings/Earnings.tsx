import React, { useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";
import { HeaderWithTitle } from "components/molecules";
import useAppDispatch from "hooks/useAppDispatch";
import {
  EventSelectors,
  getEarningsRequest,
  getTicketsRequest,
} from "store/slices/event";
import { Loader } from "components/atoms";

const Earnings = ({ navigation, route }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useAppDispatch();
  const { earningList, loading } = EventSelectors();

  async function getEarnings() {
    dispatch(getEarningsRequest());
    // dispatch(getTicketsRequest())
  }

  useEffect(() => {
    getEarnings();
  }, []);

  const DetailOption = (props: any) => {
    const { detail, type } = props;

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image
          style={styles.iconPic}
          resizeMode="contain"
          source={
            type === "date"
              ? Images.date
              : type === "location"
              ? Images.location
              : Images.time
          }
        />
        <Text style={styles.txt}>{detail}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: Color.plain_white,
        },
      ]}
    >
      {loading && <Loader visible={loading} />}
      <HeaderWithTitle title="Earnings" blackBar />
      <FlatList
        data={earningList}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EarningDetail", {
                  item: item,
                });
              }}
              style={[
                styles.innerContainer,
                {
                  backgroundColor: Color.plain_white,
                },
              ]}
            >
              <View style={styles.eventView}>
                <Image
                  resizeMode="cover"
                  style={styles.eventPhoto}
                  source={{ uri: item?.eventPhoto }}
                />
                <View style={styles.eventDetails}>
                  <Text style={styles.nameTxt}>{item?.eventName}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      marginTop: hp(1),
                    }}
                  >
                    <DetailOption
                      type={"date"}
                      detail={item?.eventDateCreated || ""}
                    />
                    <DetailOption
                      type={"time"}
                      detail={item?.eventstartTime?.replace(/:.{2}$/, "")}
                    />
                    <DetailOption
                      type={"location"}
                      detail={item?.location?.city || item?.location?.state}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
    eventView: {
      flexDirection: "row",
      width: "90%",
    },
    eventPhoto: {
      width: wp(23),
      height: hp(8),
      borderRadius: 8,
    },
    iconPic: {
      width: hp(1.6),
      height: hp(1.6),
      marginRight: wp(1),
    },
    eventDetails: {
      padding: wp(2),
      width: "75%",
    },
    nameTxt: {
      fontSize: hp(2),
      fontWeight: "500",
      color: Color.black,
    },
    txt: {
      fontSize: hp(1.2),
      fontWeight: "400",
      color: Color.black,
    },
  });
};

export default Earnings;
