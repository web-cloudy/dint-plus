import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";

const HeaderWithBackButton = () => {
  const { theme, setTheme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  return (
    <View>
      <Text>HeaderWithBackButton</Text>
    </View>
  );
};

export default HeaderWithBackButton;

const screenStyles = (Color: any) => {
  return StyleSheet.create({});
};
