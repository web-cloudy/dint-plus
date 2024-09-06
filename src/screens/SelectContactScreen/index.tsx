import React, { FunctionComponent, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  SectionList,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import useAppDispatch from "hooks/useAppDispatch";
import {
  ChatSelectors,
  createChannelIdAPI,
  getChatMessagesAPI,
  getMatchingContactsAPI,
  resetChannelData,
  resetMessageList,
} from "store/slices/chat";
import { ms, mvs } from "react-native-size-matters";
import { HeaderWithTitle } from "components/molecules";
import MatchingContactItem from "components/molecules/MatchingContactItem";
import { useReadContact } from "hooks";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { FONTS } from "constants";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { useIsFocused } from "@react-navigation/native";

type Props = Record<string, never>;

const SelectContactScreen: FunctionComponent<Props> = ({
  navigation,
}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const focus = useIsFocused();
  console.log("🚀 ~ focus:", focus);

  const dispatch = useAppDispatch();
  const {
    matchingContactList,
    isChannelIdCreated,
    selectedChannelData,
    loading,
  } = ChatSelectors();
  console.log("🚀 ~ selectedChannelData:", selectedChannelData);
  console.log("🚀 ~ matchingContactList:", JSON.stringify(matchingContactList));
  const { contactList } = useReadContact();

  // Sort and prepare sections
  const sections = matchingContactList.reduce((acc, item) => {
    const firstLetter = item.display_name.charAt(0).toUpperCase();
    let section = acc.find((sec) => sec.title === firstLetter);

    if (!section) {
      section = { title: firstLetter, data: [] };
      acc.push(section);
    }

    section.data.push(item);
    return acc;
  }, []);
  console.log("🚀 ~ sections ~ sections:", JSON.stringify(sections));

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
        phone_no_list: [...phone_no_list],
      };

      dispatch(getMatchingContactsAPI(contactss));
    }
    return () => dispatch(resetChannelData());
  }, [contactList, focus]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (isChannelIdCreated && selectedChannelData?.info) {
        try {
          await dispatch(getChatMessagesAPI(selectedChannelData.info.id));
          dispatch(resetChannelData());

          navigation?.replace("ChatDetail", {
            receiverId: selectedChannelData.info.id,
            receiverName: selectedChannelData.name,
            receiverImage: selectedChannelData.profile_image,
            channel_id: selectedChannelData.info.channel_id,
          });
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [isChannelIdCreated, selectedChannelData, dispatch, navigation]);

  const onPress = (data) => {
    const obj = {
      id: data.id,
      name: data?.display_name || "",
      profile_image: data?.profile_image || "",
    };
    dispatch(createChannelIdAPI(obj));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerVIew}>
        <Text style={styles.title}>Contacts</Text>
        <View style={styles.iconVIew}>
          <TouchableOpacity>
            <Image
              resizeMode="contain"
              style={[styles.SmallSearchIcon, { marginRight: ms(20) }]}
              source={Images.SmallSearch}
            />
          </TouchableOpacity>

          <Menu>
            <MenuTrigger>
              <Image
                resizeMode="contain"
                style={styles.SmallSearchIcon}
                source={Images.AddCircle}
              />
            </MenuTrigger>
            <MenuOptions optionsContainerStyle={styles.MenuOptionsContainer}>
              <MenuOption onSelect={() => {}}>
                <View style={styles.MenuOptionView}>
                  <Image
                    resizeMode="contain"
                    style={styles.contactChatIcon}
                    source={Images.contactChat}
                  />
                  <Text style={styles.menuText}>New Chat</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => {}}>
                <View style={styles.MenuOptionView}>
                  <Image
                    resizeMode="contain"
                    style={styles.contactChatIcon}
                    source={Images.contactEmail}
                  />
                  <Text style={styles.menuText}>Support</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
          {/* <TouchableOpacity>
            <Image
              resizeMode="contain"
              style={styles.SmallSearchIcon}
              source={Images.AddCircle}
            />
          </TouchableOpacity> */}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <View style={styles.newFriendView}>
          <TouchableOpacity onPress={() => {}} style={styles.item}>
            <Image
              resizeMode="contain"
              source={Images.newFriend}
              style={styles.image}
            />
            <Text style={styles.text}>New Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("NewGroup");
            }}
            style={styles.item}
          >
            <Image source={Images.groupChat} style={styles.image} />
            <Text style={styles.text}>Group Chats</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.item}>
            <Image source={Images.tag} style={styles.image} />
            <Text style={styles.text}>Tags</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.item}>
            <Image source={Images.officialAccounts} style={styles.image} />
            <Text style={styles.text}>Official Accounts</Text>
          </TouchableOpacity>
        </View>

        <SectionList
          contentContainerStyle={styles.SectionListView}
          sections={sections.sort((a, b) => a.title.localeCompare(b.title))}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onPress(item);
              }}
              style={styles.item}
            >
              {item.profile_image ? (
                <Image
                  source={{ uri: item.profile_image } || Images.contactUser}
                  style={styles.image}
                />
              ) : (
                <Image source={Images.contactUser} style={styles.image} />
              )}
              <Text style={styles.text}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.headerText}>{title}</Text>
          )}
        />
      </ScrollView>
      {/* <View style={{ flex: 1, paddingVertical: ms(8) }}>
        <FlatList
          data={matchingContactList}
          renderItem={({ item }) => (
            <MatchingContactItem loading={loading} data={item} />
          )}
        />
      </View> */}
    </View>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },

    headerText: {
      fontSize: ms(12),
      fontFamily: FONTS.robotoBold,
      color: Color.black,
      marginVertical: mvs(5),
      marginHorizontal: ms(15),
    },
    item: {
      backgroundColor: Color.white,
      flexDirection: "row",
      alignItems: "center",
      width: wp(100),
      paddingTop: mvs(10),
      marginBottom: mvs(5),
      paddingHorizontal: ms(15),
      paddingBottom: mvs(10),
    },
    image: {
      width: mvs(32),
      height: mvs(32),
      marginRight: ms(10),
      borderRadius: 2,
    },
    text: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
    },
    title: {
      color: Color.black,
      fontSize: ms(22),
      fontFamily: FONTS.robotoBold,
    },
    headerVIew: {
      flexDirection: "row",
      paddingTop: useSafeAreaInsets().top + mvs(5),
      paddingBottom: mvs(10),
      width: wp(100),
      backgroundColor: Color.white,
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: ms(15),
    },
    SmallSearchIcon: {
      height: mvs(24),
      width: mvs(24),
      tintColor: Color.black,
    },
    iconVIew: {
      flexDirection: "row",
      alignItems: "center",
    },
    newFriendView: {
      marginTop: mvs(20),
      backgroundColor: Color.white,
      width: wp(100),
      paddingBottom: mvs(5),
    },
    SectionListView: {
      marginTop: mvs(10),
    },
    contactChatIcon: {
      height: mvs(20),
      width: mvs(20),
      tintColor: Color.black,
      marginRight: ms(10),
    },
    MenuOptionView: {
      flexDirection: "row",
      alignItems: "center",
    },
    MenuOptionsContainer: {
      paddingVertical: mvs(5),
      paddingHorizontal: ms(10),
      backgroundColor: Color?.white,
      borderWidth: 1,
      borderColor: Color.border,
      borderRadius: ms(8),
      marginTop: mvs(25),
      width: wp(45),
    },
    menuText: {
      color: Color.black,
      fontSize: mvs(14),
    },
  });
};

export default SelectContactScreen;
