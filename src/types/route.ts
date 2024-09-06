import { SignUpUser } from "./user";

export interface OtpScreenParams {
  isEmail?: boolean;
  isMobile?: boolean;
  isSignUp?: boolean;
  isDeleteAccount?: boolean;
  newMobileNumber?: string;
  oldMobileNumber?: string;
  mobileNumber?: string;
  userDetails?: SignUpUser;
  verificationOtp?: string;
  isLogin?: boolean
}
