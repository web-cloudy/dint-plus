// src/utils/MqttUtils.ts

import { Paho } from 'paho-mqtt';

const SERVER_URL = 'mqtt.dint.com'; // Replace this with your actual MQTT broker URL
const PORT = 1883; // Use the appropriate port for your broker (default MQTT port is 1883)
const CLIENT_ID = 'clientIdTestPav'; // Unique client ID

let client: Paho.Client | null = null;

// Create the MQTT client and connect
export const connectMqtt = () => {
  client = new Paho.Client(SERVER_URL, PORT, CLIENT_ID);

  // Event handlers
  client.onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.error('MQTT connection lost:', responseObject.errorMessage);
    }
  };

  client.onMessageArrived = (message) => {
    console.log('MQTT message arrived:', message.payloadString);
    // Handle incoming messages here
  };

  client.connect({
    onSuccess: () => {
      console.log('MQTT connection opened');
      // You can subscribe to topics here if needed
    },
    onFailure: (error) => {
      console.error('MQTT connection failed:', error);
    },
  });
};

// Send an MQTT message
export const sendMessage = (topic: string, message: string) => {
  if (client && client.isConnected()) {
    const mqttMessage = new Paho.Message(message);
    mqttMessage.destinationName = topic;
    client.send(mqttMessage);
    console.log('Sent MQTT message:', message);
  } else {
    console.log('MQTT client is not connected. Cannot send message.');
  }
};

// Subscribe to an MQTT topic
export const subscribeToTopic = (topic: string) => {
  if (client && client.isConnected()) {
    client.subscribe(topic, {
      onSuccess: () => console.log(`Subscribed to ${topic}`),
      onFailure: (error) => console.error(`Failed to subscribe to ${topic}`, error),
    });
  } else {
    console.log('MQTT client is not connected. Cannot subscribe.');
  }
};

// Unsubscribe from an MQTT topic
export const unsubscribeFromTopic = (topic: string) => {
  if (client && client.isConnected()) {
    client.unsubscribe(topic, {
      onSuccess: () => console.log(`Unsubscribed from ${topic}`),
      onFailure: (error) => console.error(`Failed to unsubscribe from ${topic}`, error),
    });
  } else {
    console.log('MQTT client is not connected. Cannot unsubscribe.');
  }
};

// Disconnect the MQTT client
export const disconnectMqtt = () => {
  if (client) {
    client.disconnect();
    console.log('MQTT connection closed');
  }
};
