import React, { FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  ViewStyle,
  TouchableOpacity,
  Image,
  StyleProp,
  TextStyle,
} from "react-native";
import { ms, mvs } from "react-native-size-matters";
import { arrowRight } from "assets/images/index";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { wp } from "utils/metrix";

type Props = {
  style?: ViewStyle;
  title?: string;
  onPress?: () => void;
  viewStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  option?: string;
  line?: boolean;
  redTxt?: string;
};

const AccountItem: FunctionComponent<Props> = ({
  style,
  title,
  onPress,
  titleStyle,
  option,
  line,
  redTxt,
}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  return (
    <TouchableOpacity
      activeOpacity={1.0}
      style={[{ backgroundColor: Color.white }, style]}
      onPress={onPress}
    >
      <TouchableOpacity
        style={[styles.container, { borderBottomWidth: line ? 1 : 0 }]}
        activeOpacity={1.0}
        onPress={onPress}
      >
        {redTxt ? (
          <Text style={[styles.redTxt]}>{redTxt}</Text>
        ) : (
          <>
            <Text style={[styles.title, titleStyle && titleStyle]}>
              {title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                justifyContent: "space-between",
              }}
            >
              {option && <Text style={styles?.option}>{option}</Text>}

              <Image
                resizeMode="contain"
                source={arrowRight}
                style={{
                  width: ms(12),
                  height: ms(12),
                  tintColor: Color.black,
                  alignSelf: "center",
                }}
              />
            </View>
          </>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default AccountItem;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingRight: ms(16),
      paddingVertical: mvs(10),
      backgroundColor: Color.white,
      width: "97%",
      borderBottomColor: "#BBBBBB29",
      marginLeft: ms(16),
    },
    title: {
      fontSize: mvs(14),
      color: Color.black,
      flex: 1,
    },
    redTxt: {
      fontSize: mvs(14),
      color: Color.red,
      fontWeight: "400",
    },
    option: {
      fontSize: mvs(14),
      color: Color.black,
      marginRight: wp(2),
    },
  });
};
