// src/utils/WebSocketUtils.ts

const SERVER_URL = 'ws://mqtt.dint.com'; // Replace this with your actual WebSocket URL

let socket: WebSocket | null = null;

export const connectWebSocket = () => {
  socket = new WebSocket(SERVER_URL);

  socket.onopen = () => {
    console.log('WebSocket connection opened');
  };

  socket.onmessage = (message) => {
    console.log('Received message:', message.data);
    // Handle incoming messages
  };

  socket.onerror = (error) => {
    console.log('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };
};

export const sendMessage = (data: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(data);
    console.log('Sent message:', data);
  } else {
    console.log('WebSocket is not open. Cannot send message.');
  }
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
  }
};
