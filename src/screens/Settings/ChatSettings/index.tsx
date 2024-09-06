import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { ServicesHeader } from "components/molecules";
import { Images } from "assets/images";
import AccountItemForChangeUi from "components/molecules/AccountItem/AccountItem";
import { ms, mvs } from "react-native-size-matters";
import { wp } from "utils/metrix";
import { FONTS } from "constants";
import { useRealm } from "contexts/RealmContext";

const ChatSettings = () => {
  const { theme, setTheme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const [savePhoto, setSavePhoto] = React.useState(false);
  const [archivedChats, setArchivedChats] = React.useState(false);
  const realm = useRealm();
  const [conversations, setConversations] = React.useState<any[]>([]);


  const archiveConversation = (conversationId: string) => {
    const realm = useRealm();
  
    realm.write(() => {
      const conversation = realm.objectForPrimaryKey('Conversation', conversationId);
      if (conversation) {
        conversation.archived = true;
      }
    });
  };

  const unarchiveConversation = (conversationId: string) => {
    const realm = useRealm();
  
    realm.write(() => {
      const conversation = realm.objectForPrimaryKey('Conversation', conversationId);
      if (conversation) {
        conversation.archived = false;
      }
    });
  };

  useEffect(() => {
    const conversationsQuery = realm.objects('Conversation').filtered('archived == false').sorted('last_message_timestamp', true);

    const listener = (changes: Realm.CollectionChangeSet) => {
      if (changes.insertions.length > 0 || changes.newModifications.length > 0) {
        setConversations(conversationsQuery.snapshot());
      }      
    };

    conversationsQuery.addListener(listener);

    return () => {
      conversationsQuery.removeListener(listener);
    };
  }, [realm]);
  

  return (
    <View style={styles.container}>
      <ServicesHeader title="Chats" showRightIcon={false} />
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <View style={styles.newFriendView}>
          <AccountItemForChangeUi
            title="Chat Wallpaper"
            showIcon={false}
            onPress={() => {}}
            showLine={false}
          />
        </View>
        <View style={[styles.newFriendView, { marginTop: mvs(10) }]}>
          <AccountItemForChangeUi
            title="Chat Backup"
            showIcon={false}
            onPress={() => {}}
            showLine={false}
          />
          <AccountItemForChangeUi
            title="Export Chat"
            showIcon={false}
            onPress={() => {}}
            showLine={false}
          />
        </View>

        <View style={styles.settingItemContainer}>
          <Text style={styles.title}>Save to Photos</Text>
          <Switch
            trackColor={{ false: "#767577", true: Color.primary }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setSavePhoto((prew) => !prew);
            }}
            value={savePhoto}
          />
        </View>

        <View style={[styles.settingItemContainer, { marginTop: mvs(10) }]}>
          <Text style={styles.title}>Keep Chats Archived</Text>
          <Switch
            trackColor={{ false: "#767577", true: Color.primary }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setArchivedChats((prew) => !prew);
            }}
            value={archivedChats}
          />
        </View>
        <Text style={styles.archivedtext}>
          Archived chats will remains archived when you receive a new message.
        </Text>

        <View
          style={[
            styles.newFriendView,
            { marginTop: mvs(20), paddingHorizontal: ms(15) },
          ]}
        >
          <TouchableOpacity>
            <Text style={styles.nameText}>Move Chats to Android</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.nameText}>Move Chats to Iphone</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.newFriendView,
            { marginTop: mvs(15), paddingHorizontal: ms(15) },
          ]}
        >
          <TouchableOpacity>
            <Text style={[styles.nameText, { color: Color.black }]}>
              Archive All Chats
            </Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity>
            <Text style={[styles.nameText, { color: "red" }]}>
              Clear All Chats
            </Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity>
            <Text style={[styles.nameText, { color: "red" }]}>
              Delete All Chats
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChatSettings;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    newFriendView: {
      marginTop: mvs(15),
      backgroundColor: Color.white,
      width: wp(100),
    },
    settingItemContainer: {
      marginTop: mvs(20),
      paddingHorizontal: ms(16),
      paddingVertical: mvs(10),
      backgroundColor: Color.white,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: mvs(14),
      color: Color.black,
    },
    previewMessage: {
      paddingHorizontal: ms(16),
      fontSize: mvs(12),
      marginTop: mvs(15),
      marginBottom: mvs(20),

      color: Color.grey,
    },
    archivedtext: {
      fontSize: ms(12),
      color: Color.grey,
      width: wp(95),
      alignSelf: "center",
      marginTop: mvs(5),
    },
    nameText: {
      color: Color.primary,
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      paddingVertical: mvs(10),
    },
    line: {
      borderBottomWidth: 1,
      borderBottomColor: Color.deleteBtnColor,
      width: wp(90),
      alignSelf: "center",
    },
  });
};
function useState<T>(arg0: never[]): [any, any] {
  throw new Error("Function not implemented.");
}