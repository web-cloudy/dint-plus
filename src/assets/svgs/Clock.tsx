import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Clock() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" data-testid="TimerIcon" fill={'#7c7c7c'}>
      <Path d="M9 1h6v2H9zm10.03 6.39l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0012 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 007.03-14.61zM13 14h-2V8h2v6z" />
    </Svg>
  );
}

export default Clock;
