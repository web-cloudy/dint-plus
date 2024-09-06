import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { wp } from "utils/metrix";
import { ms, mvs } from "react-native-size-matters";
import { FONTS } from "constants/fonts";

const ShowStatusWithTitle = ({ title, data, onPress }) => {
  console.log("🚀 ~ ShowStatusWithTitle ~ data:", data);
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  return (
    <View style={styles.newFriendView}>
      <Text style={styles.titleText}>{title}</Text>
      <View style={styles.container}>
        {data.map((item, index) => (
          <TouchableOpacity onPress={onPress} style={styles.innerView}>
            <Image style={styles.Icon} source={item?.icon} />
            <Text style={styles.nameText}>{item?.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ShowStatusWithTitle;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    newFriendView: {
      width: wp(100),
      backgroundColor: Color.white,
      paddingVertical: mvs(10),
      marginTop: mvs(10),
      paddingHorizontal: ms(16),
    },
    titleText: {
      fontSize: ms(16),
      color: Color.black,
      fontFamily: FONTS.robotoRegular,
    },
    nameText: {
      fontSize: ms(12),
      color: Color.black,
      fontFamily: FONTS.robotoRegular,
      textAlign: "center",
      marginTop: mvs(5),
    },
    Icon: {
      height: mvs(24),
      width: mvs(24),
      tintColor: Color.black,
    },
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: mvs(20),
      marginLeft: ms(-15),
    },
    innerView: {
      alignItems: "center",
      width: ms(71),
      marginBottom: mvs(30),
      marginLeft: ms(15),
    },
  });
};
