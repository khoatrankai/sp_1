import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isOpen: false, // Trạng thái ban đầu
};

const toggleSlice = createSlice({
  name: "toggle", // Tên slice
  initialState,
  reducers: {
    // Đặt trạng thái thành true
    openMenu: (state) => {
      state.isOpen = true;
    },
    // Đặt trạng thái thành false
    closeMenu: (state) => {
      state.isOpen = false;
    },
    // Chuyển đổi trạng thái giữa true và false
    toggleMenu: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openMenu, closeMenu, toggleMenu } = toggleSlice.actions; // Export actions
export default toggleSlice.reducer; // Export reducer
