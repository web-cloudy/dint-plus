import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import React, { FunctionComponent, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
  Image,
} from "react-native";
import FastImage from "react-native-fast-image";
import { ProgressBar } from "react-native-paper";
import { ms, mvs, vs } from "react-native-size-matters";
import { Colors } from "react-native/Libraries/NewAppScreen";
import styles from "rn-range-slider/styles";
import { hp, wp } from "utils/metrix";
import { VideoPlayer } from "../VideoPlayer/VideoPlayer";
import { Play, Pause, Images } from "assets/images";
type Props = {
  data: any;
  messageList: any;
  OnPressClose?: any;
};

const ReplyView: FunctionComponent<Props> = React.memo(
  ({ data, messageList, OnPressClose }: Props) => {
    const { theme } = useTheme();
    const Color = getCurrentTheme(theme || "light");
    const styles = screenStyles(Color);
    const [isPlaying, setIsPlaying] = useState(false); // State to tracqk if audio is currently playing

    const source = useMemo(
      () => ({ uri: data?.media_meta_data?.url }),
      [data?.media_meta_data?.url]
    );

    const toggleAudio = async (url: string) => {
      // try {
      //   if (!isPlaying && currentAudioUrlRef.current !== url) {
      //     SoundPlayer.playUrl(url);
      //     currentAudioUrlRef.current = url;
      //     setLoading(true);
      //     setIsPlaying(true);
      //     updateProgress(); // Start updating progress
      //   } else if (isPlaying) {
      //     SoundPlayer.pause();
      //     setIsPlaying(false);
      //     clearInterval(intervalRef.current!); // Clear interval when playback is paused
      //   } else {
      //     SoundPlayer.resume();
      //     setIsPlaying(true);
      //     updateProgress();
      //     // clearInterval(intervalRef.current)
      //   }
      //   // if (currentAudioUrlRef.current === url) {
      //   //   SoundPlayer.resume()
      //   // }
      // } catch (error) {
      //   console.log("Error toggling audio playback:", error);
      //   setIsPlaying(false);
      // }
    };

    return (
      <View style={styles.container}>
        {/* <MessageItem
          key={data?.id}
          data={data}
          messages={messageList}
          callMessageAction={(msg: any, type: string) => {}}
        /> */}

        <TouchableOpacity activeOpacity={1.0} style={[styles.senderContainer]}>
          {data?.content_type === "MEDIA" ? (
            data?.media_meta_data?.name === "fileImage" ? (
              <FastImage
                style={{ height: ms(80), width: "100%" }}
                source={{ uri: data?.media_meta_data?.url }}
              />
            ) : data?.media_meta_data?.name === "fileVideo" ? (
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <VideoPlayer source={source} data={data} />
                <Text style={{ marginStart: 10 }}>▶</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => toggleAudio(data?.media_meta_data?.url)}
                >
                  <FastImage
                    source={isPlaying ? Pause : Play}
                    style={styles.btnIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </>
            )
          ) : (
            <Text onPress={() => console.log(data)} style={styles.message}>
              {data?.content}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={OnPressClose} style={styles.close}>
          <Image
            source={Images.cancel}
            style={styles.closeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  }
);

export default ReplyView;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      backgroundColor: Color.messageBackgroundReceiver,
      marginHorizontal: wp(5),
      paddingTop: hp(1),
      borderWidth: 1,
      borderColor: Color.messageBackgroundReceiver,
      borderRadius: 12,
      paddingBottom: hp(2),
      marginBottom: -hp(1.5),
      shadowColor: "#000",
      shadowOpacity: 0.5,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 3 },
      elevation: 5,
      width: wp(76),
      alignItems: "flex-start",
    },
    senderContainer: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: vs(10),
      paddingHorizontal: ms(13), // when message is audio instead of text need to adjust padding, previous value 20
      backgroundColor: Color.purple_theme,
      width: "60%",
      borderRadius: ms(20),
      marginBottom: vs(16),
    },
    message: { color: Color.black, fontSize: mvs(15), fontWeight: "500" },
    btnIcon: { width: ms(30), height: ms(30), tintColor: Color.black },
    close: {
      height: hp(4),
      width: hp(4),
      position: "absolute",
      right: 0,
      padding: hp(2),
      justifyContent: "center",
      alignItems: "center",
    },
    closeIcon: {
      height: hp(1.8),
      width: hp(1.8),
      tintColor: Color.black,
    },
  });
};
