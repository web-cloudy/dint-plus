import React, { createContext, useContext, useEffect, useState } from 'react';
import Paho from 'paho-mqtt';

// Define the context type
interface MqttContextType {
  client: Paho.Client | null;
  connect: () => void;
  disconnect: () => void;
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
  publish: (topic: string, message: string) => void;
}

// Create the context with default values
const MqttContext = createContext<MqttContextType | undefined>(undefined);

// Define the provider component
export const MqttProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Paho.Client | null>(null);

  useEffect(() => {
    // Create and configure the MQTT client
    
    const mqttClient = new Paho.Client('mqtt.dint.com', 1883, 'clientIdtestpav');
    setClient(mqttClient);

    // Define event handlers
    mqttClient.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.error('Connection lost:', responseObject.errorMessage);
      }
    };

    mqttClient.onMessageArrived = (message) => {
      console.log('Message arrived:', message.payloadString);
    };

    return () => {
      mqttClient.disconnect();
    };
  }, []);

  // Define the context methods
  const connect = () => {
    if (client) {
      client.connect({
        onSuccess: () => console.log('Connected'),
        onFailure: (error) => console.error('Connection failed:', error),
      });
    }
  };

  const disconnect = () => {
    if (client) {
      client.disconnect();
      console.log('Disconnected');
    }
  };

  const subscribe = (topic: string) => {
    if (client) {
      client.subscribe(topic);
    }
  };

  const unsubscribe = (topic: string) => {
    if (client) {
      client.unsubscribe(topic);
    }
  };

  const publish = (topic: string, message: string) => {
    if (client) {
      const mqttMessage = new Paho.Message(message);
      mqttMessage.destinationName = topic;
      client.send(mqttMessage);
    }
  };

  return (
    <MqttContext.Provider value={{ client, connect, disconnect, subscribe, unsubscribe, publish }}>
      {children}
    </MqttContext.Provider>
  );
};

// Custom hook to use MQTT context
export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error('useMqtt must be used within a MqttProvider');
  }
  return context;
};
