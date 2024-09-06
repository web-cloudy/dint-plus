import React, { FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import { ms, mvs } from "react-native-size-matters";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp } from "utils/metrix";
import { AvatarPNG } from "assets/images";
import Clipboard from "@react-native-clipboard/clipboard";

type Props = {
  isVisible: boolean;
  hideModal: () => void;
  selectedImage?: string;
};

const ImageDisplayModal: FunctionComponent<Props> = ({
  isVisible,
  hideModal,
  selectedImage,
}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  return (
    <Modal visible={isVisible} onRequestClose={hideModal} transparent={true}>
      <Pressable style={styles.outerContainer} onPress={hideModal}>
        <View
          style={[
            styles.modal,
            isVisible ? styles.modalVisible : styles.modalHidden,
          ]}
        >
          <View style={styles.modalContent}>
            <Image
              source={
                selectedImage != "empty" ? { uri: selectedImage } : AvatarPNG
              }
              style={styles.imageIcon}
            />
            <View style={styles.btnView}>
              <TouchableOpacity
                onPress={() => {
                  selectedImage != "empty" &&
                    selectedImage &&
                    Clipboard.setString(selectedImage);
                  hideModal();
                }}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Copy link</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={hideModal} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ImageDisplayModal;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff30",
    },
    imageIcon: {
      height: hp(25),
      width: hp(25),
      borderRadius: hp(20),
    },
    outerContainer: { flex: 1, justifyContent: "center" },
    innerContainer: {
      borderRadius: ms(20),
      backgroundColor: Color.grey,
      paddingHorizontal: ms(16),
      paddingVertical: mvs(16),
      marginHorizontal: ms(40),
      elevation: 5,
    },
    profileImage: {
      width: 200,
      height: 200,
      borderRadius: 100,
    },
    modal: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Color.grey_transparent,
    },
    modalVisible: {
      display: "flex",
    },
    modalHidden: {
      display: "none",
    },
    modalContent: {
      padding: 20,
      borderRadius: 10,
    },

    btnView: {
      backgroundColor: "#212328",
      borderRadius: 10,
      marginTop: hp(2),
    },
    modalButton: {
      padding: hp(1.5),
      borderBottomColor: Color.borderLine,
      borderBottomWidth: 1,
    },
    modalButtonText: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
  });
};
