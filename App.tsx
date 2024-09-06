import React, { useEffect, useState } from "react";

import { LogBox, PermissionsAndroid } from "react-native";
import RNCallKeep from "react-native-callkeep";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import SplashScreen from "react-native-splash-screen";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { v4 as uuidv4 } from "uuid";

import { StripeProvider } from "@stripe/stripe-react-native";
import { MqttProvider } from "contexts/MQTTContext";
import { useRealm } from "contexts/RealmContext";
import { WebSocketProvider } from "contexts/WebSocketContext";
import { PersistGate } from "redux-persist/integration/react";

import { RealmProvider } from "./src/contexts/RealmContext";
import Navigator from "./src/navigator";
import store from "./src/store";
import { useNetworkStatus } from "./src/utils/networkStatus";

import "react-native-get-random-values";

const persistor = persistStore(store);

// Function to delete old messages and conversations
const cleanupOldData = () => {
  const realm = useRealm();
  const retentionPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  realm.write(() => {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - retentionPeriod);

    // Delete old messages
    const oldMessages = realm.objects("Message").filtered("timestamp < $0", cutoffDate);
    realm.delete(oldMessages);

    // Delete old conversations
    const oldConversations = realm.objects("Conversation").filtered("last_message_timestamp < $0", cutoffDate);
    realm.delete(oldConversations);
  });
};

// Schedule the cleanup job
const scheduleCleanup = () => {
  setInterval(cleanupOldData, 24 * 60 * 60 * 1000); // Run daily
};

function App(): JSX.Element {
  const [callerName, setCallerName] = useState("");
  const [callUUID, setCallUUID] = useState(null);
  const incomingCallState = store.getState().chat.incomingCall;
  const CallData = store.getState().chat.offerData;
  console.log("🚀 ~ App ~ auth:", incomingCallState);

  useNetworkStatus(); // I'm Calling the network status hook

  useEffect(() => {
    SplashScreen?.hide();
    scheduleCleanup(); // Schedule the cleanup when the app starts
  }, []);

  useEffect(() => {
    console.log("🚀 ~ App ~ CallData", CallData, incomingCallState);
  }, [CallData, incomingCallState]);

  const handleIncomingCall = (name: string) => {
    const uuid = uuidv4();
    setCallerName(name);
    setCallUUID(uuid);

    // Display the incoming call UI
    RNCallKeep.displayIncomingCall(uuid, "12345", name);
  };

  const handleAnswerCall = () => {
    setIncomingCall(false);
    // Answer the call logic
    RNCallKeep.answerIncomingCall(callUUID);
  };

  const handleDeclineCall = () => {
    setIncomingCall(false);
    // Decline the call logic
    RNCallKeep.endCall(callUUID);
  };

  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

  useEffect(() => {
    const options = {
      ios: {
        appName: "Dint +",
      },
      android: {
        alertTitle: "Permissions required",
        alertDescription: "Dint + needs to access your phone accounts",
        cancelButton: "Cancel",
        okButton: "ok",
        imageName: "phone_account_icon",
        additionalPermissions: [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
        foregroundService: {
          channelId: "com.dint.society",
          channelName: "Foreground service for my app",
          notificationTitle: "Dint + is running on background",
          // notificationIcon: Images.headerLogo,
        },
      },
    };
    RNCallKeep.registerAndroidEvents();
    RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true);
  }, []);

  return (
    <GestureHandlerRootView>
      <StripeProvider
        publishableKey={
          "pk_test_51PYiJuFiQkPaNX0RLqgDLVSRCwShw8UNbuyFCdN86hGvcTNnVxGrIaeQSQDa2PDgQNp7RYAStNFdi49DdMMTFQx400AwPd17im"
        }
      >
        <RealmProvider>
          <WebSocketProvider>
            <MqttProvider>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <MenuProvider>
                    <Navigator />
                  </MenuProvider>
                </PersistGate>
              </Provider>
            </MqttProvider>
          </WebSocketProvider>
        </RealmProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}

export default App;
