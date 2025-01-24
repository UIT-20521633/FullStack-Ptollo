import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import CardSmall from "~/components/Card/CardSmall";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import {
  selectRecentlyViewedBoards,
  selectStarredBoards,
} from "~/redux/user/userSlice";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchBoardsAPI } from "~/apis";
import SidebarCreateBoardModal from "~/pages/Boards/create";
const ListHomePage = () => {
  // Số lượng bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
  const [boards, setBoards] = useState(null);
  // Tổng toàn bộ số lượng bản ghi boards có trong Database mà phía BE trả về để FE dùng tính toán phân trang
  const [totalBoards, setTotalBoards] = useState(null);
  const updateStateData = (res) => {
    setBoards(res.boards || []);
    setTotalBoards(res.totalBoards || 0);
  };
  const location = useLocation();
  useEffect(() => {
    fetchBoardsAPI(location.search).then(updateStateData);
  }, [location.search]);
  const afterCreateNewBoard = () => {
    // Đơn giản là cứ fetch lại danh sách board tương tự trong useEffect (f5 lại trang)
    fetchBoardsAPI(location.search).then(updateStateData);
  };
  const starredBoards = useSelector(selectStarredBoards);
  const recentlyViewedBoards = useSelector(selectRecentlyViewedBoards);
  return (
    <Box sx={{ width: "100%", maxWidth: 360 }}>
      <nav>
        <List>
          {/* starred */}
          <ListItem
            sx={{
              my: 1,
            }}
            disablePadding>
            <ListItemIcon>
              <StarBorderRoundedIcon sx={{ ml: 1 }} />
            </ListItemIcon>
            <Box sx={{ fontSize: "16px", fontWeight: "700" }}>Starred</Box>
          </ListItem>
          <Box>
            {starredBoards.map((board) => (
              <ListItem disablePadding key={board.boardId}>
                <ListItemButton>
                  <CardSmall
                    title={board.title}
                    description={board.description}
                    boardId={board.boardId}
                    background={board.background}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
          <Divider />
          {/* Recent */}
          <ListItem
            disablePadding
            sx={{
              my: 1,
            }}>
            <ListItemIcon>
              <AccessTimeOutlinedIcon sx={{ ml: 1 }} />
            </ListItemIcon>
            <Box sx={{ fontSize: "16px", fontWeight: "700" }}>
              Recently viewed
            </Box>
          </ListItem>
          <Box>
            {recentlyViewedBoards.map((board) => (
              <ListItem disablePadding key={board.boardId}>
                <ListItemButton>
                  <CardSmall
                    title={board?.board?.title}
                    description={board?.board?.description}
                    boardId={board?.boardId}
                    background={board?.board?.background}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
          <Divider />
          <ListItem
            sx={{
              my: 1,
            }}
            disablePadding>
            <ListItemText primary="Links" />
          </ListItem>
          <Box>
            <ListItem disablePadding>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <SidebarCreateBoardModal
                  afterCreateNewBoard={afterCreateNewBoard}
                />
              </Box>
            </ListItem>
          </Box>
        </List>
      </nav>
    </Box>
  );
};
export default ListHomePage;
