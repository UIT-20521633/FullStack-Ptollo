import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import Tooltip from "@mui/material/Tooltip";
// import FlashOnIcon from "@mui/icons-material/FlashOn";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import theme from "~/theme";
import Chip from "@mui/material/Chip";
import VpnLockOutlinedIcon from "@mui/icons-material/VpnLockOutlined";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";

import { capitalizeFirstLetter } from "~/utils/formattersAZ";
import BoardUserGroup from "./BoardUserGroup";
import InviteBoardUser from "./InviteBoardUser";
import CallGroupBoard from "./CallGroupBoard";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStarredBoards,
  toggleStarredBoardAPI,
} from "~/redux/user/userSlice";
import { getBackgroundBoardAPI } from "~/apis";
import { updateCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import BackgroundSelector from "~/components/BackgroundSelector/BackgroundSelector";

const MENU_STYLE = {
  backgroundColor: theme.palette.primary.main,
  color: "white",
  border: "none",
  px: "5px",
  borderRadius: "4px",
  fontWeight: "bold",
  fontSize: "13px",
  "&:hover": {
    borderWidth: "2px",
    borderColor: "white",
    backgroundColor: "#2C4A8A",
  },
};

const BoardBar = ({ board }) => {
  // object Detructuring: bóc tách phần tử
  const starredBoards = useSelector(selectStarredBoards);
  const isMarked = starredBoards.some((b) => b.boardId === board._id);
  const handleToggleMark = () => {
    //Gọi API cập nhật starredBoards
    dispatch(toggleStarredBoardAPI(board._id));
  };
  const dispatch = useDispatch();
  const handleBackgroundChange = async (background) => {
    // Gửi API để lưu trạng thái background
    await getBackgroundBoardAPI(board._id, background);
    // Cập nhật lại state của board
    const updatedBoard = { ...board, background };
    dispatch(updateCurrentActiveBoard(updatedBoard));
  };
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#ffffff3d", // Màu nền với độ trong suốt
        backdropFilter: "blur(4px)", // Hiệu ứng mờ
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)", // Tạo bóng
        color: "white",
        width: "100%",
        position: "relative",
        flex: "1",
        justifyContent: "space-between",
        flexDirection: { xs: "column", md: "row" }, // Responsive layout
        alignItems: "center",
        height: theme.Ptollo.boardBarHeight,
        px: 2,
        py: "6px",
      }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: { xs: "center", md: "flex-end" }, // Center align on small screens
        }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={{
              color: theme.palette.primary.main,
              border: "none",
              px: "5px",
              fontWeight: "800",
              backgroundColor: "transparent",
              fontSize: "20px",
            }}
            label={board?.title}
          />
        </Tooltip>
        <Tooltip title="Click to star or unstar this template. Starred templates show up at the top of your boards list.">
          <Box>
            <IconButton onClick={handleToggleMark} sx={{ cursor: "pointer" }}>
              {isMarked ? (
                <StarIcon sx={{ color: "yellow" }} />
              ) : (
                <StarOutlineIcon sx={{ color: "yellow" }} />
              )}
            </IconButton>
          </Box>
        </Tooltip>
        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockOutlinedIcon />}
          label={capitalizeFirstLetter(board?.type)}
        />
        {/* <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon sx={{ ml: 0 }} />}
          label="Add to Drive"
        /> */}
        <BackgroundSelector
          boardId={board._id}
          onSave={handleBackgroundChange}
        />
        <Tooltip title="Board">
          <Chip
            sx={MENU_STYLE}
            icon={<AddToDriveIcon sx={{ ml: 0 }} />}
            label="Board"
          />
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: { xs: 2, sm: 0 },
          flexWrap: "wrap",
          justifyContent: { xs: "center", md: "flex-end" }, // Center align on small screens
        }}>
        <CallGroupBoard />
        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon sx={{ ml: 0 }} />}
          label="Filter"
        />
        {/* Xử lý mời user vào làm thành viên của Board */}
        <InviteBoardUser boardId={board._id} />
        {/* Hiển thị ds thành viên của board */}
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  );
};

export default BoardBar;
