import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { AddBalance, UserBasicInfo, UserProfileData } from "../../types/basicTypes";


type HomeApiState = {
  basicUserInfo?: UserBasicInfo;
  userProfileData?: UserProfileData;
  searchResults: any[];
  status: "idle" | "loading" | "failed";
  error: string | null;
};

const initialState: HomeApiState = {
  basicUserInfo: JSON.parse(localStorage.getItem("userInfo") as string),
  userProfileData: undefined,
  searchResults: [],
  status: "idle",
  error: null,
};

export const fetchUserBalance = createAsyncThunk(
  "home/fetchUserBalance", 
  async (user: string) => { 
    const response = await axiosInstance.get(`/api/user/balance`, {
      params: { user }
    });
    return response.data;
  }
);

export const addUserBalance = createAsyncThunk(
  "home/addUserBalance", 
  async (data: AddBalance) => { 
    const response = await axiosInstance.post(`/api/user/balance`, data);
    return response.data;
  }
);

export const searchStocks = createAsyncThunk(
  "home/searchStocks",
  async (searchTerm: string) => {
    const response = await axiosInstance.post("/api/home/search", { searchTerm });
    return response.data;
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBalance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserBalance.fulfilled, (state, action) => {
        console.log(`Balance ${action.payload}`)
        const { balance } = action.payload;
        state.status = "idle";
        if (action.payload.balance !== undefined) {
          if (state.basicUserInfo) {
            state.basicUserInfo.balance = action.payload.balance;
          } else {
            console.error("No basicUserInfo available to update.");
          }
        } else {
          console.error("Balance not found in the API response");
        }
      })
      .addCase(fetchUserBalance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch user data";
      })
      .addCase(searchStocks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchStocks.fulfilled, (state, action) => {
        state.status = "idle";
        state.searchResults = action.payload;
      })
      .addCase(searchStocks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to search stocks";
      });
  },
});

export default homeSlice.reducer;