import {
  getSocketConnection,
  setCurrentInstanceSocket,
  setSocketConnection,
} from "constants/chatSocket";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { useEffect, useState } from "react";
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
} from "react-native-webrtc";
import { getDataFromAsync } from "utils/LocalStorage";
import ReconnectingWebSocket from "react-native-reconnecting-websocket";
import { useRoute } from "@react-navigation/native";
import uuid from "react-native-uuid";
import { Platform } from "react-native";

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const URL = "wss://bedev.dint.com/ws/conversation/global/";

const useCalling = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  // const [pc, setPc] = useState(null);
  // const [localStream, setLocalStream] = useState(null);
  // const [remoteStream, setRemoteStream] = useState(null);
  // const peerConnection = new RTCPeerConnection(configuration);
  // const route = useRoute();
  // const { receiverId, receiverName, receiverImage, channelId } = route.params;

  // console.log("Channel Id", channelId);
  // const socket = getSocketConnection();

  // const [ws, setWs] = useState<WebSocket>();

  // useEffect(() => {
  //   console.log("hello world");
  //   const establishConnection = async () => {
  //     const token = await getDataFromAsync("token");

  //     peerConnection.addEventListener("icecandidate", (event) => {
  //       if (event.candidate) {
  //         ws.send(
  //           JSON.stringify({ type: "candidate", candidate: event.candidate })
  //         );
  //       }
  //     });

  //     peerConnection.onaddstream = (event) => {
  //       setRemoteStream(event.stream);
  //     };

  //     const connectWebSocket = async () => {
  //       const ws = new ReconnectingWebSocket(`${URL}?token=${token}`);
  //       ws.onopen = () => {
  //         setSocketConnection(ws);
  //         setCurrentInstanceSocket(0);
  //         console.log("WebSocket connection opened.");
  //       };

  //       ws.onclose = () => {
  //         console.log("WebSocket connection closed.");
  //         setSocketConnection(null);
  //         setCurrentInstanceSocket(-1);
  //       };

  //       ws.onerror = (error) => {
  //         console.error("WebSocket error: ", error);
  //         setSocketConnection(null);
  //         setCurrentInstanceSocket(-1);
  //       };

  //       ws.onmessage = async (message) => {
  //         console.log("Message received: ", JSON.stringify(message));
  //         const data = JSON.parse(message.data);
  //         console.log(Platform.OS, "Data received: ", data);
  //         if (data.type === "send_offer") {
  //           await answerCall(data.offer);
  //         } else if (data.type === "send_answer") {
  //           if (peerConnection) {
  //             await peerConnection.setRemoteDescription(
  //               new RTCSessionDescription(data.answer)
  //             );
  //           }
  //         } else if (data.type === "send_ice_candidate") {
  //           await handleCandidate(data.candidate);
  //         }
  //         setSocketConnection(ws);
  //         setCurrentInstanceSocket(0);
  //         setWs(ws);
  //       };
  //     };

  //     if (socket) {
  //       socket.onerror = (error) => {
  //         console.error("WebSocket error:", error);
  //       };

  //       socket.onmessage = async (message) => {
  //         const data = JSON.parse(message.data);
  //         console.log("data:", data);
  //         if (data.type === "receive_offer") {
  //           await answerCall(data.offer);
  //         } else if (data.type === "send_answer") {
  //           if (peerConnection) {
  //             await peerConnection.setRemoteDescription(
  //               new RTCSessionDescription(data.answer)
  //             );
  //           }
  //         } else if (data.type === "send_ice_candidate") {
  //           await handleCandidate(data.candidate);
  //         }
  //       };
  //     } else {
  //       connectWebSocket();
  //     }
  //   };

  //   establishConnection();

  //   return () => {
  //     peerConnection.close();
  //   };
  // }, []);

  // const startCall = async () => {
  //   try {
  //     const stream = await mediaDevices.getUserMedia({
  //       audio: true,
  //       video: false,
  //     });
  //     setLocalStream(stream);
  //     console.log("PEER stream", stream);
  //     if (peerConnection) {
  //       stream.getTracks().forEach((track) => {
  //         peerConnection.addTrack(track, stream);
  //       });

  //       const offer = await peerConnection.createOffer({});
  //       await peerConnection.setLocalDescription(offer);
  //       console.log("Ws", ws);
  //       if (ws) {
  //         const body = {
  //           type: "send_offer",
  //           offer: offer,
  //           channel_id: channelId,
  //           // secure_key: "80809809032423899809"
  //           secure_key: uuid.v4(),
  //         };
  //         // const body = {
  //         //   type: "text",
  //         //   message: "Hello world1234",
  //         //   content_type: "TEXT",
  //         //   channel_id: channelId,
  //         //   secure_key: uuid.v4(),
  //         // };
  //         console.log("Body: " + JSON.stringify(body));
  //         ws.send(
  //           // JSON.stringify({
  //           //   type: "send_offer",
  //           //   // offer,
  //           //   channel_id: channelId,
  //           // })
  //           JSON.stringify(body)
  //         );
  //       } else {
  //         console.error("WebSocket is not initialized");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error starting call:", error);
  //   }
  // };

  // const answerCall = async (offer: RTCSessionDescriptionInit) => {
  //   try {
  //     if (peerConnection) {
  //       await peerConnection.setRemoteDescription(
  //         new RTCSessionDescription(offer)
  //       );
  //       const stream = await mediaDevices.getUserMedia({
  //         audio: true,
  //         video: false,
  //       });
  //       setLocalStream(stream);
  //       stream.getTracks().forEach((track) => {
  //         peerConnection.addTrack(track, stream);
  //       });

  //       const answer = await peerConnection.createAnswer();
  //       await peerConnection.setLocalDescription(answer);
  //       if (ws) {
  //         ws.send(JSON.stringify({ type: "answer", answer }));
  //       } else {
  //         console.error("WebSocket is not initialized");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error answering call:", error);
  //   }
  // };

  // const handleCandidate = async (candidate: RTCIceCandidateInit) => {
  //   try {
  //     if (peerConnection) {
  //       await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  //     }
  //   } catch (error) {
  //     console.error("Error handling candidate:", error);
  //   }
  // };
  return { Color };
};

export default useCalling;
