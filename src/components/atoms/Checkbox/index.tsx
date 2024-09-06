import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { ms } from "react-native-size-matters";
import { CheckboxSelected } from "assets/svgs";
type Props = { isSelected: boolean };

const Checkbox: FunctionComponent<Props> = ({ isSelected }: Props) => {
  return (
    <View>
      {isSelected ? (
        <CheckboxSelected width={ms(20)} height={ms(20)} />
      ) : (
        <CheckboxSelected width={ms(20)} height={ms(20)} />
      )}
    </View>
  );
};

export default Checkbox;
