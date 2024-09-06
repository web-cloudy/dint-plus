import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import EventService from "services/EventService";
import { RootState } from "store";
import { IEvent } from "types/event";

type EventState = {
  loading: boolean;
  eventList: Array<IEvent>;
  createEventResponse: any;
  ticketIdResponse: any;
  ticketSoldApiResp: any;
  eventTicketInfo: any;
  generatedQRcode?: any;
  earningDetailData?: any;
  earningList: any;
  ticketsList?: any;
};

const initialState: EventState = {
  loading: false,
  eventList: [],
  createEventResponse: undefined,
  ticketIdResponse: undefined,
  ticketSoldApiResp: undefined,
  eventTicketInfo: undefined,
  generatedQRcode: undefined,
  earningDetailData: undefined,
  earningList: undefined,
  ticketsList: undefined,
};

export const getAllEventAPI = createAsyncThunk(
  "getAllEvent",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response = await EventService.getAllEventService(reqBody);
      if (response?.data?.code === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log("getAllEvent", JSON.stringify(error));

      return rejectWithValue(error);
    }
  }
);

export const createEventAPI = createAsyncThunk(
  "createEventAPI",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response = await EventService.createEventService(reqBody);
      console.log("createEventAPI ", JSON.stringify(response));

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getTickeIdRequest = createAsyncThunk(
  "getTicketIdByEventId",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response = await EventService.getTicketIdByEventId(reqBody);
      console.log("getTicketIdByEventId ", JSON.stringify(response));

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const ticketSoldRequestApi = createAsyncThunk(
  "ticketSoldRequestApi",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response = await EventService.ticketSoldRequest(reqBody);
      console.log("ticketSoldRequestApi ", JSON.stringify(response));

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getEarningDetails = createAsyncThunk(
  "getEarningDetails",
  async (reqBody: string, { rejectWithValue }) => {
    try {
      const response = await EventService.earningDetails(reqBody);
      console.log("getEarningDetails ", JSON.stringify(response));

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const eventTicketInfoRequest = createAsyncThunk(
  "eventTicketInfoRequest",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response = await EventService.eventTicketInfo(reqBody);
      console.log("eventTicketInfoRequest ", JSON.stringify(response));

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const generateQRcodeRequest = createAsyncThunk(
  "generateQRcodeRequest",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response = await EventService.generateQRcode(reqBody);
      console.log("generateQRcodeRequest ", JSON.stringify(response));

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getEarningsRequest = createAsyncThunk(
  "getEarningsRequest",
  async (undefined, { rejectWithValue }) => {
    try {
      const response = await EventService.earningList();
      console.log("getEarningsRequest ", JSON.stringify(response));

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data?.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getTicketsRequest = createAsyncThunk(
  "getTicketsRequest",
  async (undefined, { rejectWithValue }) => {
    try {
      const response = await EventService.ticketsList();
      console.log("getTicketsRequest ", JSON.stringify(response));
      if (response?.status === 200 || response?.status === 201) {
        return response?.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const updateEventAPI = createAsyncThunk(
  "updateEventAPI",
  async (reqBody: any, { rejectWithValue }) => {
    try {
      const response = await EventService.updateEventService(reqBody);
      console.log("updateEventAPI ", JSON.stringify(response));

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error: any) {
      console.log("updateEventAPI err ", JSON.stringify(error?.response));

      return rejectWithValue(error);
    }
  }
);

const eventSlice = createSlice({
  name: "event",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getAllEventAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getAllEventAPI.fulfilled, (state, action) => {
      state.eventList = action.payload.data;
      state.loading = false;
    });
    builder.addCase(getAllEventAPI.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(createEventAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(createEventAPI.fulfilled, (state, action) => {
      state.createEventResponse = action.payload;
      state.loading = false;
    });
    builder.addCase(createEventAPI.rejected, (state, action) => {
      state.createEventResponse = action.payload;
      state.loading = false;
    });

    builder.addCase(getTickeIdRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getTickeIdRequest.fulfilled, (state, action) => {
      state.ticketIdResponse = action.payload;
      state.loading = false;
    });
    builder.addCase(getTickeIdRequest.rejected, (state, action) => {
      state.ticketIdResponse = action.payload;
      state.loading = false;
    });

    builder.addCase(ticketSoldRequestApi.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(ticketSoldRequestApi.fulfilled, (state, action) => {
      state.ticketSoldApiResp = action.payload;
      state.loading = false;
    });
    builder.addCase(ticketSoldRequestApi.rejected, (state, action) => {
      state.ticketSoldApiResp = action.payload;
      state.loading = false;
    });

    builder.addCase(eventTicketInfoRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(eventTicketInfoRequest.fulfilled, (state, action) => {
      state.eventTicketInfo = action.payload;
      state.loading = false;
    });
    builder.addCase(eventTicketInfoRequest.rejected, (state, action) => {
      state.eventTicketInfo = action.payload;
      state.loading = false;
    });

    builder.addCase(generateQRcodeRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(generateQRcodeRequest.fulfilled, (state, action) => {
      state.generatedQRcode = action.payload;
      state.loading = false;
    });
    builder.addCase(generateQRcodeRequest.rejected, (state, action) => {
      state.generatedQRcode = action.payload;
      state.loading = false;
    });

    builder.addCase(getEarningDetails.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getEarningDetails.fulfilled, (state, action) => {
      state.earningDetailData = action.payload;
      state.loading = false;
    });
    builder.addCase(getEarningDetails.rejected, (state, action) => {
      state.earningDetailData = {
        code: 400,
        message: "Something is not right",
      };
      state.loading = false;
    });

    builder.addCase(getEarningsRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getEarningsRequest.fulfilled, (state, action) => {
      state.earningList = action.payload;
      state.loading = false;
    });
    builder.addCase(getEarningsRequest.rejected, (state, action) => {
      state.earningList = {
        code: 400,
        message: "Something is not right",
      };
      state.loading = false;
    });

    builder.addCase(getTicketsRequest.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(getTicketsRequest.fulfilled, (state, action) => {
      state.ticketsList = action.payload;
      state.loading = false;
    });
    builder.addCase(getTicketsRequest.rejected, (state, action) => {
      state.ticketsList = [];
      state.loading = false;
    });

    builder.addCase(updateEventAPI.pending, (state, { meta }) => {
      state.loading = true;
    });
    builder.addCase(updateEventAPI.fulfilled, (state, action) => {
      state.createEventResponse = action.payload;
      state.loading = false;
    });
    builder.addCase(updateEventAPI.rejected, (state, action) => {
      state.createEventResponse = action.payload;
      state.loading = false;
    });
  },
  reducers: {
    resetCreateEventData(state) {
      state.createEventResponse = undefined;
    },
    resetTicketIdData(state) {
      state.ticketIdResponse = undefined;
    },
    resetTicketSoldData(state) {
      state.ticketSoldApiResp = undefined;
    },
    resetEventTicketInfo(state) {
      state.eventTicketInfo = undefined;
    },
    resetGeneratedQRcodeData(state) {
      state.generatedQRcode = undefined;
    },
    resetEarningDetailData(state) {
      state.earningDetailData = undefined;
    },
  },
});

const { reducer } = eventSlice;
export default reducer;

interface EventSelectorsType {
  loading: boolean;
  eventList: Array<any>;
  createEventResponse?: any;
  ticketIdResponse: any;
  ticketSoldApiResp: any;
  eventTicketInfo: any;
  generatedQRcode: any;
  earningDetailData?: any;
  earningList?: any;
  ticketsList?: any;
}

export const EventSelectors = (): EventSelectorsType => {
  const loading = useSelector((state: RootState) => state.event.loading);
  const eventList = useSelector((state: RootState) => state.event.eventList);
  const createEventResponse = useSelector(
    (state: RootState) => state.event.createEventResponse
  );

  const ticketIdResponse = useSelector(
    (state: RootState) => state.event.ticketIdResponse
  );
  const ticketSoldApiResp = useSelector(
    (state: RootState) => state.event.ticketSoldApiResp
  );

  const eventTicketInfo = useSelector(
    (state: RootState) => state.event.eventTicketInfo
  );
  const generatedQRcode = useSelector(
    (state: RootState) => state.event.generatedQRcode
  );

  const earningDetailData = useSelector(
    (state: RootState) => state.event.earningDetailData
  );

  const earningList = useSelector(
    (state: RootState) => state.event.earningList
  );

  const ticketsList = useSelector(
    (state: RootState) => state.event.ticketsList
  );

  return {
    loading,
    eventList,
    createEventResponse,
    ticketIdResponse,
    ticketSoldApiResp,
    eventTicketInfo,
    generatedQRcode,
    earningDetailData,
    earningList,
    ticketsList,
  };
};

export const {
  resetCreateEventData,
  resetTicketIdData,
  resetTicketSoldData,
  resetEventTicketInfo,
  resetGeneratedQRcodeData,
  resetEarningDetailData,
} = eventSlice.actions;
