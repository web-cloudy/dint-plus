import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";

type Props = {
  Icon: any;
  text?: string;
  boldText?: string;
  textClickable?: boolean;
  onTextClick?: () => void;
};

const EventInfoItem: FunctionComponent<Props> = ({
  Icon,
  text,
  boldText,
  textClickable,
  onTextClick,
}: Props) => {
  return (
    <View style={style.container}>
      <Icon />
      <Text style={style.infoText}>
        {text}
        <Text
          style={[
            style.boldText,
            { textDecorationLine: textClickable ? "underline" : "none" },
          ]}
          onPress={!!onTextClick ? onTextClick : undefined}
        >
          {boldText}
        </Text>
      </Text>
    </View>
  );
};

export default EventInfoItem;

const style = StyleSheet.create({
  boldText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 14,
    marginStart: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
});
