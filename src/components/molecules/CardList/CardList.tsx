import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";

interface Props {
  allCards?: any;
  onClickCard?: any;
  selectedItem?: any;
  type?: string;
}
export const CardList = ({
  allCards,
  onClickCard,
  selectedItem,
  type,
}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const isPayout = type === "payout" ? true : false;
  return (
    <View
      style={{
        flex: 1,
        width: wp(90),
        paddingVertical: hp(2),
        alignSelf: "center",
      }}
    >
      <FlatList
        nestedScrollEnabled={true}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={[...allCards]}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={1.0}
              onPress={() => {
                onClickCard(item);
              }}
              style={{
                backgroundColor: Color.white,
                borderRadius: 15,
                padding: hp(2),
                marginBottom: hp(2),
                shadowColor: "#000",
                shadowOpacity: 0.5,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 3 },
                elevation: 5,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={styles.innerView}>
                <Image style={styles.payIcon} source={Images.payout} />
                <View>
                  <Text
                    style={{
                      color: Color.black,
                      fontWeight: "600",
                      fontSize: hp(1.6),
                    }}
                  >
                    {isPayout
                      ? "Bank Name : " + item?.bank_name
                      : item?.card_name + " ...." + item?.card_number}
                  </Text>
                  <Text
                    style={{
                      color: Color.black,
                      fontWeight: "400",
                      fontSize: hp(1.5),
                    }}
                  >
                    {isPayout
                      ? item?.name_on_account +
                        " ...." +
                        item?.account_number.slice(-4)
                      : "Exp.  " + item?.card_expired}
                  </Text>
                  {/* {isPayout && <Text  style={{
                      color: Color.black,
                      fontWeight: "400",
                      fontSize: hp(1.5),
                    }}>{ " ...." + item?.routing_number.slice(-4)}</Text>} */}
                </View>
              </View>
              <View>
                {item?.is_default && (
                  <Image
                    resizeMode="contain"
                    style={styles.tickIcon}
                    source={Images.selected}
                  />
                )}
                {item?.id === selectedItem?.id && (
                  <Image style={styles.tickIcon} source={Images.tick} />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(90),
    height: hp(15),
    marginVertical: 30,
  },
  tickIcon: {
    height: hp(2.8),
    width: hp(2.8),
  },
  innerView: {
    flexDirection: "row",
  },
  payIcon: {
    height: hp(2.8),
    width: hp(2.8),
    marginRight: wp(4),
    alignSelf: "center",
  },
});
