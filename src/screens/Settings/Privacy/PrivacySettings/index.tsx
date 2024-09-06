import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Switch,
  Image,
  ScrollView,
} from "react-native";
import { ms, mvs } from "react-native-size-matters";
import { LineDivider } from "components/atoms";
import { AccountItem, HeaderWithTitle } from "components/molecules";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";
import { FONTS } from "constants/fonts";
import AccountItemForChangeUi from "components/molecules/AccountItem/AccountItem";
import { ChatSelectors, disappearingTimer } from "store/slices/chat";
import { useDispatch } from "react-redux";

const PrivacySettingsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useDispatch();

  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const { disappearingTimerDataState } = ChatSelectors();

  const disappearingMessageTimer = async () => {
    const res = await dispatch(disappearingTimer());
    console.log("🚀 ~ dis ~ res:", res);
  };

  useEffect(() => {
    disappearingMessageTimer();
  }, []);

  const showTimer = () => {
    if (
      disappearingTimerDataState == null ||
      disappearingTimerDataState == undefined ||
      disappearingTimerDataState == 0
    ) {
      return "Off";
    } else if (parseInt(disappearingTimerDataState) == 2073600) {
      return "24 Hours";
    } else if (parseInt(disappearingTimerDataState) == 604800) {
      return "7 Days";
    } else if (parseInt(disappearingTimerDataState) == 7776000) {
      return "90 Days";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="Privacy Policy" blackBar />
      <ScrollView>
        <View style={styles.bodyContainer}>
          <View style={styles.firstContainer}>
            <AccountItem
              line
              title={"Calls"}
              onPress={() => {}}
              option="Nobody"
            />
            <AccountItem
              line
              title={"Profile Photo"}
              onPress={() => {}}
              option="1 Excluded"
            />
            <AccountItem
              line
              title={"About"}
              onPress={() => {}}
              option="1 Excluded"
            />

            <AccountItem
              line
              title={"Status"}
              onPress={() => {}}
              option="Everyone"
            />
            <AccountItem redTxt={"Reset Settings"} />
          </View>

          <View style={styles.settingItemContainer}>
            <Text style={styles.title}>Live Location</Text>

            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? Color.primary : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>

          <Text style={styles.listOfChats}>
            List of chats where you are sharing live location
          </Text>
          <View style={styles.secondContainer}>
            <AccountItem line title={"Calls"} onPress={() => {}} />
            <AccountItem title={"Blocked"} onPress={() => {}} />
          </View>

          <Text style={styles.disappearingText}>Disappearing messages</Text>
          <View style={styles.newFriendView}>
            <AccountItemForChangeUi
              title="Default Timer"
              icon={Images.disappearingMessage}
              onPress={() => {
                navigation.navigate("DisappearingMessagesScreen");
              }}
              children={<Text style={styles.childrenText}>{showTimer()}</Text>}
              showLine={false}
            />
          </View>
          {/* <View style={styles.settingItemContainer}>
            <Text style={styles.title}>Default Timer</Text>

            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? Color.primary : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View> */}
          <Text style={styles.listOfChats}>
            Start new chats with disappearing messages set to your time
          </Text>

          <View style={styles.settingItemContainer}>
            <Text style={styles.title}>Read Receipts</Text>

            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? Color.primary : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <Text style={styles.listOfChats}>
            If you turn off read receipts , you won’t be able to see read
            receipts from other people. Read receipts are always sent for group
            chats
          </Text>

          <View style={styles.secondContainer}>
            <AccountItem line title={"App Lock"} onPress={() => {}} />
            <AccountItem title={"Chat Lock"} onPress={() => {}} />
          </View>

          <View style={styles.secondContainer}>
            <AccountItem
              title={"Advanced"}
              onPress={() => {
                navigation.navigate("AdvanceSettings");
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    bodyContainer: { flex: 1, paddingBottom: hp(5) },
    firstContainer: { marginTop: mvs(32) },
    secondContainer: { marginTop: hp(3) },
    settingItemContainer: {
      paddingHorizontal: ms(16),
      paddingVertical: mvs(10),
      backgroundColor: Color.white,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: hp(2),
    },
    title: {
      fontSize: mvs(14),
      color: Color.black,
    },
    value: { fontSize: mvs(14), marginEnd: mvs(8), color: Color.grey },
    valueContainer: { flexDirection: "row", alignItems: "center" },
    listOfChats: {
      paddingHorizontal: ms(16),
      fontSize: hp(1.4),
      marginTop: mvs(10),
      color: Color.grey,
    },
    icon: {
      height: hp(1.5),
      width: hp(1.5),
      tintColor: Color.arrow_icon,
    },
    redTxt: {
      fontSize: hp(1.8),
      color: Color.red,
      flex: 1,
      backgroundColor: Color.white,
      paddingHorizontal: wp(5),
      paddingBottom: hp(2),
    },
    disappearingText: {
      fontSize: ms(14),
      fontFamily: FONTS.robotoBold,
      color: Color.black,
      paddingHorizontal: ms(16),
      marginTop: mvs(20),
    },
    newFriendView: {
      marginTop: mvs(10),
      backgroundColor: Color.white,
      width: wp(100),
    },

    childrenText: {
      fontSize: mvs(16),
      color: Color.black,
      fontFamily: FONTS.robotoRegular,
      marginRight: mvs(5),
    },
  });
};

export default PrivacySettingsScreen;
