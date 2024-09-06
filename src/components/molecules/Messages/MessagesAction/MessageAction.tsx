import Clipboard from "@react-native-clipboard/clipboard";
import { Images } from "assets/images";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import React from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { hp, wp } from "utils/metrix";
import { BlurView } from "@react-native-community/blur";
import Modal from "react-native-modal";
import moment from "moment";

interface IProps {
  isVisible?: any;
  selectedMsg?: any;
  closeModal?: any;
  modalPosition?: any;
  onClickPin?: any;
  replyToMessage?: any;
  onForwardMsg?: any;
  onDeleteMessage?: any;
  onStarMessage?: any;
  onEditMessage?: any;
  isSender?: any;
}

export default function MessageAction(props: IProps) {
  const {
    isVisible,
    closeModal,
    selectedMsg,
    modalPosition,
    onClickPin,
    replyToMessage,
    onForwardMsg,
    onDeleteMessage,
    onStarMessage,
    onEditMessage,
    isSender
  } = props;

  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  const OptionView = (props: any) => {
    const { type, icon, onClick, onDeleteMessage } = props;
    return (
      <TouchableOpacity onPress={onClick} style={styles.replyItem}>
        <Image
          style={{
            height: hp(1.8),
            width: hp(1.8),
            tintColor: type == "Delete" ? Color.red : Color.black,
          }}
          source={icon}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.optionText,
            { color: type == "Delete" ? Color.red : Color.black },
          ]}
        >
          {type}
        </Text>
      </TouchableOpacity>
    );
  };

  function getTimeDifference() {
    const t1 = new Date().getTime();
    const t2 = new Date(selectedMsg?.createdOn);
    let ts = (t1 - t2.getTime()) / 1000;
    var d = Math.floor(ts / (3600 * 24));
    var h = Math.floor((ts % (3600 * 24)) / 3600);
    var m = Math.floor((ts % 3600) / 60);
    var s = Math.floor(ts % 60);
    return d ? false : h ? false : m && m <= 10 ? true : s ? true : false;
  }


  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={closeModal}
    >
      <TouchableOpacity
        activeOpacity={1.0}
        onPress={closeModal}
        style={styles.modalBackground}
      >
        <BlurView
          style={styles.blurBackground}
          blurType="light"
          blurAmount={2}
        />
        <Animated.View
          style={[styles.modalContainer, modalPosition.getLayout()]}
        >
          <View style={styles.usernameView}>
            <Text style={styles.username}>{selectedMsg?.fullName}</Text>

            {selectedMsg?.content && (
              <Text
                numberOfLines={2}
                style={[
                  styles.optionText,
                  { color: Color.black, width: wp(25), fontWeight: "500" },
                ]}
              >
                {selectedMsg?.content}
              </Text>
            )}
            {selectedMsg?.media_meta_data?.name === "fileImage" && (
              <Image
                style={{
                  height: hp(4),
                  width: hp(4),
                  margin: hp(0.5),
                  marginLeft: wp(3),
                }}
                source={{
                  uri: selectedMsg?.media_meta_data?.url,
                }}
              />
            )}
            <Text
              style={{
                fontSize: hp(1.16),
                textAlign: "right",
                color: Color.grey,
              }}
            >
              {moment(selectedMsg?.updated_at).format("hh:mm a")}
            </Text>
          </View>
          <View style={styles.viewBottom}>
            <OptionView
              type={"Star"}
              icon={Images.starAction}
              onClick={onStarMessage}
            />
            <OptionView
              type={"Reply"}
              icon={Images.replyAction}
              onClick={replyToMessage}
            />
            <OptionView
              type={"Forward"}
              icon={Images.forwardAction}
              onClick={onForwardMsg}
            />
            <OptionView
              type={"Copy"}
              icon={Images.copyAction}
              onClick={() => {
                let message =
                  selectedMsg?.content_type === "TEXT"
                    ? selectedMsg?.content
                    : selectedMsg?.media_meta_data?.url;
                Clipboard.setString(message || ""), closeModal();
              }}
            />
            <OptionView
              type={"Pin"}
              icon={Images.pinAction}
              onClick={onClickPin}
            />
            {selectedMsg?.content_type === "TEXT" && isSender || selectedMsg?.type === 'message_edited' ? (
              <>
                <OptionView
                  type={"Edit"}
                  icon={Images.editAction}
                  onClick={onEditMessage}
                />
                <OptionView
                  type={"Delete"}
                  icon={Images.deleteAction}
                  onClick={onDeleteMessage}
                />
              </>
            ) : null}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#fff",
    },
    optionText: {
      color: Color.white,
      fontSize: hp(1.8),
      marginLeft: wp(3),
      fontWeight: "400",
    },
    itemStyle: {
      padding: 20,
      backgroundColor: "#7B68EE",
      margin: 10,
      borderRadius: 10,
    },
    replyItem: {
      flexDirection: "row",
      padding: 10,
      alignItems: "center",
    },
    modalBackground: {
      flex: 1,
      marginVertical: -hp(2.2),
      marginHorizontal: -wp(5),
      width: wp(100),
      // backgroundColor:'red'
    },
    // modalContainer: {
    //   position: 'absolute',
    //   // width: 300,
    //   // backgroundColor: 'white',
    //   borderRadius: 10,
    //   padding: 5,
    //   elevation: 5,
    // },

    modalContainer: {
      position: "absolute",
      elevation: 5,
    },

    usernameView: {
      backgroundColor: Color?.theme === "light" ? Color.light_grey : "#252523",
      width: 150,
      borderRadius: 15,
      marginBottom: 10,
      padding: 10,
      marginLeft: 20,
    },
    username: {
      fontSize: hp(1.4),
      color: Color.purple,
    },
    viewBottom: {
      backgroundColor: Color?.theme === "light" ? Color.light_grey : "#252523",
      width: 150,
      borderRadius: 15,
      marginLeft: 20,
    },
    blurBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });
};
