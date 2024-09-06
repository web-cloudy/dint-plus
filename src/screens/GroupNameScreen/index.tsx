import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, FlatList, Text } from "react-native";
import { useAuth } from "contexts/AuthContext";
import { GroupNameHeader, SelectedGroupUserItem } from "components/molecules";
import { ms, mvs } from "react-native-size-matters";
import { Button, Loader } from "components/atoms";
import {
  addMembersInGroup,
  ChatSelectors,
  createGroupAPI,
  resetAddMembersData,
  resetCreateChannelData,
} from "store/slices/chat";
import useAppDispatch from "hooks/useAppDispatch";
import { useImagePicker } from "hooks";
import {
  ProfileSelectors,
  resetProfileData,
  uploadMediaAPI,
} from "store/slices/profile";
import { ImageType } from "hooks/useImagePicker";
import { SearchUser } from "types/chat";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";

const GroupNameScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const { setUserId } = useAuth();
  const selectedUsersData = route?.params?.data || [];
  const dispatch = useAppDispatch();
  const { selectedImage, setSelectedImage, showImagePickerOptions } =
    useImagePicker();
  const [groupName, onSetGroupName] = useState("");
  const [channelId, setChannelId] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<
    SearchUser[] | undefined
  >();
  const [err, setErr] = useState("");
  const [groupImage, onSetGroupImage] = useState<ImageType>();
  const { mediaKey } = ProfileSelectors();
  const { createGroupData, addMembersApiResp, loading } = ChatSelectors();

  function createGroupReuqest() {
    if (groupName === "") {
      setErr("Please enter group name");
    } else if (groupImage?.uri === "" || groupImage === undefined) {
      setErr("Please select group icon");
    } else {
      setErr("");
      const obj = {
        group_name: groupName,
        group_type: "GROUP",
        group_image: mediaKey || "",
      };
      dispatch(createGroupAPI(obj));
      dispatch(resetProfileData());
    }
  }
  useEffect(() => {
    setSelectedUsers(selectedUsersData);
  }, [selectedUsersData]);

  useEffect(() => {
    if (selectedImage?.uri) {
      const formData = new FormData();
      formData.append("media", selectedImage);
      dispatch(uploadMediaAPI(formData));
      onSetGroupImage(selectedImage);
      setSelectedImage(undefined);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (createGroupData?.id) {
      let Ids: number[] = [];
      selectedUsers?.map((res: SearchUser) => {
        Ids.push(res?.id);
      });
      let params = {
        user_ids: Ids,
        groupId: createGroupData?.id,
      };
      setChannelId(createGroupData?.channel_id);
      dispatch(addMembersInGroup(params));
    } else if (createGroupData?.errors) {
      setErr(Object?.values(createGroupData?.errors)[0][0] || "");
    }
  }, [createGroupData]);

  useEffect(() => {
    console.log("chekk addMembersApiResp ", addMembersApiResp);
    if (addMembersApiResp?.groupId) {
      navigation?.replace("ChatDetail", {
        receiverId: addMembersApiResp?.groupId,
        receiverName: groupName,
        receiverImage: groupImage?.uri,
        type: "group_text",
        channel_id: channelId,
        newGroup: true,
      });
      setChannelId("");
      dispatch(resetCreateChannelData());
      dispatch(resetAddMembersData());
    }
  }, [addMembersApiResp]);

  function onPressRemove(user: SearchUser) {
    const selectedIndex = selectedUsers?.findIndex(
      (item: SearchUser) => item.id === user?.id
    );
    let data = [...selectedUsers];
    if (data?.length > 1) {
      data[selectedIndex].isSelected = !data[selectedIndex].isSelected;
      setSelectedUsers([...data]);
    } else {
      setErr("We need atleast 1 person to create group");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading && <Loader visible={loading} />}
      <GroupNameHeader
        image={groupImage?.uri || selectedImage?.uri}
        onChangeText={onSetGroupName}
        value={groupName}
        onClickGroupImage={showImagePickerOptions}
      />
      <View style={{ flex: 1 }}>
        <View>
          <FlatList
            style={{
              marginTop: mvs(20),
              marginStart: ms(16),
            }}
            horizontal
            data={selectedUsers}
            renderItem={({ item, index }) =>
              item?.isSelected && (
                <SelectedGroupUserItem
                  onPressRemove={onPressRemove}
                  data={item}
                />
              )
            }
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
      <Text style={styles.errMsg}>{err}</Text>
      <Button
        text="Create Group"
        onPress={createGroupReuqest}
        textStyle={{ fontSize: mvs(12) }}
        btnStyle={{
          paddingHorizontal: ms(5),
          paddingVertical: mvs(5),
          width: ms(100),
          height: mvs(30),
          alignSelf: "flex-end",
          margin: ms(20),
        }}
      />
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.white,
    },
    errMsg: {
      fontSize: mvs(15),
      color: "red",
      alignSelf: "flex-end",
      paddingHorizontal: mvs(10),
      fontWeight: "600",
    },
  });
};

export default GroupNameScreen;
