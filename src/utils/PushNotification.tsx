import React, { useEffect, useRef } from "react";
import { Platform, AppState, View } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { useDispatch } from "react-redux";
import { handleIncomingCall, sdpOffer } from "store/slices/chat";
import store from "store";
import RNCallKeep from "react-native-callkeep";
import { storeDataInAsync } from "./LocalStorage";
import {
  PERMISSIONS_RESULTS,
  checkPushNotificationPermissionAndroid,
  checkPushNotificationPermissionIos,
  requestPushNotificationPermissionAndroid,
  requestPushNotificationPermissionIos,
} from "./permissions";

export let pushNotificationRef: any;

const PushNotification = () => {
  pushNotificationRef = useRef();
  // const appState = useRef(AppState.currentState);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener('change', nextAppState => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === 'active'
  //     ) {
  //       console.log('App has come to the foreground!');
  //     }
  //     appState.current = nextAppState;
  //     console.log('AppState', appState.current);
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  useEffect(() => {
    manageRequirePermissions();
  }, []);

  const manageRequirePermissions = async () => {
    if (Platform.OS === "android") {
      const checkPermissionStatus =
        await checkPushNotificationPermissionAndroid();
      if (
        checkPermissionStatus === PERMISSIONS_RESULTS.DENIED ||
        checkPermissionStatus === PERMISSIONS_RESULTS.BLOCKED
      ) {
        await requestPushNotificationPermissionAndroid();
      } else {
        initPushNotification();
      }
    } else {
      const checkPermissionStatus = await checkPushNotificationPermissionIos();
      if (
        checkPermissionStatus === PERMISSIONS_RESULTS.DENIED ||
        checkPermissionStatus === PERMISSIONS_RESULTS.BLOCKED
      ) {
        await requestPushNotificationPermissionIos();
      } else {
        initPushNotification();
      }
    }
  };

  const initPushNotification = async () => {
    await messaging().registerDeviceForRemoteMessages();
    await getSetFCMToken();

    messaging().onTokenRefresh(async (firebase_token) => {
      console.log("FCM Token refreshed:", firebase_token);
      await getSetFCMToken(firebase_token);
    });

    messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground Message received:", remoteMessage);
      // Handle foreground notifications here
      // You can use react-native-push-notification or a custom UI component to show the notification
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log(" notiff Background Message received:", remoteMessage);

      if ("sdp_offer" in remoteMessage?.data) {
        const sdp = await store.dispatch(
          sdpOffer(remoteMessage?.data?.sdp_offer)
        );
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
              isAppOpen: false,
            })
          );
        }
      }
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage
      );
      // Handle notification opened app
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage
          );
          // Handle notification opened app from quit state
        }
      });
  };

  const getSetFCMToken = async (fcmToken: string | null = "") => {
    try {
      if (!fcmToken) {
        fcmToken = await messaging().getToken();
      }
      if (fcmToken) {
        await storeDataInAsync("fcmToken", fcmToken);
        console.log("FCM Token:", fcmToken);
      } else {
        console.log("Failed to get FCM token");
      }
    } catch (error) {
      console.log("getSetFCMToken Error:", error);
    }
  };

  return <View />;
};

export default PushNotification;
