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
import { cloneDeep, random } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveTemplate } from "~/redux/activeTemplate/activeTemplateSlice";

const ListColumns = ({ columns }) => {
  //redux
  const dispatch = useDispatch();
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  //
  const toggleOpenNewColumnForm = () =>
    setOpenNewColumnForm(!openNewColumnForm);

  const [newColumnTitle, setNewColumnTitle] = useState("");

  /**
   * SortableContext yêu cầu items là một mảng dạng ['id1', 'id2', 'id3', ...] chứ không phải là mảng object như columns [{_id: 'id1', ...}, {_id: 'id2', ...}, ...]
   * Nếu không đúng thì vẫn kéo thả được nhưng không có animation
   */
  const setThemeDark = (theme) =>
    theme.palette.mode === "dark" ? "#f1f2f4" : "#1A1D20";
  return (
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
        return <Column key={column.tittle + random(1, 1000)} column={column} />;
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
  );
};
export default ListColumns;
