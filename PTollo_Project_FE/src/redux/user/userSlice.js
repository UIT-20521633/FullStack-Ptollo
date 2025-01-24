import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";
import { disconnectSocket } from "~/utils/socketManager";

//Khởi tạo giá trị State của 1 cái slice trong redux
const initialState = {
  currentUser: null,
  isLoggingIn: false,
  onlineUsers: [],
  recentlyViewedBoards: [],
  starredBoards: [],
};
//Các hành động gọi API( bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsyncThunk đi kèm với extraReducers

export const loginUserAPI = createAsyncThunk(
  "user/loginUserAPI",
  async (data) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    );
    //Lưu ý: axios sẽ trả về kết quả về qua property của nó là data
    return response.data;
  }
);

export const logoutUserAPI = createAsyncThunk(
  "user/logoutUserAPI",
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(
      `${API_ROOT}/v1/users/logout`
    );
    if (showSuccessMessage) {
      toast.success("Logged out successfully!");
    }
    return response.data;
  }
);

export const updateUserAPI = createAsyncThunk(
  "user/updateUserAPI",
  async (data) => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/users/update`,
      data
    );
    return response.data;
  }
);
// ** Thêm API để cập nhật recentlyViewedBoards **
export const updateRecentlyViewedBoardsAPI = createAsyncThunk(
  "user/updateRecentlyViewedBoardsAPI",
  async (boardId, data) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/boards/${boardId}/recently_viewed`,
      data
    );
    return response.data; // Dữ liệu trả về sẽ chứa danh sách recentlyViewedBoards đã cập nhật
  }
);
// ** Thêm API để lấy danh sách recentlyViewedBoards **
export const fetchRecentBoardsAPI = createAsyncThunk(
  "user/fetchRecentBoardsAPI",
  async () => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/users/recently_viewed`
    );
    return response.data.recentlyViewedBoards;
  }
);

// ** Thêm API để cập nhật starredBoard **
export const toggleStarredBoardAPI = createAsyncThunk(
  "user/toggleStarredBoardAPI",
  async (boardId) => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/boards/${boardId}/star_board`
    );
    return response.data; // Dữ liệu trả về sẽ chứa danh sách recentlyViewedBoards đã cập nhật
  }
);
// ** Thêm API để lấy danh sách starredBoard **
export const fetchStarredBoardsAPI = createAsyncThunk(
  "user/fetchStarredBoardsAPI",
  async () => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/users/star_board`
    );
    return response.data.starredBoards;
  }
);

//Khởi tạo 1 slice trong kho luu trữ Redux Store
export const userSlice = createSlice({
  name: "user",
  initialState,
  //Reducers: Nơi chứa các xử lý dữ liệu đồng bộ
  reducers: {
    setIsLoggingIn: (state, action) => {
      state.isLoggingIn = action.payload;
    },
    updateOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setRecentlyViewedBoards: (state, action) => {
      state.recentlyViewedBoards = action.payload;
    },
    setStarredBoards: (state, action) => {
      state.starredBoards = action.payload;
    },
  },
  //ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: async (builder) => {
    //sẽ hứng data trả về từ loginUserAPI và xử lý dữ liệu ở đây
    //fullfilled: là trạng thái khi API gọi thành công
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      //action.payload chính là response.data trả về ở trên
      state.currentUser = action.payload;
    });
    //sẽ hứng data trả về từ logoutUserAPI và xử lý dữ liệu ở đây
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      /**
       * API logout sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây
       * Kết hợp ProtectedRoute đã làm ở App.js => code sẽ điều hướng chuẩn về trang Login
       */
      disconnectSocket();
      state.currentUser = null;
      state.isLoggingIn = false;
    });
    //sẽ hứng data trả về từ updateUserAPI và xử lý dữ liệu ở đây
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    // ** Thêm xử lý cho updateRecentlyViewedBoardsAPI **
    builder.addCase(
      updateRecentlyViewedBoardsAPI.fulfilled,
      (state, action) => {
        state.recentlyViewedBoards = action.payload.recentlyViewed; // Cập nhật danh sách recentlyViewedBoards
      }
    );
    // ** Thêm xử lý cho fetchRecentBoardsAPI **
    //để cập nhật danh sách recentlyViewedBoards khi có dữ liệu trả về từ API
    builder.addCase(fetchRecentBoardsAPI.fulfilled, (state, action) => {
      state.recentlyViewedBoards = action.payload; // Cập nhật danh sách recentlyViewedBoards
    });
    // ** Thêm xử lý cho updateStarredBoardsAPI **
    builder.addCase(toggleStarredBoardAPI.fulfilled, (state, action) => {
      // Cập nhật danh sách starredBoards
      state.starredBoards = action.payload.starredBoards; // Cập nhật danh sách starredBoards
    });
    builder.addCase(fetchStarredBoardsAPI.fulfilled, (state, action) => {
      // Cập nhật danh sách starredBoards
      state.starredBoards = action.payload;
    });
  },
});

//Actions: là nơi dành cho các component bên dưới gọi bằng dispatch() tới nó để cập nhật dữ liệu thông qua reducer (chạy đồng bộ)(câp nhật dữ liệu trong store)
export const {
  setIsLoggingIn,
  updateOnlineUsers,
  setRecentlyViewedBoards,
  setStarredBoards,
} = userSlice.actions;
//Để ý ở trên thì không thấy properties actions nào cả, vì Toolkit đã tự sinh ra nó theo tên của reducer
// export const {} = userSlice.actions;

//Selectors: là nơi dành cho các component bên dưới gọi bằng useSelector() để lấy dữ liệu từ store ra sử dụng (lấy dữ liệu từ store ra bên ngoài)
export const selectCurrentUser = (state) => {
  //state.user là name của slice, currentUser là tên của property trong initialState
  return state.user.currentUser;
};
export const selectIsLoggingIn = (state) => state.user.isLoggingIn;
export const selectOnlineUsers = (state) => state.user.onlineUsers;
export const selectRecentlyViewedBoards = (state) =>
  state.user.recentlyViewedBoards;
export const selectStarredBoards = (state) => state.user.starredBoards;
export const userReducer = userSlice.reducer;
