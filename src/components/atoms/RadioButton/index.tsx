import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { ms, mvs, vs } from "react-native-size-matters";
import {getCurrentTheme} from "constants/Colors";
const Color = getCurrentTheme();

type Props = { isSelected: boolean };

const RadioButton: FunctionComponent<Props> = ({ isSelected }: Props) => {
  return (
    <View>
      {isSelected ? (
        <View
          style={{
            borderWidth: 1,
            width: ms(20),
            height: ms(20),
            borderColor: Color.primaryDark,
            borderRadius: ms(10),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: ms(12),
              height: ms(12),
              backgroundColor: Color.primaryDark,
              borderRadius: ms(6),
            }}
          />
        </View>
      ) : (
        <View
          style={{
            borderWidth: 1,
            width: ms(20),
            height: ms(20),
            borderColor: Color.primaryDark,
            borderRadius: ms(10),
          }}
        />
      )}
    </View>
  );
};

export default RadioButton;
