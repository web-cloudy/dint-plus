import React, { FunctionComponent, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput as RnTextInput,
  ViewStyle,
  StyleProp,
  KeyboardTypeOptions,
  Image,
  TouchableOpacity,
  TextStyle,
  ImageSourcePropType,
} from "react-native";
import Eye from "assets/images/eye.png";
import EyeHide from "assets/images/hide.png";
import { ms } from "react-native-size-matters";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";

type Props = {
  lable?: string;
  placeholder: string;
  value: string;
  containerStyle?: StyleProp<ViewStyle>;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  isPassword?: boolean;
  isCountryCodeDisplayed?: boolean;
  placeholderTextColor?: string;
  inputViewStyle?: StyleProp<ViewStyle>;
  numberOfLines?: number;
  multiline?: boolean;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  onFocus?: any;
  editable?: boolean;
  maxLength?: number;
  icon?: ImageSourcePropType;
  error?: boolean;
};

const TextInput: FunctionComponent<Props> = ({
  lable,
  placeholder,
  value,
  containerStyle,
  onChangeText,
  keyboardType,
  isPassword,
  isCountryCodeDisplayed,
  placeholderTextColor,
  inputViewStyle,
  numberOfLines,
  multiline,
  inputStyle,
  labelStyle,
  onFocus,
  editable,
  maxLength,
  icon,
  error,
}: Props) => {
  const [showPass, setShowPass] = useState<boolean>(true);
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const style = screenStyles(Color);

  const onEyePress = useCallback(() => {
    setShowPass(!showPass);
  }, [showPass]);

  return (
    <View style={[style.container, containerStyle]}>
      <Text style={[{ color: Color.black }, labelStyle && labelStyle]}>
        {lable}
      </Text>
      <TouchableOpacity
        activeOpacity={1.0}
        onPress={onFocus}
        style={[
          style.textInputContainer,
          {
            borderColor:
              error === true
                ? Color.red
                : Color.theme === "dark"
                ? Color.input_background
                : "#353535",
          },
          inputViewStyle && inputViewStyle,
        ]}
      >
        {isCountryCodeDisplayed && (
          <Text style={style.countryCodeStyle}>+1</Text>
        )}
        {onFocus ? (
          <Text style={[style.textInput, inputStyle && inputStyle]}>
            {value || placeholder}
          </Text>
        ) : (
          <RnTextInput
            value={value}
            placeholder={placeholder}
            onChangeText={onChangeText}
            secureTextEntry={isPassword ? showPass : false}
            style={[style.textInput, inputStyle && inputStyle]}
            keyboardType={keyboardType}
            autoCapitalize="none"
            placeholderTextColor={
              placeholderTextColor ? placeholderTextColor : Color.placeholder
            }
            numberOfLines={numberOfLines}
            multiline={multiline || false}
            editable={editable}
            maxLength={maxLength}
          />
        )}
        {isPassword ? (
          <TouchableOpacity onPress={onEyePress} style={style.eyeBtn}>
            <Image style={style.eyeImg} source={showPass ? Eye : EyeHide} />
          </TouchableOpacity>
        ) : (
          <View style={style.eyeBtn}>
            <View style={style.eyeImg} />
          </View>
        )}

        {icon && (
          <TouchableOpacity onPress={onEyePress} style={style.eyeBtn}>
            <Image style={style.eyeImg} source={icon} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TextInput;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    countryCodeStyle: {
      fontSize: ms(18),
      fontWeight: "600",
      color: Color.inputPlaceholder,
      marginRight: ms(14),
    },
    eyeImg: {
      width: 20,
      height: 20,
      tintColor: Color.black,
    },
    eyeBtn: {
      paddingStart: 5,
    },
    textInput: {
      color: Color.black,
      flex: 1,
      paddingVertical: 0,
    },
    container: {},
    textInputContainer: {
      paddingHorizontal: ms(16),
      paddingVertical: ms(8),
      borderWidth: 1,
      borderColor: Color.theme === "dark" ? Color.input_background : "#353535",
      borderRadius: ms(24),
      marginVertical: ms(8),
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Color.input_background,
    },
  });
};
