import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Alert } from "react-native/types";
import { useSelector } from "react-redux";
import ProfileService from "services/ProfileService";
import { RootState } from "store";
import { User } from "../../types/user";

type ChatState = {
  loading: boolean;
  mediaKey: string;
  profileData?: User | undefined;
  numberUpdateStatus: string;
  numberUpdateError?: string | unknown;
  emailUpdateStatus: string;
  emailUpdateError?: string | unknown;
  otpSendError?: string | unknown;
  newUserOtpResp?: object | undefined;
  verifyOtpResp?: object | undefined;
  verificationCodeResp?: any | undefined;
  setVerificationOTPResp?: any | undefined;
  verifiedWithOtp?: boolean | undefined;
};

const initialState: ChatState = {
  loading: false,
  mediaKey: "",
  profileData: undefined,
  numberUpdateStatus: "",
  numberUpdateError: "",
  emailUpdateStatus: "",
  emailUpdateError: "",
  otpSendError: "",
  newUserOtpResp: undefined,
  verifyOtpResp: undefined,
  verificationCodeResp: undefined,
  setVerificationOTPResp: undefined,
  verifiedWithOtp: undefined,
};

export const uploadMediaAPI = createAsyncThunk(
  "uploadMedia",
  async (reqBody, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await ProfileService.uploadMediaService(reqBody);

      if (response?.data?.code === 200) {
        const data = response.data.data;
        if (data.length > 0) {
          const obj = data[0];
          return obj?.media_file_url;
        }
        return rejectWithValue(response.data);
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getProfileData = createAsyncThunk(
  "getProfileData",
  async (reqBody, { rejectWithValue }) => {
    try {
      const response = await ProfileService.getProfileService();
      if (response?.data?.code === 200) {
        const data = response.data.data;
        return data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const updateProfileAPI = createAsyncThunk(
  "updateProfile",
  async (reqBody, { rejectWithValue }) => {
    try {
      const response = await ProfileService.updateProfileService(reqBody);
      console.log("updateProfileAPI", response.data);

      if (response?.data?.code === 200) {
        return response.data.data;
      } else {
        return rejectWithValue(response?.data?.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const sendOtpToOldUserAPI = createAsyncThunk(
  "sendOtpToOldUser",
  async (reqBody, { rejectWithValue }) => {
    try {
      const response: any = await ProfileService.sendOtpToOldUserService(
        reqBody
      );

      if (response?.data?.code === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const sendOtpToNewUserAPI = createAsyncThunk(
  "sendOtpToNewUser",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response: any = await ProfileService.sendOtpToNewUserService(
        reqBody
      );
      console.log("sendOtpToNewUser ", JSON.stringify(response));

      if (response?.data?.code === 200) {
        const data = response.data;
        return data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const verifyOtpAPI = createAsyncThunk(
  "verifyOtpAPI",
  async (reqBody, { rejectWithValue }) => {
    try {
      const response: any = await ProfileService.verifyOtpService(reqBody);
      console.log("verifyOtpAPI LOG, ", JSON.stringify(response));

      if (response?.data?.code === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const changeNumberAPI = createAsyncThunk(
  "changeNumber",
  async (reqBody, { rejectWithValue }) => {
    try {
      // console.log("changeNumberBody", reqBody);
      const response: any = await ProfileService.changeNumberService(reqBody);
      // console.log("changeNumber", response);

      if (response?.data?.code === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const changeEmailAPI = createAsyncThunk(
  "changeEmail",
  async (reqBody, { rejectWithValue }) => {
    try {
      console.log("changeEmailBody", reqBody);
      const response: any = await ProfileService.changeEmailService(reqBody);
      console.log("changeEmail", response);

      if (response?.data?.code === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getVerificationStatusRequest = createAsyncThunk(
  "getVerificationStatusRequest",
  async (undefined, { rejectWithValue }) => {
    try {
      const response: any = await ProfileService.getVerificationStatus();
      if (response?.data?.code === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const updateVerificationOtpRequest = createAsyncThunk(
  "updateVerificationOtpRequest",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response: any = await ProfileService.updateVerificationOtp(reqBody);
      if (response?.data?.code === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action?.payload;
    },
    resetProfileData(state) {
      state.mediaKey = "";
    },
    resetChangeNumber: (state) => {
      state.numberUpdateStatus = "";
      state.numberUpdateError = "";
    },
    resetChangeEmail: (state) => {
      state.emailUpdateStatus = "";
      state.emailUpdateError = "";
    },
    resetOtpData: (state) => {
      state.otpSendError = "";
    },
    resetSentOtpToNewUser: (state) => {
      state.newUserOtpResp = undefined;
    },
    resetVerifyOtpResp: (state) => {
      state.verifyOtpResp = undefined;
      state.otpSendError = "";
    },
    resetVerificationOtpResp: (state) => {
      state.setVerificationOTPResp = undefined;
    },
    updateVerifiedWithOtp: (state, action) => {
      state.verifiedWithOtp = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadMediaAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(uploadMediaAPI.fulfilled, (state, action) => {
      state.mediaKey = action.payload;
      state.loading = false;
    });
    builder.addCase(uploadMediaAPI.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(updateProfileAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(updateProfileAPI.fulfilled, (state, action) => {
      state.profileData = action.payload;
      state.loading = false;
    });
    builder.addCase(updateProfileAPI.rejected, (state, action) => {
      state.emailUpdateError = action.payload;
      state.loading = false;
    });

    builder.addCase(getProfileData.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getProfileData.fulfilled, (state, action) => {
      state.profileData = action.payload;
      state.loading = false;
    });
    builder.addCase(getProfileData.rejected, (state, action) => {
      state.loading = false;
    });

    // Send OTP To Old user API calling
    builder.addCase(sendOtpToOldUserAPI.rejected, (state, action) => {
      state.loading = false;
      state.otpSendError = action.payload;
    });

    // Send OTP To New user API calling
    builder.addCase(sendOtpToNewUserAPI.rejected, (state, action) => {
      state.loading = false;
      state.otpSendError = action.payload;
      state.newUserOtpResp = { code: 400, message: action?.payload };
    });

    builder.addCase(sendOtpToNewUserAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(sendOtpToNewUserAPI.fulfilled, (state, action) => {
      state.newUserOtpResp = action.payload;
      state.loading = false;
    });

    // Verify OTP API calling
    builder.addCase(verifyOtpAPI.rejected, (state, action) => {
      state.loading = false;
      state.otpSendError = action.payload?.message || "";
    });

    builder.addCase(verifyOtpAPI.fulfilled, (state, action) => {
      state.verifyOtpResp = action.payload;
      state.numberUpdateError = "";
      state.loading = false;
    });

    // Change mobile number API calling statuses
    builder.addCase(changeNumberAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(changeNumberAPI.fulfilled, (state, action) => {
      state.numberUpdateStatus = action.payload?.message;
      state.numberUpdateError = "";
      state.loading = false;
    });
    builder.addCase(changeNumberAPI.rejected, (state, action) => {
      state.loading = false;
      state.numberUpdateStatus = "";
      state.numberUpdateError = action.payload;
    });

    // Change email API calling statuses
    builder.addCase(changeEmailAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(changeEmailAPI.fulfilled, (state, action) => {
      state.emailUpdateStatus = action.payload?.message;
      state.emailUpdateError = "";
      state.loading = false;
    });
    builder.addCase(changeEmailAPI.rejected, (state, action) => {
      state.loading = false;
      state.emailUpdateStatus = "";
      state.emailUpdateError = action.payload;
    });

    // get verificaiton otp data
    builder.addCase(getVerificationStatusRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getVerificationStatusRequest.fulfilled, (state, action) => {
      state.verificationCodeResp = action.payload;
      state.loading = false;
    });
    builder.addCase(getVerificationStatusRequest.rejected, (state, action) => {
      state.loading = false;
      state.verificationCodeResp = action.payload;
    });

    // update verificaiton otp data
    builder.addCase(updateVerificationOtpRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(updateVerificationOtpRequest.fulfilled, (state, action) => {
      state.setVerificationOTPResp = action.payload;
      state.loading = false;
    });
    builder.addCase(updateVerificationOtpRequest.rejected, (state, action) => {
      state.loading = false;
      state.setVerificationOTPResp = action.payload;
    });
  },
});

const { reducer } = profileSlice;
export default reducer;

interface ProfileSelectorsType {
  loading: boolean;
  mediaKey: string;
  profileData?: User | undefined;
  numberUpdateStatus: string;
  numberUpdateError?: string | unknown;
  emailUpdateStatus: string;
  emailUpdateError?: string | unknown;
  otpSendError?: string | unknown;
  verifyOtpResp?: object | undefined;
  newUserOtpResp?: object | undefined;
  verificationCodeResp?: any | undefined;
  setVerificationOTPResp?: any | undefined;
  verifiedWithOtp?: boolean | undefined;
}

export const ProfileSelectors = (): ProfileSelectorsType => {
  const loading = useSelector((state: RootState) => state.profile.loading);
  const mediaKey = useSelector((state: RootState) => state.profile.mediaKey);
  const profileData = useSelector(
    (state: RootState) => state.profile.profileData
  );
  const otpSendError = useSelector(
    (state: RootState) => state.profile.otpSendError
  );
  const numberUpdateStatus = useSelector(
    (state: RootState) => state.profile.numberUpdateStatus
  );
  const numberUpdateError = useSelector(
    (state: RootState) => state.profile.numberUpdateError
  );
  const emailUpdateStatus = useSelector(
    (state: RootState) => state.profile.emailUpdateStatus
  );
  const emailUpdateError = useSelector(
    (state: RootState) => state.profile.emailUpdateError
  );

  const newUserOtpResp = useSelector(
    (state: RootState) => state.profile.newUserOtpResp
  );

  const verifyOtpResp = useSelector(
    (state: RootState) => state.profile.verifyOtpResp
  );

  const setVerificationOTPResp = useSelector(
    (state: RootState) => state.profile.setVerificationOTPResp
  );

  const verificationCodeResp = useSelector(
    (state: RootState) => state.profile.verificationCodeResp
  );
  const verifiedWithOtp = useSelector(
    (state: RootState) => state.profile.verifiedWithOtp
  );
  return {
    loading,
    mediaKey,
    profileData,
    otpSendError,
    numberUpdateStatus,
    numberUpdateError,
    emailUpdateStatus,
    emailUpdateError,
    newUserOtpResp,
    verifyOtpResp,
    verificationCodeResp,
    setVerificationOTPResp,
    verifiedWithOtp,
  };
};

export const {
  resetProfileData,
  resetChangeNumber,
  resetChangeEmail,
  resetOtpData,
  resetSentOtpToNewUser,
  resetVerifyOtpResp,
  resetVerificationOtpResp,
  updateVerifiedWithOtp,
  setLoading,
} = profileSlice.actions;
