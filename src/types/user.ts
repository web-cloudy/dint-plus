export interface UserData {
  data: User;
  code: number;
  message: string;
}

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_no?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  profile_image?: string;
  display_name?: string;
  custom_username?: string;
  is_private?: boolean;
  able_to_be_found?: boolean;
  token: string;
}
export type SignUpUser = {
  name: string;
  email: string;
  password: string;
  display_name: string;
  phone_no: string;
  fire_base_auth_key?: string
};
