import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { ms, mvs } from "react-native-size-matters";
import { wp } from "utils/metrix";
import { Images } from "assets/images";
import Toast from "react-native-toast-message";

const toastConfig = {
  SuccessToast: ({ props }) => (
    <View
      style={{
        paddingVertical: mvs(10),
        width: wp(90),
        backgroundColor: "#242525",
        justifyContent: "center",
        borderRadius: 6,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          style={{ height: mvs(32), width: mvs(32), tintColor: "#FFFFFF" }}
          source={Images.toastSucess}
        />
        <View style={{ marginLeft: ms(10) }}>
          <Text
            style={{ fontSize: ms(18), fontWeight: "600", color: "#FFCF03" }}
          >
            Success
          </Text>
          <Text
            style={{
              fontSize: ms(16),
              fontWeight: "400",
              marginTop: mvs(5),
              width: wp(90),
              color: "#C0C0C0",
            }}
          >
            {props}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          Toast.hide();
        }}
        style={{ position: "absolute", top: mvs(15), right: mvs(15) }}
      >
        <Image
          style={{ height: mvs(16), width: mvs(16), tintColor: "#FFFFFF" }}
          source={Images.toastClose}
        />
      </TouchableOpacity>
    </View>
  ),

  ErrorToast: ({ props }) => (
    <View
      style={{
        paddingVertical: mvs(10),
        width: wp(90),
        backgroundColor: "#FF0303",
        justifyContent: "center",
        borderRadius: 6,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          style={{ height: mvs(32), width: mvs(32), marginLeft: ms(10) }}
          source={Images.toastError}
        />
        <View style={{ marginLeft: ms(10) }}>
          <Text
            style={{ fontSize: ms(18), fontWeight: "600", color: "#FFFFFF" }}
          >
            Error
          </Text>
          <Text
            style={{
              fontSize: ms(16),
              fontWeight: "400",
              marginTop: mvs(5),
              color: "#FFFFFF",
              width: wp(80),
            }}
          >
            {props}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          Toast.hide();
        }}
        style={{ position: "absolute", top: mvs(15), right: mvs(15) }}
      >
        <Image
          style={{ height: mvs(16), width: mvs(16), tintColor: "#FFFFFF" }}
          source={Images.toastClose}
        />
      </TouchableOpacity>
    </View>
  ),
};

export default toastConfig;
