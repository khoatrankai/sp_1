import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: "", // Trạng thái ban đầu
};

const toggleSlice = createSlice({
  name: "image-preview", // Tên slice
  initialState,
  reducers: {
    // Đặt trạng thái thành true
    onChangeImagePreview: (state, action) => {
      state.value = action.payload;
    },
    onDeleteImagePreview: (state) => {
      state.value = "";
    },
  },
});

export const { onChangeImagePreview, onDeleteImagePreview } =
  toggleSlice.actions; // Export actions
export default toggleSlice.reducer; // Export reducer
