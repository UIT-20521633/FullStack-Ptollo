import { configureStore } from "@reduxjs/toolkit";
import { activeBoardReducer } from "./activeBoard/activeBoardSlice";
import { userReducer } from "./user/userSlice";

//Cấu hình redux-persist
import { combineReducers } from "redux"; // lưu ý chúng ta có sẵn redux trong node_modules bởi vì khi cài @reduxjs/toolkit là đã có luôn
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default là localstorage
import { activeCardReducer } from "./activeCard/activeCardSlice";
import { notificationsReducer } from "./notifications/notificationsSlice";
import { callInfoReducer } from "./activieCall/callSlice";
import { chatReducer } from "./Chats/chatSlice";
import { activeTemplateReducer } from "./activeTemplate/activeTemplateSlice";

// Cấu hình persist
const rootPersistConfig = {
  key: "root", // key của cái persist do chúng ta chỉ định, cứ để mặc định là root
  storage: storage, // Biến storage ở trên - lưu vào localstorage
  //name: user, // Đặt tên cho storage thì thằng user: userReducer sẽ lưu vào Localstorage với tên là user
  whitelist: ["user"], // định nghĩa các slice dữ liệu ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
  // blacklist: ["socket"], // định nghĩa các slice KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
};
const userPersistConfig = {
  key: "user",
  storage,
  blacklist: ["socket"], // Loại bỏ socket khỏi phần persist
};
// Combine các reducers trong dự án của chúng ta ở đây
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: persistReducer(userPersistConfig, userReducer),
  // user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer,
  callInfo: callInfoReducer,
  chat: chatReducer,
  activeTemplate: activeTemplateReducer,
});
// Thực hiện persist Reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducers,
  //Fix warning error khi implement redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
