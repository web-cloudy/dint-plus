import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { ServicesHeader } from "components/molecules";
import { ms, mvs } from "react-native-size-matters";
import { FONTS } from "constants/fonts";
import MessageTimerData from "constants/MessageTimerData";
import { wp } from "utils/metrix";
import { Images } from "assets/images";
import {
  ChatSelectors,
  disappearingTimer,
  updateDisappearingTimer,
} from "store/slices/chat";
import { useDispatch } from "react-redux";
import { showToastSuccess } from "components";

const DisappearingMessagesScreen = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [selctedIndex, setSelectedIndex] = useState(0);
  const { disappearingTimerDataState } = ChatSelectors();
  console.log(
    "🚀 ~ DisappearingMessagesScreen ~ disappearingTimerDataState:",
    disappearingTimerDataState
  );
  const dispatch = useDispatch();

  const handleSelectedOnpress = async (item, index) => {
    setSelectedIndex(index);
    try {
      const res = await dispatch(
        updateDisappearingTimer({ default_disappearing_timer: item?.value })
      );
      if (res?.payload) {
        showToastSuccess(res?.payload?.message);
        const res1 = await dispatch(disappearingTimer());
      }
      console.log("🚀 ~ handleSelectedOnpress ~ res:", JSON.stringify(res));
    } catch (error) {}
  };

  const showTimer = () => {
    if (
      disappearingTimerDataState == null ||
      disappearingTimerDataState == undefined ||
      disappearingTimerDataState == 0
    ) {
      setSelectedIndex(3);
    } else if (parseInt(disappearingTimerDataState) == 2073600) {
      setSelectedIndex(0);
    } else if (parseInt(disappearingTimerDataState) == 604800) {
      setSelectedIndex(1);
    } else if (parseInt(disappearingTimerDataState) == 7776000) {
      setSelectedIndex(2);
    }
  };

  useEffect(() => {
    showTimer();
  }, []);

  return (
    <View style={styles.container}>
      <ServicesHeader title="Default message timer" showRightIcon={false} />
      <Text style={styles.startText}>
        Start new chats with a disappearing message timer set to
      </Text>
      <View style={styles.messageTimerDataView}>
        {MessageTimerData.map((item, index) => (
          <>
            <TouchableOpacity
              key={index.toString()}
              onPress={() => {
                handleSelectedOnpress(item, index);
              }}
              style={styles.mapView}
            >
              <View style={styles.itemTextView}>
                <Text style={styles.itemNameText}>{item?.name}</Text>
                {index == selctedIndex ? (
                  <Image
                    resizeMode="contain"
                    style={styles.selectedIcon}
                    source={Images.toastSucess}
                  />
                ) : (
                  <View style={styles.selectedIcon} />
                )}
              </View>
            </TouchableOpacity>
            {index != MessageTimerData.length - 1 && (
              <View style={styles.line} />
            )}
          </>
        ))}
      </View>
    </View>
  );
};

export default DisappearingMessagesScreen;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    startText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.grey,
      paddingHorizontal: ms(16),
      marginTop: mvs(30),
    },
    mapView: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: mvs(12),
    },
    itemNameText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
    },
    itemTextView: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    line: {
      borderBottomWidth: 1,
      borderBottomColor: Color.deleteBtnColor,
      width: wp(90),
      alignSelf: "center",
    },
    messageTimerDataView: {
      backgroundColor: Color.white,
      marginTop: mvs(10),
      paddingHorizontal: ms(16),
    },
    selectedIcon: {
      width: mvs(24),
      height: mvs(24),
      tintColor: Color.primary,
    },
  });
};
