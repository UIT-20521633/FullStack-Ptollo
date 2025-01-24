import { useEffect } from "react";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import Box from "@mui/material/Box";

// import { mockData } from "~/apis/mock-data";
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  getBackgroundBoardAPI,
} from "~/apis";
import { cloneDeep } from "lodash";
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
  fetchCompletionBoardAPI,
} from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
//useSelector: là hook của react-redux giúp lấy dữ liệu từ store nó gióng như mapStateToProps trong class component của react-redux trước đây (lấy dữ liệu từ store) có tác dụng lấy dữ liệu từ store
//useDispatch: là hook của react-redux giúp gọi action để cập nhật dữ liệu vào store nó gióng như mapDispatchToProps trong class component của react-redux trước đây (cập nhật dữ liệu vào store) có tác dụng gọi action để cập nhật dữ liệu vào store
import { useParams } from "react-router-dom";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
import ActiveCard from "~/components/Modal/ActiveCard/ActiveCard";
import { updateRecentlyViewedBoardsAPI } from "~/redux/user/userSlice";
import FABMessage from "~/components/FABMessage/FABMessage";

const BoardPage = () => {
  const dispatch = useDispatch();
  //không dùng state của react nữa mà dùng state của redux
  // const [board, setBoard] = useState(null);
  //Lấy dữ liệu từ store
  const board = useSelector(selectCurrentActiveBoard);
  //Lấy id từ url
  const { boardId } = useParams();

  useEffect(() => {
    //Call API
    // Gọi API lấy dữ liệu board từ BE và sẽ cập nhật dữ liệu vào store thông qua action fetchBoardDetailsAPI và reducer của nó là extraReducers của slice activeBoardSlice (đã import ở trên) (bất đồng bộ)
    //fetchBoardDetailsAPI(boardID) là 1 action được tạo ra từ createAsyncThunk là middleware của redux toolkit giúp chúng ta gọi API và cập nhật dữ liệu vào store
    //dispatch(fetchBoardDetailsAPI(boardID)) là cách gọi action để gọi API và cập nhật dữ liệu vào store cần phải có dispatch
    dispatch(fetchBoardDetailsAPI(boardId));
    //Khi truy cập vào board thì gửi request lên server thông báo đã truy cập vào board này để lưu vào recentlyViewedBoards
    dispatch(updateRecentlyViewedBoardsAPI(boardId)); //Gọi API update lại recentlyViewedBoards
    dispatch(fetchCompletionBoardAPI(boardId));
  }, [dispatch, boardId]);
  //Func có nhiệm vụ gọi API và xử lý kéo thả column xong xuoi
  const moveColumns = (dndSortedColumns) => {
    //dnbSortedColumnsIds là mảng các _id của các column sau khi đã sắp xếp
    //update lại dữ liệu State Board
    const dndSortedColumnsIds = dndSortedColumns.map((col) => col._id);
    const boardClone = cloneDeep(board);
    const newBoard = {
      ...boardClone,
      columns: [...dndSortedColumns],
      columnOrderIds: [...dndSortedColumnsIds],
    };
    dispatch(updateCurrentActiveBoard(newBoard));
    //Gọi API update lại vị trí của các column
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndSortedColumnsIds,
    });
  };

  /**
   * Khi kéo thả card trong cùng 1 column
   * chỉ cần gọi API để cập nhật mảng cardOrderIds của column chưa nó (thay đổi vị trí trong mảng)
   */
  const moveCardsInTheSameColumn = (
    dndSortedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    //update lại dữ liệu State Board
    const boardClone = cloneDeep(board);
    const updatedColumns = { ...boardClone }.columns.map((column) => {
      if (column._id === columnId) {
        // Cập nhật cột có _id trùng với createdCard.columnId
        return {
          ...column, // Sao chép cột hiện tại
          cards: [...dndSortedCards], //dnbSortedCards là mảng các card sau khi đã sắp xếp
          cardOrderIds: [...dndOrderedCardIds], //dndOrderedCardIds là mảng các _id của các card sau khi đã sắp xếp
        };
      }
      return column; // Nếu không phải cột cần cập nhật, trả về cột gốc
    });
    const newBoard = {
      ...boardClone,
      columns: updatedColumns, // Cập nhật lại mảng columns trong state
    };
    dispatch(updateCurrentActiveBoard(newBoard));
    //Gọi API update column
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardIds,
    });
  };
  /**
   * Khi di chuyển card sang column khác
   * B1: Cập nhật mảng cardOrderIds của column cũ (xóa cardId khỏi mảng cardOrderIds)
   * B2: Cập nhật mảng cardOrderIds của column mới (thêm cardId vào mảng cardOrderIds)
   * B3: cập nhật lại truong columnId mới của Card đã kéo
   * => Làm API support riêng
   */
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndSortedColumns
  ) => {
    //update lại dữ liệu State Board
    const dndSortedColumnsIds = dndSortedColumns.map((col) => col._id);
    const boardClone = cloneDeep(board);
    const newBoard = {
      ...boardClone,
      columns: [...dndSortedColumns],
      columnOrderIds: [...dndSortedColumnsIds],
    };
    dispatch(updateCurrentActiveBoard(newBoard));
    //Gọi API update lại vị trí của cac card trong column cũ và column mới
    let prevCardOrderIds = dndSortedColumns.find(
      (col) => col._id === prevColumnId
    )?.cardOrderIds;
    //Xử lý vấn đề khi kéo thả card vào column rỗng, cần xóa card placeholder đi trước khi gửi data lên BE
    if (prevCardOrderIds[0].includes("-placeholder-card"))
      prevCardOrderIds = [];
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds, //Lấy ra mảng cardOrderIds của column cũ
      nextColumnId,
      nextCardOrderIds: dndSortedColumns.find((col) => col._id === nextColumnId)
        ?.cardOrderIds, //Lấy ra mảng cardOrderIds của column mới
    });
  };

  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..." />;
  }

  return (
    <>
      {/* Modal Active Card, check đóng/mở dựa theo cái State isShowActiveCard lưu tròng redux  */}
      <ActiveCard />
      {/* Các thành phần còn lại của board detall */}
      <Box
        sx={{
          position: "relative",
          height: (theme) => `calc(100vh - ${theme.Ptollo.appBarHeight})`,
          background: board?.background?.startsWith("#")
            ? board?.background
            : `url(${board?.background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",

          "&.css-r92vv6": {
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}>
        {/* ? là optional channing: để kiểm tra dữ liệu  */}
        <BoardBar board={board} />
        <Box
          sx={{
            "&.css-o9nd4w": {
              position: "relative",
            },
          }}>
          <BoardContent
            board={board}
            moveColumns={moveColumns}
            moveCardsInTheSameColumn={moveCardsInTheSameColumn}
            moveCardToDifferentColumn={moveCardToDifferentColumn}
          />
        </Box>
        {/* Nút FAB để tạo thẻ */}
        <Box sx={{ position: "absolute", bottom: "0.5em", right: "0.5em" }}>
          <FABMessage board={board} />
        </Box>
        {/* SpeedDial  */}
      </Box>
    </>
  );
};

export default BoardPage;
