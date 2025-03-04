import { InfoUser } from "@/models/userInterface";
import { DataStateRedux } from "@/models/responseInterface";
import userService from "@/services/userService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state for user info
const initialState: DataStateRedux<InfoUser | null> = {
  datas: null,
  loading: false,
  error: null,
};

// Async thunk to fetch user info
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const userInfo = await userService.getProfile();
      return userInfo; // Return result from API
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch user info");
    }
  }
);

const userProfileSlice = createSlice({
  name: "user_profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
        if (action.payload.statusCode === 400) {
          state.loading = false;
          state.datas = null;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default userProfileSlice;
