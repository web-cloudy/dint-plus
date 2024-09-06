import React, { useState } from "react";
import {
  Image,
  Keyboard,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { hp, wp } from "utils/metrix";
import { ms } from "react-native-size-matters";
import { Images } from "assets/images";

interface ButtonProps {
  value?: string;
  containerStyle?: StyleProp<ViewStyle>;
  placeholder?: string;
  onChangeText?: (test: string) => void;
  type?: string;
  onClickOutside?: any;
  data?: any[];
  labelStyle?: StyleProp<TextStyle>;
  label?: string;
  selectedValue?: string;
}
export const PickerField = ({
  value,
  containerStyle,
  placeholder,
  onChangeText,
  type,
  onClickOutside,
  data,
  label,
  labelStyle,
  selectedValue,
}: ButtonProps) => {
  const { theme } = useTheme();
  const Colors = getCurrentTheme(theme || "light");
  const styles = screenStyles(Colors);
  let LIST =
    type === "miles"
      ? [
          { id: 0, label: "Within 5 miles", label2: "5" },
          { id: 1, label: "Within 10 miles", label2: "10" },
          { id: 2, label: "Within 15 miles", label2: "15" },
          { id: 3, label: "Within 20 miles", label2: "20" },
          { id: 4, label: "Within 25 miles", label2: "25" },
        ]
      : type === "frequency"
      ? [
          { id: 0, label: "Once", label2: "" },
          { id: 1, label: "Weekly", label2: "" },
          { id: 2, label: "Monthly", label2: "" },
          { id: 3, label: "Yearly", label2: "" },
        ]
      : type === "eventType"
      ? [
          {
            id: 0,
            label: "Live Event",
            label2: "For physical, in-person events.",
          },
          {
            id: 1,
            label: "Virtual Event",
            label2: "For virtual events conducted over the internet.",
          },
        ]
      : type === "price"
      ? [
          {
            id: 0,
            label: "Paid",
            label2: "",
          },
          {
            id: 1,
            label: "Free",
            label2: "",
          },
        ]
      : data;

  const [showList, setShowList] = useState(false);
  return (
    <>
      <Text style={[{ color: Colors.black }, labelStyle && labelStyle]}>
        {label}
      </Text>
      <TouchableOpacity
        activeOpacity={1.0}
        style={[styles.container, containerStyle]}
        onPress={() => {
          setShowList(!showList), Keyboard.dismiss();
        }}
      >
        {showList && type != "miles" && (
          <View
            style={[
              styles.listContainer,
              {
                width: type === "eventType" ? wp(85) : wp(38),
                padding: type === "eventType" ? wp(1.5) : wp(3),
              },
            ]}
          >
            {LIST?.map((res, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={1.0}
                  onPress={() => {
                    Keyboard.dismiss();
                    onChangeText && onChangeText(res?.label),
                      setShowList(false);
                  }}
                  style={[
                    styles.optionView,
                    {
                      marginLeft: type === "price" ? wp(1) : wp(5),
                      borderBottomWidth:
                        type === "price"
                          ? 0
                          : index === LIST?.length - 1
                          ? 0
                          : 1,
                      flexDirection: "row",
                    },
                  ]}
                >
                  {type === "price" && (
                    <View
                      style={{
                        marginRight: wp(5),
                        height: hp(2.4),
                        width: hp(2.4),
                        borderColor: Colors.primary,
                        borderWidth: 1,
                        backgroundColor:
                          value === res?.label ? Colors.primary : "transparent",
                      }}
                    />
                  )}
                  <View>
                    <Text
                      style={[
                        styles.optionText,
                        { fontWeight: res?.label2 ? "600" : "400" },
                      ]}
                    >
                      {res?.label}
                      {res?.label2 && (
                        <Text style={styles.optionText}> - {res?.label2}</Text>
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <Text style={styles.inputText}>{value || placeholder}</Text>
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={() => setShowList(true)}
          style={styles.iconView}
        >
          <Image
            resizeMode="contain"
            style={styles.icon}
            source={Images.arrowRight}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      {showList && type === "miles" && (
        <View style={styles.listContainer2}>
          {LIST?.map((res, index) => {
            return (
              <TouchableOpacity
                activeOpacity={1.0}
                onPress={() => {
                  Keyboard.dismiss();
                  onChangeText && onChangeText(res?.label2), setShowList(false);
                }}
                style={[
                  styles.optionView,
                  {
                    marginLeft: wp(5),
                    borderBottomWidth: index === LIST?.length - 1 ? 0 : 1,
                    flexDirection: "row",
                    paddingVertical: index === LIST?.length - 1 ? 0 : hp(0.5),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      fontWeight: "400",
                      paddingVertical: hp(1),
                      color: res?.label2?.includes(selectedValue)
                        ? Colors.primary
                        : Colors.black,
                    },
                  ]}
                >
                  {res?.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </>
  );
};

const screenStyles = (Colors: any) => {
  return StyleSheet.create({
    container: {
      paddingHorizontal: ms(16),
      paddingVertical: ms(8),
      borderWidth: 1,
      borderColor:
        Colors.theme === "dark" ? Colors.input_background : "#353535",
      borderRadius: ms(24),
      marginVertical: ms(8),
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.input_background,
      width: "100%",
      zIndex: 1,
    },
    inputContainer: {
      height: ms(18),
      width: "100%",
      backgroundColor: Colors.wild_sand,
      borderRadius: 8,
    },

    inputText: {
      color: Colors.black,
      flex: 1,
      paddingVertical: 0,
    },
    listContainer: {
      backgroundColor: Colors.white,
      position: "absolute",
      zIndex: 1000,
      top: hp(3),
      right: wp(3),
      borderRadius: 8,
      shadowColor: "#000",
      shadowOpacity: 0.5,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 3 },
      elevation: 5,
    },
    listContainer2: {
      backgroundColor: Colors.white,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOpacity: 0.5,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 3 },
      elevation: 5,
    },
    optionView: {
      marginLeft: wp(5),
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
      paddingVertical: hp(0.5),
      alignItems: "center",
    },
    optionText: {
      color: Colors.black,
      flex: 1,
      paddingVertical: hp(0.5),
      fontSize: hp(1.8),
      fontWeight: "400",
    },
    iconView: {
      padding: hp(0.5),
    },
    icon: {
      height: hp(1.4),
      tintColor: Colors.black,
      width: hp(1.4),
      transform: [{ rotate: "90deg" }],
    },
  });
};
