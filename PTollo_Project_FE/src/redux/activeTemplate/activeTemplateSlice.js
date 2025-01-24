import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";
import { generatePlacehodelrCard } from "~/utils/formattersAZ";
import { isEmpty, set } from "lodash";
import { mapOrder } from "~/utils/sorts";

//Khởi tạo giá trị State của 1 cái slice trong redux
const initialState = {
  currentActiveTemplate: null,
};
//Các hành động gọi API( bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsyncThunk đi kèm với extraReducers
export const fetchTemplateDetailsAPI = createAsyncThunk(
  "activeTemplate/fetchTemplateDetailsAPI",
  async (templateId) => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/templates/${templateId}`
    );
    //Lưu ý: axios sẽ trả về kết quả về qua property của nó là data
    return response.data;
  }
);

//Khởi tạo 1 slice trong kho luu trữ Redux Store
export const activeTemplateSlice = createSlice({
  name: "activeTemplate",
  initialState,
  //Reducers: Nơi chứa các xử lý dữ liệu đồng bộ
  reducers: {
    //Các hành động đồng bộ sẽ được định nghĩa ở đây
    setTemplate: (state, action) => {
      state.currentActiveTemplate = action.payload;
    },
  },
  //ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    //sẽ hứng data trả về từ fetchBoardDetailsAPI và xử lý dữ liệu ở đây
    builder.addCase(fetchTemplateDetailsAPI.fulfilled, (state, action) => {
      state.currentActiveTemplate = action.payload;
    });
  },
});
//Actions: là nơi dành cho các component bên dưới gọi bằng dispatch() tới nó để cập nhật dữ liệu thông qua reducer (chạy đồng bộ)(câp nhật dữ liệu trong store)
//Để ý ở trên thì không thấy properties actions nào cả, vì Toolkit đã tự sinh ra nó theo tên của reducer
export const { setTemplate } = activeTemplateSlice.actions;

//Selectors: là nơi dành cho các component bên dưới gọi bằng useSelector() để lấy dữ liệu từ store ra sử dụng (lấy dữ liệu từ store ra bên ngoài)
export const selectActiveTemplate = (state) =>
  state.activeTemplate.currentActiveTemplate;

export const activeTemplateReducer = activeTemplateSlice.reducer;
