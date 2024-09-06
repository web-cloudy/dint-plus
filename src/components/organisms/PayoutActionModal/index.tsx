import React, { FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { ms, mvs } from "react-native-size-matters";
import { LineDivider } from "components/atoms";
import { useTheme } from "contexts/ThemeContext";

type Props = {
  isVisible: boolean;
  hideModal: () => void;
  onSetAsDefault: () => void;
  onPressCancel: () => void;
  onPressDelete: () => void;
  onPressEdit: () => void;
};

const PayoutActionModal: FunctionComponent<Props> = ({
  isVisible,
  hideModal,
  onSetAsDefault,
  onPressCancel,
  onPressDelete,
  onPressEdit,
}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  const OptionsView = ({ mode, onPress }: { mode: string; onPress: any }) => {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={styles.optionView}
        onPress={onPress}
      >
        <Text style={styles.modeText}>{mode}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={isVisible} onRequestClose={hideModal} transparent={true}>
      <Pressable style={styles.outerContainer} onPress={hideModal}>
        <View style={styles.innerContainer}>
          <Text style={styles.selectImage}>Payout</Text>
          <LineDivider />
          <OptionsView mode={"Set as default"} onPress={onSetAsDefault} />
          <OptionsView mode={"Edit Payout"} onPress={onPressEdit} />
          <OptionsView mode={"Delete Payout"} onPress={onPressDelete} />
          <Text style={styles.cancel} onPress={onPressCancel}>
            Cancel
          </Text>
        </View>
      </Pressable>
    </Modal>
  );
};

export default PayoutActionModal;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff30",
    },
    optionView: {
      width: "100%",
      justifyContent: "space-between",
      flexDirection: "row",
      paddingVertical: mvs(15),
      paddingHorizontal: ms(25),
      borderBottomWidth: 1,
      borderBottomColor: Color.backgroundColor,
      alignItems: "center",
    },
    radioButton: {
      height: ms(20),
      width: ms(20),
      borderRadius: 100,
      borderWidth: 1,
      borderColor: Color.black,
      justifyContent: "center",
      alignItems: "center",
    },
    radioInner: {
      height: ms(12),
      width: ms(12),
      borderRadius: 100,
    },
    outerContainer: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: Color.grey_transparent,
    },
    innerContainer: {
      borderRadius: ms(20),
      backgroundColor: Color.white,
      paddingVertical: mvs(16),
      elevation: 5,
      bottom: 0,
      position: "absolute",
      width: "100%",
    },
    selectImage: {
      color: Color.black,
      fontSize: mvs(16),
      fontWeight: "600",
      paddingBottom: mvs(16),
      textAlign: "center",
    },

    cancel: {
      color: Color.black,
      fontSize: mvs(16),
      fontWeight: "500",
      paddingVertical: mvs(15),
      textAlign: "center",
    },

    save: {
      color: Color.grey,
      fontSize: mvs(20),
      fontWeight: "500",
      textAlign: "center",
    },

    modeText: {
      color: Color.black,
      fontSize: mvs(15),
      fontWeight: "400",
      textAlign: "left",
    },
    descText: {
      color: Color.grey,
      fontSize: mvs(14),
      fontWeight: "500",
      textAlign: "left",
    },
    saveBtn: {
      borderRadius: 10,
      marginHorizontal: ms(25),
      marginTop: ms(25),
    },
  });
};
