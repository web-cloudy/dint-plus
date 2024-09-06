import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import StripeService from "services/StripeService";
import { RootState } from "store";

type stripeState = {
  loading: boolean;
  cardList: Array<any>;
  paymentServiceInstance: any;
  saveCardResponse: any;
  paymentResponse: any;
};

const initialState: stripeState = {
  loading: false,
  cardList: [],
  paymentServiceInstance: undefined,
  saveCardResponse: undefined,
  paymentResponse: undefined,
};

export const getServiceIntent = createAsyncThunk(
  "getServiceIntent",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response = await StripeService.getServiceIntent(reqBody);
      console.log("getServiceIntent ", response?.data);
      console.log("getServiceIntentreqBody ", reqBody);

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

export const saveCardRequest = createAsyncThunk(
  "saveCardRequest",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response = await StripeService.saveCardService(reqBody);
      console.log("saveCardRequest ", response);

      if (response?.status === 200 || response?.status === 201) {
        return response;
      } else {
        const firstKey = Object.keys(response?.response?.data?.error)[0];
        const firstValue = response?.response?.data?.error[firstKey];

        return rejectWithValue(firstKey + ": " + firstValue[0]);
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);

export const getSavedCardsListRequest = createAsyncThunk(
  "getSavedCardsListRequest",
  async (undefined, { rejectWithValue }) => {
    try {
      const response = await StripeService.getSavedCardsList();
      console.log("getSavedCardsListRequest ", response);
      if (response?.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const makePaymentFromCardList = createAsyncThunk(
  "makePaymentFromCardList",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await StripeService.makePaymentForSelectedCard(data);
      console.log("makePaymentFromCardList ", JSON.stringify(response));

      if (response?.status === 200 || response?.status === 201) {
        return response;
      } else {
        return rejectWithValue(response?.response?.data?.error);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const stripeSlice = createSlice({
  name: "stripe",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getServiceIntent.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getServiceIntent.fulfilled, (state, action) => {
      state.paymentServiceInstance = action.payload.data;
      state.loading = false;
    });
    builder.addCase(getServiceIntent.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(saveCardRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(saveCardRequest.fulfilled, (state, action) => {
      state.saveCardResponse = action.payload;
      state.loading = false;
    });
    builder.addCase(saveCardRequest.rejected, (state, action) => {
      state.saveCardResponse = { status: 400, message: action.payload };
      state.loading = false;
    });

    builder.addCase(getSavedCardsListRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getSavedCardsListRequest.fulfilled, (state, action) => {
      state.cardList = action.payload;
      state.loading = false;
    });
    builder.addCase(getSavedCardsListRequest.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(makePaymentFromCardList.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(makePaymentFromCardList.fulfilled, (state, action) => {
      state.paymentResponse = action.payload;
      state.loading = false;
    });
    builder.addCase(makePaymentFromCardList.rejected, (state, action) => {
      state.paymentResponse = { status: 400, message: action.payload };
      state.loading = false;
    });
  },
  reducers: {
    resetServiceInstance(state) {
      state.paymentServiceInstance = undefined;
    },
    setLoading(state, action) {
      state.loading = action?.payload;
    },
    resetSavedCardResp(state) {
      state.saveCardResponse = undefined;
    },
    resetCardList(state) {
      state.cardList = [];
    },
    resetPaymentResp(state) {
      state.paymentResponse = undefined;
    },
  },
});

const { reducer } = stripeSlice;
export default reducer;

interface stripeSelectorsType {
  loading: boolean;
  cardList: Array<any>;
  paymentServiceInstance?: any;
  saveCardResponse: any;
  paymentResponse?: any;
}

export const stripeSelectors = (): stripeSelectorsType => {
  const loading = useSelector(
    (state: RootState) => state.stripeService.loading
  );
  const cardList = useSelector(
    (state: RootState) => state.stripeService.cardList
  );
  const paymentServiceInstance = useSelector(
    (state: RootState) => state.stripeService.paymentServiceInstance
  );
  const saveCardResponse = useSelector(
    (state: RootState) => state.stripeService.saveCardResponse
  );
  const paymentResponse = useSelector(
    (state: RootState) => state.stripeService.paymentResponse
  );

  return {
    loading,
    cardList,
    paymentServiceInstance,
    saveCardResponse,
    paymentResponse,
  };
};

export const {
  resetServiceInstance,
  setLoading,
  resetSavedCardResp,
  resetCardList,
  resetPaymentResp,
} = stripeSlice.actions;
