// ChatDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MessageList from '../../components/chat/MessageList';
import ChatInput from '../../components/chat/ChatInput';
import WebSocketManager from '../../components/chat/WebSocketManager';
import CallManager from '../../components/chat/CallManager';
import { useMqtt } from '../../contexts/MQTTContext';

const ChatDetailScreen = () => {
  const [messages, setMessages] = useState([]);
  const { connect, publish, subscribe } = useMqtt(); // Use MQTT hook

  useEffect(() => {
    // Connect to the MQTT broker when the component mounts
    connect();

    // Subscribe to the chat topic (replace 'chat/topic' with your topic)
    subscribe('chat/topic');

    return () => {
      // Optionally, unsubscribe from the topic when the component unmounts
      // unsubscribe('chat/topic');
    };
  }, []);

  // Handle sending a message
  const handleSendMessage = (message: string) => {
    // Publish the message to the MQTT topic (replace 'chat/topic' with your topic)
    publish('chat/topic', message);
    setMessages([...messages, message]); // Update local state with the new message
  };

  return (
    <View style={styles.container}>
      <MessageList messages={messages} />
      <ChatInput onSend={handleSendMessage} />
      <CallManager />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatDetailScreen;
