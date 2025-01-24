import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";
import { generatePlacehodelrCard } from "~/utils/formattersAZ";
import { isEmpty } from "lodash";
import { mapOrder } from "~/utils/sorts";

//Khởi tạo giá trị State của 1 cái slice trong redux
const initialState = {
  currentActiveBoard: null,
  completionBoard: null,
};
//Các hành động gọi API( bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  "activeBoard/fetchBoardDetailsAPI",
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`
    );
    //Lưu ý: axios sẽ trả về kết quả về qua property của nó là data
    return response.data;
  }
);
export const fetchCompletionBoardAPI = createAsyncThunk(
  "activeBoard/fetchCompletionBoardAPI",
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}/completion-board`
    );
    return response.data;
  }
);

//Khởi tạo 1 slice trong kho luu trữ Redux Store
export const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,
  //Reducers: Nơi chứa các xử lý dữ liệu đồng bộ
  reducers: {
    //Luôn luôn cần {} cho function reducers có dù chỉ có 1 dòng lệnh
    //updateCurrentActiveBoard: là tên của action, action này sẽ được gọi từ component bên dưới để cập nhật dữ liệu vào store
    //state: là dữ liệu hiện tại của cái slice đó, action: là dữ liệu mà component gọi action truyền vào
    //Ví dụ: dispatch(updateCurrentActiveBoard({name: "Tuan"})) thì action sẽ là {name: "Tuan"}
    //Còn nếu là dispatch(updateCurrentActiveBoard) thì action sẽ là undefined
    //updateCurrentActiveBoard: (state, action) => {state.currentActiveBoard = action.payload;} có tác dụng cập nhật dữ liệu vào store (cập nhật dữ liệu trong store) (đồng bộ)
    updateCurrentActiveBoard: (state, action) => {
      //action.payload: là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra 1 biến có nghĩa hơn (fullBoard)
      const board = action.payload;

      //Xử lý dữ liệu

      //Update lại data của cái currentActiveBoard
      state.currentActiveBoard = board;
    },
    updateCardInBoard: (state, action) => {
      //Update nested data trong Redux
      const findingCard = action.payload;
      //tìm dần từ board > column > card
      const columnOfCard = state.currentActiveBoard.columns.find(
        (col) => col._id === findingCard.columnId
      );
      if (columnOfCard) {
        const card = columnOfCard.cards.find(
          (card) => card._id === findingCard._id
        );
        //Nếu tìm thấy card thì update lại card đó tại vị trí đó trong mảng cards nghĩa là ghi đè lên card cũ bằng card mới (findingCard)
        if (card) {
          //Object.keys(findingCard) là lấy ra tất cả các key của findingCard ra thành 1 mảng rồi duyệt qua từng key để gán giá trị của key đó vào card tương ứng trong state
          Object.keys(findingCard).forEach((key) => {
            card[key] = findingCard[key];
          });
        }
      }
    },
    setCompletionBoard: (state, action) => {
      state.completionBoard = action.payload;
    },
    resetActiveBoard: (state) => {
      state.currentActiveBoard = null;
      state.completionBoard = null;
    },
  },
  //ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    //sẽ hứng data trả về từ fetchBoardDetailsAPI và xử lý dữ liệu ở đây
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      //action.payload chính là response.data trả về ở trên
      let board = action.payload;

      //Thành viên trong board sẽ được gộp từ 2 mảng là members và owners thành 1 mảng
      board.FE_allUsers = [...board.owners, ...board.members];
      //Xử lý dữ liệu
      //Sắp xếp thứ tự các column ở đây trước khi đưa dữ liệu xuống dưới component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");

      board.columns.forEach((column) => {
        //Khi f5 (refresh) lại trang web thì cần Kiểm tra xem column có card không, nếu không thì thêm card placeholder vào để xử lý UI cho 1 column rỗng
        if (isEmpty(column.cards)) {
          column.cards = [generatePlacehodelrCard(column)];
          column.cardOrderIds = [generatePlacehodelrCard(column)._id];
        } else {
          //Sắp xếp thứ tự các card ở đây trước khi đưa dữ liệu xuống dưới component con
          column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
        }
      });

      //Update lại data của cái currentActiveBoard
      state.currentActiveBoard = board; //nó tương tự như setState trong React
    });
    //sẽ hứng data trả về từ fetchCompletionBoardAPI và xử lý dữ liệu ở đây
    builder.addCase(fetchCompletionBoardAPI.fulfilled, (state, action) => {
      state.completionBoard = action.payload;
    });
  },
});
//Actions: là nơi dành cho các component bên dưới gọi bằng dispatch() tới nó để cập nhật dữ liệu thông qua reducer (chạy đồng bộ)(câp nhật dữ liệu trong store)
//Để ý ở trên thì không thấy properties actions nào cả, vì Toolkit đã tự sinh ra nó theo tên của reducer
export const {
  updateCurrentActiveBoard,
  updateCardInBoard,
  setCompletionBoard,
  resetActiveBoard,
} = activeBoardSlice.actions;

//Selectors: là nơi dành cho các component bên dưới gọi bằng useSelector() để lấy dữ liệu từ store ra sử dụng (lấy dữ liệu từ store ra bên ngoài)
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard;
};
export const selectCompletionBoard = (state) => {
  return state.activeBoard.completionBoard;
};

//Cái file này tên là activeBoardSlice, nhưng ta sẽ export ra 1 cái tên là Reducer để import vào rootReducer
// export default activeBoardSlice.reducer;
export const activeBoardReducer = activeBoardSlice.reducer;
