import { useRef } from "react";
import { Animated, Dimensions } from "react-native";
import { hp, wp } from "utils/metrix";

const useModalEventOptions = () => {
  let modalPosition = useRef(new Animated.ValueXY()).current;
  function getModalPosition(evt: any, xAxis: number, modalHeight: number) {
    const windowHeight = Dimensions.get("window").height;
    const windowWidth = Dimensions.get("window").width;
    let event = evt?.nativeEvent;
    const modalY = evt?.moveY || event?.pageY + 20 / 2; // Adjust the offset as needed
    const maxX = windowWidth - xAxis || wp(57);
    const maxY = windowHeight - modalHeight || hp(25);
    const finalY = Math.min(maxY, Math.max(0, modalY));
    modalPosition.setValue({
      x: maxX,
      y: finalY,
    });
  }
  return {
    modalPosition,
    getModalPosition,
  };
};

export default useModalEventOptions;
