import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import React from "react";
import { View, StyleSheet } from "react-native";
import { hp } from "utils/metrix";

const Thumb = ({ name }: { name: string }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  return <View style={name === "high" ? styles.rootHigh : styles.rootLow} />;
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    rootLow: {
      width: hp(3),
      height: hp(3),
      borderRadius: 100,
      backgroundColor: Color.primary,
    },
    rootHigh: {
      width: hp(3.8),
      height: hp(3.8),
      borderRadius: 100,
      borderWidth: 3,
      borderColor: "grey",
      backgroundColor: "red",
    },
  });
};

export default Thumb;
