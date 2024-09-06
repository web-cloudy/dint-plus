import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { View, Text } from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import Slider from "rn-range-slider";
import Rail from "components/Slider/Rail";
import Thumb from "components/Slider/Thumb";
import RailSelected from "components/Slider/RailSelected";

type Props = {
  disabled?: boolean;
  priceType?: string;
  handleValue?: any;
  marginVertical?: Number;
};

const EventPricePicker: FunctionComponent<Props> = ({
  disabled,
  priceType,
  handleValue,
  marginVertical,
}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const [low, setLow] = useState<number>();
  const [high, setHigh] = useState<number>();
  const renderRail = useCallback(() => <Rail />, [setLow, setHigh, low, high]);

  const renderThumb = useCallback(
    (name: "high" | "low") => {
      return name === "low" ? <Thumb name={name} /> : null;
    },
    [low, high]
  );

  const memoizedCount = useMemo(() => {
    return low;
  }, [low, high]);

  const renderRailSelected = useCallback(
    () => <RailSelected />,
    [setLow, setHigh, memoizedCount]
  );
  const RenderSlider = useCallback(
    () => (
      <Slider
        style={{ marginVertical: marginVertical ? marginVertical : hp(4) }}
        min={0}
        max={10000}
        step={10}
        high={10000}
        renderThumb={renderThumb}
        disabled={disabled}
        renderNotch={(value) => {
          return (
            <View
              style={{
                position: "absolute",
                top: -hp(4),
                height: hp(4),
                width: hp(20),
                borderRadius: 12,
                left: -wp(20),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: Color.black, fontSize: hp(1.6) }}>
                ${value}
              </Text>
            </View>
          );
        }}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        onValueChanged={(low, high, byUser) => {
          byUser === true && handleValueChange(low, high);
        }}
      />
    ),
    [priceType]
  );

  const handleValueChange = useCallback(
    (lowValue: any, highValue: any) => {
      setLow(lowValue);
      setHigh(highValue);
      console.log(lowValue);
      handleValue(lowValue);
    },

    [setLow, setHigh]
  );

  return <RenderSlider />;
};

export default EventPricePicker;
