import React, { FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";

type Props = {
  isVisible: boolean;
  hideModal: () => void;
  onPressAllow: () => void;
  onPressDontAllow: () => void;
};

const AllowTermsModal: FunctionComponent<Props> = ({
  isVisible,
  hideModal,
  onPressAllow,
  onPressDontAllow,
}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  return (
    <Modal visible={isVisible} onRequestClose={hideModal} transparent={true}>
      <SafeAreaView style={styles.container}>
        <Pressable style={styles.outerContainer} onPress={hideModal}>
          <Pressable>
            <View style={styles.innerContainer}>
              <Text style={styles.titleText}>
                "Dint Plus" Would Like to Send You Notifications
              </Text>
              <Text style={styles.descText}>
                Notifications may include alerts, sounds, and icon badges. These
                can be configured in Settings.
              </Text>

              <View style={styles.btnView}>
                <TouchableOpacity
                  style={styles.btnBox}
                  onPress={onPressDontAllow}
                >
                  <Text style={styles.btnText}>Don't Allow </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.btnBox,
                    { borderLeftWidth: 1, borderLeftColor: Color.grey },
                  ]}
                  onPress={onPressAllow}
                >
                  <Text style={styles.btnText}>Allow </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

export default AllowTermsModal;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#28282870",
    },
    outerContainer: { flex: 1, justifyContent: "center" },
    innerContainer: {
      borderRadius: 12,
      backgroundColor: Color.input_background,
      paddingTop: hp(2),
      width: wp(75),
      elevation: 5,
      alignSelf: "center",
    },
    titleText: {
      color: Color.black,
      fontSize: hp(1.9),
      fontWeight: "600",
      textAlign: "center",
      paddingHorizontal: hp(2),
    },
    descText: {
      color: Color.black,
      fontSize: hp(1.5),
      fontWeight: "300",
      textAlign: "center",
      paddingVertical: hp(2),
      paddingHorizontal: hp(2),
    },
    btnView: {
      borderTopColor: Color.grey,
      borderTopWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    btnBox: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: hp(2),
    },
    btnText: {
      color: Color.black,
      fontSize: hp(2),
      fontWeight: "600",
      textAlign: "center",
    },
  });
};
