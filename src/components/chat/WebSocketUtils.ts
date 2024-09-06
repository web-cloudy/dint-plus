// WebSocketUtils.ts
export const formatMessage = (message) => {
    // Format message before sending it to the server
    return JSON.stringify(message);
  };
  
  export const parseMessage = (event) => {
    // Parse the message received from the server
    return JSON.parse(event.data);
  };
  