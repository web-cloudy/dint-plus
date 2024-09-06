import { useRealm } from "@realm/react";
import ChatService from "../services/ChatService"; // Import your ChatService

// Function to queue a message when offline
const queueMessage = (message: any) => {
  const realm = useRealm();
  realm.write(() => {
    realm.create("PendingMessage", {
      _id: message.message_id, // Use a unique identifier for the primary key
      ...message,
    });
  });
};

// Function to handle offline messages
const handleOfflineMessage = (message: any) => {
  queueMessage(message);
};

// Function to sync pending messages with the server
const syncPendingMessages = async () => {
  const realm = useRealm();
  const pendingMessages = realm.objects("PendingMessage");

  // Iterate over pending messages
  for (const message of pendingMessages) {
    try {
      // Send message using the service
      await ChatService.sendMessageService(message);
      
      // Delete the message from the realm after successful send
      realm.write(() => {
        realm.delete(message);
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      // Handle any errors if needed
    }
  }
};