import http from "utils/http-common";
import { useRealm } from "contexts/RealmContext"; 

const syncMessages = async (serverMessages: any[]) => {
  const realm = useRealm();

  realm.write(() => {
    serverMessages.forEach((msg: any) => {
      realm.create("Message", msg, "modified");
    });
  });
};

const queueMessage = async (message: any) => {
  const realm = useRealm();
  realm.write(() => {
    realm.create("PendingMessage", message);
  });
};

const handleOfflineMessage = (message: any) => {
  queueMessage(message);
};

const syncPendingMessages = async () => {
  const realm = useRealm();
  const pendingMessages = realm.objects("PendingMessage");

  pendingMessages.forEach(async (message: any) => {
    try {
      await sendMessageService(message);
      realm.write(() => {
        realm.delete(message);
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  });
};

const getChatListService = (val: number, type: string) => {
  if (type === "unread") {
    return http({
      url: `api/conversations/?start=${val}&limit=${val + 20}&unread=true`,
      type: "GET",
    });
  } else {
    return http({
      url: `api/conversations/?start=${val}&limit=${val + 20}&chat_type=${type}`,
      type: "GET",
    });
  }
};

const getChatMessagesService = (receiverId: string) => {
  return http({ url: `api/conversations/${receiverId}/`, type: "GET" });
};

const searchUserService = (keyword: string) => {
  return http({
    url: `api/users/query-users-by-username/?search_username=${keyword}`,
    type: "GET",
  });
};

const getMatchingContactsService = (reqBody: { phone_no_list: Array<String> }) => {
  return http({
    url: `api/group/get-matching-contacts/`,
    type: "POST",
    data: reqBody,
  });
};

const createChannelIdService = (reqBody: { reciever_id: string }) => {
  return http({
    url: `api/groups/create-peer-group/`,
    type: "POST",
    data: reqBody,
  });
};

const createGroupIdService = (reqBody: { group_name?: string; group_image?: string; group_type?: string }) => {
  return http({ url: `api/groups/create/`, type: "POST", data: reqBody });
};

const addGroupMembers = (reqBody: { user_ids?: string[]; groupId: string }) => {
  return http({
    url: `api/group/${reqBody?.groupId}/members/add/`,
    type: "POST",
    data: reqBody,
  });
};

const sendMessageService = async (reqBody: any) => {
  const response = await http({ url: `api/chat/create-message/`, type: "POST", data: reqBody });
  const message = response.data;
  console.log("asfasdfasd")
  const realm = useRealm();
  realm.write(() => {
    realm.create("Message", message);
  });

  return response;
};

const unreadMessageService = (channel_id: string) => {
  return http({
    url: `api/conversations/mark-read/${channel_id}/`,
    type: "PUT",
    data: {},
  });
};

const uploadAudioFileService = (reqBody: { media: string }) => {
  return http({
    url: `api/upload/media/`,
    type: "POST",
    data: reqBody,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const pinTheMessage = (reqBody: any) => {
  return http({
    url: `api/conversations/pin/${reqBody?.id}/`,
    type: "POST",
    data: reqBody?.data,
  });
};

const unpinTheMessage = (id: string) => {
  return http({
    url: `api/conversations/unpin/${id}/`,
    type: "POST",
  });
};

const updateTheMessage = (data: any) => {
  return http({
    url: `api/chat/update-message/${data?.id}/`,
    type: "POST",
    data: data?.data,
  });
};

const updateFCMToken = (data: any) => {
  return http({
    url: `api/user/update-firebase-token/`,
    type: "PUT",
    data: data,
  });
};

const getSdpOffer = (id: any) => {
  return http({
    url: `api/conversation/get-sdp-offer/${id}/`,
    type: "GET",
  });
};

const getStarredMessagesService = () => {
  return http({
    url: `api/conversation/get-starred-messages/`,
    type: "GET",
  });
};

const starMessageService = (id: any) => {
  return http({
    url: `api/conversation/mark-message-as-starred/${id}/`,
    type: "POST",
  });
};

const deleteCoversationService = (id: any) => {
  return http({
    url: `api/conversation/delete-chat/${id}/`,
    type: "DELETE",
  });
};

const unStarMessageService = (id: any) => {
  return http({
    url: `api/conversation/unstar-message/${id}/`,
    type: "DELETE",
  });
};

const sentLatLngForUpdateLocation = (data: any) => {
  return http({
    url: "api/users/update-or-create-users-location/",
    type: "POST",
    data: data,
  });
};

const getPeopleNearby = (data: any) => {
  return http({
    url: "api/users/fetch-nearby-users/",
    type: "POST",
    data: data,
  });
};

const getLocationExist = () => {
  return http({
    url: "api/users/users-location-exist/",
    type: "GET",
  });
};

const toggleLocationPrivacy = () => {
  return http({
    url: "api/users/toggle-location-privacy/",
    type: "PUT",
  });
};

const deleteUsersLocation = () => {
  return http({
    url: "api/users/delete-users-location/",
    type: "DELETE",
  });
};

const getGroupLocationExist = () => {
  return http({
    url: "api/group/group-location-exist/",
    type: "GET",
  });
};

const sentLatLngForUpdateGroupLocation = (data: any) => {
  return http({
    url: "api/group/update-or-create-group-location/",
    type: "POST",
    data: data,
  });
};

const toggleGroupLocationPrivacy = () => {
  return http({
    url: "api/group/toggle-location-privacy/",
    type: "PUT",
  });
};

const deleteGroupLocation = (data: any) => {
  return http({
    url: "api/group/delete-group-location/",
    type: "DELETE",
    data: data,
  });
};

const getGroupsNearby = (data: any) => {
  return http({
    url: "api/group/fetch-nearby-groups/",
    type: "POST",
    data: data,
  });
};

const getDisappearingTimer = () => {
  return http({
    url: "api/user/get-default-disappearing-timer/",
    type: "GET",
  });
};

const setDisappearingTimer = (data: any) => {
  return http({
    url: "api/user/default-disappearing-timer/",
    type: "PUT",
    data: data,
  });
};

const getPrivacySettings = () => {
  return http({
    url: "api/privacy-settings/fetch/",
    type: "GET",
  });
};

const updatePrivacySettings = (data: any) => {
  return http({
    url: "api/privacy-settings/update/",
    type: "POST",
    data: data,
  });
};

const getBlockContactsList = () => {
  return http({
    url: "api/users/user-contact/",
    type: "GET",
  });
};

const addedUserBlockContactsList = (data: any) => {
  return http({
    url: "api/users/user-contact/",
    type: "PUT",
    data: data,
  });
};

const ChatService = {
  getChatListService,
  getChatMessagesService,
  sendMessageService,
  searchUserService,
  getMatchingContactsService,
  createChannelIdService,
  createGroupIdService,
  addGroupMembers,
  unreadMessageService,
  uploadAudioFileService,
  pinTheMessage,
  unpinTheMessage,
  updateTheMessage,
  updateFCMToken,
  getSdpOffer,
  getStarredMessagesService,
  starMessageService,
  deleteCoversationService,
  unStarMessageService,
  sentLatLngForUpdateLocation,
  getPeopleNearby,
  getLocationExist,
  toggleLocationPrivacy,
  deleteUsersLocation,
  getGroupsNearby,
  getDisappearingTimer,
  setDisappearingTimer,
  syncMessages,
  handleOfflineMessage,
  syncPendingMessages,
};

export default ChatService;
