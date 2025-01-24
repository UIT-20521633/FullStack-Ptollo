import { X } from "lucide-react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedUser, setSelectedUser } from "~/redux/Chats/chatSlice";
import { selectOnlineUsers } from "~/redux/user/userSlice";
const ChatHeader = () => {
  const selectedUser = useSelector(selectSelectedUser);
  const onlineUsers = useSelector(selectOnlineUsers);
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: 1,
        borderColor: "divider",
      }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* User Info Section */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Avatar */}
          <Avatar
            src={selectedUser?.avatar || "/avatar.png"}
            alt={selectedUser?.displayName}
            sx={{ width: 40, height: 40 }}
          />

          {/* User Info */}
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {selectedUser.displayName}
            </Typography>
            <Typography
              variant="body2"
              color={
                onlineUsers?.includes(selectedUser._id)
                  ? "success.main"
                  : "text.secondary"
              }>
              {onlineUsers?.includes(selectedUser._id) ? "Online" : "Offline"}
            </Typography>
          </Box>
        </Box>

        {/* Close Button */}
        <IconButton
          onClick={() => dispatch(setSelectedUser(null))}
          aria-label="Close chat">
          <X />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatHeader;
