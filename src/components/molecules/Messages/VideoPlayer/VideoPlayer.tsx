import React, { useRef, useState } from "react";
import Video, { VideoRef } from "react-native-video";
import { View } from "react-native";
import { ms } from "react-native-size-matters";

type Props = {
  source?: any;
  style?: any;
  onEnd?: any;
  data?: any;
};

export const VideoPlayer = React.memo(
  ({ source, style, onEnd, data }: Props) => {
    console.log("source====>", source);

    const [paused, setPaused] = useState(true);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef<VideoRef>(null);

    return (
      <View style={{ flex: 1 }}>
        <Video
          key={data?.id}
          paused={paused}
          ref={videoRef}
          controls={true}
          onLoad={() => {
            // setPaused(true); // this will set first frame of video as thumbnail
            videoRef?.current?.seek(0);
          }}
          onEnd={onEnd}
          // onEnd={()=>ref.current?.setNativeProps({ paused: false })}
          source={source}
          onProgress={(x) => setProgress(x)}
          muted
          repeat={false}
          autoplay={false}
          style={{ width: "100%", height: ms(200) }}
          resizeMode="contain"
        />
      </View>
    );
  },
  (prevProps, nextProps) => {
    console.log("prevProps", prevProps);
    console.log("nextProps", nextProps);
    // Return true if props are equal and component should not re-render
    return prevProps.source.uri === nextProps.source.uri;
  }
);
