import React, { FunctionComponent, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { ms, mvs, vs } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { AvatarPNG } from "assets/images";
import { SearchUser } from "types/chat";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { useDispatch } from "react-redux";
import {
  ChatSelectors,
  createChannelIdAPI,
  getChatMessagesAPI,
  resetChannelData,
} from "store/slices/chat";

type Props = {
  data: SearchUser;
};

const SearchUserItem: FunctionComponent<Props> = ({ data }: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isChannelIdCreated, selectedChannelData } = ChatSelectors();

  useEffect(() => {
    console.log("isChannelIdCreated", isChannelIdCreated);
    if (isChannelIdCreated) {
      console.log(selectedChannelData, "-------------selectedChannelData");
      navigation?.navigate("ChatDetail", {
        receiverId: selectedChannelData?.info?.id,
        receiverName: selectedChannelData?.name,
        receiverImage: selectedChannelData?.profile_image,
      });
      dispatch(resetChannelData());
    }
  }, [isChannelIdCreated]);

  const onPress = async () => {
    if (data?.channel_id) {
      let array = await dispatch(getChatMessagesAPI(data?.id));
      navigation.navigate("ChatDetail", {
        receiverId: data?.id,
        receiverName: data?.display_name,
        receiverImage: data?.picture || null,
        channel_id: data?.channel_id,
        type: data?.type,
        // type: data?.type === "GROUP" ? "group_text" : "text",
        chatMsgs: array?.payload,
      });
    } else {
      const obj = {
        id: data.id,
        name: data?.display_name || "",
        profile_image: data?.profile_image || "",
      };
      dispatch(createChannelIdAPI(obj));
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={
            data?.profile_image ? { uri: data?.profile_image } : AvatarPNG
          }
        />
        <View style={styles.chatInfoContainer}>
          <Text style={styles.name}>{data?.display_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchUserItem;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingVertical: vs(16),
    },
    image: {
      width: ms(50),
      height: ms(50),
      backgroundColor: "#dcdcdc",
      borderRadius: ms(25),
    },
    chatInfoContainer: { flex: 1, marginStart: ms(16) },
    name: { color: Color.black, fontWeight: "700", fontSize: mvs(14) },
    lastMessage: { fontSize: mvs(14) },
    chatTimeContainer: { marginStart: ms(16), alignItems: "center" },
    messageTime: { fontSize: mvs(12) },
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
  });
};
