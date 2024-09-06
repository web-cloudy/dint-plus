// MessageList.tsx
import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

const MessageList = ({ messages }) => {
  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    marginVertical: 5,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
  },
});

export default MessageList;
