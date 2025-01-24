import { MessageSquare } from "lucide-react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
const NoChatSelected = () => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}>
      <Box sx={{ textAlign: "center", maxWidth: "md", mb: 4 }}>
        {/* Icon Display */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: "primary.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "bounce 2s infinite",
            }}>
            <MessageSquare className="w-8 h-8 text-primary " />
          </Box>
        </Box>

        {/* Welcome Text */}
        <Typography variant="h5" component="h2" fontWeight="bold">
          Welcome to Chatty!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Select a conversation from the sidebar to start chatting
        </Typography>
      </Box>
    </Box>
  );
};

export default NoChatSelected;
