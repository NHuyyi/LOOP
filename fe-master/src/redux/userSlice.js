import { createSlice } from "@reduxjs/toolkit";

// trạng thái mặc định
const initialState = {
  user: null, // chưa đăng nhập
  token: null,
};

// tạo slide
const userSlice = createSlice({
  name: "user", // tên slide
  initialState,
  //   chứa hàm thây đổi state
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      // ✅ lưu vào localStorage
      // lưu thẳng payload, không bọc thêm 1 level "user"
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    //  trạng thái đăng xuất
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("userData");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
