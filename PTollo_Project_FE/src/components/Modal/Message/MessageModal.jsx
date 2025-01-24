import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SideBarChat from "~/pages/Chat/SideBarChat";
import NoChatSelected from "~/pages/Chat/NoChatSelected";
import ChatContainer from "~/pages/Chat/ChatContainer";

const MessageModal = ({ selectUser, open, close }) => {
  return (
    <Modal
      disableScrollLock
      open={open}
      onClose={close} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: "auto" }}>
      <Box
        sx={{
          position: "relative",
          width: 1000,
          maxWidth: 1000,
          height: 600,
          maxHeight: 600,
          bgcolor: "white",
          boxShadow: 24,
          borderRadius: "10px",
          border: "none",
          outline: 0,
          padding: "20px",
          margin: "50px auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}>
        <Box
          sx={{
            top: "10px",
            right: "10px",
            cursor: "pointer",
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              height: "550px",
            }}>
            {/* User */}
            <Box
              sx={{
                height: "100%",
                width: "35%",
              }}>
              <SideBarChat />
            </Box>
            {/* Message */}
            <Box
              sx={{
                width: "65%",
                height: "100%",
              }}>
              {!selectUser ? <NoChatSelected /> : <ChatContainer />}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
export default MessageModal;
