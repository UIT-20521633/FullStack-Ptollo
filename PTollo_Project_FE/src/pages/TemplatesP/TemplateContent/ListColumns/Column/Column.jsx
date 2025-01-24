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
import { useDispatch, useSelector } from "react-redux";
import ToggleFocusInput from "~/components/Form/ToggleFocusInput";
import { selectActiveTemplate } from "~/redux/activeTemplate/activeTemplateSlice";

const Column = ({ column }) => {
  //redux
  const dispatch = useDispatch();
  const template = useSelector(selectActiveTemplate);

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
  const setThemeDark = (theme) =>
    theme.palette.mode === "dark" ? "#f1f2f4" : "#1A1D20";
  const setThemeLight = (theme) =>
    theme.palette.mode === "dark" ? "#1A1D20" : "#f1f2f4";

  //Xử lý xóa column và các card trong nó
  return (
    <Box
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
        <ToggleFocusInput value={column?.title} data-no-dnd="true" />
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
  );
};

export default Column;
