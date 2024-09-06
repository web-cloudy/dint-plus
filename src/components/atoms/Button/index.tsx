import React, { FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ms, mvs, vs } from "react-native-size-matters";
import  {getCurrentTheme}  from "constants/Colors";
import { hp } from "utils/metrix";
import { useTheme } from "contexts/ThemeContext";

type Props = {
  text: string;
  onPress: () => void;
  textStyle?: StyleProp<TextStyle>;
  btnStyle?: StyleProp<ViewStyle>;
};

const Button: FunctionComponent<Props> = ({
  text,
  onPress,
  textStyle,
  btnStyle,
}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const style = screenStyles(Color);
  return (
    <TouchableOpacity onPress={onPress} style={[style.btnContainer, btnStyle]}>
      <Text style={[style.btnText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
  btnContainer: {
    backgroundColor: Color.primary,
    borderRadius: mvs(30),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: ms(20),
    paddingVertical: mvs(10),
    height: hp(6)
  },
  btnText: {
    fontSize: hp(2),
    color: Color.chock_black,
    fontWeight: "600",
  },
})}
