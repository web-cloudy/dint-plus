import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import BankService from "services/BankServices";
import { RootState } from "store";

type stripeState = {
  loading: boolean;
  bankAccList: Array<any>;
  addBankAccountResp?: any;
  markAccAsDefaultResp?: any;
  deleteBankAccountResp?: any;
  userWalletBalance?: any;
};

const initialState: stripeState = {
  loading: false,
  bankAccList: [],
  addBankAccountResp: undefined,
  markAccAsDefaultResp: undefined,
  deleteBankAccountResp: undefined,
  userWalletBalance: undefined,
};

export const getbankAccListRequest = createAsyncThunk(
  "getbankAccListRequest",
  async (undefined, { rejectWithValue }) => {
    try {
      const response = await BankService.bankAccListService();
      console.log("getbankAccListRequest ", response);
      if (response?.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response?.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const addBankAccountRequest = createAsyncThunk(
  "addBankAccountRequest",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response = await BankService.addBankAccount(reqBody);
      console.log("addBankAccountRequest ", response);
      if (response?.status === 200 || response?.status === 201) {
        return response.data;
      } else {
        const firstKey = Object?.keys(response?.data?.data)[0] || "";
        const firstValue =
          response?.data?.data[firstKey] || "Something went wrong";
        return firstKey === "error"
          ? rejectWithValue(firstValue)
          : rejectWithValue(firstKey + ": " + firstValue[0]);
      }
    } catch (error: any) {
      const firstKey = Object?.keys(error?.response?.data)[0] || "";
      const firstValue =
        error?.response?.data[firstKey] || "Something went wrong";
      return firstKey === "error"
        ? rejectWithValue(firstValue)
        : rejectWithValue(firstKey + ": " + firstValue[0]);
    }
  }
);

export const markAccAsDefaultRequest = createAsyncThunk(
  "markAccAsDefaultRequest",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await BankService.markAccAsDefault(id);
      console.log("markAccAsDefaultRequest ", response);
      if (response?.status === 200) {
        return { id: id, data: response.data };
      } else {
        return rejectWithValue(response?.data?.data?.error || "");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.error || "");
    }
  }
);

export const editBankAccountRequest = createAsyncThunk(
  "editBankAccountRequest",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response = await BankService.editBankAccount(reqBody);
      console.log("editBankAccountRequest ", response);
      if (response?.status === 200 || response?.status === 201) {
        return response.data;
      } else {
        const firstKey = Object?.keys(response?.data?.data)[0] || "";
        const firstValue =
          response?.data?.data[firstKey] || "Something went wrong";
        return firstKey === "error"
          ? rejectWithValue(firstValue)
          : rejectWithValue(firstKey + ": " + firstValue[0]);
      }
    } catch (error: any) {
      console.log("dlakshdl ", error?.response);

      const firstKey = Object?.keys(error?.response?.data)[0] || "";
      const firstValue =
        error?.response?.data[firstKey] || "Something went wrong";
      return firstKey === "error"
        ? rejectWithValue(firstValue)
        : rejectWithValue(firstKey + ": " + firstValue[0]);
    }
  }
);

export const deleteBankAccListRequest = createAsyncThunk(
  "deleteBankAccListRequest",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await BankService.deleteBankAccount(id);
      console.log("deleteBankAccListRequest ", response);
      if (response?.status === 200 || response?.status === 204) {
        return { code: 200, message: "Deleted" };
      } else {
        return rejectWithValue({ code: 400, message: "Deleted" });
      }
    } catch (error: any) {
      return rejectWithValue({ code: 400, message: "Something went wrong" });
    }
  }
);

export const getUserWalletBalance = createAsyncThunk(
  "getUserWallet",
  async (undefined, { rejectWithValue }) => {
    try {
      const response = await BankService.getUserWallet();
      console.log("getbankAccListRequest ", response);
      if (response?.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response?.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const addWalletBalance = createAsyncThunk(
  "addWalletBalance",
  async (data, { rejectWithValue }) => {
    try {
      const response = await BankService.addBalance(data);
      console.log("getbankAccListRequest ", response);
      if (response?.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response?.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const sendAmountToAnotherUser = createAsyncThunk(
  "sendAmountToAnotherUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await BankService.sendAmountToAnotherUser(data);
      console.log("getbankAccListRequest ", response);
      if (response?.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response?.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const bankSlice = createSlice({
  name: "stripe",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getbankAccListRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getbankAccListRequest.fulfilled, (state, action) => {
      state.bankAccList = action.payload;
      state.loading = false;
    });
    builder.addCase(getbankAccListRequest.rejected, (state, action) => {
      state.loading = false;
      state.bankAccList = [];
    });

    //add bank account
    builder.addCase(addBankAccountRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(addBankAccountRequest.fulfilled, (state, action) => {
      state.addBankAccountResp = action.payload;
      state.loading = false;
    });
    builder.addCase(addBankAccountRequest.rejected, (state, action) => {
      state.loading = false;
      state.addBankAccountResp = { code: 400, message: action?.payload };
    });

    //MARK AD DEFAULT
    builder.addCase(markAccAsDefaultRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(markAccAsDefaultRequest.fulfilled, (state, action) => {
      state.markAccAsDefaultResp = {
        code: 200,
        message: action?.payload?.data?.message,
      };
      let data = state.bankAccList;
      data?.map((res: any) => {
        res.is_default = res.id === action?.payload?.id ? true : false;
      });
      state.bankAccList = data;
      state.loading = false;
    });
    builder.addCase(markAccAsDefaultRequest.rejected, (state, action) => {
      state.loading = false;
      state.markAccAsDefaultResp = { code: 400, message: action?.payload };
    });

    //edit bank account
    builder.addCase(editBankAccountRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(editBankAccountRequest.fulfilled, (state, action) => {
      state.addBankAccountResp = action.payload;
      state.loading = false;
    });
    builder.addCase(editBankAccountRequest.rejected, (state, action) => {
      state.loading = false;
      state.addBankAccountResp = { code: 400, message: action?.payload };
    });

    //delete bank account
    builder.addCase(deleteBankAccListRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(deleteBankAccListRequest.fulfilled, (state, action) => {
      state.deleteBankAccountResp = action.payload;
      state.loading = false;
    });
    builder.addCase(deleteBankAccListRequest.rejected, (state, action) => {
      state.loading = false;
      state.deleteBankAccountResp = action.payload;
    });

    //get wallet balance
    builder.addCase(getUserWalletBalance.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getUserWalletBalance.fulfilled, (state, action) => {
      state.userWalletBalance = action.payload?.data?.available_balance;
      state.loading = false;
    });
    builder.addCase(getUserWalletBalance.rejected, (state, action) => {
      state.loading = false;
    });
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action?.payload;
    },
    resetAddBankAccResp(state) {
      state.addBankAccountResp = undefined;
    },
    resetMarkAccAsDefaultResp(state) {
      state.markAccAsDefaultResp = undefined;
    },
    resetdeleteBankAccResp(state) {
      state.deleteBankAccountResp = undefined;
    },
  },
});

const { reducer } = bankSlice;
export default reducer;

interface bankSelectorsType {
  loading: boolean;
  bankAccList: Array<any>;
  addBankAccountResp?: any;
  markAccAsDefaultResp?: any;
  deleteBankAccountResp?: any;
  walletBalance?: any;
}

export const bankSelectors = (): bankSelectorsType => {
  const loading = useSelector((state: RootState) => state.bankService.loading);
  const bankAccList = useSelector(
    (state: RootState) => state.bankService.bankAccList
  );
  const addBankAccountResp = useSelector(
    (state: RootState) => state.bankService.addBankAccountResp
  );

  const markAccAsDefaultResp = useSelector(
    (state: RootState) => state.bankService.markAccAsDefaultResp
  );
  const deleteBankAccountResp = useSelector(
    (state: RootState) => state.bankService.deleteBankAccountResp
  );

  const walletBalance = useSelector(
    (state: RootState) => state.bankService.userWalletBalance
  );
  return {
    loading,
    bankAccList,
    addBankAccountResp,
    markAccAsDefaultResp,
    deleteBankAccountResp,
    walletBalance,
  };
};

export const {
  setLoading,
  resetAddBankAccResp,
  resetMarkAccAsDefaultResp,
  resetdeleteBankAccResp,
} = bankSlice.actions;
