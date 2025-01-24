import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import theme from "~/theme";
import Chip from "@mui/material/Chip";
import VpnLockOutlinedIcon from "@mui/icons-material/VpnLockOutlined";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import { capitalizeFirstLetter } from "~/utils/formattersAZ";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { useState } from "react";
import BurstModeIcon from "@mui/icons-material/BurstMode";
import Button from "@mui/material/Button";
import VideoCallSharpIcon from "@mui/icons-material/VideoCallSharp";
import ToggleFocusInputBoard from "~/components/Form/ToggleFocusInputBoard";
import { cloneTemplateAPI } from "~/apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

const TemplateBar = ({ template }) => {
  const [isMarked, setIsMarked] = useState(false);
  const navigate = useNavigate();
  const onUpdateBoardTitle = (newTitle) => {
    // Gọi API cập nhật title của board
    console.log("New Title: ", newTitle);
  };
  // Xử lý áp dụng một template để tạo board mới
  const handleApplyTemplate = async (templateId) => {
    try {
      const response = await cloneTemplateAPI(templateId);
      navigate(`/boards/${response}`);
      toast.success(`Board đã được tạo với ID: ${response}`);
    } catch (error) {
      toast.error("Không thể áp dụng template:", error);
    }
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

        flex: "1",
        justifyContent: "space-between",
        flexDirection: { xs: "column", md: "row" }, // Responsive layout
        alignItems: "center",
        height: theme.Ptollo.boardBarHeight,
        px: 1,
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
        <Tooltip title={template?.description}>
          <Box>
            <ToggleFocusInputBoard
              inputFontSize="20px"
              value={template?.title}
              onChangedValue={onUpdateBoardTitle}
              data-no-dnd="true"
            />
          </Box>
        </Tooltip>
        <Tooltip title="Click to star or unstar this template. Starred templates show up at the top of your boards list.">
          <Box>
            <IconButton
              onClick={() => setIsMarked(!isMarked)}
              sx={{ cursor: "pointer" }}>
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
          label={capitalizeFirstLetter(template?.type)}
        />
        {/* <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon sx={{ ml: 0 }} />}
          label="Add to Drive"
        /> */}
        <Tooltip title="Change Background" arrow>
          <Button
            variant="contained"
            startIcon={
              <BurstModeIcon
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "white" : "#616161",
                }}
              />
            }
            sx={{
              textTransform: "none",
              "&:hover": { borderColor: "white" },
              backgroundColor: "#172B4D",
              color: "white",
            }}>
            Change Background
          </Button>
        </Tooltip>
        <Tooltip title="Board">
          <Chip
            sx={MENU_STYLE}
            icon={<TableChartRoundedIcon sx={{ ml: 0 }} />}
            onClick={() => handleApplyTemplate(template?._id)}
            label="Use Template"
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
        {/* Tooltip and Video Call Icon */}
        <Tooltip title="Create or Join Room">
          <Button
            variant="contained"
            startIcon={
              <VideoCallSharpIcon
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "white" : "#616161",
                }}
              />
            }
            sx={{
              textTransform: "none",
              "&:hover": { borderColor: "white" },
              backgroundColor: "#172B4D",
              color: "white",
            }}>
            Room Options
          </Button>
        </Tooltip>
        <Chip
          sx={MENU_STYLE}
          icon={<PersonAddIcon sx={{ ml: 0 }} />}
          label="Invite"
        />

        <AvatarGroup
          max={2}
          sx={{
            gap: "10px",
            "& .MuiAvatar-root": {
              width: 34,
              height: 34,
              fontSize: 16,
              border: "none",
              color: "white",
              cursor: "pointer",
              "&:first-of-type": { bgcolor: "#a4b0be" },
            },
          }}>
          <Tooltip title="John Doe">
            <Avatar
              alt="John Doe"
              src="https://picsum.photos/200/300?random=1"
            />
          </Tooltip>
          <Tooltip title="Jane Smith">
            <Avatar
              alt="Jane Smith"
              src="https://picsum.photos/200/300?random=2"
            />
          </Tooltip>
          <Tooltip title="Alice Johnson">
            <Avatar
              alt="Alice Johnson"
              src="https://picsum.photos/200/300?random=3"
            />
          </Tooltip>
          <Tooltip title="Robert Brown">
            <Avatar
              alt="Robert Brown"
              src="https://picsum.photos/200/300?random=4"
            />
          </Tooltip>
          <Tooltip title="Emily Davis">
            <Avatar
              alt="Emily Davis"
              src="https://picsum.photos/200/300?random=5"
            />
          </Tooltip>
          <Tooltip title="Michael Wilson">
            <Avatar
              alt="Michael Wilson"
              src="https://picsum.photos/200/300?random=6"
            />
          </Tooltip>
          <Tooltip title="Sophia Moore">
            <Avatar
              alt="Sophia Moore"
              src="https://picsum.photos/200/300?random=7"
            />
          </Tooltip>
          <Tooltip title="Daniel Anderson">
            <Avatar
              alt="Daniel Anderson"
              src="https://picsum.photos/200/300?random=8"
            />
          </Tooltip>
          <Tooltip title="Olivia Thomas">
            <Avatar
              alt="Olivia Thomas"
              src="https://picsum.photos/200/300?random=9"
            />
          </Tooltip>
          <Tooltip title="William Taylor">
            <Avatar
              alt="William Taylor"
              src="https://picsum.photos/200/300?random=10"
            />
          </Tooltip>
          <Tooltip title="Charlotte Harris">
            <Avatar
              alt="Charlotte Harris"
              src="https://picsum.photos/200/300?random=11"
            />
          </Tooltip>
          <Tooltip title="Lucas Martinez">
            <Avatar
              alt="Lucas Martinez"
              src="https://picsum.photos/200/300?random=12"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
};

export default TemplateBar;
