import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
// import authorizedAxiosInstance from "~/utils/authorizeAxios";
// import { API_ROOT } from "~/utils/constants";

const initialState = {
  roomId: null,
  token: null,
  listUsersCall: [],
};

const callInfoSlice = createSlice({
  name: "callInfo",
  initialState,
  reducers: {
    setCallInfo: (state, action) => {
      state.roomId = action.payload.roomId;
      state.token = action.payload.token;
    },
    clearCallInfo: (state) => {
      state.roomId = null;
      state.token = [];
    },
    setListUsersCall: (state, action) => {
      state.listUsersCall = action.payload;
    },
  },
});

export const { setCallInfo, clearCallInfo, setListUsersCall } =
  callInfoSlice.actions;

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentCallInfo = (state) => {
  return {
    roomId: state.callInfo.roomId,
    token: state.callInfo.token,
  };
};
export const selectCurrentRoomId = (state) => {
  return state.callInfo.roomId;
};
export const selectCurrentToken = (state) => {
  return state.callInfo.token;
};

// Cái file này tên là notificationsSlice NHƯNG chúng ta sẽ export một thứ tên là Reducer, mọi người lưu ý :D
// export default notificationsSlice.reducer
export const callInfoReducer = callInfoSlice.reducer;
