import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChatListItem } from "types/chat";
import { IEvent } from "types/event";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Events: undefined;
  Ticket: {
    userId: number;
    eventId: number;
  };
  EventDetails: {
    event: IEvent;
  };
  Home: undefined;
  Chat: undefined;
  Services: undefined;
  ChatDetail: {
    chatDetail: ChatListItem;
  };
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
