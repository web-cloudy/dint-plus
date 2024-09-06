// import {
//   createNotification,
//   handleNotificationOpenedApp,
// } from "./NotificationLisenters";
// import messaging from "@react-native-firebase/messaging";
// import { useEffect } from "react";
// import { Platform } from "react-native";
// import { useDispatch } from "react-redux";
// import store from "store";
// import { handleIncomingCall, sdpOffer } from "store/slices/chat";
// import VoipPushNotification from "react-native-voip-push-notification";
// import RNCallKeep from "react-native-callkeep";

// const NotificationsBanners = () => {
//   const showNotification = (notification: any) => {
//     if (Platform.OS == "ios") {
//       console.log("onMessage banner ", notification);
//     }
//     createNotification(notification);
//   };

//   useEffect(() => {
//     messaging().getInitialNotification().then(handleNotificationOpenedApp);
//     messaging().onNotificationOpenedApp(handleNotificationOpenedApp);
//     const unsubscribe = messaging().onMessage(async (remoteMessage) => {
//       // When app in foreground
//       console.log("Message handled in the foregroud!", remoteMessage);
//       showNotification(remoteMessage);
//     });

//     return () => {
//       return unsubscribe;
//     };
//   }, []);

//   useEffect(() => {
//     const unsubscribe = messaging().setBackgroundMessageHandler(
//       async (remoteMessage) => {
//         console.log(
//           "🚀 ~ remoteMessage setBackgroundMessageHandler:",
//           remoteMessage
//         );

//         if ("sdp_offer" in remoteMessage?.data) {
//           console.log("------called------");
//           const sdp = await store.dispatch(
//             sdpOffer(remoteMessage?.data?.sdp_offer)
//           );
//           if (sdp?.payload) {
//             console.log("🚀 ~ sdp?.sdp_offer:", sdp?.payload);

//             store.dispatch(
//               handleIncomingCall({
//                 record_id: sdp?.payload?.conversation,
//                 sender: sdp?.payload?.channel_id,
//                 offer: {
//                   sdp: sdp?.payload?.sdp,
//                   type: sdp?.payload?.offer_type,
//                 },
//                 sender_name: sdp?.payload?.sender_name,
//                 caller_id: sdp?.payload?.caller_id,
//                 isVoiceOnly: sdp?.payload?.media_type == "audio" ? true : false,
//                 background: true,
//               })
//             );
//           }
//         }
//         if (!("sdp_offer" in remoteMessage?.data)) {
//           showNotification(remoteMessage);
//         }
//         //call count here
//       }
//     );
//     return () => {
//       return unsubscribe;
//     };
//   }, []);

//   // useEffect(() => {
//   //   VoipPushNotification.addEventListener("register", (token) => {});

//   //   VoipPushNotification.addEventListener("notification", (notification) => {
//   //     console.log(
//   //       "🚀 ~ VoipPushNotification.addEventListener ~ notification:",
//   //       notification
//   //     );

//   //     // VoipPushNotification.onVoipNotificationCompleted(notification.uuid);
//   //   });

//   //   VoipPushNotification.addEventListener("didLoadWithEvents", (events) => {
//   //     console.log(
//   //       "🚀 ~ VoipPushNotification.addEventListener ~ events:",
//   //       events
//   //     );
//   //   });

//   //   return () => {
//   //     VoipPushNotification.removeEventListener("didLoadWithEvents");
//   //     VoipPushNotification.removeEventListener("register");
//   //     VoipPushNotification.removeEventListener("notification");
//   //   };
//   // }, []);

//   return null;
// };

// export default NotificationsBanners;
