import React, { FunctionComponent } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { IEvent } from "types/event";
import { hp, wp } from "utils/metrix";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { Images } from "assets/images";
import { Button } from "components/atoms";

type Props = {
  item: IEvent;
  index: number;
  onPressViewDetail: () => void;
};

const EventItem: FunctionComponent<Props> = ({
  item,
  index,
  onPressViewDetail,
}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const style = screenStyles(Color);

  return (
    <View style={style.container}>
      {/* top image section */}
      <View style={style.topSection}>
        <Image
          resizeMode="cover"
          source={{ uri: item?.eventPhoto }}
          style={style.img}
        />
        <Text style={style.nameTxt}>{item?.eventName}</Text>
      </View>
      <View style={style.mid}>
        <View>
          {String(item?.price)?.length > 0 && (
            <View style={style.midSection}>
              <Image
                resizeMode="contain"
                source={Images.price}
                style={style.dateIcon}
              />
              <Text style={style.timeText}>${item?.price}</Text>
            </View>
          )}
          <View style={style.midSection}>
            <Image
              resizeMode="contain"
              source={Images.date}
              style={style.dateIcon}
            />
            <Text style={style.timeText}>{item?.eventDate}</Text>
          </View>

          <View style={style.midSection}>
            <Image
              resizeMode="contain"
              source={Images.time}
              style={style.dateIcon}
            />
            <Text style={style.timeText}>
              {item?.eventstartTime.replace(/:.{2}$/, "")}{" "}
              {item?.eventEndTime
                ? " To " + item?.eventEndTime.replace(/:.{2}$/, "")
                : ""}
            </Text>
          </View>
          {item?.location && item?.is_public && (
            <View style={style.midSection}>
              <Image
                resizeMode="contain"
                source={Images.location}
                style={style.dateIcon}
              />
              <Text style={style.timeText}>
                {item?.location?.city || item?.location?.state}
              </Text>
            </View>
          )}
        </View>
        <Button
          text="View Details"
          btnStyle={style.btnStyle}
          textStyle={style.btnText}
          onPress={onPressViewDetail}
        />
      </View>
    </View>
  );
};

export default EventItem;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      width: wp(100),
      alignSelf: "center",
      marginBottom: hp(2),
      backgroundColor: Color.white,
      padding: hp(2),
    },
    topSection: {
      alignItems: "center",
      justifyContent: "center",
    },
    img: {
      height: hp(16.5),
      width: wp(100),
      alignSelf: "center",
      marginTop: -hp(2),
    },
    nameTxt: {
      fontSize: hp(1.8),
      fontWeight: "600",
      marginLeft: wp(2),
      color: Color.black,
      alignSelf: "flex-start",
      marginTop: hp(2),
    },
    timeText: {
      fontSize: hp(1.4),
      fontWeight: "400",
      marginLeft: wp(2),
      color: Color.black,
    },
    dateIcon: {
      height: hp(1.6),
      width: hp(1.6),
      tintColor: Color.black,
    },
    mid: {
      flexDirection: "row",
      justifyContent: "space-between",
      // marginTop: hp(2),
    },
    midSection: {
      marginTop: hp(1),
      flexDirection: "row",
      alignItems: "center",
      marginLeft: wp(2),
    },
    btnStyle: {
      alignSelf: "flex-end",
      width: wp(20),
      borderRadius: 7,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 0,
      paddingVertical: 0,
      height: hp(2.4),
      marginTop: hp(2),
    },
    btnText: {
      fontSize: hp(1.2),
      fontWeight: "700",
      color: Color.chock_black,
    },
  });
};
