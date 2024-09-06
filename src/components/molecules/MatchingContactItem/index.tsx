import React, { FunctionComponent } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { ms, mvs, vs } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { AvatarPNG } from "assets/images";
import { ChatListItem } from "types/chat";
import { useDispatch } from "react-redux";
import { createChannelIdAPI } from "store/slices/chat";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";

type Props = {
  data: ChatListItem;
};

const MatchingContactItem: FunctionComponent<Props> = ({ data }: Props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  const onPress = () => {
    const obj = {
      id: data.id,
      name: data?.display_name || "",
      profile_image: data?.profile_image || "",
    };
    dispatch(createChannelIdAPI(obj));
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={
            data?.profile_image ? { uri: data?.profile_image } : AvatarPNG
          }
        />
        <View style={styles.chatInfoContainer}>
          <Text style={styles.name}>{data?.name || data?.display_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MatchingContactItem;

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
    chatInfoContainer: {
      flex: 1,
      marginStart: ms(16),
      justifyContent: "center",
    },
    name: { color: Color.black, fontWeight: "700", fontSize: mvs(14) },
  });
};
