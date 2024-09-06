import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import { act } from "react-test-renderer";
import ChatService from "services/ChatService";
import { RootState } from "store";
import { ChatListItem, ChatMessage, SearchUser } from "types/chat";

type ChatState = {
  loading: boolean;
  chatList: Array<ChatListItem>;
  messageList: Array<ChatMessage>;
  searchUserList: Array<SearchUser>;
  matchingContactList: Array<SearchUser>;
  isChannelIdCreated: boolean;
  selectedChannelData: object | undefined;
  selectedChannelInfo: object | undefined;
  createMessageData: ChatMessage | undefined;
  createGroupData: any | undefined;
  addMembersApiResp: any | undefined;
  uploadFileResp: any | undefined;
  incomingCall: boolean;
  offerData: object;
  handleIncommingCall: boolean;
  receiveData: object;
  handleReceiveCall: boolean;
  handleReceiveCallData: object;
  handleIceCandidate: boolean;
  handleIceCandidateData: object;
  hangUpCall: boolean;
  pinUnpinMsgResp: any | undefined;
  updateMessageResp: any | undefined;
  sdpOffer: any | undefined;
  getStarredMessages: any | undefined;
  unStarMessage: any | undefined;
  starMessage: any | undefined;
  deleteConversation: any | undefined;
  refreshing: boolean;
  peopleNearbyData: any | undefined;
  locationExistData: any | undefined;
  groupNearbyData: any | undefined;
  disappearingTimerData: any | undefined;
};

const initialState: ChatState = {
  loading: false,
  chatList: [],
  messageList: [],
  searchUserList: [],
  matchingContactList: [],
  isChannelIdCreated: false,
  selectedChannelData: undefined,
  createMessageData: undefined,
  createGroupData: undefined,
  addMembersApiResp: undefined,
  selectedChannelInfo: undefined,
  uploadFileResp: undefined,
  incomingCall: false,
  offerData: {},
  handleIncommingCall: false,
  receiveData: {},
  handleReceiveCall: false,
  handleReceiveCallData: {},
  handleIceCandidate: false,
  handleIceCandidateData: {},
  hangUpCall: false,
  pinUnpinMsgResp: undefined,
  updateMessageResp: undefined,
  sdpOffer: undefined,
  getStarredMessages: undefined,
  starMessage: undefined,
  unStarMessage: undefined,
  refreshing: false,
  peopleNearbyData: undefined,
  locationExistData: undefined,
  deleteConversation: undefined,
  groupNearbyData: undefined,
  disappearingTimerData: undefined,
};

export const getChatsAPI = createAsyncThunk(
  "getChats",
  async (
    reqBody: {
      val: number;
      type: string;
    },
    { rejectWithValue }
  ) => {
    console.log(" ---val---> ", reqBody?.val);
    console.log(" ---val 2---> ", reqBody?.type);
    try {
      const response = await ChatService.getChatListService(
        reqBody?.val,
        reqBody?.type
      );
      console.log("getChats response ", JSON.stringify(response?.data));
      if (response?.data?.code === 200) {
        return response?.data?.data?.conversations;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const refreshChatsAPI = createAsyncThunk(
  "refreshChats",
  async (
    reqBody: {
      val: number;
      type: string;
    },
    { rejectWithValue }
  ) => {
    console.log(" ---val---> ", reqBody?.val);
    console.log(" ---val 2---> ", reqBody?.type);
    try {
      const response = await ChatService.getChatListService(
        reqBody?.val,
        reqBody?.type
      );
      console.log(" ---refresh resp---> ", response?.data);
      if (response?.data?.code === 200) {
        return response.data.data?.conversations;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getChatMessagesAPI = createAsyncThunk(
  "getChatMessages",
  async (receiverId, { rejectWithValue }) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await ChatService.getChatMessagesService(receiverId);
        const isArray = Array.isArray(response.data?.data);
        if (response?.data?.code === 200) {
          return resolve(isArray ? response.data?.data : []);
        } else {
          return rejectWithValue(response.message);
        }
      } catch (error: any) {
        return rejectWithValue(error);
      }
    })
);

export const patchUnreadChatMessageAPI = createAsyncThunk(
  "patchUnreadChatMessageAPI",
  async (channelId: string, { rejectWithValue }) => {
    try {
      const response = await ChatService.unreadMessageService(channelId);
      if (response?.data?.code === 200) {
        console.log(
          Platform.OS,
          " ==patchUnreadChatMessageAPI ",
          response?.data
        );
        // return response.data?.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const uplodAudioFileMessageAPI = createAsyncThunk(
  "uplodAudioFileMessageAPI",
  async (reqBody, { rejectWithValue }) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await ChatService.uploadAudioFileService(reqBody);
        if (response?.data?.code === 200) {
          console.log("uplodAudioFileMessageAPI ", response.data?.data);
          // return response.data?.data;
          return resolve(response.data?.data);
        } else {
          return rejectWithValue(response.message);
        }
      } catch (error: any) {
        return rejectWithValue(error);
      }
    })
);

export const searchUserAPI = createAsyncThunk(
  "searchUser",
  async (keyword: string, { rejectWithValue }) => {
    try {
      const response = await ChatService.searchUserService(keyword);
      if (response?.data?.code === 200) {
        return response.data.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const createMessageAPI = createAsyncThunk(
  "createMessage",
  async (reqBody, { rejectWithValue }) => {
    console.log("🚀 ~ reqBody:", reqBody);
    try {
      const response = await ChatService.sendMessageService(reqBody);
      console.log("createMessage response", response?.data);
      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getMatchingContactsAPI = createAsyncThunk(
  "getMatchingContacts",
  async (
    reqBody: {
      phone_no_list: Array<String>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ChatService.getMatchingContactsService(reqBody);

      console.log("getMatchingContactsAPI ", response.data);
      if (response?.data?.status === 200) {
        const newData = response.data.data.map((item: SearchUser) => ({
          ...item,
          isSelected: false,
        }));
        return newData;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("contactss ", error);
      return rejectWithValue(error);
    }
  }
);

export const createChannelIdAPI = createAsyncThunk(
  "createChannelId",
  async (
    reqBody: {
      id: String;
      name: String;
      profile_image: String;
    },
    { rejectWithValue }
  ) => {
    try {
      const reqBodyTwo = { reciever_id: reqBody.id };
      const response = await ChatService.createChannelIdService(reqBodyTwo);
      console.log("createChannelIdAPI", response.data);
      if (response?.data?.code === 202 || response?.data?.code === 201) {
        let dataaaa = { ...reqBody, info: response?.data?.data };
        return dataaaa;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const createGroupAPI = createAsyncThunk(
  "createGroupAPI",
  async (
    reqBody: {
      group_name?: String;
      group_image?: String;
      group_type?: String;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ChatService.createGroupIdService(reqBody);
      console.log("createGroupAPI ", response?.data);
      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data?.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const addMembersInGroup = createAsyncThunk(
  "addMembersInGroup",
  async (
    reqBody: {
      user_ids?: string[];
      groupId: string;
    },
    { rejectWithValue }
  ) => {
    console.log("request body ", reqBody);
    try {
      const response = await ChatService.addGroupMembers(reqBody);
      console.log("addMembersInGroup ", response.data);
      if (response?.data?.status === 200 || response?.data?.status === 201) {
        return reqBody;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const pinMessageRequest = createAsyncThunk(
  "pinMessageRequest",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response = await ChatService.pinTheMessage(reqBody);
      console.log("pinMessageRequest ", response.data);

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const unpinMessageRequest = createAsyncThunk(
  "unpinMessageRequest",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ChatService.unpinTheMessage(id);
      console.log("unpinMessageRequest ", response.data);

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        return reqBody;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const updateMessageRequest = createAsyncThunk(
  "updateMessageRequest",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await ChatService.updateTheMessage(data);
      console.log("updateMessageRequest ", response);

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        return reqBody;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("updateMessageRequest err ", error?.response);

      return rejectWithValue(error);
    }
  }
);

export const updateFCMTokenRequest = createAsyncThunk(
  "updateFCMTokenRequest",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await ChatService.updateFCMToken(data);

      console.log(
        "🚀 ~ response updateFCMTokenRequest:",
        response?.data.message
      );

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        return reqBody;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("🚀 ~ error updateFCMTokenRequest:", error);

      return rejectWithValue(error);
    }
  }
);

export const updateUserLocation = createAsyncThunk(
  "updateUserLocation",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await ChatService.sentLatLngForUpdateLocation(data);
      console.log("🚀 ~ response:", response?.data.message);
      if (response?.data?.status === 200 || response?.data?.status === 201) {
        return reqBody;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("🚀 ~ error:", error);
      return rejectWithValue(error);
    }
  }
);

export const sdpOffer = createAsyncThunk(
  "sdpOffer",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await ChatService.getSdpOffer(id);
      console.log("🚀 ~ response sdpOffer:", response);
      if (response?.data?.code === 200) {
        return response.data.sdp_offer;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("🚀 ~ error sdpOffer:", error);
      return rejectWithValue(error);
    }
  }
);

export const getStarredMessages = createAsyncThunk(
  "getStarredMessages",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await ChatService.getStarredMessagesService();
      console.log("🚀 ~ response getStarredMessagesService:", response?.data);
      if (response?.data?.code === 200) {
        return response?.data?.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("🚀 ~ error getStarredMessagesService:", error);
      return rejectWithValue(error);
    }
  }
);

export const starMessage = createAsyncThunk(
  "starMessage",
  async (id: any, { rejectWithValue }) => {
    try {
      console.log(" ---starMessage---> ", id);
      const response = await ChatService.starMessageService(id);
      console.log("🚀 ~ response starMessage:", response?.data);
      // if (response?.data?.code === 200) {
      //   return response.data.sdp_offer;
      // } else {
      //   return rejectWithValue(response.message);
      // }
    } catch (error: any) {
      console.log("🚀 ~ error starMessage:", error);
      return rejectWithValue(error);
    }
  }
);

export const deleteConversation = createAsyncThunk(
  "deleteConversation",
  async (id: any, { rejectWithValue }) => {
    try {
      console.log(" ---deleteConversation---> ", id);
      const response = await ChatService.deleteCoversationService(id);
      console.log("🚀 ~ response deleteConversation:", response?.data);
      if (response?.data?.code === 200) {
        return id; // Return the deleted conversation id
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("🚀 ~ error starMessage:", error);
      return rejectWithValue(error);
    }
  }
);

export const unStarMessage = createAsyncThunk(
  "unStarMessage",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await ChatService.unStarMessageService(id);
      console.log("🚀 ~ response unStarMessage:", response?.data);
      // if (response?.data?.code === 200) {
      //   return response.data.sdp_offer;
      // } else {
      //   return rejectWithValue(response.message);
      // }
    } catch (error: any) {
      console.log("🚀 ~ error unStarMessage:", error);
      return rejectWithValue(error);
    }
  }
);

export const peopleNearby = createAsyncThunk(
  "peopleNearby",
  async (data, { rejectWithValue }) => {
    try {
      console.log("🚀 ~ data:", data);
      const response = await ChatService.getPeopleNearby(data);
      console.log("🚀 ~ response peopleNearby:", response);

      if (response?.data?.code === 200) {
        return response?.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("🚀 ~ error unStarMessage:", error);
      return rejectWithValue(error);
    }
  }
);

export const locationExist = createAsyncThunk(
  "locationExist",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ChatService.getLocationExist();
      console.log("🚀 ~ response:", response);

      if (response?.data?.code === 200) {
        return response?.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("🚀 ~ error unStarMessage:", error);
      return rejectWithValue(error);
    }
  }
);

export const deleteUsersLocation = createAsyncThunk(
  "deleteUsersLocation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ChatService.deleteUsersLocation();
      console.log("🚀 ~ response:", response);

      if (response?.data?.code === 200) {
        return response?.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("🚀 ~ error unStarMessage:", error);
      return rejectWithValue(error);
    }
  }
);

export const toggleLocationPrivacy = createAsyncThunk(
  "toggleLocationPrivacy",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ChatService.toggleLocationPrivacy();
      console.log("🚀 ~ response:", response);

      if (response?.data?.code === 200) {
        return response?.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("🚀 ~ error unStarMessage:", error);
      return rejectWithValue(error);
    }
  }
);

export const groupNearby = createAsyncThunk(
  "groupNearby",
  async (data, { rejectWithValue }) => {
    try {
      console.log("🚀 ~ data:", data);
      const response = await ChatService.getGroupsNearby(data);
      console.log("🚀 ~ response peopleNearby:", response);

      if (response?.data?.code === 200) {
        return response?.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("🚀 ~ error unStarMessage:", error);
      return rejectWithValue(error);
    }
  }
);

export const disappearingTimer = createAsyncThunk(
  "disappearingTimer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ChatService.getDisappearingTimer();
      console.log("🚀 ~ response:", response);

      if (response?.data?.code === 200) {
        return response?.data?.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("🚀 ~ error unStarMessage:", error);
      return rejectWithValue(error);
    }
  }
);

export const updateDisappearingTimer = createAsyncThunk(
  "updateDisappearingTimer",
  async (data, { rejectWithValue }) => {
    console.log("🚀 ~ data:", data);
    try {
      const response = await ChatService.setDisappearingTimer(data);
      console.log("🚀 ~ response:", response);

      if (response?.status === 200) {
        return response?.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("🚀 ~ error unStarMessage:", error);
      return rejectWithValue(error);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChatlist: (state) => {
      state.chatList = [];
    },
    resetMessageList(state) {
      state.messageList = [];
    },
    updateMessaegList(state, action) {
      state.messageList = [...state.messageList, action.payload];
      state.loading = false;
    },
    resetChannelData(state) {
      state.isChannelIdCreated = false;
      state.selectedChannelData = undefined;
    },
    onUpdateMatchingContacts(state, action) {
      state.matchingContactList = action.payload;
      state.loading = false;
      console.log(action.payload);
    },
    resetCreateMessageData(state) {
      state.createMessageData = undefined;
      state.loading = false;
    },
    resetCreateChannelData(state) {
      state.createGroupData = undefined;
      state.loading = false;
    },
    resetAddMembersData(state) {
      state.addMembersApiResp = undefined;
      state.loading = false;
    },
    incomingCall(state, action) {
      if (state.incomingCall == true) {
        state.incomingCall = false;
        state.offerData = {};
      } else {
        state.incomingCall = true;
        state.offerData = action.payload;
      }
    },
    handleIncomingCall(state, action) {
      if (state.handleIncommingCall == true) {
        state.handleIncommingCall = false;
        state.receiveData = {};
      } else {
        state.handleIncommingCall = true;
        state.receiveData = action.payload;
      }
    },
    handleReceiveCall(state, action) {
      if (state.handleReceiveCall == true) {
        state.handleReceiveCall = false;
        state.handleReceiveCallData = {};
      } else {
        state.handleReceiveCall = true;
        state.handleReceiveCallData = action.payload;
      }
    },

    handleIceCandidate(state, action) {
      if (state.handleIceCandidate == true) {
        state.handleIceCandidate = false;
        state.handleIceCandidateData = {};
      } else {
        state.handleIceCandidate = true;
        state.handleIceCandidateData = action.payload;
      }
    },
    hangUpCallForEndCall(state, action) {
      if (state.hangUpCall == true) {
        state.hangUpCall = false;
      } else {
        state.hangUpCall = true;
      }
    },
    resetPinunpinData(state) {
      state.pinUnpinMsgResp = undefined;
    },
    resetUpdateMessageData(state) {
      state.updateMessageResp = undefined;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getChatsAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getChatsAPI.fulfilled, (state, action) => {
      state.chatList = [...state.chatList, ...action.payload];
      state.loading = false;
    });
    // builder.addCase(getChatsAPI.fulfilled, (state, action) => {
    //   // Merge new chats with existing ones, avoiding duplicates and sorting
    //   const allChats = [...action.payload, ...state.chatList];
    //   state.chatList = Array.from(new Set(allChats.map(chat => chat.id)))
    //     .map(id => allChats.find(chat => chat.id === id))
    //     .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    //   state.loading = false;
    // });
    builder.addCase(getChatsAPI.rejected, (state, action) => {
      // state.chatList = [];
      state.loading = false;
    });

    // Add new cases for refreshing
    builder.addCase(refreshChatsAPI.pending, (state) => {
      state.refreshing = true;
    });
    builder.addCase(refreshChatsAPI.fulfilled, (state, action) => {
      // Merge new chats with existing ones, avoiding duplicates and sorting
      const allChats = [...action.payload, ...state.chatList];
      state.chatList = Array.from(new Set(allChats.map((chat) => chat.id)))
        .map((id) => allChats.find((chat) => chat.id === id))
        .sort(
          (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        );
      state.refreshing = false;
    });
    builder.addCase(refreshChatsAPI.rejected, (state) => {
      // state.chatList = [];
      state.refreshing = false;
    });

    builder.addCase(getChatMessagesAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getChatMessagesAPI.fulfilled, (state, action) => {
      state.messageList = action.payload ? action?.payload?.reverse() : [];
      state.loading = false;
    });
    builder.addCase(getChatMessagesAPI.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(patchUnreadChatMessageAPI.pending, (state, { meta }) => {
      // state.loading = true;
    });
    builder.addCase(patchUnreadChatMessageAPI.fulfilled, (state, action) => {
      // state.messageList = action.payload;
      // state.loading = false;
    });
    builder.addCase(patchUnreadChatMessageAPI.rejected, (state, action) => {
      // state.loading = false;
    });

    builder.addCase(uplodAudioFileMessageAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(uplodAudioFileMessageAPI.fulfilled, (state, action) => {
      state.uploadFileResp = action.payload;
      state.loading = false;
    });
    builder.addCase(uplodAudioFileMessageAPI.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(searchUserAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(searchUserAPI.fulfilled, (state, action) => {
      state.searchUserList = action.payload;
      state.loading = false;
    });
    builder.addCase(searchUserAPI.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(getMatchingContactsAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getMatchingContactsAPI.fulfilled, (state, action) => {
      state.matchingContactList = action.payload;
      state.loading = false;
    });
    builder.addCase(getMatchingContactsAPI.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(createChannelIdAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(createChannelIdAPI.fulfilled, (state, action) => {
      state.isChannelIdCreated = true;
      state.selectedChannelData = action.payload;
      state.selectedChannelInfo = action.payload;
      state.loading = false;
    });
    builder.addCase(createChannelIdAPI.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(createMessageAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(createMessageAPI.fulfilled, (state, action) => {
      console.log("🚀 ~ builder.addCase ~ action:", action);
      state.createMessageData = action.payload?.data;
      state.loading = false;
    });
    builder.addCase(createMessageAPI.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(createGroupAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(createGroupAPI.fulfilled, (state, action) => {
      state.createGroupData = action.payload;
      state.loading = false;
    });
    builder.addCase(createGroupAPI.rejected, (state, action) => {
      state.createGroupData = action.payload;
      state.loading = false;
    });

    builder.addCase(addMembersInGroup.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(addMembersInGroup.fulfilled, (state, action) => {
      state.addMembersApiResp = action.payload;
      state.loading = false;
    });
    builder.addCase(addMembersInGroup.rejected, (state, action) => {
      state.loading = false;
    });

    // builder.addCase(getGroupMessagesAPI.pending, (state, { meta }) => {
    //   state.loading = true;
    // });
    // builder.addCase(getGroupMessagesAPI.fulfilled, (state, action) => {
    //   state.messageList = action.payload;
    //   state.loading = false;
    // });
    // builder.addCase(getGroupMessagesAPI.rejected, (state, action) => {
    //   state.loading = false;
    // });

    //pin message handler
    builder.addCase(pinMessageRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(pinMessageRequest.fulfilled, (state, action) => {
      state.pinUnpinMsgResp = { pin: action.payload };
      state.loading = false;
    });
    builder.addCase(pinMessageRequest.rejected, (state, action) => {
      state.loading = false;
      state.pinUnpinMsgResp = { pin: action.payload };
    });

    //unpin message handler
    builder.addCase(unpinMessageRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(unpinMessageRequest.fulfilled, (state, action) => {
      state.pinUnpinMsgResp = { unpin: action.payload };
      state.loading = false;
    });
    builder.addCase(unpinMessageRequest.rejected, (state, action) => {
      state.loading = false;
      state.pinUnpinMsgResp = { unpin: action.payload };
    });

    //update message handler
    builder.addCase(updateMessageRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(updateMessageRequest.fulfilled, (state, action) => {
      state.updateMessageResp = { unpin: action.payload };
      state.loading = false;
    });
    builder.addCase(updateMessageRequest.rejected, (state, action) => {
      state.loading = false;
      state.updateMessageResp = { unpin: action.payload };
    });

    builder.addCase(updateFCMTokenRequest.pending, (state, { meta }) => {
      // state.loading = true;
    });
    builder.addCase(updateFCMTokenRequest.fulfilled, (state, action) => {
      // state.messageList = action.payload;
      // state.loading = false;
    });
    builder.addCase(updateFCMTokenRequest.rejected, (state, action) => {
      // state.loading = false;
    });

    builder.addCase(updateUserLocation.pending, (state, { meta }) => {
      // state.loading = true;
    });
    builder.addCase(updateUserLocation.fulfilled, (state, action) => {
      // state.messageList = action.payload;
      // state.loading = false;
    });
    builder.addCase(updateUserLocation.rejected, (state, action) => {
      // state.loading = false;
    });

    builder.addCase(getStarredMessages.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getStarredMessages.fulfilled, (state, action) => {
      state.getStarredMessages = action.payload;
      state.loading = false;
    });
    builder.addCase(getStarredMessages.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(sdpOffer.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(sdpOffer.fulfilled, (state, action) => {
      state.sdpOffer = action.payload;
      state.loading = false;
    });
    builder.addCase(sdpOffer.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(starMessage.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(starMessage.fulfilled, (state, action) => {
      state.starMessage = action.payload;
      state.loading = false;
    });
    builder.addCase(starMessage.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(unStarMessage.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(unStarMessage.fulfilled, (state, action) => {
      state.unStarMessage = action.payload;
      state.loading = false;
    });
    builder.addCase(unStarMessage.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteConversation.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(deleteConversation.fulfilled, (state, action) => {
      state.deleteConversation = action.payload;
      state.chatList = state.chatList.filter(
        (chat) => chat.id !== action.payload
      );
      state.loading = false;
    });
    builder.addCase(deleteConversation.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(peopleNearby.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(peopleNearby.fulfilled, (state, action) => {
      console.log("🚀 ~ builder.addCase ~ state:", state);
      state.peopleNearbyData = action.payload?.data;
      state.loading = false;
    });
    builder.addCase(peopleNearby.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(locationExist.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(locationExist.fulfilled, (state, action) => {
      console.log("🚀 ~ builder.addCase ~ state:", state);
      state.locationExistData = action.payload?.data?.is_location_private;
      state.loading = false;
    });
    builder.addCase(locationExist.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(groupNearby.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(groupNearby.fulfilled, (state, action) => {
      console.log("🚀 ~ builder.addCase ~ state:", state);
      state.groupNearbyData = action.payload?.data;
      state.loading = false;
    });
    builder.addCase(groupNearby.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(disappearingTimer.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(disappearingTimer.fulfilled, (state, action) => {
      console.log("🚀 ~ builder.addCase ~ state:", state);
      state.disappearingTimerData = action.payload?.disappearing_timer;
      state.loading = false;
    });
    builder.addCase(disappearingTimer.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(updateDisappearingTimer.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(updateDisappearingTimer.fulfilled, (state, action) => {
      console.log("🚀 ~ builder.addCase ~ state:", state);
      state.loading = false;
    });
    builder.addCase(updateDisappearingTimer.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

const { reducer } = chatSlice;
export default reducer;

interface EventSelectorsType {
  loading: boolean;
  chatList: Array<ChatListItem>;
  messageList: Array<ChatMessage>;
  searchUserList: Array<SearchUser>;
  matchingContactList: Array<SearchUser>;
  isChannelIdCreated: boolean;
  selectedChannelData: object | undefined;
  createMessageData: ChatMessage | undefined;
  createGroupData: any | undefined;
  addMembersApiResp: any | undefined;
  selectedChannelInfo: object | undefined;
  incomingCallState: any | undefined;
  offerDataState: any | undefined;
  receiveDataSate: any | undefined;
  handleIncommingCallState: any | undefined;
  handleReceiveCallDataState: any | undefined;
  handleReceiveCallState: any | undefined;
  handleIceCandidateState: any | undefined;
  handleIceCandidateDataState: any | undefined;
  hangUpCallState: any | undefined;
  pinUnpinMsgResp: any | undefined;
  updateMessageResp: any | undefined;
  sdpOfferState: any | undefined;
  starredMessagesState: any | undefined;
  refreshing: any | undefined;
  peopleNearbyDataState: any | undefined;
  locationExistDataState: any | undefined;
  groupNearbyDataState: any | undefined;
  disappearingTimerDataState: any | undefined;
}

export const ChatSelectors = (): EventSelectorsType => {
  const loading = useSelector((state: RootState) => state.chat.loading);
  const chatList = useSelector((state: RootState) => state.chat.chatList);
  const messageList = useSelector((state: RootState) => state.chat.messageList);
  const searchUserList = useSelector(
    (state: RootState) => state.chat.searchUserList
  );
  const matchingContactList = useSelector(
    (state: RootState) => state.chat.matchingContactList
  );
  const isChannelIdCreated = useSelector(
    (state: RootState) => state.chat.isChannelIdCreated
  );
  const selectedChannelData = useSelector(
    (state: RootState) => state.chat.selectedChannelData
  );
  const selectedChannelInfo = useSelector(
    (state: RootState) => state.chat.selectedChannelInfo
  );
  const createMessageData = useSelector(
    (state: RootState) => state.chat.createMessageData
  );

  const createGroupData = useSelector(
    (state: RootState) => state.chat.createGroupData
  );
  const addMembersApiResp = useSelector(
    (state: RootState) => state.chat.addMembersApiResp
  );
  const incomingCallState = useSelector(
    (state: RootState) => state.chat.incomingCall
  );

  const handleIncommingCallState = useSelector(
    (state: RootState) => state.chat.handleIncommingCall
  );

  const offerDataState = useSelector(
    (state: RootState) => state.chat.offerData
  );
  const receiveDataSate = useSelector(
    (state: RootState) => state.chat.receiveData
  );

  const handleReceiveCallState = useSelector(
    (state: RootState) => state.chat.handleReceiveCall
  );

  const handleReceiveCallDataState = useSelector(
    (state: RootState) => state.chat.handleReceiveCallData
  );

  const handleIceCandidateState = useSelector(
    (state: RootState) => state.chat.handleIceCandidate
  );

  const handleIceCandidateDataState = useSelector(
    (state: RootState) => state.chat.handleIceCandidateData
  );

  const hangUpCallState = useSelector(
    (state: RootState) => state.chat.hangUpCall
  );

  const pinUnpinMsgResp = useSelector(
    (state: RootState) => state.chat.pinUnpinMsgResp
  );

  const updateMessageResp = useSelector(
    (state: RootState) => state.chat.updateMessageResp
  );

  const sdpOfferState = useSelector((state: RootState) => state.chat.sdpOffer);

  const peopleNearbyDataState = useSelector(
    (state: RootState) => state.chat.peopleNearbyData
  );

  const locationExistDataState = useSelector(
    (state: RootState) => state.chat.locationExistData
  );

  const starredMessagesState = useSelector(
    (state: RootState) => state.chat?.getStarredMessages
  );

  const refreshing = useSelector((state: RootState) => state.chat.refreshing);

  const groupNearbyDataState = useSelector(
    (state: RootState) => state.chat.groupNearbyData
  );

  const disappearingTimerDataState = useSelector(
    (state: RootState) => state.chat.disappearingTimerData
  );

  return {
    loading,
    chatList,
    messageList,
    searchUserList,
    matchingContactList,
    isChannelIdCreated,
    selectedChannelData,
    createMessageData,
    createGroupData,
    addMembersApiResp,
    selectedChannelInfo,
    incomingCallState,
    offerDataState,
    handleIncommingCallState,
    receiveDataSate,
    handleReceiveCallState,
    handleReceiveCallDataState,
    handleIceCandidateState,
    handleIceCandidateDataState,
    hangUpCallState,
    pinUnpinMsgResp,
    updateMessageResp,
    sdpOfferState,
    starredMessagesState,
    refreshing,
    peopleNearbyDataState,
    locationExistDataState,
    groupNearbyDataState,
    disappearingTimerDataState,
  };
};

export const {
  resetChatlist,
  resetMessageList,
  resetChannelData,
  onUpdateMatchingContacts,
  resetCreateMessageData,
  resetCreateChannelData,
  resetAddMembersData,
  updateMessaegList,
  incomingCall,
  handleIncomingCall,
  handleReceiveCall,
  handleIceCandidate,
  hangUpCallForEndCall,
  resetPinunpinData,
  resetUpdateMessageData,
} = chatSlice.actions;
