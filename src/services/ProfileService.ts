import http from "utils/http-common";

const uploadMediaService = (reqBody: any) => {
  return http({
    url: `api/upload/media/`,
    type: "POST",
    data: reqBody,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getProfileService = () => {
  return http({ url: `api/user/get-profile-by-token/`, type: "GET" });
};

const updateProfileService = (reqBody: object) => {
  return http({
    url: `api/user/update-profile-by-token/`,
    type: "PUT",
    data: reqBody,
  });
};

const changeNumberService = (reqBody: any) => {
  return http({
    url: "api/auth/change-user-phone-no/",
    type: "PATCH",
    data: reqBody,
  });
};

const changeEmailService = (reqBody: any) => {
  return http({
    url: "api/auth/change-user-email/",
    type: "PATCH",
    data: reqBody,
  });
};

const sendOtpToOldUserService = (reqBody: any) => {
  return http({
    url: "api/user/send-otp-to-old-user/",
    type: "POST",
    data: reqBody,
  });
};

const sendOtpToNewUserService = (reqBody: any) => {
  return http({
    url: "api/user/send-otp-to-new-user/",
    type: "POST",
    data: reqBody,
  });
};

const verifyOtpService = (reqBody: any) => {
  return http({
    url: "api/user/verify-otp/",
    type: "POST",
    data: reqBody,
  });
};

const getVerificationStatus = () => {
  return http({
    url: "api/auth/verfication-status/",
    type: "GET",
  });
};

const updateVerificationOtp = (reqBody: any) => {
  return http({
    url: "api/auth/verfication-status/",
    type: "POST",
    data: reqBody,
  });
};

const ProfileService = {
  uploadMediaService,
  getProfileService,
  updateProfileService,
  changeNumberService,
  changeEmailService,
  sendOtpToOldUserService,
  sendOtpToNewUserService,
  verifyOtpService,
  getVerificationStatus,
  updateVerificationOtp,
};

export default ProfileService;
