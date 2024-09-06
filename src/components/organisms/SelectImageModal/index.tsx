import React, { FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  SafeAreaView,
  Pressable,
} from "react-native";
import { ms, mvs } from "react-native-size-matters";
import { LineDivider } from "components/atoms";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";

type Props = {
  isVisible: boolean;
  hideModal: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
};

const SelectImageModal: FunctionComponent<Props> = ({
  isVisible,
  hideModal,
  onCameraPress,
  onGalleryPress,
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
              <Text style={styles.selectImage}>Select Image</Text>
              <LineDivider />
              <Text
                style={styles.camera}
                onPress={() => {
                  onCameraPress();
                  hideModal();
                }}
              >
                Camera
              </Text>
              <LineDivider />
              <Text
                style={styles.gallery}
                onPress={() => {
                  setTimeout(() => {
                    onGalleryPress();
                  }, 500);
                  hideModal();
                }}
              >
                Gallery
              </Text>
              <LineDivider />
              <Text style={styles.cancel} onPress={hideModal}>
                Cancel
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

export default SelectImageModal;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff30",
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
    selectImage: {
      color: Color.black,
      fontSize: mvs(16),
      fontWeight: "500",
      paddingVertical: mvs(10),
      textAlign: "center",
    },
    camera: {
      color: Color.black,
      fontSize: mvs(16),
      fontWeight: "400",
      paddingVertical: mvs(10),
      textAlign: "center",
    },
    gallery: {
      color: Color.black,
      fontSize: mvs(16),
      fontWeight: "400",
      paddingVertical: mvs(10),
      textAlign: "center",
    },
    cancel: {
      color: "red",
      fontSize: mvs(16),
      fontWeight: "500",
      paddingVertical: mvs(10),
      textAlign: "center",
    },
  });
};
