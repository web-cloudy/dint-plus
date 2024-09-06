import { ObjectSchema } from "realm";

export const PendingMessageSchema: ObjectSchema = {
  name: "PendingMessage",
  properties: {
    _id: "string",
    conversation_id: "string",
    sender_id: "string",
    receiver_id: "string",
    content: "string",
    timestamp: "date",
    status: "string",
    type: "string",
  },
  primaryKey: "_id",
};
