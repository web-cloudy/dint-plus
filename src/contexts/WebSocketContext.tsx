import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReconnectingWebSocket from "react-native-reconnecting-websocket";
import { getDataFromAsync } from "utils/LocalStorage";
import store from "store";
import {
  ChatSelectors,
  handleIceCandidate,
  handleIncomingCall,
  handleReceiveCall,
  hangUpCallForEndCall,
} from "store/slices/chat";
import { useDispatch } from "react-redux";
import { useAuth } from "./AuthContext";
import {
  setCurrentInstanceSocket,
  setSocketConnection,
} from "constants/chatSocket";
import { AppState, DeviceEventEmitter } from "react-native";
import { showToastError } from "components";
import { EventRegister } from "react-native-event-listeners";

const URL = "wss://bedev.dint.com/ws/conversation/global/";

interface WebSocketContextType {
  ws: React.MutableRefObject<ReconnectingWebSocket | null>;
  reconnectWebSocket: () => void;
  sendMessage: (message: any) => void;
  connectWebSocket: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC = ({ children }) => {
  const ws = useRef<ReconnectingWebSocket | null>(null);
  const { userId } = useAuth();
  const userIdRef = useRef(userId);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const reconnectWebSocket = async () => {
    const token = await getDataFromAsync("token");
    if (token) {
      connectWebSocket(token);
    }
  };

  const connectWebSocket = async (token: string) => {
    try {
      ws.current = new ReconnectingWebSocket(`${URL}?token=${token}`);
      ws.current.onopen = () => {
        setSocketConnection(ws.current);
        setCurrentInstanceSocket(0);
        console.info("WebSocket connection opened.");
      };

      ws.current.onclose = () => {
        console.warn("WebSocket connection closed.");
        setSocketConnection(null);
        setCurrentInstanceSocket(-1);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error: ", error);
        setSocketConnection(null);
        setCurrentInstanceSocket(-1);
        showToastError(
          "ERROR-001 Connection Error, 'There was an error with the chat connection. '"
        );
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event?.data);
        console.log("WebSocket message received:", message);

        EventRegister.emit("updateChats", message);
        console.log("🚀 ~ userId in contextref:", userIdRef.current);
        const fireEvent = () => {
          DeviceEventEmitter.emit("messageEvent", message);
        };
        if (message) {
          fireEvent();
        }
        switch (message.type) {
          case "receive_offer":
            if (
              message.content.content.sender != userIdRef.current &&
              store.getState().chat.handleIncommingCall == false &&
              appState.current != "background"
            ) {
              console.log(
                "🚀 ~ connectWebSocket ~ receive_offer:",
                userIdRef.current,
                message
              );

              store.dispatch(
                handleIncomingCall({
                  record_id: message.content.content.record_id,
                  sender: message.content.content.channel_id,
                  offer: message.offer,
                  sender_name: message.content.content.sender_name,
                  caller_id: message.content.content.caller_id,
                  isVoiceOnly: message.content.content.isVoiceOnly,
                })
              );
            }
            break;
          case "receive_answer":
            if (
              message.content.content.sender != userIdRef.current &&
              store.getState().chat.handleReceiveCall == false
            ) {
              console.log(
                "🚀 ~ connectWebSocket ~ receive_answer:",
                userIdRef.current,
                message
              );
              store.dispatch(handleReceiveCall({ answer: message.answer }));
            }
            break;
          case "receive_ice_candidate":
            if (message.content.content.sender != userIdRef.current) {
              store.dispatch(handleIceCandidate({ message }));
            }
            break;
          case "participant_left":
            if (
              message.content.content.sender != userIdRef.current &&
              store.getState().chat.hangUpCall == false
            ) {
              console.log(
                "🚀 ~ useEffect ~ receive_ice_candidate:",
                userIdRef.current,
                message
              );
              store.dispatch(hangUpCallForEndCall({}));
            }
            break;
          default:
            console.log("Unknown message type:", message.type);
        }
      };
    } catch (error) {
      console.error("Error connecting to WebSocket", error);
      showToastError(
        "ERROR-002 Connection Error, 'Failed to connect to chat. Please check your internet connection and try again. '"
      );
    }
  };

  const sendMessage = async (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      await reconnectWebSocket();
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message));
      }
    }
  };

  useEffect(() => {
    reconnectWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{ ws, reconnectWebSocket, sendMessage, connectWebSocket }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
