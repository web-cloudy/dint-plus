// import PushNotification from "react-native-push-notification";
// import messaging from "@react-native-firebase/messaging";
// import { PermissionsAndroid, Platform } from "react-native";
// import { storeDataInAsync } from "utils/LocalStorage";
// import { handleIncomingCall, sdpOffer } from "store/slices/chat";
// import store from "store";

// export async function handleNotificationOpenedApp(remoteMessage: any) {
//   console.log("handleNotificationOpenedApp ", remoteMessage);
// }

// export function createNotification(remoteMessage: any) {
//   console.log("creating notification true", remoteMessage, Platform.OS);
//   // console.log('count ', PushNotification?.getApplicationIconBadgeNumber() || 0)
//   if (!("sdp_offer" in remoteMessage?.data)) {
//     PushNotification.localNotification({
//       channelId: "Dint+",
//       message: remoteMessage?.data?.body || "",
//       title: remoteMessage?.data?.title || "",
//       // userInfo: remoteMessage?.data || {
//       //   name: "test",
//       // },
//       // subText: remoteMessage?.data?.contents || "",
//       smallIcon: "ic_notification",
//       largeIcon: "ic_launcher",
//       color: "#FFDD55",
//     });
//   }
// }

// export function getNotificationsBanner() {
//   messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
//     console.log("remoteMessage notifi ", remoteMessage);
//     //call count here
//     if ("sdp_offer" in remoteMessage?.data && Platform.OS == "android") {
//       console.log("------called------");
//       const sdp = await store.dispatch(
//         sdpOffer(remoteMessage?.data?.sdp_offer)
//       );
//       if (sdp?.payload) {
//         console.log("🚀 ~ sdp?.sdp_offer:", sdp?.payload);

//         store.dispatch(
//           handleIncomingCall({
//             record_id: sdp?.payload?.conversation,
//             sender: sdp?.payload?.channel_id,
//             offer: {
//               sdp: sdp?.payload?.sdp,
//               type: sdp?.payload?.offer_type,
//             },
//             sender_name: sdp?.payload?.sender_name,
//             caller_id: sdp?.payload?.caller_id,
//             isVoiceOnly: sdp?.payload?.media_type == "audio" ? true : false,
//             background: false,
//           })
//         );
//       }
//     }
//   });
//   PushNotification.configure({
//     onRegister() {
//       let channel_id = "Dint+";
//       PushNotification.channelExists(channel_id, function (exists) {
//         if (!exists) {
//           PushNotification.createChannel(
//             {
//               channelId: channel_id,
//               channelName: "Dint",
//               channelDescription: "Notification from Dint",
//               playSound: true,
//             },
//             (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
//           );
//         }
//       });
//     },
//     onAction(notification) {
//       console.log("notification** onAction , ", JSON.stringify(notification));
//     },

//     onRemoteFetch(notification) {
//       console.log(
//         "notification** onRemoteFetch , ",
//         JSON.stringify(notification)
//       );
//     },

//     onNotification(notification) {
//       console.log("on click notification , ", JSON.stringify(notification));
//     },
//     permissions: {
//       alert: true,
//       badge: true,
//       sound: true,
//     },
//     popInitialNotification: true,
//     requestPermissions: true,
//   });
// }

// export async function checkNotificationPermissionIniOS() {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//   if (enabled) {
//     getToken();
//     console.log("Authorization status:", authStatus);
//   }
// }

// export const checkNotificationPermissionInAndroid = async () => {
//   if (Platform.OS === "android") {
//     try {
//       await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//       );
//     } catch (error) {}
//   }
// };

// export async function getToken() {
//   const fcmToken = await messaging().getToken();
//   if (fcmToken) {
//     storeDataInAsync("fcmToken", fcmToken)
//       .then((res) => {
//         console.log("Saved");
//       })
//       .catch((err) => {
//         console.log("Not Saved", err);
//       });
//     console.log("Your Firebase Token is: ", fcmToken);
//   } else {
//     console.log('Failed", "No token received');
//   }
// }
