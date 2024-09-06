import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { ServicesHeader } from "components/molecules";
import { hp, wp } from "utils/metrix";
import { ms, mvs } from "react-native-size-matters";
import { Images } from "assets/images";
import { FONTS } from "constants/fonts";
import ShowStatusWithTitle from "components/MyStatus/ShowStatusWithTitle";
import {
  Activities,
  Breaks,
  Feelings,
  More,
  WorkAndStudy,
} from "constants/MyStatusData";

const MyStatusScreen = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  return (
    <View style={styles.container}>
      <ServicesHeader
        showSubHeader={true}
        subHeader="Visible to friends for 24 hours"
        title="My Status"
        showRightIcon={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: mvs(30) }}
      >
        <View style={styles.newFriendView}>
          <Image
            resizeMode="contain"
            style={styles.statuasIcon}
            source={Images.statuas}
          />
          <Text style={styles.customizeText}>Customize Status</Text>
        </View>
        <ShowStatusWithTitle
          title={"Feelings"}
          onPress={() => {}}
          data={Feelings}
        />

        <ShowStatusWithTitle
          title={"Work & Study"}
          onPress={() => {}}
          data={WorkAndStudy}
        />

        <ShowStatusWithTitle
          title={"Activities"}
          onPress={() => {}}
          data={Activities}
        />

        <ShowStatusWithTitle
          title={"Breaks"}
          onPress={() => {}}
          data={Breaks}
        />
        <ShowStatusWithTitle title={"More"} onPress={() => {}} data={More} />
      </ScrollView>
    </View>
  );
};

export default MyStatusScreen;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    newFriendView: {
      width: wp(100),
      backgroundColor: Color.white,
      alignItems: "center",
      justifyContent: "center",
      marginTop: mvs(15),
      paddingVertical: mvs(20),
    },
    statuasIcon: {
      width: mvs(32),
      height: mvs(32),
      tintColor: Color.black,
    },
    customizeText: {
      fontSize: mvs(18),
      color: Color.grey,
      fontFamily: FONTS.robotoRegular,
      marginTop: mvs(10),
    },
  });
};
