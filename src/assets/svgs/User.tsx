import * as React from "react";
import Svg, { Path } from "react-native-svg";

function User() {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      data-testid="PersonIcon"
      fill={"#7c7c7c"}
    >
      <Path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        fill={"#7c7c7c"}
      />
    </Svg>
  );
}

export default User;
