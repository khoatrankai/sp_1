import {
  ICreateActivityContainer,
  IGetActivityContainer,
  IUpdateActivityContainer,
} from "@/models/productInterface";
import productService from "@/services/productService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ActivityContainerState {
  datas: IGetActivityContainer[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityContainerState = {
  datas: [],
  loading: false,
  error: null,
};

// Async thunk for fetching activity containers
export const fetchActivityContainers = createAsyncThunk(
  "activityContainer/fetchActivityContainers",
  async (type: "import" | "export" | "status", thunkAPI) => {
    try {
      const response = await productService.findAllActivityContainers(type);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch activity containers");
    }
  }
);

// Async thunk for fetching an activity container by ID
export const fetchActivityContainerById = createAsyncThunk(
  "activityContainer/fetchActivityContainerById",
  async (id: string, thunkAPI) => {
    try {
      const response = await productService.findActivityContainerById(id);
      return response;
    } catch {
      return thunkAPI.rejectWithValue(
        `Failed to fetch activity container with ID ${id}`
      );
    }
  }
);

// Async thunk for creating an activity container
export const createActivityContainer = createAsyncThunk(
  "activityContainer/createActivityContainer",
  async (data: ICreateActivityContainer, thunkAPI) => {
    try {
      const response = await productService.createActivityContainer(data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to create activity container");
    }
  }
);

// Async thunk for updating an activity container
export const updateActivityContainer = createAsyncThunk(
  "activityContainer/updateActivityContainer",
  async (
    { id, data }: { id: string; data: IUpdateActivityContainer },
    thunkAPI
  ) => {
    try {
      const response = await productService.updateActivityContainer(id, data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue(
        `Failed to update activity container with ID ${id}`
      );
    }
  }
);

const activityContainerSlice = createSlice({
  name: "activityContainer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all activity containers
      .addCase(fetchActivityContainers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityContainers.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data || [];
      })
      .addCase(fetchActivityContainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch activity container by ID
      .addCase(fetchActivityContainerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityContainerById.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = [action.payload.data]; // Assuming we want to replace the data list with a single container
      })
      .addCase(fetchActivityContainerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create an activity container
      .addCase(createActivityContainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivityContainer.fulfilled, (state, action) => {
        state.loading = false;
        state.datas.push(action.payload.data); // Add the newly created container to the list
      })
      .addCase(createActivityContainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update an activity container
      .addCase(updateActivityContainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateActivityContainer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.datas.findIndex(
          (container) =>
            container.activity_container_id ===
            action.payload.data.activity_container_id
        );
        if (index >= 0) {
          state.datas[index] = action.payload.data; // Update the container in the list
        }
      })
      .addCase(updateActivityContainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default activityContainerSlice;
