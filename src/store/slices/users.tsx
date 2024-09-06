import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import * as RootNavigation from "../../navigator/RootNavigation";

import AuthService from "services/AuthService";
import { IWallet } from "types/wallet";
import { RootState } from "store";

type UserState = {
  loading: boolean;
  loginError: { status: number; message: string } | undefined;
  signUpError: { status: number; message: string } | undefined;
  userData: object | undefined;
  wallet: IWallet;
};

const initialState: UserState = {
  loading: false,
  loginError: undefined,
  signUpError: undefined,
  userData: undefined,
  wallet: {
    data: {
      wallet_address: "",
    },
    code: 0,
    message: "",
  },
};

export const loginUserAPI = createAsyncThunk(
  "loginUser",
  async (
    reqBody: { phone_no: string; fire_base_auth_key: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("loginUser reqBody", reqBody);

      const response = await AuthService.loginUserService(reqBody);
      console.log("loginUser", response);

      if (response?.data?.code === 200) {
        return response.data;
      } else {
        return rejectWithValue({
          status: response?.data?.code,
          message: response?.data?.message,
        });
      }
    } catch (error: any) {
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.message || "An unknown error occurred",
      });
    }
  }
);

export const signUpUserAPI = createAsyncThunk(
  "signUpUser",
  async (
    reqBody: {
      display_name: string;
      phone_no: string;
      profile_image: string;
      fire_base_auth_key: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthService.signUpUserService(reqBody);
      console.log("signUpUser", JSON.stringify(response));

      if (response?.data?.code === 201) {
        // RootNavigation.navigate("Login");
        return response.data;
      } else {
        return rejectWithValue({
          status: response?.data?.code,
          message: response?.data?.message,
        });
      }
    } catch (error: any) {
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.message || "An unknown error occurred",
      });
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetLoginData(state) {
      state.loginError = undefined;
      state.userData = undefined;
    },
    resetSignUpData(state) {
      state.signUpError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    });
    builder.addCase(loginUserAPI.rejected, (state, action) => {
      state.loginError = action.payload as { status: number; message: string };
      state.loading = false;
    });
    builder.addCase(signUpUserAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signUpUserAPI.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
    });
    builder.addCase(signUpUserAPI.rejected, (state, action) => {
      state.signUpError = action.payload as { status: number; message: string };
      state.loading = false;
    });
  },
});

const { reducer } = userSlice;
export default reducer;

interface UserSelectorsType {
  loading: boolean;
  loginError: { status: number; message: string } | undefined;
  signUpError: { status: number; message: string } | undefined;
  userData: object | undefined;
  wallet: IWallet;
}

export const UserSelectors = (): UserSelectorsType => {
  const loading = useSelector((state: RootState) => state.user.loading);
  const loginError = useSelector(
    (state: RootState) => state.user.loginError
  );
  const signUpError = useSelector(
    (state: RootState) => state.user.signUpError
  );
  const userData = useSelector((state: RootState) => state.user.userData);
  const wallet = useSelector((state: RootState) => state.user.wallet);

  return {
    loading,
    loginError,
    signUpError,
    userData,
    wallet,
  };
};

export const { resetLoginData, resetSignUpData } = userSlice.actions;
