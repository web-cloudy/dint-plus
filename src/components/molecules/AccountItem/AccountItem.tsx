import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ms, mvs } from "react-native-size-matters";
import { FONTS } from "constants";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { Images } from "assets/images";
import { wp } from "utils/metrix";

const AccountItemForChangeUi = ({
  showIcon = true,
  icon,
  title,
  showLine = true,
  onPress,
  children,
  leftIconStyle,
  titleStyle,
  subTitle,
  subTitleStyle,
  showSubTitle = false,
  showAerowDownIcon = true,
  custemIcon,
}) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.mapView}>
        <View style={styles.innerView}>
          {showIcon ? (
            <Image
              resizeMode="contain"
              style={[styles.icon, leftIconStyle]}
              source={icon}
            />
          ) : (
            custemIcon
          )}
          <View>
            <Text style={[styles.nameText, titleStyle]}>{title}</Text>
            {showSubTitle && (
              <Text style={[styles.nameText1, subTitleStyle]}>{subTitle}</Text>
            )}
          </View>
        </View>
        <View style={styles.leftIconVIew}>
          {children}
          {showAerowDownIcon && (
            <Image
              resizeMode="contain"
              style={styles.leftAerrowIcon}
              source={Images.arrowRight}
            />
          )}
        </View>
      </TouchableOpacity>
      {showLine && <View style={styles.line} />}
    </>
  );
};

export default AccountItemForChangeUi;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    mapView: {
      backgroundColor: Color.white,
      paddingVertical: mvs(15),
      paddingHorizontal: ms(15),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    nameText: {
      color: Color.black,
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
    },
    nameText1: {
      color: Color.grey,
      fontSize: ms(14),
      fontFamily: FONTS.robotoRegular,
    },
    icon: {
      width: ms(24),
      height: ms(24),
      tintColor: Color.black,
      marginRight: ms(10),
    },
    innerView: {
      flexDirection: "row",
      alignItems: "center",
    },
    leftAerrowIcon: {
      width: ms(12),
      height: ms(12),
      tintColor: Color.black,
    },
    line: {
      borderBottomWidth: 1,
      borderBottomColor: Color.deleteBtnColor,
      width: wp(90),
      alignSelf: "center",
    },
    leftIconVIew: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
};
