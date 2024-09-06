import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

const RailSelected = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");

  return (
    <View style={[styles.root, { backgroundColor: Color.input_background }]} />
  );
};

export default memo(RailSelected);

const styles = StyleSheet.create({
  root: {
    height: 3,
    borderRadius: 2,
  },
});
