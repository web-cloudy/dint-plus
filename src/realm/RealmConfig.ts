import Realm from "realm";
import { Platform } from "react-native";
import { getSecureStorage } from "../utils/secureStorage"; 
import { PendingMessageSchema } from "./PendingMessageSchema:";

const encryptionKey = async () => {
  return await getSecureStorage();
};

// Define schemas
const MessageSchema = {
  name: "Message",
  primaryKey: "message_id",
  properties: {
    message_id: "string",
    conversation_id: "string",
    sender_id: "string",
    receiver_id: "string",
    content: "string",
    timestamp: "date",
    status: "string",
    type: "string",
  },
};

const ConversationSchema = {
  name: "Conversation",
  primaryKey: "conversation_id",
  properties: {
    conversation_id: "string",
    user_id: "string",
    last_message_id: "string",
    last_message_timestamp: "date",
    unread_count: "int",
    archived: 'bool',
  },
};

const UserSchema = {
  name: "User",
  primaryKey: "user_id",
  properties: {
    user_id: "string",
    name: "string",
    profile_picture: "string",
    status: "string",
    phone_number:"string"
  },
};

export const getRealmConfig = async () => {
  const key = await encryptionKey();
  return {
    path: "myrealm",
    schema: [MessageSchema, ConversationSchema, UserSchema],
    encryptionKey: new Uint8Array(key),
    schemaVersion: 1,
  };
};

