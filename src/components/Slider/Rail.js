import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import React, { memo } from "react";
import { View, StyleSheet } from "react-native";

const Rail = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: Color.primary,
        },
      ]}
    />
  );
};

export default memo(Rail);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginHorizontal: 0,
    height: 3,
    borderRadius: 2,
  },
});
