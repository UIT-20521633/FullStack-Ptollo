import React, { useState } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CloudIcon from "@mui/icons-material/Cloud";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import AddCardIcon from "@mui/icons-material/AddCard";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import CloseIcon from "@mui/icons-material/Close";
import ListCards from "./ListCards/ListCards";
import { useConfirm } from "material-ui-confirm";
//dnd-kit
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";

import {
  createNewCardAPI,
  updateColumnDetailsAPI,
  deleteColumnDetailsAPI,
} from "~/apis";
import { cloneDeep } from "lodash";
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
import ToggleFocusInput from "~/components/Form/ToggleFocusInput";

const Column = ({ column }) => {
  //redux
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);
  //dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column._id, data: { ...column } });
  const dndKitColumnStyles = {
    /**
     * Nếu sử dụng CSS.Transform như docs sẽ bị lỗi kiểu stretch
     */
    // touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    //Chiểu cao phải luôn max là 100% vì nếu không sẽ lỗi lúc kéo column ngắn qua 1 column dài thì ta phải kéo ở khu vực giữa rất khó chịu và khó kéo và lưu ý lúc này phải kết hợp với {...listeners} nằm ở Box chứ không phải ở div ngoài cũng để tránh kéo vào vùng không có nội dung
    height: "100%",
    //Nếu đang kéo thả thì opacity sẽ giảm nhờ isDragging là đang kéo
    opacity: isDragging ? 0.5 : undefined,
  };
  //dropdown menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // Sắp xếp thứ tự các card
  const sortedCards = column.cards;

  //Add new card
  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  //
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

  const [newCardTitle, setNewCardTitle] = useState("");
  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error("Please enter card title", {
        position: "bottom-right",
        autoClose: 1000,
      });
      return;
    }
    //Tạo data Card để gọi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id,
    };
    // * gọi API tạo mới Card và làm lại dữ liệu State Board
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    //Cập nhật lại dữ liệu State Board
    // const newBoard = { ...board };
    // const columnToUpdate = newBoard.columns.find(
    //   (column) => column._id === createdCard.columnId
    // );
    // if (columnToUpdate) {
    //   columnToUpdate.cards.push(createdCard);
    //   columnToUpdate.cardOrderIds.push(createdCard._id);
    // }
    // setBoard(newBoard);
    // Cập nhật lại dữ liệu State Board
    //Lưu ý vì là card nên cần phải tìm ra cột mà card đó thuộc về để cập nhật dữ liệu cho cột đó
    const boardClone = cloneDeep(board);
    const updatedColumns = { ...boardClone }.columns.map((column) => {
      if (column._id === createdCard.columnId) {
        // Cập nhật cột có _id trùng với createdCard.columnId
        if (column.cards.some((card) => card.FE_PlaceholderCard)) {
          //Nếu column đó chỉ có 1 card placeholder thì xóa card placeholder đi và thêm card mới vào
          return {
            ...column, // Sao chép cột hiện tại
            cards: [createdCard], // Thêm card mới vào mảng cards của cột
            cardOrderIds: [createdCard._id], // Thêm cardId vào mảng cardOrderIds của cột
          };
        } else {
          return {
            ...column, // Sao chép cột hiện tại
            cards: [...column.cards, createdCard], // Thêm card mới vào mảng cards của cột
            cardOrderIds: [...column.cardOrderIds, createdCard._id], // Thêm cardId vào mảng cardOrderIds của cột
          };
        }
      }
      return column; // Nếu không phải cột cần cập nhật, trả về cột gốc
    });
    const newBoard = {
      // Sao chép mảng columns
      ...boardClone,
      columns: updatedColumns, // Cập nhật lại mảng columns trong state
    };
    dispatch(updateCurrentActiveBoard(newBoard));
    //Đóng trạng thái thêm Card mới $ Clear input
    toggleOpenNewCardForm();
    setNewCardTitle("");
  };
  const setThemeDark = (theme) =>
    theme.palette.mode === "dark" ? "#f1f2f4" : "#1A1D20";
  const setThemeLight = (theme) =>
    theme.palette.mode === "dark" ? "#1A1D20" : "#f1f2f4";

  //Xử lý xóa column và các card trong nó
  const confirmDeleteColumn = useConfirm();
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: "Delete Column?",
      description:
        "This action will permanently delete your Column and its Cards! Are you sure?",
      confirmationText: "Confirm",
      cancellationText: "Cancel",
      // buttonOrder: ["confirm", "cancel"],
      // content: 'test content hehe',
      // allowClose: false,
      // dialogProps: { maxWidth: 'lg' },
      // cancellationButtonProps: { color: "info", variant: "outlined" },
      // confirmationButtonProps: { color: "error", variant: "outlined" },
      // description: 'Phải nhập chữ namnguyen thì mới được Confirm =))',
      // confirmationKeyword: 'namnguyen'
    })
      .then(() => {
        // *Xử lý xoá column và card bên trong nó
        // * Update cho chuẩn dữ liệu State Board
        const boardClone = cloneDeep(board);
        const newBoard = {
          ...boardClone,
          columns: { ...boardClone }.columns.filter(
            (col) => col._id !== column._id
          ),
          columnOrderIds: { ...boardClone }.columnOrderIds.filter(
            (colId) => colId !== column._id
          ),
        };
        dispatch(updateCurrentActiveBoard(newBoard));
        //Gọi API xóa column
        deleteColumnDetailsAPI(column._id).then((res) => {
          toast.success(res?.deleteResult);
        });
      })
      .catch(() => {
        /* ... */
      });
  };

  const onUpdateColumnTitle = (newTitle) => {
    //Gọi API cập nhật title cho column và xử lý data board trong redux
    updateColumnDetailsAPI(column._id, { title: newTitle }).then(() => {
      //Cập nhật lại dữ liệu State Board
      const newBoard = cloneDeep(board);
      const updatedColumns = newBoard.columns.find(
        (col) => column._id === col._id
      );
      if (updatedColumns) {
        updatedColumns.title = newTitle;
      }
      //Cập nhật lại dữ liệu State Board trong redux
      dispatch(updateCurrentActiveBoard(newBoard));
    });
  };
  return (
    //Bọc div ở đây vi vấn đề chiều cao của column khi kéo thả sẽ có bug kiểu kiểu flickering
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        //listeners là các sự kiện kéo thả của dnd-kit nên đặt trong box nếu đặt ngoài thì hegith là 100% r sẽ
        //phần không có nội dung ở dưới thẻ điv vẫn kéo thả được nên đặt listeners trong box
        {...listeners}
        sx={{
          minWidth: "300px",
          maxWidth: "300px",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A1D20" : "#f1f2f4",
          backgroundSize: "cover",
          ml: 2,
          backgroundPosition: "center",
          borderRadius: "6px",
          height: "fit-content",
          maxHeight: (theme) =>
            `calc(${theme.Ptollo.boardContentHeight} - ${theme.spacing(3.5)})`,
        }}>
        {/* Header */}
        <Box
          sx={{
            px: 2,
            height: (theme) => theme.Ptollo.columnHeaderHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          {/* <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}>
            {column?.title}
          </Typography> */}
          <ToggleFocusInput
            value={column?.title}
            onChangedValue={onUpdateColumnTitle}
            data-no-dnd="true"
          />
          <Box>
            <Tooltip title="More options">
              <MoreHorizRoundedIcon
                sx={{ cursor: "pointer", color: "text.primary" }}
                id="basic-column-menu"
                aria-controls={open ? "basic-menu-column" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-column-menu",
              }}>
              <MenuItem
                onClick={toggleOpenNewCardForm}
                sx={{
                  "&:hover": {
                    color: (theme) => theme.palette.success.light,
                    "& .add-card-icon": {
                      color: (theme) => theme.palette.success.light,
                    },
                  },
                }}>
                <ListItemIcon>
                  <AddCardIcon className="add-card-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  "&:hover": {
                    color: (theme) => theme.palette.warning.dark,
                    "& .delete-foreve-icon": {
                      color: (theme) => theme.palette.warning.dark,
                    },
                  },
                }}>
                <ListItemIcon>
                  <DeleteForeverIcon
                    className="delete-foreve-icon"
                    fontSize="small"
                  />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <CloudIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Card */}
        <ListCards cards={sortedCards} />

        {/* Footer */}
        <Box
          sx={{
            height: (theme) => theme.Ptollo.columnFooterHeight,
            px: 2,
          }}>
          {!openNewCardForm ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Button
                onClick={toggleOpenNewCardForm}
                sx={{ fontSize: "0.875rem" }}
                startIcon={<AddCardIcon />}>
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: "pointer" }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}>
              <TextField
                label="Enter card title..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  "& label": { color: "text.primary" },
                  "& input": {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: setThemeLight,
                  },
                  "& label.Mui-focused": {
                    color: (theme) => theme.palette.primary.main,
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&:hover fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    borderRadius: 1,
                  },
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  className="interceptor-loading"
                  data-no-dnd="true"
                  onClick={addNewCard}
                  variant="contained"
                  size="small"
                  sx={{
                    height: "38px",
                    boxShadow: "none",
                    border: "0.5px solid",
                    borderColor: setThemeDark,
                    "&:hover": { bgcolor: setThemeDark },
                  }}>
                  Add
                </Button>
                <CloseIcon
                  fontSize="small"
                  sx={{
                    cursor: "pointer",
                    color: (theme) => theme.palette.warning.light,
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Column;
