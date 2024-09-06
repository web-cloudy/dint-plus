import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { useEffect, useState } from "react";
import {
  mediaDevices,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";
import { getDataFromAsync } from "utils/LocalStorage";

const iceServers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const URL = "wss://bedev.dint.com/ws/conversation/global/";

const useCalling = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [ws, setWs] = useState(null);

  async function getMediaStream(isVoiceOnly) {
    let mediaConstraints = {
      audio: true,
      video: !isVoiceOnly ? { frameRate: 30, facingMode: "user" } : false,
    };

    try {
      const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
      if (isVoiceOnly) {
        let videoTrack = mediaStream.getVideoTracks()[0];
        videoTrack.enabled = false;
      }
      return mediaStream;
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  }

  function createPeerConnection(onIceCandidate, onTrack) {
    let peerConnection = new RTCPeerConnection(iceServers);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        onIceCandidate(event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      onTrack(event.streams[0]);
    };

    return peerConnection;
  }

  async function startCall(isCaller, peerConnection, localStream) {
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
    console.log("object", isCaller, peerConnection, localStream);
    if (isCaller) {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        sendMessage({ type: "offer", sdp: offer });
      } catch (err) {
        console.error("Error creating offer.", err);
      }
    } else {
      peerConnection.ondatachannel = (event) => {
        peerConnection.dataChannel = event.channel;
      };
    }
  }

  function handleOffer(offer, peerConnection) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    peerConnection.createAnswer().then((answer) => {
      peerConnection.setLocalDescription(answer);
      sendMessage({ type: "send_offer", sdp: answer });
    });
  }

  function handleAnswer(answer, peerConnection) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  function handleCandidate(candidate, peerConnection) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  const initializeSocket = async () => {
    const token = await getDataFromAsync("token");
    const signalingServerUrl = `${URL}?token=${token}`;
    const webSocket = new WebSocket(signalingServerUrl);
    console.log("WXS WebSocket", webSocket);
    setWs(webSocket);
  };

  function sendMessage(message) {
    ws.send(JSON.stringify(message));
  }

  async function handleStartCall() {
    const isVoiceOnly = false;
    const stream = await getMediaStream(isVoiceOnly);
    console.log("Stream", stream);
    setLocalStream(stream);

    const peerConnection = createPeerConnection(
      (candidate) => {
        console.log("Candidate: ", candidate);
        sendMessage({ type: "candidate", candidate });
      },
      (stream) => {
        console.log("Stream: ", stream);
        setRemoteStream(stream);
      }
    );

    startCall(true, peerConnection, stream);
  }

  useEffect(() => {
    initializeSocket();
  }, []);

  return { Color, handleStartCall };
};

export default useCalling;
