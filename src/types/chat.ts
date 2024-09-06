export interface ChatListItem {
  email: string;
  id: number;
  latest_message: ChatMessage;
  name: string;
  profile_image: string;
  display_name?: string;
  picture?: string;
  channel_id?: string;
  last_message_time?: string;
  last_message_type?: string;
  last_message?: string;
  type?: string;
}

export interface ChatMessage {
  can_delete: boolean;
  chat_room: number;
  content: string;
  content_type: string;
  conversation_type: string;
  created_at: string;
  deleted_at: string | null;
  forward_details: ForwardDetails;
  id: number;
  is_active: boolean;
  is_deleted: boolean;
  is_disappearing: boolean;
  is_edited: boolean;
  is_pinned: boolean;
  is_seen: boolean;
  reciever: Receiver;
  is_starred: boolean;
  media_meta_data: any | null; // You might want to define a more specific type if you know the structure
  reply_of: any | null; // You might want to define a more specific type if you know the structure
  secure_key: string;
  seen_by: SeenBy[];
  sender: Sender;
  updated_at: string;
}

export interface Receiver {
  custom_username: string;
  display_name: string;
  email: string;
  first_name: string;
  id: number;
  is_active: boolean;
  is_deleted: boolean;
  is_private: boolean;
  last_name: string;
  phone_no: string;
  profile_image: string;
}

export interface SearchUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_no: string;
  is_active: boolean;
  is_deleted: boolean;
  profile_image: string;
  display_name: string;
  custom_username: string;
  is_private: boolean;
  isSelected?: boolean;
}


interface ForwardDetails {
  forwarded_count: number;
  original_message_secure_key: string;
}

interface Sender {
  display_name: string;
  id: number;
}

interface SeenBy {
  // You might want to define the structure of this object
  // based on what's inside [Object] in your actual data
}

