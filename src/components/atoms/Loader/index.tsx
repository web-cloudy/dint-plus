import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import React, { FunctionComponent } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

type Props = {
  visible: boolean;
  size?: string;
};

const Loader: FunctionComponent<Props> = ({ visible, size }: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  return (
    <>
      {visible && (
        <View style={style.container}>
          <ActivityIndicator size={size ? size : "large"} color={Color.black} />
        </View>
      )}
    </>
  );
};

export default Loader;

const style = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000
  },
});
