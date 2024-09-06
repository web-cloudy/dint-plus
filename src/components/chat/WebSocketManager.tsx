// src/components/chat/WebSocketManager.tsx
import React, { useEffect } from 'react';
import { connectWebSocket, sendMessage, closeWebSocket } from '../../utils/WebSocketUtils';

const WebSocketManager = () => {

  useEffect(() => {
    // Connect to the WebSocket server when the component mounts
    connectWebSocket();

    // Clean up when the component unmounts
    return () => {
      closeWebSocket();
    };
  }, []);

  return (
    <div>
      <button onClick={() => sendMessage('Hello, WebSocket!')}>Send Message</button>
    </div>
  );
};

export default WebSocketManager;
