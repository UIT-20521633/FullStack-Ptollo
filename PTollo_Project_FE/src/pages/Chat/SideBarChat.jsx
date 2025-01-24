import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import { Users } from "lucide-react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { useSelector } from "react-redux";
import {
  getUsersInBoard,
  selectSelectedUser,
  selectUsers,
  setBoardId,
  setSelectedUser,
} from "~/redux/Chats/chatSlice";
import { useEffect } from "react";
import { selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch } from "react-redux";
import SlideBarSkeleton from "../../components/Skeletons/SlideBarSkeleton";
import { selectOnlineUsers } from "~/redux/user/userSlice";
const SideBarChat = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers); // Lấy thông tin tất cả user
  const selectedUser = useSelector(selectSelectedUser); // Lấy thông tin user đang được chọn
  const onlineUsersId = useSelector(selectOnlineUsers); // Lấy thông tin user đang online
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const boardId = useSelector(selectCurrentActiveBoard)._id;
  const [loading, setLoading] = useState(false);
  //Kiểm tra user online có thuộc board đang chọn không
  const onlineUsersInBoard = users?.filter((user) =>
    onlineUsersId?.includes(user._id)
  );
  useEffect(() => {
    const fetchUsers = async () => {
      if (boardId) {
        setLoading(true); // Bắt đầu loading
        dispatch(setBoardId(boardId));
        await dispatch(getUsersInBoard(boardId));
        setLoading(false); // Dừng loading sau khi hoàn tất
      }
    };
    fetchUsers();
  }, [boardId, dispatch]);
  const handleSelectUser = (user) => {
    dispatch(setSelectedUser(user));
  };
  const filteredUsers = showOnlineOnly
    ? // Nếu showOnlineOnly = true thì chỉ hiển thị những user đang online
      users?.filter((user) => onlineUsersId?.includes(user._id)) // Lọc những user có trong mảng onlineUsers
    : users;
  if (loading) {
    return <SlideBarSkeleton />;
  }
  return (
    <Box
      component="aside"
      sx={{
        height: "100%",
        borderRight: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s",
      }}>
      {/* Header */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          p: 2,
        }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Users width={24} height={24} />
          <Typography
            variant="body1"
            fontWeight="medium"
            sx={{ display: { xs: "none", lg: "block" } }}>
            Contacts
          </Typography>
        </Box>
      </Box>
      {/* TODO: Online fillter toggele */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          py: 1,
          px: 2,
          display: { xs: "none", lg: "flex" },
          alignItems: "center",
          gap: 2,
        }}>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          component="label"
          sx={{ cursor: "pointer" }}>
          <Checkbox
            size="small"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
          />
          <Typography variant="body2">Show online only</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {onlineUsersInBoard.length} online
        </Typography>
      </Box>
      {/* User List */}
      <Box
        sx={{
          overflowY: "auto",
          width: "100%",
          py: 1,
        }}>
        {filteredUsers?.map((user) => (
          <Button
            key={user?._id}
            onClick={() => {
              handleSelectUser(user);
            }}
            variant={selectedUser?._id === user?._id ? "outlined" : "none"}
            sx={{
              textTransform: "none",
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              justifyContent: { xs: "center", lg: "flex-start" },
              borderRadius: 1,
              transition: "background-color 0.2s",
              bgcolor:
                selectedUser?._id === user?._id
                  ? (theme) => theme.palette.chatButton
                  : "transparent",

              border: selectedUser?._id === user?._id ? "1px solid" : "none",
              borderColor:
                selectedUser?._id === user?._id
                  ? (theme) => theme.palette.borderColor
                  : "transparent",
              "&:hover": {
                bgcolor: (theme) => theme.palette.chatButtonHover,
              },
            }}>
            {/* Avatar with Online Indicator */}
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
              }}>
              <Avatar
                src={user?.avatar || "./assets/avatar.png"}
                alt={user?.displayName}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "grey.300",
                }}
              />
              {onlineUsersId?.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </Box>

            {/* User Info - Visible on larger screens */}
            <Box
              sx={{
                display: { xs: "none", lg: "block" },
                textAlign: "left",
                minWidth: 0,
              }}>
              <Typography variant="body1" fontWeight="medium" noWrap>
                {user?.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {onlineUsersId?.includes(user?._id) ? "Online" : "Offline"}
              </Typography>
            </Box>
          </Button>
        ))}
        {users?.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ py: 4 }}>
            No online users
          </Typography>
        )}
      </Box>
    </Box>
  );
};
export default SideBarChat;
