/**
 * @format
 */

import { ThemeProvider } from "contexts/ThemeContext";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import Toast from "react-native-toast-message";
import messaging from "@react-native-firebase/messaging";
import RNCallKeep from "react-native-callkeep";
import { AuthProvider } from "contexts/AuthContext";
import Splash from "screens/Splash";
import { useEffect, useState } from "react";
import PushNotification from "utils/PushNotification";
import store from "store";
import { handleIncomingCall, sdpOffer } from "store/slices/chat";
import toastConfig from "components/ToastMessage/toastConfig";

// Handle background messages using setBackgroundMessageHandler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if ("sdp_offer" in remoteMessage?.data) {
    const sdp = await store.dispatch(sdpOffer(remoteMessage?.data?.sdp_offer));
    if (sdp?.payload) {
      RNCallKeep.setAvailable(true);
      store.dispatch(
        handleIncomingCall({
          record_id: sdp?.payload?.conversation,
          sender: sdp?.payload?.channel_id,
          offer: {
            sdp: sdp?.payload?.sdp,
            type: sdp?.payload?.offer_type,
          },
          sender_name: sdp?.payload?.sender_name,
          caller_id: sdp?.payload?.caller_id,
          isVoiceOnly: sdp?.payload?.media_type === "audio",
          background: true,
        })
      );
      RNCallKeep.backToForeground();
    }
  }
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  // Render the app component on foreground launch
  return <AppWrapper />;
}

const AppWrapper = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 4200);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <PushNotification />
        <App />
        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
        {showSplash && <Splash />}
      </AuthProvider>
    </ThemeProvider>
  );
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
