import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Recent from "./Recent/Recent";
import Starred from "./Starred/Starred";
import Templates from "./TemplatesDB/Templates";
import Create from "./Create/Create";
import SettingsIcon from "@mui/icons-material/Settings";
import theme from "~/theme";
import { useColorScheme } from "@mui/material/styles";
// import CustomCardMedia from "../Card/CardMedia";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Popover from "@mui/material/Popover";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { NAVIGATION_MAIN } from "~/config/navigation";
import Profiles from "./Profiles/Profiles";
import Notifications from "./Notifications/Notifications";
import AutoCompleteSearchBoard from "./SearchBoards/AutoCompleteSearchBoard";
import { socketIoInstance } from "~/socketClient";
import { selectCurrentUser } from "~/redux/user/userSlice";
import { useSelector } from "react-redux";
import { fetchBoardsAPI } from "~/apis";
import { useState } from "react";

function CustomThemeSwitcher() {
  const { setMode } = useColorScheme();

  const handleThemeChange = React.useCallback(
    (event) => {
      setMode(event.target.value);
    },
    [setMode]
  );

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

  const toggleMenu = React.useCallback(
    (event) => {
      setMenuAnchorEl(isMenuOpen ? null : event.currentTarget);
      setIsMenuOpen((previousIsMenuOpen) => !previousIsMenuOpen);
    },
    [isMenuOpen]
  );

  return (
    <Box>
      <Tooltip title="Settings" enterDelay={1000}>
        <div>
          <IconButton type="button" aria-label="settings" onClick={toggleMenu}>
            <SettingsIcon />
          </IconButton>
        </div>
      </Tooltip>
      <Popover
        open={isMenuOpen}
        anchorEl={menuAnchorEl}
        onClose={toggleMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableAutoFocus>
        <Box sx={{ p: 2 }}>
          <FormControl>
            <FormLabel id="custom-theme-switcher-label">Theme</FormLabel>
            <RadioGroup
              aria-labelledby="custom-theme-switcher-label"
              defaultValue="system"
              name="custom-theme-switcher"
              onChange={handleThemeChange}>
              <FormControlLabel
                value="light"
                control={<Radio />}
                label="Light"
              />
              <FormControlLabel
                value="system"
                control={<Radio />}
                label="System"
              />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Popover>
    </Box>
  );
}
function ToolbarActionsSearch() {
  return (
    <Stack direction="row" sx={{ alignItems: "center" }} spacing={2}>
      {/* <Search /> */}
      {/* Tìm kiếm nhanh 1 or nhiều board */}
      <AutoCompleteSearchBoard />
      {/* xử lý hiển thị các thông báo - notifications ở đây */}
      <Notifications />
      <CustomThemeSwitcher />
      <Profiles />
    </Stack>
  );
}

const DashBoard = ({ hideNav }) => {
  const navigate = useNavigate();
  // Số lượng bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
  const [boards, setBoards] = useState(null);
  // Tổng toàn bộ số lượng bản ghi boards có trong Database mà phía BE trả về để FE dùng tính toán phân trang
  const [totalBoards, setTotalBoards] = useState(null);
  const updateStateData = (res) => {
    setBoards(res.boards || []);
    setTotalBoards(res.totalBoards || 0);
  };
  const location = useLocation();
  React.useEffect(() => {
    fetchBoardsAPI(location.search).then(updateStateData);
  }, [location.search]);
  const afterCreateNewBoard = () => {
    // Đơn giản là cứ fetch lại danh sách board tương tự trong useEffect (f5 lại trang)
    fetchBoardsAPI(location.search).then(updateStateData);
  };
  // const router = useDemoRouter("/dashboard");
  //some(): Duyệt qua từng phần tử trong mảng pathNavigationUser. Đối với mỗi phần tử, nó kiểm tra điều kiện trong hàm callback.
  //endsWith(): Phương thức này kiểm tra xem chuỗi path có kết thúc bằng chuỗi /userWorkspace/${segment} hay không.
  // Hàm xử lý khi nhấn vào logo để đặt lại điều hướng về NAVIGATION_MAI
  //lấy userId từ store
  const userId = useSelector(selectCurrentUser)._id;
  socketIoInstance.emit("registerUser", { userId: userId });
  // Tính giá trị của left dựa trên hideNav
  const calculateLeft = () => (hideNav ? "1.3rem" : "4rem");
  return (
    <AppProvider navigation={NAVIGATION_MAIN} theme={theme}>
      <DashboardLayout
        hideNavigation={hideNav}
        slots={{
          appTitle: () => {
            return (
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  overflowX: "auto",
                }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    onClick={() => {
                      navigate("/");
                    }}
                    sx={{
                      position: "absolute",
                      top: "0",
                      left: calculateLeft(),
                      cursor: "pointer",
                    }}>
                    <img
                      src="/icons/icon.png"
                      alt="PTollo Logo"
                      style={{ width: "60px", height: "60px" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      ml: 2,
                    }}></Box>
                  <Box
                    sx={{
                      ml: 2,
                    }}></Box>
                  {/* <WorkSpace /> */}
                  <Recent />
                  <Starred />
                  <Templates />
                  <Create afterCreateNewBoard={afterCreateNewBoard} />
                </Box>
              </Stack>
            );
          },
          toolbarActions: ToolbarActionsSearch,
        }}>
        {/* <DemoPageContent pathname={"/boar"} /> */}
        {/* Phần chính của Dashboard */}
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
};

export default DashBoard;
