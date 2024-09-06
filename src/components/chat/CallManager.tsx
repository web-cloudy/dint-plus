// CallManager.tsx
import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { startCall, endCall } from '../../utils/CallUtils';  // Placeholder for actual call functionality

const CallManager = () => {
  return (
    <View style={styles.container}>
      <Button title="Start Video Call" onPress={() => startCall('video')} />
      <Button title="End Call" onPress={endCall} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default CallManager;
