import React, { FunctionComponent, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useAuth } from "contexts/AuthContext";
import { NewGroupHeader, NewGroupItem } from "components/molecules";
import { ms, mvs } from "react-native-size-matters";
import { RightArrowPNG } from "assets/images";
import { LineDivider } from "components/atoms";
import { useReadContact } from "hooks";
import useAppDispatch from "hooks/useAppDispatch";
import {
  ChatSelectors,
  getMatchingContactsAPI,
  onUpdateMatchingContacts,
  resetChannelData,
} from "store/slices/chat";
import { SearchUser } from "types/chat";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { useIsFocused } from "@react-navigation/native";

const NewGroupScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const focus = useIsFocused();

  const { setUserId } = useAuth();
  const dispatch = useAppDispatch();
  const { matchingContactList, isChannelIdCreated, selectedChannelData } =
    ChatSelectors();
  console.log(
    "🚀 ~ NewGroupScreen ~ matchingContactList:",
    matchingContactList
  );
  const { contactList } = useReadContact();
  console.log("🚀 ~ NewGroupScreen ~ contactList:", contactList);

  useEffect(() => {
    if (contactList?.length > 0) {
      console.log("contactList " + contactList);
      let phone_no_list = [];
      for (let i = 0; i < contactList?.length; i++) {
        const element = contactList[i];
        const number = element?.phoneNumbers[0]?.number;
        const formattedPhoneNumber = number?.replace(/[\(\)\-\s]/g, "");
        phone_no_list?.push(formattedPhoneNumber);
      }
      const contactss = {
        phone_no_list: [
          ...phone_no_list,
          // "9179710731",
          // "9179710732",
          // "+19179915807",
          // "+14243032099",
          // "+919993227729",
          // "+12252542523",
        ],
      };

      dispatch(getMatchingContactsAPI(contactss));
    }
    return () => dispatch(resetChannelData());
  }, [contactList, focus]);

  // useEffect(() => {
  //   if (contactList?.length > 0) {
  //     console.log("contactList Length" + contactList);
  //     let phone_no_list = [];
  //     for (let i = 0; i < contactList?.length; i++) {
  //       const element = contactList[i];
  //       console.log("🚀 ~ useEffect ~ element:", element);
  //       const number = element?.phoneNumbers[0]?.number;
  //       const formattedPhoneNumber = number?.replace(/[\(\)\-\s]/g, "");
  //       console.log(
  //         "🚀 ~ useEffect ~ formattedPhoneNumber:",
  //         formattedPhoneNumber
  //       );
  //       phone_no_list?.push(formattedPhoneNumber);
  //     }

  //     const contactss = {
  //       phone_no_list: [...phone_no_list, "9179710731", "9179710732"],
  //     };
  //     dispatch(getMatchingContactsAPI(contactss));
  //   }
  //   return () => dispatch(resetChannelData());
  // }, [contactList]);

  function onClickContact(userItem: SearchUser) {
    const selectedIndex = matchingContactList?.findIndex(
      (item) => item.id === userItem?.id
    );
    let data = [...matchingContactList];
    data[selectedIndex].isSelected = !data[selectedIndex].isSelected;
    dispatch(onUpdateMatchingContacts(data));
  }

  return (
    <SafeAreaView style={styles.container}>
      <NewGroupHeader />
      <View style={{ flex: 1 }}>
        <FlatList
          data={matchingContactList}
          renderItem={({ item, index }) => (
            <NewGroupItem onPress={onClickContact} data={item} />
          )}
          ItemSeparatorComponent={<LineDivider style={{ height: 2 }} />}
        />
        <TouchableOpacity
          style={styles.next}
          onPress={() =>
            navigation.navigate("GroupName", {
              data: matchingContactList?.filter(
                (item) => item.isSelected === true
              ),
            })
          }
        >
          <Image source={RightArrowPNG} style={styles.arrow} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.white,
    },
    next: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: ms(50),
      height: ms(50),
      borderRadius: ms(25),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Color.primary,
      margin: ms(32),
    },
    arrow: { width: ms(20), height: ms(20) },
  });
};

export default NewGroupScreen;
