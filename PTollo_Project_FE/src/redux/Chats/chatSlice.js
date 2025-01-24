import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";

//Khởi tạo giá trị State của 1 cái slice trong redux
const initialState = {
  boardId: null,
  messages: [],
  users: [],
  selectedUser: null,
};
//Các hành động gọi API( bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsyncThunk đi kèm với extraReducers
export const getUsersInBoard = createAsyncThunk(
  `/messages/getUsersInBoard`,
  async (boardId) => {
    console.log(boardId);
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/messages/${boardId}/users`
    );
    console.log(response.data);
    return response.data;
  }
);
export const getMessagesInBoard = createAsyncThunk(
  `/messages/getMessagesInBoard`,
  async (data) => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/messages/${data.userId}`,
      { params: { boardId: data.boardId } }
    );
    return response.data;
  }
);
export const sendMessage = createAsyncThunk(
  `/messages/sendMessage`,
  async (data, thunkAPI) => {
    const state = thunkAPI.getState(); // Truy cập Redux state
    const selectedUser = state.chat.selectedUser; // Lấy selectedUser từ state
    if (!selectedUser) {
      throw new Error("No selected user found!");
    }
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/messages/send/${selectedUser._id}`, // Sử dụng selectedUser._id
      data
    );
    return response.data;
  }
);

//Khởi tạo 1 slice trong kho luu trữ Redux Store
export const chatSlice = createSlice({
  name: "chat",
  initialState,
  //Reducers: Nơi chứa các xử lý dữ liệu đồng bộ
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setBoardId: (state, action) => {
      state.boardId = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
  },
  //ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    //sẽ hứng data trả về từ getUsersInBoard và xử lý dữ liệu ở đây
    builder.addCase(getUsersInBoard.fulfilled, (state, action) => {
      //action.payload chính là response.data trả về ở trên
      state.users = action.payload;
    });
    //sẽ hứng data trả về từ getMessagesInBoard và xử lý dữ liệu ở đây
    builder.addCase(getMessagesInBoard.fulfilled, (state, action) => {
      //action.payload chính là response.data trả về ở trên
      state.messages = action.payload;
      state.unreadCount = action.payload.filter((msg) => !msg.isRead).length;
    });
    //sẽ hứng data trả về từ sendMessage và xử lý dữ liệu ở đây
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      //action.payload chính là response.data trả về ở trên
      //Thêm tin nhắn mới vào mảng messages, dùng ...state.messages để sao chép mảng messages cũ và thêm tin nhắn mới vào
      //Khi send tin nhắn, tin nhắn mới sẽ được thêm vào cuối mảng messages là do beenBE trả về newmessage  sau khi đã lưu vào db thành công và lúc và lúc ta refresh lại trang thì tin nhắn mới sẽ được hiển thị ở cuối bằng cách get lại dữ liệu từ db
      state.messages = [...state.messages, action.payload];
    });
  },
});

//Actions: Nơi chứa các hàm gọi dispatch để thực hiện các hành động trong reducers
export const { setSelectedUser, setBoardId, setMessages } = chatSlice.actions;

//Selector: Nơi chứa các hàm lấy dữ liệu từ redux
export const selectUsers = (state) => state.chat.users;
export const selectMessages = (state) => state.chat.messages;
export const selectSelectedUser = (state) => state.chat.selectedUser;

export const chatReducer = chatSlice.reducer;
