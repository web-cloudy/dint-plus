import React, { FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ms, mvs } from "react-native-size-matters";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp } from "utils/metrix";

type Props = {
  isVisible: boolean;
  hideModal: () => void;
  onPressNumber: (item: any) => void;
  data?: any;
};

const PhoneNumbersModal: FunctionComponent<Props> = ({
  isVisible,
  hideModal,
  onPressNumber,
  data,
}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  return isVisible ? (
    <Modal visible={isVisible} onRequestClose={hideModal} transparent={true}>
      <SafeAreaView style={styles.container}>
        <Pressable style={styles.outerContainer} onPress={hideModal}>
          <Pressable>
            <View style={styles.innerContainer}>
              <FlatList
                data={[...data]}
                contentContainerStyle={{ flexGrow: 1 }}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={1.0}
                      onPress={() => {
                        onPressNumber(item);
                      }}
                      style={{
                        backgroundColor: Color.white,
                        borderRadius: 15,
                        padding: hp(2),
                        marginBottom: hp(2),
                        shadowColor: "#000",
                        shadowOpacity: 0.5,
                        shadowRadius: 5,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 5,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: Color.black,
                          fontWeight: "600",
                          fontSize: hp(2),
                        }}
                      >
                        {item?.phoneNumber || ""}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
              <Text style={styles.cancel} onPress={hideModal}>
                Cancel
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </SafeAreaView>
    </Modal>
  ) : null;
};

export default PhoneNumbersModal;

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
