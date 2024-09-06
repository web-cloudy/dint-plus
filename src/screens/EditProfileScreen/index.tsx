import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { EditPrimarySVG } from "assets/svgs";
import { ms, mvs } from "react-native-size-matters";
import { HeaderWithTitle } from "components/molecules";
import { SelectImageModal } from "components/organisms";
import { useImagePicker } from "hooks";
import { useDispatch } from "react-redux";
import {
  ProfileSelectors,
  resetProfileData,
  updateProfileAPI,
  uploadMediaAPI,
} from "store/slices/profile";
import { Button, Loader, TextInput } from "components/atoms";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";

const EditProfileScreen = ({ navigation }) => {
  const [isSelectImageModalVisible, setIsSelectImageModalVisible] =
    useState(false);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const { selectedImage, openCameraForDP, openGalleryForDP } = useImagePicker();
  const { loading, mediaKey, profileData } = ProfileSelectors();
  const [userName, setUserName] = useState("");
  useEffect(() => {
    console.log("selectedImage", selectedImage);

    if (selectedImage) {
      const formData = new FormData();
      //  formData.append('UserId', 'abc@abc.com');
      formData.append("media", selectedImage);
      dispatch(uploadMediaAPI(formData));
    }
  }, [selectedImage]);

  useEffect(() => {
    console.log("mediaKey", mediaKey);
    if (mediaKey) {
      const obj = { profile_image: mediaKey };
      dispatch(updateProfileAPI(obj));
      dispatch(resetProfileData());
    }
  }, [mediaKey]);

  useEffect(() => {
    if (profileData?.custom_username) {
      setUserName(profileData?.custom_username);
    }
  }, [profileData]);

  function onSaveUserName() {
    const obj = { custom_username: userName };
    dispatch(updateProfileAPI(obj));
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle blackBar title="Edit Profile" />
      <View style={styles.bodyContainer}>
        {/* Edit User Info Container */}
        <View style={styles.userInfoContainer}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ alignItems: "center" }}>
              <Image
                source={{
                  uri: selectedImage
                    ? selectedImage.uri
                    : profileData?.profile_image,
                }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text
                style={{
                  color: Color.primaryDark,
                  fontSize: mvs(12),
                  marginTop: mvs(5),
                }}
                onPress={() => setIsSelectImageModalVisible(true)}
              >
                Edit
              </Text>
            </View>
            <Text style={styles.enterYourName}>
              Enter your name and add an optional profile picture
            </Text>
          </View>
          {/* <Text style={styles.name}>{profileData?.display_name || ""}</Text> */}
          <TextInput
            value={profileData?.display_name || ""}
            placeholder="UserName"
            onChangeText={setUserName}
            editable={false}
          ></TextInput>
          <TextInput
            value={userName}
            placeholder="UserName"
            onChangeText={setUserName}
            icon={Images.edit}
          ></TextInput>
        </View>

        {/* About */}
        <View style={styles.aboutContainer}>
          <Text style={styles.about}>About</Text>
          <View style={styles.statueContainer}>
            <Text style={styles.status}>Good Vibes only</Text>
            <EditPrimarySVG width={ms(16)} height={ms(16)} />
          </View>
        </View>
        <Button
          text="Save"
          btnStyle={styles.btnStyle}
          onPress={() => onSaveUserName()}
        ></Button>
      </View>

      <SelectImageModal
        isVisible={isSelectImageModalVisible}
        hideModal={() => setIsSelectImageModalVisible(false)}
        onCameraPress={openCameraForDP}
        onGalleryPress={openGalleryForDP}
      />
      <Loader visible={loading} />
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    bodyContainer: { flex: 1 },
    userInfoContainer: {
      backgroundColor: Color.white,
      paddingVertical: mvs(8),
      paddingHorizontal: ms(16),
      marginTop: mvs(16),
    },
    image: { width: ms(50), height: ms(50), borderRadius: ms(25) },
    name: {
      marginTop: mvs(10),
      color: Color.black,
      fontWeight: "500",
      fontSize: mvs(14),
    },
    enterYourName: {
      marginStart: ms(16),
      marginTop: mvs(10),
      flex: 1,
      color: Color.text_black,
    },
    aboutContainer: { marginTop: mvs(16) },
    about: {
      marginStart: ms(16),
      marginBottom: hp(1),
      fontSize: mvs(12),
      color: Color.black,
    },
    statueContainer: {
      flexDirection: "row",
      paddingHorizontal: ms(16),
      paddingVertical: mvs(8),
      backgroundColor: Color.white,
      marginTop: mvs(5),
      alignItems: "center",
      justifyContent: "space-between",
    },
    status: { color: Color.black, fontSize: mvs(14), fontWeight: "500" },
    btnStyle: {
      alignSelf: "flex-end",
      marginVertical: hp(5),
      width: wp(25),
      paddingVertical: 0,
      paddingHorizontal: 0,
      height: hp(6),
    },
  });
};

export default EditProfileScreen;
