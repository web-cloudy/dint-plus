import {
  setCurrentInstanceSocket,
  setSocketConnection,
} from "constants/chatSocket";
import { useEffect } from "react";
import { getDataFromAsync } from "utils/LocalStorage";
import useAppDispatch from "./useAppDispatch";
import ReconnectingWebSocket from 'react-native-reconnecting-websocket'

const SocketHandler = () => {
  let currnetInstaceId = Math.floor(Math.random() * 100);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkLoginSession = async () => {
      const token = await getDataFromAsync("token");
      const userId = await getDataFromAsync("userId");
      console.log("token", token, "userId", userId);

      setTimeout(() => {
        if (token && userId) {
          connect(token);
        }
      }, 2000);
    };
    checkLoginSession();
  }, []);

  // useEffect(() => {
  //   if (getCurrentInstanceSocket() === 0 && getSocketConnection()) {
  //     //Socket: ReceiveTypingMessage Method
  //     getSocketConnection().onclose = function (e) {
  //       console.log("Socket is closed", e);
  //       setTimeout(function () {
  //         connect();
  //       }, 1000);
  //     };

  //     getSocketConnection().onerror = function (err) {
  //       console.error(
  //         "Socket encountered error: ",
  //         err.message,
  //         "Closing socket"
  //       );
  //       getDataFromAsync("token").then((res) => {
  //         if (res) {
  //           connect(res);
  //         }
  //       });
  //     };

  //     //Socket: ReceiveDeleteMessage Method
  //     getSocketConnection().onopen = function () {
  //       console.log("opened:");
  //     };

  //     //Socket: UserDisconnected Method
  //     getSocketConnection().onmessage = function (e) {
  //       console.log("Message:", e.data);
  //       // a message was received
  //       const data = e.data;
  //       const message = JSON.parse(data);
  //       if (message && message?.type != "online") {
  //         dispatch(updateMessaegList({ message }));
  //       } else if (message && message?.type != "offline") {
  //         getDataFromAsync("token").then((res) => {
  //           if (res) {
  //             connect(res);
  //           }
  //         });
  //       }
  //     };
  //     setCurrentInstanceSocket(currnetInstaceId);
  //   }
  // });

  // function connect(token: string) {
  //   // Start the connection
  //   const URL = "wss://bedev.dint.com/ws/conversation/global/";
  //   const ws = new ReconnectingWebSocket(URL + "?token=" + token);
  //   ws.onopen = function () {
  //     console.log("opened:");
  //     setSocketConnection(ws);
  //     setCurrentInstanceSocket(0);
  //   };
  // }
  return null;
};

export default SocketHandler;
