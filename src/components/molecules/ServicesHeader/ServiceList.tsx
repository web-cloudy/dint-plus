import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { wp } from "utils/metrix";
import { ms, mvs } from "react-native-size-matters";
import { FONTS } from "constants";

const ServiceList = ({ title, serviceName, image, serviceStyle, onPress }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  return (
    <View style={[styles.container, serviceStyle]}>
      <Text style={styles.serviceText}>{title}</Text>
      <TouchableOpacity onPress={onPress} style={styles.innerView}>
        <Image resizeMode="contain" style={styles.image} source={image} />
        <Text style={styles.mobileText}>{serviceName}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ServiceList;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      width: wp(100),
      backgroundColor: Color.white,
      marginTop: mvs(10),
      paddingVertical: mvs(20),
      paddingHorizontal: ms(20),
    },
    serviceText: {
      fontSize: ms(16),
      color: Color.black,
      fontFamily: FONTS.robotoRegular,
    },
    innerView: {
      marginTop: mvs(30),
      alignItems: "center",
      width: ms(70),
    },
    mobileText: {
      fontSize: ms(12),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
      textAlign: "center",
      width: ms(71),
      marginTop: mvs(10),
    },
    image: {
      width: ms(32),
      height: mvs(32),
      tintColor: Color.black,
    },
  });
};
