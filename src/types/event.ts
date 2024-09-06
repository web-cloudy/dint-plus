import { SetProfilingLevelOptions } from "mongodb";

export interface IEvent {
  id?: number | string;
  eventFequency: string;
  balanceRequired: string;
  eventDate: string;
  eventDescription: string;
  eventEndTime: string;
  eventId: number;
  eventName: string;
  eventPhoto: string;
  eventstartTime: string;
  eventDateCreated: string;
  network?: number;
  tokenDecimal?: number;
  tokenIcon?: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenType?: string;
  tokenAddress?: string;
  venueName?: string;
  valueName?: string;
  balanceFrequency?: string | number;
  user?: any;
  venue: number;
  updated_at?: string;
  created_at?: string;
  location?: AddressInfoType;
  is_public?: boolean;
  price?: string;
}

export interface ICreateEvent {
  pic?: string;
  eventName?: string;
  eventDesc?: string;
  startingDate?: string;
  startingTime?: string;
  endingTime?: string;
  eventEndTime?: string;
  location?: AddressInfoType;
  type?: string;
  maxTicketAvail?: string;
  formattedAddress?: string;
  frequency?: string;
  price?: string;
  showLocationToOthers?: boolean;
  eventType?: string;
  availableTickets?: string;
  priceType?: string;
}

export const EventEmptyData = {
  pic: "",
  eventName: "",
  eventDesc: "",
  startingDate: "",
  startingTime: "",
  endingTime: "",
  eventEndTime: "",
  location: undefined,
  type: "",
  maxTicketAvail: "",
  formattedAddress: "",
  frequency: "Once",
  price: "0",
  showLocationToOthers: false,
  eventType: "Live Event",
  availableTickets: "",
  priceType: "Paid",
};

export interface AddressInfoType {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: string;
  longitude: string;
  pincode: string;
  formattedAddress: string;
  countryFullName?: string;
}

export const AddressInfo = {
  street: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  latitude: "",
  longitude: "",
  pincode: "",
  formattedAddress: "",
  tag: "",
  special_note: "",
  default: "",
};

export type AddressType = {
  tag: string;
  special_note: string;
  default: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: string;
  longitude: string;
  pincode: string;
  formattedAddress: string;
  id?: string;
};

export type IEventFilterType = {
  price: string;
  user_id: string;
  event_type: string;
  limit?: string;
  offset?: string;
  event_date: string;
  upcoming_events: boolean | null;
  search: string;
  latitude: string;
  longitude: string;
  max_distance_km: string;
};
