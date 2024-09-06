// ChatInput.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');
  console.log(message)
  const handleSend = () => {
    if (message.trim()) {
      onSend({ id: Date.now(), content: message });  // A simple message object
      setMessage('');  // Clear input field
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
});

export default ChatInput;
