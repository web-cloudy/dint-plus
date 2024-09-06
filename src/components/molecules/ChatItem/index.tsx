import React, { useCallback } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { ms, mvs, vs } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { AvatarPNG } from "assets/images";
import { ChatListItem } from "types/chat";
import moment from "moment-timezone";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { useDispatch } from "react-redux";
import {
  ChatSelectors,
  deleteConversation,
  getChatMessagesAPI,
  refreshChatsAPI,
} from "store/slices/chat";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { EventRegister } from "react-native-event-listeners";

type Props = {
  data: ChatListItem;
  setImageToShow?: any;
  ws: any;
};

const SWIPE_THRESHOLD = -75;

const ChatItem: React.FC<Props> = ({ data, setImageToShow, ws }) => {
  console.log("🚀 ~ data:", data);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useDispatch();
  const { loading } = ChatSelectors();

  const translateX = useSharedValue(0);
  const contextX = useSharedValue(0);
  const rowHeight = useSharedValue(70); // Adjust this value based on your row height
  // const onPress = async () => {
  //   setIsClick(true);
  //   let array = await dispatch(getChatMessagesAPI(data?.id));
  //   setIsClick(false);
  //   console.log(" ---ChatItem Screen Data ---> ", data);

  const onPress = useCallback(async () => {
    let array = await dispatch(getChatMessagesAPI(data?.id));
    console.log(" ---ChatItem Screen Data ---> ", data);

    navigation.navigate("ChatDetail", {
      receiverId: data?.id,
      receiverName: data?.display_name,
      receiverImage: data?.picture,
      channel_id: data?.channel_id,
      type: data?.type,
      chatMsgs: array?.payload,
      ws: ws,
    });
  }, [data, dispatch, navigation, ws]);

  const formatMessageTime = (timestamp: string) => {
    const messageDate = moment.utc(timestamp).local();
    const today = moment().startOf("day");
    const weekAgo = moment().subtract(7, "days").startOf("day");

    if (messageDate.isSame(today, "day")) {
      return messageDate.format("HH:mm a"); // Show time for today's messages
    } else if (messageDate.isAfter(weekAgo)) {
      return messageDate.format("ddd"); // Show day for messages within the last week
    } else {
      return messageDate.format("D MMM"); // Show date for older messages
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
    })
    .onUpdate((event) => {
      const newTranslateX = event.translationX + contextX.value;
      translateX.value = Math.min(0, Math.max(newTranslateX, -150));
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withTiming(-50);
      } else {
        translateX.value = withTiming(0);
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rIconContainerStyle = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < -5 ? 1 : 0);
    return { opacity };
  });

  const markAsUnread = () => {
    // Implement mark as unread functionality
    console.log("Mark as unread");
    translateX.value = withTiming(0);
  };

  const hideChat = () => {
    // Implement hide chat functionality
    console.log("Hide chat");
    translateX.value = withTiming(0);
  };

  const deleteChat = async (id) => {
    // Implement delete chat functionality
    await dispatch(deleteConversation(id));
    EventRegister.emit("updateChats", "");
    console.log(" ---deleteChat---> ", id);
    console.log("Delete chat");
    translateX.value = withTiming(0);
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, rStyle]}>
        <TouchableOpacity onPress={onPress} style={styles.contentContainer}>
          <TouchableOpacity
            onLongPress={() => {
              setImageToShow(data?.picture || "empty");
            }}
          >
            <Image
              style={styles.image}
              source={data?.picture ? { uri: data?.picture } : AvatarPNG}
            />
          </TouchableOpacity>

          <View style={styles.chatInfoContainer}>
            <Text style={styles.name}>{data?.display_name}</Text>
            <Text numberOfLines={1} style={styles.lastMessage}>
              {data?.last_message_type === "TEXT"
                ? data?.last_message
                : "Media"}
            </Text>
          </View>
          <View style={styles.chatTimeContainer}>
            <Text style={styles.messageTime}>
              {formatMessageTime(data?.last_message_time)}
            </Text>
            {data?.unread_count > 0 ? (
              <View style={styles.messageCountContainer}>
                <Text style={styles.messageCount}>{data?.unread_count}</Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
        <Animated.View style={[styles.iconContainer, rIconContainerStyle]}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: "lightblue" }]}
            onPress={markAsUnread}
          >
            <Text style={styles.iconText}>Unread</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: Color.messageBackgroundReceiver },
            ]}
            onPress={hideChat}
          >
            <Text style={styles.iconText}>Hide</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: Color.red }]}
            onPress={() => deleteChat(data?.id)}
          >
            <Text style={styles.iconText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
    // <View style={styles.chatInfoContainer}>
    //   <Text style={styles.name}>{data?.display_name}</Text>
    //   <Text numberOfLines={1} style={styles.lastMessage}>
    //     {data?.last_message_type === "TEXT" ? data?.last_message : "Media"}
    //   </Text>
    // </View>
    // <View
    //   style={{
    //     width: "20%",
    //     justifyContent: "space-between",
    //     flexDirection: "row",
    //   }}
    // >
    //   <View />
    //   {/* <View>{isclick && <Loader visible={loading} />}</View> */}
    //   <View style={styles.chatTimeContainer}>
    //     <Text style={styles.messageTime}>
    //       {formatMessageTime(data?.last_message_time)}
    //     </Text>
    //     {data?.unread_count > 0 ? (
    //       <View style={styles.messageCountContainer}>
    //         <Text style={styles.messageCount}>{data?.unread_count}</Text>
    //       </View>
    //     ) : null}
    //   </View>
    // </View>
    // </TouchableOpacity>
  );
};

export default ChatItem;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Color.plain_white,
      // height: 70,
    },
    contentContainer: {
      flexDirection: "row",
      alignItems: "center",
      // paddingHorizontal: ms(16),
      paddingVertical: vs(10),
      width: "100%",
    },
    image: {
      width: ms(50),
      height: ms(50),
      backgroundColor: "#dcdcdc",
      borderRadius: ms(25),
    },
    chatInfoContainer: { flex: 1, marginStart: ms(16) },
    name: { color: Color.black, fontWeight: "700", fontSize: mvs(14) },
    lastMessage: { fontSize: mvs(14), color: Color.light_grey },
    chatTimeContainer: { alignItems: "flex-end" },
    messageTime: { fontSize: mvs(11), color: Color.black },
    messageCountContainer: {
      marginTop: vs(4),
      backgroundColor: Color.primaryDark,
      width: ms(20),
      height: ms(20),
      borderRadius: ms(10),
      justifyContent: "center",
      alignItems: "center",
    },
    messageCount: {
      color: Color.white,
      fontSize: mvs(12),
      fontWeight: "700",
    },
    iconContainer: {
      flexDirection: "row",
      position: "absolute",
      right: "-8%",
      height: "100%",
    },
    iconButton: {
      width: 50,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    iconText: {
      color: Color.white,
      fontSize: mvs(10),
      fontWeight: "bold",
    },
  });
};
