import { useEffect } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import ChatService from "../services/ChatService";

const handleNetworkStatusChange = (state: NetInfoState) => {
  if (state.isConnected) {
    console.log("Network is online");
    ChatService.syncPendingMessages();
  } else {
    console.log("Network is offline");
  }
};


export const useNetworkStatus = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => handleNetworkStatusChange(state));

    return () => {
      unsubscribe();
    };
  }, []);
};
