import Box from "@mui/material/Box";
import Column from "./Column/Column";
import Button from "@mui/material/Button";
import AddBoxIcon from "@mui/icons-material/AddBox";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { toast } from "react-toastify";
import { createNewColumnAPI } from "~/apis";
import { generatePlacehodelrCard } from "~/utils/formattersAZ";
import { cloneDeep } from "lodash";
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";

const ListColumns = ({ columns }) => {
  //redux
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  //
  const toggleOpenNewColumnForm = () =>
    setOpenNewColumnForm(!openNewColumnForm);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error("Please enter column title");
      return;
    }
    //Tạo data Column để gọi API
    const newColumnData = {
      title: newColumnTitle,
    };
    // * gọi API tạo mới Column và làm lại dữ liệu State Board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });

    //Khi tạo 1 column mới chưa có card thì cần thêm card placeholder vào để xử lý UI cho 1 column rỗng
    createdColumn.cards = [generatePlacehodelrCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlacehodelrCard(createdColumn)._id];
    //Cập nhật lại dữ liệu State Board
    // const newBoard = {
    //   ...board,
    // };
    //   newBoard.columns.push(createdColumn),
    //   newBoard.columnOrderIds.push(createdColumn),
    //   setBoard(newBoard);
    //dispatch action để cập nhật dữ liệu vào store (đồng bộ) và ánh xạ dữ liệu từ store xuống component con
    /**
     * (oldBoard) => {
        return {
          ...oldBoard,
          columns: [...board.columns, createdColumn],
          columnOrderIds: [...board.columnOrderIds, createdColumn._id],
        };
      } chính là action.payload ở trong reducer updateCurrentActiveBoard
     */
    const boardClone = cloneDeep(board);
    const newBoard = {
      ...boardClone,
      columns: [...boardClone.columns, createdColumn],
      columnOrderIds: [...boardClone.columnOrderIds, createdColumn._id],
    };

    //Cập nhật dữ liệu Board vào trong redux store
    dispatch(updateCurrentActiveBoard(newBoard));

    //Đóng trạng thái thêm Column mới $ Clear input
    toggleOpenNewColumnForm();
    setNewColumnTitle("");
  };

  /**
   * SortableContext yêu cầu items là một mảng dạng ['id1', 'id2', 'id3', ...] chứ không phải là mảng object như columns [{_id: 'id1', ...}, {_id: 'id2', ...}, ...]
   * Nếu không đúng thì vẫn kéo thả được nhưng không có animation
   */
  const setThemeDark = (theme) =>
    theme.palette.mode === "dark" ? "#f1f2f4" : "#1A1D20";
  return (
    <SortableContext
      items={columns?.map((col) => col._id)}
      strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          py: 2,
          height: "100%",
          display: "flex",
          overflowX: "scroll",
          overflowY: "hidden",
          position: "absolute",
          bottom: 0,
          right: 0,
          top: 0,
          left: 0,
          // Đảm bảo nội dung không xuống dòng
        }}>
        {/* Nội dung của bảng */}
        {columns?.map((column) => {
          return <Column key={column._id} column={column} />;
        })}
        {/* Thêm cột mới */}
        {/* Nếu click vào thì hiện form thêm cột mới */}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: "300px",
              maxWidth: "300px",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#1A1D20" : "#f1f2f4",
              backgroundSize: "cover",
              mx: 2,
              backgroundPosition: "center",
              borderRadius: "6px",
              height: "fit-content",
            }}>
            <Button
              sx={{
                width: "100%",
                justifyContent: "flex-start",
                pl: 2.5,
                py: 1,
                textTransform: "none",
              }}
              startIcon={<AddBoxIcon />}>
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: "300px",
              maxWidth: "300px",
              mx: 2,
              p: 1,
              borderRadius: "6px",
              height: "fit-content",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#1A1D20" : "#f1f2f4",
            }}>
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                "& label": { color: setThemeDark },
                "& input": { color: setThemeDark },
                "& label.Mui-focused": { color: setThemeDark },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: setThemeDark },
                  "&:hover fieldset": { borderColor: setThemeDark },
                  "&.Mui-focused fieldset": { borderColor: setThemeDark },
                },
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant="contained"
                size="small"
                className="interceptor-loading"
                sx={{
                  boxShadow: "none",
                  border: "0.5px solid",
                  borderColor: setThemeDark,
                  "&:hover": { bgcolor: setThemeDark },
                }}>
                Add Column
              </Button>
              <CloseIcon
                fontSize="small"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: setThemeDark },
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  );
};
export default ListColumns;
