import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Location() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" data-testid="PlaceIcon" fill={'#7c7c7c'}>
      <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
    </Svg>
  );
}

export default Location;
